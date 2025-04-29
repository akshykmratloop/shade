import prismaClient from "../config/dbConfig.js";

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
        formattedResource.liveModeVersionData = await formatResourceVersion(
          resource.liveVersion
        );
      }

      // // Process edit version if it exists
      // if (resource.newVersionEditMode) {
      //   formattedResource.editModeVersionData = await formatResourceVersion(
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
          updatedAt:true,
          versionStatus : true,
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
          updatedAt:true,
          versionStatus : true,
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
    result.liveModeVersionData = await formatResourceVersion(resource.liveVersion);
  }

  // Process edit version if it exists
  if (resource.newVersionEditMode) {
    result.editModeVersionData = await formatResourceVersion(
      resource.newVersionEditMode
    );
  }

  return result;
};

async function formatResourceVersion(resourceVersion) {
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

            return {
              // resourceType: resource.resourceType || "SUB_PAGE",
              order: item.order,
              id: itemContent.id,
              slug: itemContent.slug,
              titleEn: itemContent.titleEn,
              titleAr: itemContent.titleAr,
              resourceType: itemContent.resourceType,
              resourceTag: itemContent.resourceTag,
              liveVersion: itemContent.liveVersion, // Include the full formatted content of the item
            };
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

                  return {
                    resourceType: resource.resourceType || "SUB_PAGE",
                    order: item.order,
                    id: resource.id,
                    slug: resource.slug,
                    titleEn: resource.titleEn,
                    titleAr: resource.titleAr,
                    icon: liveVersion?.icon || null,
                    image: liveVersion?.Image || null,
                    data: itemContent, // Include the full formatted content of the item
                  };
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
    updatedAt : resourceVersion.updatedAt,
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

export const createOrUpdateVersion = async (resourceId, contentData) => {
  // Find the resource with version counts
  const resource = await prismaClient.resource.findUnique({
    where: {
      id: resourceId,
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

  console.log(resource, "resource1");

  if (!resource) {
    throw new Error(`Resource with ID ${resourceId} not found`);
  }

  // Extract the content from the request
  const { newVersionEditMode } = contentData;
  const saveAs = newVersionEditMode?.versionStatus || "DRAFT";
  console.log(saveAs, "resource2");
  // return resource

  // Start a transaction to ensure all operations succeed or fail together
  return await prismaClient.$transaction(async (tx) => {
    let resourceVersion;

    // Check if we need to create a new version or update an existing one
    if (!resource.newVersionEditModeId) {
      const resourceVersion = await tx.resourceVersion.create({
        data: {
          resourceId: resource.id,
          versionNumber: resource._count.versions + 1,
          versionStatus: saveAs,
          notes: newVersionEditMode?.comments || "Version created",
          referenceDoc: newVersionEditMode?.referenceDoc || null,
          content: newVersionEditMode?.content || {},
          icon: newVersionEditMode?.icon || null,
          Image: newVersionEditMode?.image || null,
        },
      });
    
      await tx.resource.update({
        where: { id: resource.id },
        data: { newVersionEditModeId: resourceVersion.id },
      });
    
      console.log("Resource version created:", resourceVersion);
    
      if (Array.isArray(newVersionEditMode?.sections)) {
        for (let i = 0; i < newVersionEditMode.sections.length; i++) {
          const sectionData = newVersionEditMode.sections[i];
          await createSectionVersionWithChildren(tx, {
            sectionData,
            resource,
            resourceVersion,
            order: sectionData.order || i + 1,
          });
        }
      }
    }
     else {
      // Edit version already exists, update it
      resourceVersion = await tx.resourceVersion.update({
        where: { id: resource.newVersionEditModeId },
        data: {
          versionStatus: saveAs,
          notes: newVersionEditMode?.comments || resource.newVersionEditMode.notes,
          referenceDoc: newVersionEditMode?.referenceDoc || resource.newVersionEditMode.referenceDoc,
          content: newVersionEditMode?.content || resource.newVersionEditMode.content,
          icon: newVersionEditMode?.icon || resource.newVersionEditMode.icon,
          Image: newVersionEditMode?.image || resource.newVersionEditMode.Image,
        },
      });
    
      console.log("Updated resource version:", resourceVersion);
    
      // Update sections recursively
      if (Array.isArray(newVersionEditMode?.sections)) {
        for (const sectionData of newVersionEditMode.sections) {
          await updateSectionVersion(tx, sectionData, resourceVersion.id);
        }
      }
    }

    return resourceVersion;
  });
};

async function createSectionVersionWithChildren(tx, {
  sectionData,
  resource,
  resourceVersion,
  parentVersionId = null,
  order = 1,
}) {
  const sectionId = sectionData.sectionId;

  const section = await tx.section.findUnique({
    where: { id: sectionId },
    include: {
      _count: {
        select: { versions: true },
      },
    },
  });

  if (!section) {
    throw new Error(`Section not found for id: ${sectionId}`);
  }

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
        ...(sectionData.content !== undefined ? { content: sectionData.content } : {}),
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
      await updateSectionVersion(tx, sectionData.sections[k], resourceVersionId);
    }
  }
}
