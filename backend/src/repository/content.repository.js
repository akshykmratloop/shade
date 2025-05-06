import prismaClient from "../config/dbConfig.js";
import { assert } from "../errors/assertError.js";

export const fetchResources = async (
  resourceType = "",
  resourceTag = "",
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
    ...(resourceTag ? { resourceTag: resourceTag } : {}),
    ...(relationType ? { relationType } : {}),
    ...(typeof isAssigned === "boolean" ? { isAssigned } : {}),
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { titleEn: { contains: search, mode: "insensitive" } },
            { titleAr: { contains: search, mode: "insensitive" } },
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
          versionStatus: true,
        },
      },
      newVersionEditMode: {
        select: {
          versionNumber: true,
          versionStatus: true,
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

export const fetchAllResourcesWithContent = async (
  resourceType = "",
  resourceTag = "",
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
    ...(resourceTag ? { resourceTag: resourceTag } : {}),
    ...(relationType ? { relationType } : {}),
    ...(typeof isAssigned === "boolean" ? { isAssigned } : {}),
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { titleEn: { contains: search, mode: "insensitive" } },
            { titleAr: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  // Fetch the resources with all necessary relations
  const resources = await prismaClient.resource.findMany({
    where: whereClause,
    include: {
      liveVersion: {
        select: {
          id: true,
          versionNumber: true,
          content: true,
          icon: true,
          Image: true,
          sections: {
            include: {
              sectionVersion: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      // newVersionEditMode: {
      //   select: {
      //     id: true,
      //     versionNumber: true,
      //     content: true,
      //     icon: true,
      //     Image: true,
      //     sections: {
      //       include: {
      //         sectionVersion: true,
      //       },
      //       orderBy: {
      //         order: "asc",
      //       },
      //     },
      //   },
      // },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: parseInt(limit),
  });

  if (!resources || resources.length === 0) {
    return null;
  }

  // Process each resource with its versions
  const formattedResources = await Promise.all(
    resources.map(async (resource) => {
      // Create the base resource object
      const formattedResource = {
        id: resource.id,
        titleEn: resource.titleEn,
        titleAr: resource.titleAr,
        slug: resource.slug,
        resourceType: resource.resourceType,
        resourceTag: resource.resourceTag,
        relationType: resource.relationType,
      };

      // Process live version if it exists
      if (resource.liveVersion) {
        formattedResource.liveModeVersionData = await formatResourceVersionData(
          resource.liveVersion
        );
      }

      // // Process edit version if it exists
      // if (resource.newVersionEditMode) {
      //   formattedResource.editModeVersionData = await formatResourceVersionData(
      //     resource.newVersionEditMode
      //   );
      // }

      return formattedResource;
    })
  );

  // Get total count for pagination
  const totalResources = await prismaClient.resource.count({
    where: whereClause,
  });

  return {
    resources: formattedResources,
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
        where: {
          status: "ACTIVE",
        },
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
      }, // Include the edit mode version number
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
        where: {
          status: "ACTIVE",
        },
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
      // status: "ACTIVE",
      // status: "ACTIVE",
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
    status: user.status,
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
  // 1. Fetch current resource state with all relationships
  const currentResource = await prismaClient.resource.findUnique({
    where: { id: resourceId },
    include: {
      roles: true,
      verifiers: true,
      newVersionEditMode: {
        include: {
          roles: true,
          verifiers: true,
        },
      },
    },
  });

  assert(currentResource, "NOT_FOUND", `Resource not found`);

  return await prismaClient.$transaction(async (prisma) => {
    const roleMap = {
      MANAGER: manager,
      EDITOR: editor,
      PUBLISHER: publisher,
    };

    // 2. Validate payload structure
    const allUserIds = [
      ...Object.values(roleMap).filter(Boolean),
      ...(verifiers?.map((v) => v.id) || []),
    ];

    // Rule: No duplicate users in payload
    const uniqueUserIds = new Set(allUserIds);
    assert(
      uniqueUserIds.size === allUserIds.length,
      "DUPLICATE_USER",
      "Same user cannot be assigned to multiple roles"
    );

    // Rule: Unique verifier stages
    if (verifiers) {
      const stages = verifiers.map((v) => v.stage);
      assert(
        new Set(stages).size === stages.length,
        "DUPLICATE_STAGE",
        "Each verification stage must have exactly one user"
      );
    }

    const currentActiveRoles = currentResource.roles.filter(
      (r) => r.status === "ACTIVE"
    );
    const currentActiveVerifiers = currentResource.verifiers.filter(
      (v) => v.status === "ACTIVE"
    );

    // 3. Process role assignments first (allows verifier-to-role transitions)
    for (const [role, userId] of Object.entries(roleMap)) {
      if (!userId) continue; // Skip if no user assigned

      // Case 1: Already active in this role - skip (idempotent)
      const existingActiveInRole = currentActiveRoles.find(
        (r) => r.role === role && r.userId === userId
      );
      if (existingActiveInRole) continue;

      // Case 2: User is active verifier - deactivate first (No Role-Verifier Conflict Rule)
      const activeVerifierAssignment = currentActiveVerifiers.find(
        (v) => v.userId === userId
      );
      if (activeVerifierAssignment) {
        await prisma.resourceVerifier.update({
          where: { id: activeVerifierAssignment.id },
          data: { status: "INACTIVE" },
        });
      }

      // Case 3: User active in different role - deactivate first (Single Active Role Per User Rule)
      const activeInOtherRole = currentActiveRoles.find(
        (r) => r.userId === userId && r.role !== role
      );
      if (activeInOtherRole) {
        await prisma.resourceRole.update({
          where: { id: activeInOtherRole.id },
          data: { status: "INACTIVE" },
        });
      }

      // Case 4: Another user active in this role - deactivate them (Single Active User Per Role Rule)
      const otherUserActive = currentActiveRoles.find(
        (r) => r.role === role && r.userId !== userId
      );
      if (otherUserActive) {
        await prisma.resourceRole.update({
          where: { id: otherUserActive.id },
          data: { status: "INACTIVE" },
        });
      }

      // Case 5: Existing inactive assignment - reactivate (Inactive Reactivation Rule)
      const existingInactive = currentResource.roles.find(
        (r) => r.role === role && r.userId === userId && r.status !== "ACTIVE"
      );
      if (existingInactive) {
        await prisma.resourceRole.update({
          where: { id: existingInactive.id },
          data: { status: "ACTIVE" },
        });
      } else {
        // Case 6: Create new assignment
        await prisma.resourceRole.create({
          data: {
            resourceId,
            userId,
            role,
            status: "ACTIVE",
          },
        });
      }
    }

    // 4. Process verifier assignments (after roles are processed)
    if (Array.isArray(verifiers)) {
      // Deactivate verifiers not in payload
      const verifiersToDeactivate = currentActiveVerifiers.filter(
        (v) =>
          !verifiers.some((v2) => v2.id === v.userId && v2.stage === v.stage)
      );
      for (const verifier of verifiersToDeactivate) {
        await prisma.resourceVerifier.update({
          where: { id: verifier.id },
          data: { status: "INACTIVE" },
        });
      }

      // Get all users being assigned to roles from the payload
      const usersBeingAssignedToRoles = new Set(
        Object.values(roleMap).filter(Boolean)
      );

      // Process each verifier in payload
      for (const { id: userId, stage } of verifiers) {
        // Skip if already active in this stage (idempotent)
        const existingActive = currentActiveVerifiers.find(
          (v) => v.userId === userId && v.stage === stage
        );
        if (existingActive) continue;

        // Modified check: Only fail if user is being assigned to BOTH role and verifier in THIS payload
        if (usersBeingAssignedToRoles.has(userId)) {
          throw new Error(
            `User ${userId} cannot be assigned as both role and verifier in the same request`
          );
        }

        // Deactivate ANY existing assignment to this stage (Single Active User Per Verifier Stage)
        // This needs to happen BEFORE attempting to reactivate or create a new one
        const existingStageAssignments = currentResource.verifiers.filter(
          (v) => v.stage === stage && v.status === "ACTIVE"
        );

        for (const assignment of existingStageAssignments) {
          await prisma.resourceVerifier.update({
            where: { id: assignment.id },
            data: { status: "INACTIVE" },
          });
        }

        // Deactivate any other active verifier assignments for this user (Single Active Verifier Stage Per User)
        const userOtherActiveVerifiers = currentActiveVerifiers.filter(
          (v) => v.userId === userId && v.stage !== stage
        );
        for (const verifier of userOtherActiveVerifiers) {
          await prisma.resourceVerifier.update({
            where: { id: verifier.id },
            data: { status: "INACTIVE" },
          });
        }

        // Reactivate existing inactive or create new
        const existingInactive = currentResource.verifiers.find(
          (v) =>
            v.userId === userId && v.stage === stage && v.status !== "ACTIVE"
        );
        if (existingInactive) {
          await prisma.resourceVerifier.update({
            where: { id: existingInactive.id },
            data: { status: "ACTIVE" },
          });
        } else {
          await prisma.resourceVerifier.create({
            data: {
              resourceId,
              userId,
              stage,
              status: "ACTIVE",
            },
          });
        }
      }
    }

    // 5. Process version assignments (same logic as above)
    if (currentResource.newVersionEditModeId) {
      const versionId = currentResource.newVersionEditModeId;
      const currentVersionRoles = currentResource.newVersionEditMode.roles;
      const currentVersionVerifiers =
        currentResource.newVersionEditMode.verifiers;

      const activeVersionRoles = currentVersionRoles.filter(
        (r) => r.status === "ACTIVE"
      );
      const activeVersionVerifiers = currentVersionVerifiers.filter(
        (v) => v.status === "ACTIVE"
      );

      // Process version roles
      for (const [role, userId] of Object.entries(roleMap)) {
        if (!userId) continue;

        // Case 1: Already active in this role - skip (idempotent)
        const existingActiveInRole = activeVersionRoles.find(
          (r) => r.role === role && r.userId === userId
        );
        if (existingActiveInRole) continue;

        // Case 2: User is active verifier - deactivate first (No Role-Verifier Conflict Rule)
        const activeVerifierAssignment = activeVersionVerifiers.find(
          (v) => v.userId === userId
        );
        if (activeVerifierAssignment) {
          await prisma.resourceVersionVerifier.update({
            where: { id: activeVerifierAssignment.id },
            data: { status: "INACTIVE" },
          });
        }

        // Case 3: User active in different role - deactivate first (Single Active Role Per User Rule)
        const activeInOtherRole = activeVersionRoles.find(
          (r) => r.userId === userId && r.role !== role
        );
        if (activeInOtherRole) {
          await prisma.resourceVersionRole.update({
            where: { id: activeInOtherRole.id },
            data: { status: "INACTIVE" },
          });
        }

        // Case 4: Another user active in this role - deactivate them (Single Active User Per Role Rule)
        const otherUserActive = activeVersionRoles.find(
          (r) => r.role === role && r.userId !== userId
        );
        if (otherUserActive) {
          await prisma.resourceVersionRole.update({
            where: { id: otherUserActive.id },
            data: { status: "INACTIVE" },
          });
        }

        // Case 5: Existing inactive assignment - reactivate (Inactive Reactivation Rule)
        const existingInactive = currentVersionRoles.find(
          (r) => r.role === role && r.userId === userId && r.status !== "ACTIVE"
        );
        if (existingInactive) {
          await prisma.resourceVersionRole.update({
            where: { id: existingInactive.id },
            data: { status: "ACTIVE" },
          });
        } else {
          // Case 6: Create new assignment
          await prisma.resourceVersionRole.create({
            data: {
              resourceVersionId: versionId,
              userId,
              role,
              status: "ACTIVE",
            },
          });
        }
      }

      // Process version verifiers
      if (Array.isArray(verifiers)) {
        // Deactivate verifiers not in payload
        const verifiersToDeactivate = activeVersionVerifiers.filter(
          (v) =>
            !verifiers.some((v2) => v2.id === v.userId && v2.stage === v.stage)
        );
        for (const verifier of verifiersToDeactivate) {
          await prisma.resourceVersionVerifier.update({
            where: { id: verifier.id },
            data: { status: "INACTIVE" },
          });
        }

        // Process each verifier in payload
        for (const { id: userId, stage } of verifiers) {
          // Skip if already active in this stage (idempotent)
          const existingActive = activeVersionVerifiers.find(
            (v) => v.userId === userId && v.stage === stage
          );
          if (existingActive) continue;

          // Check for active role conflict (No Role-Verifier Conflict Rule)
          const hasActiveRole = activeVersionRoles.some(
            (r) => r.userId === userId
          );
          assert(
            !hasActiveRole,
            "ROLE_CONFLICT",
            `User ${userId} cannot be verifier while having active role in version`
          );

          // Deactivate ANY existing assignment to this stage (Single Active User Per Verifier Stage)
          // This needs to happen BEFORE attempting to reactivate or create a new one
          const existingStageAssignments = activeVersionVerifiers.filter(
            (v) => v.stage === stage && v.status === "ACTIVE"
          );

          for (const assignment of existingStageAssignments) {
            await prisma.resourceVersionVerifier.update({
              where: { id: assignment.id },
              data: { status: "INACTIVE" },
            });
          }

          // Deactivate any other active verifier assignments for this user (Single Active Verifier Stage Per User)
          const userOtherActiveVerifiers = activeVersionVerifiers.filter(
            (v) => v.userId === userId && v.stage !== stage
          );
          for (const verifier of userOtherActiveVerifiers) {
            await prisma.resourceVersionVerifier.update({
              where: { id: verifier.id },
              data: { status: "INACTIVE" },
            });
          }

          // Reactivate existing inactive or create new
          const existingInactive = currentVersionVerifiers.find(
            (v) =>
              v.userId === userId && v.stage === stage && v.status !== "ACTIVE"
          );
          if (existingInactive) {
            await prisma.resourceVersionVerifier.update({
              where: { id: existingInactive.id },
              data: { status: "ACTIVE" },
            });
          } else {
            await prisma.resourceVersionVerifier.create({
              data: {
                resourceVersionId: versionId,
                userId,
                stage,
                status: "ACTIVE",
              },
            });
          }
        }
      }
    }

    // 6. Return updated resource with active assignments
    return prisma.resource.update({
      where: { id: resourceId },
      data: { isAssigned: true },
      include: {
        roles: {
          where: { status: "ACTIVE" },
          include: { user: true },
        },
        verifiers: {
          where: { status: "ACTIVE" },
          include: { user: true },
        },
        newVersionEditMode: {
          include: {
            roles: {
              where: { status: "ACTIVE" },
              include: { user: true },
            },
            verifiers: {
              where: { status: "ACTIVE" },
              include: { user: true },
            },
          },
        },
      },
    });
  });
};

export const fetchAssignedUsers = async (resourceId) => {
  return await prismaClient.resource.findUnique({
    where: {
      id: resourceId,
    },
    select: {
      roles: {
        where: {
          status: "ACTIVE",
        },
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
        where: {
          status: "ACTIVE",
        },
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
  // Fetch the resource with all necessary relations
  const resource = await prismaClient.resource.findUnique({
    where: {
      id: resourceId,
    },
    include: {
      liveVersion: {
        select: {
          id: true,
          versionNumber: true,
          content: true,
          icon: true,
          Image: true,
          notes: true,
          referenceDoc: true,
          updatedAt: true,
          versionStatus: true,
          sections: {
            include: {
              sectionVersion: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      newVersionEditMode: {
        select: {
          id: true,
          versionNumber: true,
          content: true,
          icon: true,
          Image: true,
          notes: true,
          referenceDoc: true,
          updatedAt: true,
          versionStatus: true,
          sections: {
            include: {
              sectionVersion: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });

  if (!resource) {
    return null;
  }

  // Process both live version and edit version
  const result = {
    id: resource.id,
    titleEn: resource.titleEn,
    titleAr: resource.titleAr,
    slug: resource.slug,
    resourceType: resource.resourceType,
    resourceTag: resource.resourceTag,
    relationType: resource.relationType,
  };

  // Process live version if it exists
  if (resource.liveVersion) {
    result.liveModeVersionData = await formatResourceVersionData(
      resource.liveVersion
    );
  }

  // Process edit version if it exists
  if (resource.newVersionEditMode) {
    result.editModeVersionData = await formatResourceVersionData(
      resource.newVersionEditMode
    );
  }

  return result;
};

async function formatResourceVersionData(resourceVersion) {
  if (!resourceVersion) return null;

  // Get all section versions for this resource version
  const sectionVersions = await prismaClient.sectionVersion.findMany({
    where: {
      resourceVersionId: resourceVersion.id,
      // Only get parent sections (no parent version ID)
      parentVersionId: null,
    },
    include: {
      section: {
        include: {
          sectionType: true,
        },
      },
      children: {
        include: {
          section: {
            include: {
              sectionType: true,
            },
          },
          items: {
            include: {
              resource: {
                select: {
                  id: true,
                  titleEn: true,
                  titleAr: true,
                  slug: true,
                  resourceType: true,
                  liveVersion: {
                    select: {
                      icon: true,
                      Image: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      items: {
        include: {
          resource: {
            select: {
              id: true,
              titleEn: true,
              titleAr: true,
              slug: true,
              resourceType: true,
              liveVersion: {
                select: {
                  icon: true,
                  Image: true,
                },
              },
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  // Get the order of sections from ResourceVersionSection
  const sectionOrder = await prismaClient.resourceVersionSection.findMany({
    where: {
      resourceVersionId: resourceVersion.id,
    },
    orderBy: {
      order: "asc",
    },
  });

  // Map section IDs to their order
  const sectionOrderMap = sectionOrder.reduce((map, section) => {
    map[section.sectionVersionId] = section.order;
    return map;
  }, {});

  // Sort section versions by their order
  const sortedSectionVersions = [...sectionVersions].sort((a, b) => {
    const orderA = sectionOrderMap[a.id] || 999;
    const orderB = sectionOrderMap[b.id] || 999;
    return orderA - orderB;
  });

  // Format each section
  const formattedSections = await Promise.all(
    sortedSectionVersions.map(async (sectionVersion) => {
      // Format the main section
      const formattedSection = {
        sectionId: sectionVersion.sectionId,
        sectionVersionId: sectionVersion.id,
        order: sectionOrderMap[sectionVersion.id] || 999,
        version: sectionVersion.version,
        title: sectionVersion.section?.title || "",
        SectionType: sectionVersion.section?.sectionType?.name || "",
        content: sectionVersion.content || {},
      };

      // Add items if they exist
      if (sectionVersion.items && sectionVersion.items.length > 0) {
        formattedSection.items = await Promise.all(
          sectionVersion.items.map(async (item) => {
            // Get the resource and its live version
            const resource = item.resource;

            // Fetch the full content of the item resource
            const itemContent = await fetchContent(resource.id);

            return { ...itemContent, order: item.order };
          })
        );
      }

      // Add child sections if they exist
      if (sectionVersion.children && sectionVersion.children.length > 0) {
        formattedSection.sections = await Promise.all(
          sectionVersion.children.map(async (childSection) => {
            const formattedChild = {
              sectionId: childSection.sectionId,
              sectionVersionId: childSection.id,
              order: sectionOrderMap[childSection.id] || 999,
              title: childSection.section?.title || "",
              SectionType: childSection.section?.sectionType?.name || "",
              content: childSection.content || {},
            };

            // Add items to child section if they exist
            if (childSection.items && childSection.items.length > 0) {
              formattedChild.items = await Promise.all(
                childSection.items.map(async (item) => {
                  // Get the resource and its live version
                  const resource = item.resource;
                  const liveVersion = resource.liveVersion;

                  // Fetch the full content of the item resource
                  const itemContent = await fetchContent(resource.id);

                  return { ...itemContent, order: item.order };
                })
              );
            }

            return formattedChild;
          })
        );
      }

      return formattedSection;
    })
  );

  return {
    id: resourceVersion.id,
    versionNumber: resourceVersion.versionNumber,
    content: resourceVersion.content || {},
    icon: resourceVersion.icon || null,
    image: resourceVersion.Image || null,
    comments: resourceVersion.notes,
    referenceDoc: resourceVersion.referenceDoc,
    updatedAt: resourceVersion.updatedAt,
    status: resourceVersion.versionStatus,
    sections: formattedSections,
  };
}

export const findResourceById = async (id) => {
  return await prismaClient.resource.findUnique({
    where: {
      id,
    },
  });
};

export const createOrUpdateVersion = async (contentData) => {
  // Find the resource with version counts
  const resource = await prismaClient.resource.findUnique({
    where: {
      id: contentData.resourceId,
    },
    include: {
      _count: {
        select: {
          versions: true, // Count of versions
        },
      },
      newVersionEditMode: true, // Get the current edit mode version if it exists
    },
  });
  assert(
    resource,
    "NOT_FOUND",
    `Resource with ID ${contentData.resourceId} not found`
  );
  // Extract the content from the request
  const { newVersionEditMode } = contentData;
  const saveAs = newVersionEditMode?.versionStatus || "DRAFT";

  const {
    comments = "Version created",
    referenceDoc = null,
    content = {},
    icon = null,
    image = null,
    sections = [],
  } = newVersionEditMode;
  // Start a transaction to ensure all operations succeed or fail together
  const result = await prismaClient.$transaction(async (tx) => {
    if (!resource.newVersionEditModeId) {
      // Create a new edit version if no edit version exists
      const resourceVersion = await tx.resourceVersion.create({
        data: {
          resourceId: resource.id,
          versionNumber: resource._count.versions + 1,
          versionStatus: saveAs,
          notes: comments,
          referenceDoc,
          content,
          icon,
          Image: image,
        },
      });

      // Create section versions
      if (Array.isArray(newVersionEditMode?.sections)) {
        for (let i = 0; i < sections.length; i++) {
          const sectionData = sections[i];
          await createSectionVersionWithChildren(tx, {
            sectionData,
            resource,
            resourceVersion,
            order: sectionData.order ?? i + 1,
          });
        }
      }
      // Link new edit version to resource
      const updatedResource = await tx.resource.update({
        where: { id: resource.id },
        data: {
          newVersionEditModeId: resourceVersion.id,
          titleEn: contentData.titleEn,
          titleAr: contentData.titleAr,
          slug: contentData.slug,
        },
      });
      return {
        ...updatedResource,
        resourceVersion,
      };
    } else {
      // Edit version already exists, update it
      const resourceVersion = await tx.resourceVersion.update({
        where: { id: resource.newVersionEditModeId },
        data: {
          versionStatus: saveAs,
          notes:
            newVersionEditMode?.comments || resource.newVersionEditMode.notes,
          referenceDoc:
            newVersionEditMode?.referenceDoc ||
            resource.newVersionEditMode.referenceDoc,
          content:
            newVersionEditMode?.content || resource.newVersionEditMode.content,
          icon: newVersionEditMode?.icon || resource.newVersionEditMode.icon,
          Image: newVersionEditMode?.image || resource.newVersionEditMode.Image,
        },
      });
      // Update sections recursively
      if (Array.isArray(newVersionEditMode?.sections)) {
        for (const sectionData of newVersionEditMode.sections) {
          await updateSectionVersion(tx, sectionData, resourceVersion.id);
        }
      }

      const updatedResource = await tx.resource.update({
        where: { id: resource.id },
        data: {
          titleEn: contentData.titleEn,
          titleAr: contentData.titleAr,
          slug: contentData.slug,
        },
      });
      return {
        ...updatedResource,
        resourceVersion,
      };
    }
  });
  return {
    message: !resource.newVersionEditModeId
      ? "Resource version created successfully"
      : "Resource version updated successfully",
    resource: result,
  };
};

async function createSectionVersionWithChildren(
  tx,
  { sectionData, resource, resourceVersion, parentVersionId = null, order = 1 }
) {
  const sectionId = sectionData.sectionId;

  console.log("sectionId======================", sectionId);

  const section = await tx.section.findUnique({
    where: { id: sectionId },
    include: {
      _count: {
        select: { versions: true },
      },
    },
  });

  assert(section, "NOT_FOUND", "Section not found");

  const nextVersionNumber = section._count.versions + 1;

  // Create section version
  const sectionVersion = await tx.sectionVersion.create({
    data: {
      sectionId,
      resourceId: resource.id,
      resourceVersionId: resourceVersion.id,
      version: nextVersionNumber,
      content: sectionData.content || {},
      parentVersionId,
      sectionVersionTitle: sectionData.sectionVersionTitle || null,
    },
  });

  // Link section to resource version
  await tx.resourceVersionSection.create({
    data: {
      order,
      resourceVersionId: resourceVersion.id,
      sectionVersionId: sectionVersion.id,
    },
  });

  // Add items
  if (Array.isArray(sectionData.items)) {
    for (let j = 0; j < sectionData.items.length; j++) {
      const item = sectionData.items[j];
      await tx.sectionVersionItem.create({
        data: {
          order: item.order || j + 1,
          sectionVersionId: sectionVersion.id,
          resourceId: item.id,
        },
      });
    }
  }

  // Recursively add child sections
  if (Array.isArray(sectionData.sections)) {
    for (let k = 0; k < sectionData.sections.length; k++) {
      await createSectionVersionWithChildren(tx, {
        sectionData: sectionData.sections[k],
        resource,
        resourceVersion,
        parentVersionId: sectionVersion.id,
        order: sectionData.sections[k].order || k + 1,
      });
    }
  }
  return sectionVersion;
}

async function updateSectionVersion(tx, sectionData, resourceVersionId) {
  const sectionId = sectionData.sectionId;
  const order = sectionData.order;

  // Check if sectionVersion already exists
  let sectionVersion = await tx.sectionVersion.findFirst({
    where: {
      sectionId: sectionId,
      resourceVersionId: resourceVersionId,
    },
  });

  if (sectionVersion) {
    sectionVersion = await tx.sectionVersion.update({
      where: { id: sectionVersion.id },
      data: {
        ...(sectionData.content !== undefined
          ? { content: sectionData.content }
          : {}),
      },
    });
  }

  // Delete existing items
  await tx.sectionVersionItem.deleteMany({
    where: { sectionVersionId: sectionVersion.id },
  });

  // Insert new items
  if (Array.isArray(sectionData.items)) {
    for (let j = 0; j < sectionData.items.length; j++) {
      const item = sectionData.items[j];
      await tx.sectionVersionItem.create({
        data: {
          order: item.order || j + 1,
          sectionVersionId: sectionVersion.id,
          resourceId: item.id,
        },
      });
    }
  }

  // Recursively handle nested sections
  if (Array.isArray(sectionData.sections)) {
    for (let k = 0; k < sectionData.sections.length; k++) {
      await updateSectionVersion(
        tx,
        sectionData.sections[k],
        resourceVersionId
      );
    }
  }
}

export const publishContent = async (contentData, userId) => {
  const resource = await prismaClient.resource.findUnique({
    where: {
      id: contentData.resourceId,
    },
    include: {
      _count: {
        select: {
          versions: true,
        },
      },
    },
  });

  assert(
    resource,
    "NOT_FOUND",
    `Resource with ID ${contentData.resourceId} not found`
  );

  const { newVersionEditMode = {} } = contentData;
  const {
    comments = "Version created",
    referenceDoc = null,
    content = {},
    icon = null,
    image = null,
    sections = [],
  } = newVersionEditMode;

  const result = await prismaClient.$transaction(async (tx) => {
    const versionNumber = resource._count.versions + 1;

    const resourceVersion = await tx.resourceVersion.create({
      data: {
        resourceId: resource.id,
        versionNumber,
        versionStatus: "PUBLISHED",
        notes: comments,
        referenceDoc,
        content,
        icon,
        Image: image,
        publishedAt: new Date(),
      },
    });

    if (Array.isArray(newVersionEditMode?.sections)) {
      for (let i = 0; i < sections.length; i++) {
        const sectionData = sections[i];
        await createSectionVersionWithChildren(tx, {
          sectionData,
          resource,
          resourceVersion,
          order: sectionData.order ?? i + 1,
        });
      }
    }

    const updatedResource = await tx.resource.update({
      where: { id: resource.id },
      data: {
        liveVersionId: resourceVersion.id,
        titleEn: contentData.titleEn,
        titleAr: contentData.titleAr,
        slug: contentData.slug,
      },
    });

    await tx.resourceVersionRole.create({
      data: {
        resourceVersionId: resourceVersion.id,
        userId,
        role: "PUBLISHER",
      },
    });

    return {
      ...updatedResource,
      resourceVersion,
    };
  });

  return {
    message: "Resource version published successfully",
    resource: result,
  };
};

export const updateContentAndGenerateRequest = async (contentData) => {
  // Find the resource with version counts
  const resource = await prismaClient.resource.findUnique({
    where: {
      id: contentData.resourceId,
    },
    include: {
      _count: {
        select: {
          versions: true, // Count of versions
        },
      },
      newVersionEditMode: true, // Get the current edit mode version if it exists
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

  assert(
    resource,
    "NOT_FOUND",
    `Resource with ID ${contentData.resourceId} not found`
  );
  // Extract the content from the request
  const { newVersionEditMode } = contentData;
  const saveAs = "VERIFICATION_PENDING";

  const {
    comments = "",
    referenceDoc = null,
    content = {},
    icon = null,
    image = null,
    sections = [],
  } = newVersionEditMode;
  // Start a transaction to ensure all operations succeed or fail together
  const result = await prismaClient.$transaction(async (tx) => {
    let resourceVersion;
    let updatedResource;
    if (!resource.newVersionEditModeId) {
      // Create a new edit version if no edit version exists
      resourceVersion = await tx.resourceVersion.create({
        data: {
          resourceId: resource.id,
          versionNumber: resource._count.versions + 1,
          versionStatus: saveAs,
          notes: comments,
          referenceDoc,
          content,
          icon,
          Image: image,
        },
      });

      // Create section versions
      if (Array.isArray(newVersionEditMode?.sections)) {
        for (let i = 0; i < sections.length; i++) {
          const sectionData = sections[i];
          await createSectionVersionWithChildren(tx, {
            sectionData,
            resource,
            resourceVersion,
            order: sectionData.order ?? i + 1,
          });
        }
      }
      // Link new edit version to resource
      updatedResource = await tx.resource.update({
        where: { id: resource.id },
        data: {
          newVersionEditModeId: resourceVersion.id,
          titleEn: contentData.titleEn,
          titleAr: contentData.titleAr,
          slug: contentData.slug,
        },
      });
    } else {
      // Edit version already exists, update it
      resourceVersion = await tx.resourceVersion.update({
        where: { id: resource.newVersionEditModeId },
        data: {
          versionStatus: saveAs,
          notes:
            newVersionEditMode?.comments || resource.newVersionEditMode.notes,
          referenceDoc:
            newVersionEditMode?.referenceDoc ||
            resource.newVersionEditMode.referenceDoc,
          content:
            newVersionEditMode?.content || resource.newVersionEditMode.content,
          icon: newVersionEditMode?.icon || resource.newVersionEditMode.icon,
          Image: newVersionEditMode?.image || resource.newVersionEditMode.Image,
        },
      });
      // Update sections recursively
      if (Array.isArray(newVersionEditMode?.sections)) {
        for (const sectionData of newVersionEditMode.sections) {
          await updateSectionVersion(tx, sectionData, resourceVersion.id);
        }
      }

      updatedResource = await tx.resource.update({
        where: { id: resource.id },
        data: {
          titleEn: contentData.titleEn,
          titleAr: contentData.titleAr,
          slug: contentData.slug,
        },
      });
    }
    const generatedRequest = await tx.resourceVersioningRequest.create({
      data: {
        type: "VERIFICATION",
        editorComments: comments,
        resourceVersionId: resourceVersion.id,
        senderId: resource.roles.find((r) => r.role === "EDITOR").userId,
      },
    });

    const generateRequestApprovalsForPublisher =
      await tx.requestApproval.create({
        data: {
          stage: null,
          comments: null,
          requestId: generatedRequest.id,
          approverId: resource.roles.find((r) => r.role === "PUBLISHER").userId,
        },
      });

    const generateRequestApprovalsForVerifiers =
      await tx.requestApproval.createMany({
        data: resource.verifiers.map((verifier, index) => ({
          stage: verifier.stage,
          comments: null,
          requestId: generatedRequest.id,
          approverId: verifier.userId,
        })),
      });

    const verifierApprovals = await tx.requestApproval.findMany({
      where: {
        requestId: generatedRequest.id,
        stage: { not: null }, // Only get verifier approvals (they have stage values)
      },
    });

    return {
      ...updatedResource,
      resourceVersion,
      requests: {
        ...generatedRequest,
        approvals: {
          publisher: generateRequestApprovalsForPublisher,
          verifiers: verifierApprovals,
        },
      },
    };
  });
  return {
    message: "Update request generated successfully",
    resource: result,
  };
};

export const fetchRequests = async (
  userId,
  userRole,
  search,
  status,
  pageNum,
  limitNum
) => {
  const skip = (pageNum - 1) * limitNum;

  // Base where clause
  const where = {
    status: status || undefined, // Filter by status if provided
  };

  // Handle search term
  if (search) {
    where.resourceVersion = {
      resource: {
        OR: [
          { titleEn: { contains: search, mode: "insensitive" } },
          { titleAr: { contains: search, mode: "insensitive" } },
        ],
      },
    };
  }

  // Role-based filtering
  if (userRole === "EDITOR") {
    // Editors see their own requests for resources assigned to them
    where.senderId = userId;
    where.resourceVersion = {
      ...where.resourceVersion,
      resource: {
        ...where.resourceVersion?.resource,
        roles: {
          some: {
            userId,
            role: "EDITOR",
          },
        },
        isAssigned: true,
      },
    };
  } else if (userRole === "VERIFIER") {
    // Verifiers see requests for resources where they are assigned as verifiers
    where.resourceVersion = {
      ...where.resourceVersion,
      resource: {
        ...where.resourceVersion?.resource,
        verifiers: {
          some: {
            userId,
          },
        },
      },
    };
  } else if (userRole === "PUBLISHER") {
    // Publishers see requests that are fully verified and for resources they're assigned to
    where.type = "PUBLICATION"; // Only show publication requests
    where.status = "APPROVED"; // Only show approved requests (fully verified)
    where.resourceVersion = {
      ...where.resourceVersion,
      resource: {
        ...where.resourceVersion?.resource,
        roles: {
          some: {
            userId,
            role: "PUBLISHER",
          },
        },
      },
    };
  } else if (userRole === "MANAGER") {
    // Managers see all requests for resources they're assigned to as manager
    where.resourceVersion = {
      ...where.resourceVersion,
      resource: {
        ...where.resourceVersion?.resource,
        roles: {
          some: {
            userId,
            role: "MANAGER",
          },
        },
      },
    };
  }
  // SUPER_ADMIN gets all requests with no additional filtering

  // Count total records for pagination
  const totalCount = await prismaClient.resourceVersioningRequest.count({
    where,
  });

  // Fetch paginated requests with related data
  const requests = await prismaClient.resourceVersioningRequest.findMany({
    where,
    skip,
    take: limitNum,
    orderBy: { createdAt: "desc" },
    include: {
      resourceVersion: {
        include: {
          resource: {
            select: {
              id: true,
              titleEn: true,
              titleAr: true,
              resourceType: true,
            },
          },
        },
      },
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      approvals: {
        select: {
          id: true,
          status: true,
          stage: true,
          comments: true,
          approver: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return {
    data: requests,
    pagination: {
      total: totalCount,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalCount / limitNum),
    },
  };
};

export const fetchRequestInfo = async (requestId) => {
  const request = await prismaClient.resourceVersioningRequest.findUnique({
    where: { id: requestId },
    include: {
      resourceVersion: {
        include: {
          resource: {
            include: {
              roles: {
                include: {
                  user: true,
                },
              },
              verifiers: {
                include: {
                  user: true,
                },
                orderBy: {
                  stage: "asc",
                },
              },
              liveVersion: true,
              newVersionEditMode: true,
            },
          },
        },
      },
      sender: true,
      previousRequest: {
        include: {
          sender: true,
        },
      },
      approvals: {
        include: {
          approver: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  // Format the data as per requirements
  const formattedData = {
    Details: {
      Resource: request.resourceVersion.resource.titleEn,
      Status: request.status,
      "Edit Mode": request.resourceVersion.resource.newVersionEditMode
        ? "Active"
        : "Inactive",
      "Assigned Users": {
        Manager:
          request.resourceVersion.resource.roles
            .filter((role) => role.role === "MANAGER")
            .map((role) => role.user.name)
            .join(", ") || "Not assigned",
        Editor:
          request.resourceVersion.resource.roles
            .filter((role) => role.role === "EDITOR")
            .map((role) => role.user.name)
            .join(", ") || "Not assigned",
        Verifiers: request.resourceVersion.resource.verifiers.reduce(
          (acc, verifier) => {
            const level = `level ${verifier.stage}`;
            if (!acc[level]) acc[level] = [];
            acc[level].push(verifier.user.name);
            return acc;
          },
          {}
        ),
        Publisher:
          request.resourceVersion.resource.roles
            .filter((role) => role.role === "PUBLISHER")
            .map((role) => role.user.name)
            .join(", ") || "Not assigned",
      },
      "Submitted Date": request.createdAt.toLocaleDateString("en-US"),
      Comment: request.editorComments || "No comments",
      "Submitted By": request.sender.name,
      "Submitted To":
        request.approvals.length > 0
          ? request.approvals[0].approver.name
          : "Not assigned",
      "Version No.": `V ${request.resourceVersion.versionNumber}`,
      "Reference Document": request.resourceVersion.referenceDoc
        ? "PDF File"
        : "No document",
      "Request Type": request.type,
      "Request No.": request.id.slice(0, 4).toUpperCase(),
      "Previous Request": request.previousRequest
        ? `${request.previousRequest.type} | ${request.previousRequest.id
            .slice(0, 4)
            .toUpperCase()}`
        : "None",
      "Approval Status": request.approvals.map((approval) => ({
        Role: getRoleForApprover(
          approval.approver.id,
          request.resourceVersion.resource
        ),
        Status: approval.status,
        Comment: approval.comments || "No comments",
      })),
    },
  };

  return formattedData;
};

// Helper function to determine role for approver
function getRoleForApprover(userId, resource) {
  const role = resource.roles.find((r) => r.userId === userId);
  if (role) return role.role;

  const verifier = resource.verifiers.find((v) => v.userId === userId);
  if (verifier) return `VERIFIER_LEVEL_${verifier.stage}`;

  return "UNKNOWN";
}
