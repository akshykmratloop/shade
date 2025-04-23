import prismaClient from "../config/dbConfig.js";

export const fetchResources = async (
  resourceType = "",
  ResourceTag = "",
  relationType = "",
  isAssigned,
  search = "",
  status = "",
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  // Determine the resourceType filter
  let resourceTypeFilter = {};
  if (resourceType === "HEADER_FOOTER") {
    resourceTypeFilter = {
      resourceType: {
        in: ["HEADER", "FOOTER"],
      },
    };
  } else if (resourceType) {
    resourceTypeFilter = {
      resourceType,
    };
  }

  // Build the where clause based on provided filters
  const whereClause = {
    ...resourceTypeFilter,
    ...(ResourceTag ? { resourceTag: ResourceTag } : {}),
    ...(relationType ? { relationType } : {}),
    ...(typeof isAssigned === 'boolean' ? { isAssigned } : {}),
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  // Fetch resources with pagination
  const resources = await prismaClient.resource.findMany({
    where: whereClause,
    include: {
      _count: {
        select: {
          versions: true, // Count of versions
        },
      },
      liveVersion: {
        select: {
          versionNumber: true,
        },
      },
      roles: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: parseInt(limit),
  });

  // Get total count for pagination
  const totalResources = await prismaClient.resource.count({
    where: whereClause,
  });

  // Return formatted response with pagination info
  return {
    resources,
    pagination: {
      totalResources,
      totalPages: Math.ceil(totalResources / limit),
      currentPage: page,
      limit,
    },
  };
};

export const fetchResourceInfo = async (resourceId) => {
  const resources = await prismaClient.resource.findUnique({
    where: {
      id: resourceId,
    },
    include: {
      _count: {
        select: {
          versions: true, // Count of versions associated with this resource
        },
      },
      roles: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      liveVersion: {
        select: {
          versionNumber: true,
        },
      }, // Include the live version number
      newVersionEditMode: {
        select: {
          versionNumber: true,
          versionStatus: true,
          requests: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1, // Get the most recent request
            select: {
              type: true,
              status: true,
            },
          },
        },
      },
      verifiers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  // Determine the version status mode
  if (resources?.newVersionEditMode) {
    const version = resources.newVersionEditMode;
    let versionMode = "editMode"; // Default mode

    // Check if there are any requests
    if (version.requests && version.requests.length > 0) {
      const latestRequest = version.requests[0];

      if (
        latestRequest.type === "VERIFICATION" &&
        latestRequest.status === "PENDING"
      ) {
        versionMode = "verificationMode";
      } else if (
        latestRequest.type === "PUBLICATION" &&
        latestRequest.status === "PENDING"
      ) {
        versionMode = "publishMode";
      } else if (latestRequest.status === "REJECTED") {
        versionMode = "editMode";
      }
    }

    // Add the version mode to the response
    resources.newVersionEditMode.versionMode = versionMode;
  }

  return resources;
};

export const fetchEligibleUsers = async (roleType = "", permission = "") => {
  // Remove quotes from roleType and permission if they exist
  const cleanRoleType = roleType.replace(/['"]+/g, "");
  const cleanPermission = permission.replace(/['"]+/g, "");

  const users = await prismaClient.user.findMany({
    where: {
      isSuperUser: false,
      roles: {
        some: {
          role: {
            AND: [
              // RoleType condition (if provided)
              cleanRoleType
                ? {
                    roleType: {
                      name: cleanRoleType.toUpperCase(),
                    },
                  }
                : {},
              // Permission condition (if provided)
              cleanPermission
                ? {
                    permissions: {
                      some: {
                        permission: {
                          name: cleanPermission.toUpperCase(),
                        },
                      },
                    },
                  }
                : {},
            ],
          },
        },
      },
    },
    include: {
      roles: {
        include: {
          role: {
            include: {
              roleType: true,
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const formattedUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    roles: user.roles.map((r) => ({
      name: r.role.name,
      type: r.role.roleType.name,
      permissions: r.role.permissions.map((p) => p.permission.name),
    })),
  }));

  return formattedUsers;
};



export const assignUserToResource = async (
  resourceId,
  manager,
  editor,
  verifiers,
  publisher
) => {
  // First, get the current resource and its active version (if any)
  const currentResource = await prismaClient.resource.findUnique({
    where: { id: resourceId },
    include: {
      newVersionEditMode: true,
      roles: true,
      verifiers: true,
    },
  });

  if (!currentResource) {
    throw new Error(`Resource with ID ${resourceId} not found`);
  }

  // Start a transaction to ensure all operations succeed or fail together
  return await prismaClient.$transaction(async (prisma) => {
    // 1. Clear existing roles and verifiers for this resource
    await prisma.resourceRole.deleteMany({
      where: { resourceId },
    });

    await prisma.resourceVerifier.deleteMany({
      where: { resourceId },
    });

    // 2. Create new resource roles
    const roleCreations = [];

    // Add manager role
    if (manager) {
      roleCreations.push(
        prisma.resourceRole.create({
          data: {
            resourceId,
            userId: manager,
            role: "MANAGER",
          },
        })
      );
    }

    // Add editor role
    if (editor) {
      roleCreations.push(
        prisma.resourceRole.create({
          data: {
            resourceId,
            userId: editor,
            role: "EDITOR",
          },
        })
      );
    }

    // Add publisher role
    if (publisher) {
      roleCreations.push(
        prisma.resourceRole.create({
          data: {
            resourceId,
            userId: publisher,
            role: "PUBLISHER",
          },
        })
      );
    }

    // 3. Create verifiers with their stages
    const verifierCreations = [];
    if (verifiers && Array.isArray(verifiers)) {
      for (const verifier of verifiers) {
        if (verifier.id && verifier.stage !== undefined) {
          verifierCreations.push(
            prisma.resourceVerifier.create({
              data: {
                resourceId,
                userId: verifier.id,
                stage: verifier.stage,
              },
            })
          );
        }
      }
    }

    // Execute all role and verifier creations
    await Promise.all([...roleCreations, ...verifierCreations]);

    // 4. If there's an active edit version, update its roles and verifiers too
    if (currentResource.newVersionEditModeId) {
      // Clear existing roles and verifiers for this version
      await prisma.resourceVersionRole.deleteMany({
        where: { resourceVersionId: currentResource.newVersionEditModeId },
      });

      await prisma.resourceVersionVerifier.deleteMany({
        where: { resourceVersionId: currentResource.newVersionEditModeId },
      });

      // Create version roles
      const versionRoleCreations = [];

      if (manager) {
        versionRoleCreations.push(
          prisma.resourceVersionRole.create({
            data: {
              resourceVersionId: currentResource.newVersionEditModeId,
              userId: manager,
              role: "MANAGER",
            },
          })
        );
      }

      if (editor) {
        versionRoleCreations.push(
          prisma.resourceVersionRole.create({
            data: {
              resourceVersionId: currentResource.newVersionEditModeId,
              userId: editor,
              role: "EDITOR",
            },
          })
        );
      }

      if (publisher) {
        versionRoleCreations.push(
          prisma.resourceVersionRole.create({
            data: {
              resourceVersionId: currentResource.newVersionEditModeId,
              userId: publisher,
              role: "PUBLISHER",
            },
          })
        );
      }

      // Create version verifiers
      const versionVerifierCreations = [];
      if (verifiers && Array.isArray(verifiers)) {
        for (const verifier of verifiers) {
          if (verifier.id && verifier.stage !== undefined) {
            versionVerifierCreations.push(
              prisma.resourceVersionVerifier.create({
                data: {
                  resourceVersionId: currentResource.newVersionEditModeId,
                  userId: verifier.id,
                  stage: verifier.stage,
                },
              })
            );
          }
        }
      }

      // Execute all version role and verifier creations
      await Promise.all([...versionRoleCreations, ...versionVerifierCreations]);
    }

    // 5. Update the resource to mark it as assigned
    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: { isAssigned: true },
      include: {
        roles: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        verifiers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        newVersionEditMode: {
          include: {
            roles: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            verifiers: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return updatedResource;
  });
};

export const fetchAssignedUsers = async (resourceId) => {
  return await prismaClient.resource.findUnique({
    where: {
      id: resourceId,
    },
    select: {
      roles: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      verifiers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};

export const fetchContent = async (resourceId) => {
    return await prismaClient.resource.findUnique({
      where: {
        id: resourceId,
      },
      include: {
        liveVersion: true,
        newVersionEditMode: true,
      },
    });
};
