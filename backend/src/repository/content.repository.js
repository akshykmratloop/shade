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
  limit = 10,
  userId,
  roleId,
  apiCallType
) => {
  const skip = (page - 1) * limit;

  // First, fetch the user's roles and permissions
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                select: {
                  permission: true,
                },
              },
              roleType: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if user is super admin
  const isSuperAdmin = user.isSuperUser;

  // Only check for role if user is not super admin
  let rolePermissions = [];
  if (!isSuperAdmin) {
    // Find the specific role from the query
    const queryRole = user.roles.find((r) => r.roleId === roleId)?.role;

    // If role is not found or is inactive, throw error
    if (!apiCallType && !queryRole) {
      throw new Error("Role not found for this user");
    }
    if (queryRole.status === "INACTIVE") {
      throw new Error("Role is inactive for this user");
    }

    if (!apiCallType) {
      // Extract permissions for the specific role
      rolePermissions = queryRole.permissions.map(
        (permissionItem) => permissionItem.permission.name
      );
    }
  }

  // Map permissions to allowed resource types and tags
  const permissionToResourceMap = {
    PAGE_MANAGEMENT: {
      types: ["MAIN_PAGE"],
      tags: [],
    },
    SERVICE_MANAGEMENT: {
      types: ["SUB_PAGE", "SUB_PAGE_ITEM"],
      tags: ["SERVICE"],
    },
    MARKET_MANAGEMENT: {
      types: ["SUB_PAGE", "SUB_PAGE_ITEM"],
      tags: ["MARKET"],
    },
    PROJECT_MANAGEMENT: {
      types: ["SUB_PAGE", "SUB_PAGE_ITEM"],
      tags: ["PROJECT"],
    },
    NEWS_BLOGS_MANAGEMENT: {
      types: ["SUB_PAGE", "SUB_PAGE_ITEM"],
      tags: ["NEWS"],
    },
    CAREER_MANAGEMENT: {
      types: ["SUB_PAGE", "SUB_PAGE_ITEM"],
      tags: ["CAREER"],
    },
    HEADER_MANAGEMENT: {
      types: ["HEADER"],
      tags: ["HEADER"],
    },
    FOOTER_MANAGEMENT: {
      types: ["FOOTER"],
      tags: ["FOOTER"],
    },
    TESTIMONIAL_MANAGEMENT: {
      types: ["SUB_PAGE", "SUB_PAGE_ITEM"],
      tags: ["TESTIMONIAL"],
    },
    FORM_MANAGEMENT: {
      types: ["FORM"],
      tags: [],
    },
  };

  // Initialize filters
  let typeFilter = {};
  let tagFilter = {};
  let resourceIdFilter = {};

  // Super admin logic - they can see all resources
  if (isSuperAdmin) {
    // Super admin gets all resources with optional filters
    if (resourceType) {
      typeFilter = { resourceType };
    }
    if (resourceTag) {
      tagFilter = { resourceTag };
    }
  }
  // Non-super admin logic with role filtering
  else if (!apiCallType) {
    // Handle EDIT permission case (unchanged)
    if (rolePermissions.includes("EDIT")) {
      // Get resources where user is assigned as EDITOR
      const assignedResources = await prismaClient.resourceRole.findMany({
        where: {
          userId,
          role: "EDITOR",
          status: "ACTIVE",
        },
        select: {
          resourceId: true,
        },
      });

      const assignedResourceIds = assignedResources.map((r) => r.resourceId);

      // If no assigned resources, return empty
      if (assignedResourceIds.length <= 0) {
        return {
          resources: [],
          pagination: {
            totalResources: 0,
            totalPages: 0,
            currentPage: page,
            limit,
          },
        };
      }

      // Add assigned resource filter
      resourceIdFilter = { id: { in: assignedResourceIds } };

      // Apply resource type filter if specified
      if (resourceType) {
        typeFilter = { resourceType };
      }

      // Apply resource tag filter if specified
      if (resourceTag) {
        tagFilter = { resourceTag };
      }
    }
    // Handle manager permission cases (updated logic)
    else {
      // Handle both single resource management and other management permissions
      const hasSingleResourceManagement = rolePermissions.includes(
        "SINGLE_RESOURCE_MANAGEMENT"
      );
      const hasPageManagement = rolePermissions.includes("PAGE_MANAGEMENT");
      const hasFooterManagement = rolePermissions.includes("FOOTER_MANAGEMENT");
      const hasOtherManagement = rolePermissions.some(
        (permission) =>
          Object.keys(permissionToResourceMap).includes(permission) &&
          permission !== "PAGE_MANAGEMENT"
      );

      // Get resources where user is assigned as MANAGER (if has single resource management)
      let assignedResourceIds = [];
      if (hasSingleResourceManagement) {
        const assignedManagerResources =
          await prismaClient.resourceRole.findMany({
            where: {
              userId,
              role: "MANAGER",
              status: "ACTIVE",
            },
            select: {
              resourceId: true,
            },
          });
        assignedResourceIds = assignedManagerResources.map((r) => r.resourceId);
      }

      // Handle other management permissions
      let allowedTypes = new Set();
      let allowedTags = new Set();

      // If user has PAGE_MANAGEMENT, they can always see MAIN_PAGEs
      if (hasPageManagement) {
        allowedTypes.add("MAIN_PAGE");
      }

      // Add allowed types and tags from other management permissions
      if (hasOtherManagement) {
        for (const [permission, { types, tags }] of Object.entries(
          permissionToResourceMap
        )) {
          if (rolePermissions.includes(permission)) {
            types.forEach((type) => allowedTypes.add(type));
            tags.forEach((tag) => allowedTags.add(tag));
          }
        }
      }

      // Ensure FOOTER is included when user has FOOTER_MANAGEMENT permission
      if (hasFooterManagement) {
        const { types, tags } = permissionToResourceMap["FOOTER_MANAGEMENT"];
        types.forEach((type) => allowedTypes.add(type));
        tags.forEach((tag) => allowedTags.add(tag));
      }

      // Special case: If querying for MAIN_PAGE
      if (resourceType === "MAIN_PAGE") {
        // If user has PAGE_MANAGEMENT, they can see all MAIN_PAGEs
        if (hasPageManagement) {
          typeFilter = { resourceType: "MAIN_PAGE" };
          // No need for resourceIdFilter as they can see all MAIN_PAGEs
          resourceIdFilter = {};
        }
        // If they don't have PAGE_MANAGEMENT but have SINGLE_RESOURCE_MANAGEMENT
        else if (
          hasSingleResourceManagement &&
          assignedResourceIds.length > 0
        ) {
          // Get only MAIN_PAGEs from assigned resources
          const mainPageResources = await prismaClient.resource.findMany({
            where: {
              id: { in: assignedResourceIds },
              resourceType: "MAIN_PAGE",
            },
            select: { id: true },
          });

          if (mainPageResources.length === 0) {
            return {
              resources: [],
              pagination: {
                totalResources: 0,
                totalPages: 0,
                currentPage: page,
                limit,
              },
            };
          }

          // Only show MAIN_PAGEs where user is assigned as MANAGER
          typeFilter = { resourceType: "MAIN_PAGE" };
          resourceIdFilter = { id: { in: mainPageResources.map((r) => r.id) } };
        } else {
          // No PAGE_MANAGEMENT and no assigned MAIN_PAGEs, return empty
          return {
            resources: [],
            pagination: {
              totalResources: 0,
              totalPages: 0,
              currentPage: page,
              limit,
            },
          };
        }
      }
      // For SUB_PAGE or SUB_PAGE_ITEM queries with specific resourceTag
      else if (
        (resourceType === "SUB_PAGE" || resourceType === "SUB_PAGE_ITEM") &&
        resourceTag
      ) {
        // Check if user has permission for this specific resource type and tag
        let hasPermissionForResourceType = false;

        // Check if any of the user's permissions allow this resource type and tag
        for (const permission of rolePermissions) {
          if (
            permissionToResourceMap[permission] &&
            permissionToResourceMap[permission].types.includes(resourceType) &&
            permissionToResourceMap[permission].tags.includes(resourceTag)
          ) {
            hasPermissionForResourceType = true;
            break;
          }
        }

        // If user has permission for this resource type/tag OR is assigned to resources of this type
        if (hasPermissionForResourceType) {
          // User has direct permission, apply type and tag filters
          typeFilter = { resourceType };
          tagFilter = { resourceTag };
        }
        // If user has SINGLE_RESOURCE_MANAGEMENT but no direct permission for this type
        else if (
          hasSingleResourceManagement &&
          assignedResourceIds.length > 0
        ) {
          // Get only resources of the specified type/tag from assigned resources
          const filteredResources = await prismaClient.resource.findMany({
            where: {
              id: { in: assignedResourceIds },
              resourceType,
              resourceTag,
            },
            select: { id: true },
          });

          if (filteredResources.length === 0) {
            return {
              resources: [],
              pagination: {
                totalResources: 0,
                totalPages: 0,
                currentPage: page,
                limit,
              },
            };
          }

          // Only show resources where user is assigned as MANAGER
          typeFilter = { resourceType };
          tagFilter = { resourceTag };
          resourceIdFilter = { id: { in: filteredResources.map((r) => r.id) } };
        } else {
          // No permission and no assigned resources of this type, return empty
          return {
            resources: [],
            pagination: {
              totalResources: 0,
              totalPages: 0,
              currentPage: page,
              limit,
            },
          };
        }
      }
      // For other queries (no specific resourceType or a type that's not MAIN_PAGE/SUB_PAGE)
      else {
        // Build filters based on permissions and assignments

        // If user has SINGLE_RESOURCE_MANAGEMENT, include assigned resources
        if (hasSingleResourceManagement && assignedResourceIds.length > 0) {
          // If user also has FOOTER_MANAGEMENT, we need to handle this special case
          if (hasFooterManagement) {
            // We don't set resourceIdFilter directly here, as we'll handle it in the typeFilter and tagFilter
            // This ensures we get both assigned resources AND footers
          } else {
            resourceIdFilter = { id: { in: assignedResourceIds } };
          }
        }

        // If user has PAGE_MANAGEMENT, FOOTER_MANAGEMENT, or other management permissions
        if (hasPageManagement || hasOtherManagement || hasFooterManagement) {
          // If no specific resourceType is requested, use allowed types from permissions
          if (!resourceType && allowedTypes.size > 0) {
            typeFilter = { resourceType: { in: Array.from(allowedTypes) } };
          }
          // If specific resourceType is requested, check if it's allowed
          else if (
            resourceType &&
            !allowedTypes.has(resourceType) &&
            !(hasSingleResourceManagement && assignedResourceIds.length > 0) &&
            !(resourceType === "FOOTER" && hasFooterManagement)
          ) {
            return {
              resources: [],
              pagination: {
                totalResources: 0,
                totalPages: 0,
                currentPage: page,
                limit,
              },
            };
          } else if (resourceType) {
            typeFilter = { resourceType };
          }

          // If no specific resourceTag is requested, use allowed tags from permissions
          if (!resourceTag && allowedTags.size > 0) {
            tagFilter = { resourceTag: { in: Array.from(allowedTags) } };
          }
          // If specific resourceTag is requested, check if it's allowed
          else if (
            resourceTag &&
            !allowedTags.has(resourceTag) &&
            !(hasSingleResourceManagement && assignedResourceIds.length > 0) &&
            !(resourceTag === "FOOTER" && hasFooterManagement)
          ) {
            return {
              resources: [],
              pagination: {
                totalResources: 0,
                totalPages: 0,
                currentPage: page,
                limit,
              },
            };
          } else if (resourceTag) {
            tagFilter = { resourceTag };
          }
        }
        // If user only has SINGLE_RESOURCE_MANAGEMENT (no other permissions)
        else if (hasSingleResourceManagement) {
          // Apply resourceType and resourceTag filters if specified
          if (resourceType) {
            typeFilter = { resourceType };
          }
          if (resourceTag) {
            tagFilter = { resourceTag };
          }
        }
        // User has no relevant permissions
        else {
          return {
            resources: [],
            pagination: {
              totalResources: 0,
              totalPages: 0,
              currentPage: page,
              limit,
            },
          };
        }
      }
    }
  } else {
    if (resourceType) {
      typeFilter = { resourceType };
    }

    // Apply resource tag filter if specified
    if (resourceTag) {
      tagFilter = { resourceTag };
    }
  }

  // Build the base where clause
  const baseWhereClause = {
    ...typeFilter,
    ...tagFilter,
    ...resourceIdFilter,
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
    where: baseWhereClause,
    include: {
      _count: {
        select: {
          versions: true,
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
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: parseInt(limit),
  });

  // Get total count for pagination
  const totalResources = await prismaClient.resource.count({
    where: baseWhereClause,
  });

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
  limit = 10,
  userId,
  roleId,
  apiCallType
) => {
  // First fetch the filtered resources based on permissions and roleId
  const filteredResources = await fetchResources(
    resourceType,
    resourceTag,
    relationType,
    isAssigned,
    search,
    status,
    page,
    limit,
    userId,
    roleId,
    apiCallType
  );

  // If no resources found, return early
  if (
    !filteredResources.resources ||
    filteredResources.resources.length === 0
  ) {
    return {
      resources: [],
      pagination: filteredResources.pagination,
    };
  }

  const resourceIds = filteredResources.resources.map(
    (resource) => resource.id
  );
  const skip = (page - 1) * limit;

  // Build the where clause based on provided filters and filtered resource IDs
  const whereClause = {
    id: { in: resourceIds },
    ...(resourceType ? { resourceType } : {}),
    ...(resourceTag ? { resourceTag } : {}),
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
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: parseInt(limit),
  });

  if (!resources || resources.length === 0) {
    return {
      resources: [],
      pagination: {
        totalResources: 0,
        totalPages: 0,
        currentPage: page,
        limit,
      },
    };
  }

  // Process each resource with its versions
  const formattedResources = await Promise.all(
    resources.map(async (resource) => {
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

export const markAllAssignedUserInactive = async (resourceId) => {
  return await prismaClient.$transaction(async (prisma) => {
    // 1. Mark all active roles as inactive
    await prisma.resourceRole.updateMany({
      where: {
        resourceId,
        status: "ACTIVE",
      },
      data: {
        status: "INACTIVE",
      },
    });

    // 2. Mark all active verifiers as inactive
    await prisma.resourceVerifier.updateMany({
      where: {
        resourceId,
        status: "ACTIVE",
      },
      data: {
        status: "INACTIVE",
      },
    });

    // 3. If there's a version, mark those assignments as inactive too
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { newVersionEditModeId: true },
    });

    if (resource?.newVersionEditModeId) {
      await prisma.resourceVersionRole.updateMany({
        where: {
          resourceVersionId: resource.newVersionEditModeId,
          status: "ACTIVE",
        },
        data: {
          status: "INACTIVE",
        },
      });

      await prisma.resourceVersionVerifier.updateMany({
        where: {
          resourceVersionId: resource.newVersionEditModeId,
          status: "ACTIVE",
        },
        data: {
          status: "INACTIVE",
        },
      });
    }

    // 4. Update the resource's isAssigned flag if needed
    await prisma.resource.update({
      where: { id: resourceId },
      data: { isAssigned: false },
    });

    return {
      success: true,
      message: `All active user assignments for resource ${resourceId} have been marked as inactive`,
    };
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

export const fetchContent = async (resourceId, isItemFullContent = true) => {
  // Fetch the resource with all necessary relations
  const resource = await prismaClient.resource.findUnique({
    where: {
      id: resourceId,
    },
    include: {
      liveVersion: {
        select: {
          ...(isItemFullContent
            ? {
                id: true,
                versionNumber: true,
                content: true,
                icon: true,
                Image: true,
                notes: true,
                referenceDoc: true,
                updatedAt: true,
                versionStatus: true,
              }
            : {
                id: true,
                icon: true,
                Image: true,
              }),
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
    ...(isItemFullContent && {
      resourceType: resource.resourceType,
      resourceTag: resource.resourceTag,
      relationType: resource.relationType,
    }),
  };

  // Process live version if it exists
  if (resource.liveVersion) {
    result.liveModeVersionData = await formatResourceVersionData(
      resource.liveVersion,
      isItemFullContent,
      resource.slug
    );
  }

  // Process edit version if it exists
  if (isItemFullContent && resource.newVersionEditMode) {
    result.editModeVersionData = await formatResourceVersionData(
      resource.newVersionEditMode,
      isItemFullContent,
      resource.slug
    );
  }

  return result;
};

async function formatResourceVersionData(
  resourceVersion,
  isItemFullContent,
  resourceSlug
) {
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
        // sectionVersionId: sectionVersion.id,
        order: sectionOrderMap[sectionVersion.id] || 999,
        version: sectionVersion.version,
        title: sectionVersion.section?.title || "",
        // SectionType: sectionVersion.section?.sectionType?.name || "",
        content: sectionVersion.content || {},
        // sections: [], // Initialize sections array
      };

      // Add items if they exist
      if (
        isItemFullContent &&
        sectionVersion.items &&
        sectionVersion.items.length > 0
      ) {
        formattedSection.items = await Promise.all(
          sectionVersion.items.map(async (item) => {
            // Get the resource and its live version
            const resource = item.resource;

            // Fetch the full content of the item resource
            const itemContent = await fetchContent(resource.id, false);

            let returningBody = {
              id: itemContent.id,
              titleEn: itemContent.titleEn,
              titleAr: itemContent.titleAr,
              slug: itemContent.slug,
              icon: itemContent.liveModeVersionData.icon,
              image: itemContent.liveModeVersionData.image,
            };

            if (
              resourceSlug === "home" &&
              sectionOrderMap[sectionVersion.id] === 7
            ) {
              returningBody = itemContent;
            }

            if (resourceSlug === 'service' && sectionOrderMap[sectionVersion.id] === 2) {
              returningBody.description = itemContent.liveModeVersionData.sections[0].content.description;
            }

            return { ...returningBody, order: item.order };
          })
        );
      }

      // Add child sections if they exist
      if (sectionVersion.children && sectionVersion.children.length > 0) {
        // Initialize sections array if it doesn't exist
        formattedSection.sections = [];

        // Add child sections
        formattedSection.sections = await Promise.all(
          sectionVersion.children.map(async (childSection) => {
            const formattedChild = {
              sectionId: childSection.sectionId,
              // sectionVersionId: childSection.id,
              order: sectionOrderMap[childSection.id] || 999,
              title: childSection.section?.title || "",
              // SectionType: childSection.section?.sectionType?.name || "",
              content: childSection.content || {},
            };

            // Add items to child section if they exist
            if (
              isItemFullContent &&
              childSection.items &&
              childSection.items.length > 0
            ) {
              formattedChild.items = await Promise.all(
                childSection.items.map(async (item) => {
                  // Get the resource
                  const resource = item.resource;

                  const itemContent = await fetchContent(resource.id, false);

                  let returningBody = {
                    id: itemContent.id,
                    titleEn: itemContent.titleEn,
                    titleAr: itemContent.titleAr,
                    slug: itemContent.slug,
                    icon: itemContent.liveModeVersionData.icon,
                    image: itemContent.liveModeVersionData.image,
                  };

                  if (
                    resourceSlug === "home" &&
                    sectionOrderMap[sectionVersion.id] === 7
                  ) {
                    returningBody = itemContent;
                  } else if (
                    resourceSlug === "home" &&
                    sectionOrderMap[sectionVersion.id] === 5
                  ) {
                    returningBody.location =
                      itemContent.liveModeVersionData.sections[1].content[0];
                  }
                  return { ...returningBody, order: item.order };
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
    // content: resourceVersion.content || {},
    icon: resourceVersion.icon || null,
    image: resourceVersion.Image || null,
    comments: resourceVersion.notes,
    referenceDoc: resourceVersion.referenceDoc,
    updatedAt: resourceVersion.updatedAt,
    status: resourceVersion.versionStatus,
    sections: formattedSections,
  };
}

//DRAFT CONTENT
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

  const { newVersionEditMode } = contentData;

  assert(
    resource.newVersionEditMode.versionStatus === "DRAFT",
    "NOT_ALLOWED",
    `Not Allowed, Previous request is already in process`
  );

  // Extract the content from the request
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
  // We'll use order later when creating/updating section

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

//DIRECT PUBLISH CONTENT
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

// SUBMIT CONTENT FOR VERIFICATION
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

    // GENERATE A REQ AND APPROVAL LOGS
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

    await tx.requestApproval.createMany({
      data: resource.verifiers.map((verifier) => ({
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
  roleId,
  permission,
  search,
  status,
  pageNum = 1,
  limitNum = 10
) => {
  const skip = (pageNum - 1) * limitNum;

  // First, fetch the user's roles and permissions
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                select: {
                  permission: true,
                },
              },
              roleType: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if user is super admin
  const isSuperAdmin = user.isSuperUser;

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

  // Map permissions to allowed resource types and tags
  const permissionToResourceMap = {
    PAGE_MANAGEMENT: {
      types: ["MAIN_PAGE"],
      tags: [],
    },
    SERVICE_MANAGEMENT: {
      types: ["SUB_PAGE", "SUB_PAGE_ITEM"],
      tags: ["SERVICE"],
    },
    MARKET_MANAGEMENT: {
      types: ["SUB_PAGE", "SUB_PAGE_ITEM"],
      tags: ["MARKET"],
    },
    PROJECT_MANAGEMENT: {
      types: ["SUB_PAGE", "SUB_PAGE_ITEM"],
      tags: ["PROJECT"],
    },
    NEWS_BLOGS_MANAGEMENT: {
      types: ["SUB_PAGE", "SUB_PAGE_ITEM"],
      tags: ["NEWS"],
    },
    CAREER_MANAGEMENT: {
      types: ["SUB_PAGE", "SUB_PAGE_ITEM"],
      tags: ["CAREER"],
    },
    HEADER_MANAGEMENT: {
      types: ["HEADER"],
      tags: ["HEADER"],
    },
    FOOTER_MANAGEMENT: {
      types: ["FOOTER"],
      tags: ["FOOTER"],
    },
    TESTIMONIAL_MANAGEMENT: {
      types: ["SUB_PAGE_ITEM"],
      tags: ["TESTIMONIAL"],
    },
    FORM_MANAGEMENT: {
      types: ["FORM"],
      tags: [],
    },
  };

  // If user is not super admin, apply role-based filtering
  if (!isSuperAdmin && roleId) {
    // Find the specific role from the query
    const queryRole = user.roles.find((r) => r.roleId === roleId)?.role;
    // If role is not found or is inactive, throw error
    if (!queryRole) {
      throw new Error("Role not found for this user");
    }
    if (queryRole.status === "INACTIVE") {
      throw new Error("Role is inactive for this user");
    }

    // Extract permissions for the specific role
    const rolePermissions = queryRole.permissions.map(
      (permissionItem) => permissionItem.permission.name
    );

    // Check role type
    const roleType = queryRole.roleType.name;

    if (roleType === "MANAGER") {
      // Handle manager role type
      const hasSingleResourceManagement = rolePermissions.includes(
        "SINGLE_RESOURCE_MANAGEMENT"
      );
      const hasPageManagement = rolePermissions.includes("PAGE_MANAGEMENT");
      const hasFooterManagement = rolePermissions.includes("FOOTER_MANAGEMENT");
      const hasOtherManagement = rolePermissions.some(
        (perm) =>
          Object.keys(permissionToResourceMap).includes(perm) &&
          perm !== "PAGE_MANAGEMENT"
      );

      // Get resources where user is assigned as MANAGER with ACTIVE status
      let assignedResourceIds = [];
      if (hasSingleResourceManagement) {
        const assignedManagerResources =
          await prismaClient.resourceRole.findMany({
            where: {
              userId,
              role: "MANAGER",
              status: "ACTIVE",
            },
            select: {
              resourceId: true,
            },
          });
        assignedResourceIds = assignedManagerResources.map((r) => r.resourceId);
      }

      // Build the OR conditions for filtering resources
      const orConditions = [];

      // Handle PAGE_MANAGEMENT permission separately to ensure it's always included
      if (hasPageManagement) {
        orConditions.push({
          resourceType: "MAIN_PAGE",
        });
      }

      // Handle other management permissions
      if (hasOtherManagement || hasFooterManagement) {
        // Group permissions by resource type and tag
        const typePermissions = new Map();
        const tagPermissions = new Map();

        for (const [perm, { types, tags }] of Object.entries(
          permissionToResourceMap
        )) {
          if (
            (rolePermissions.includes(perm) && perm !== "PAGE_MANAGEMENT") ||
            (perm === "FOOTER_MANAGEMENT" && hasFooterManagement)
          ) {
            // Add types to the map
            types.forEach((type) => {
              if (!typePermissions.has(type)) {
                typePermissions.set(type, []);
              }
              typePermissions.get(type).push(perm);
            });

            // Add tags to the map
            tags.forEach((tag) => {
              if (!tagPermissions.has(tag)) {
                tagPermissions.set(tag, []);
              }
              tagPermissions.get(tag).push(perm);
            });
          }
        }

        // Create conditions for each type
        if (typePermissions.size > 0) {
          const types = Array.from(typePermissions.keys());
          if (types.length > 0) {
            orConditions.push({
              resourceType: { in: types },
            });
          }
        }

        // Create conditions for each tag
        if (tagPermissions.size > 0) {
          const tags = Array.from(tagPermissions.keys());
          if (tags.length > 0) {
            orConditions.push({
              resourceTag: { in: tags },
            });
          }
        }
      }

      // If user has SINGLE_RESOURCE_MANAGEMENT and has assigned resources, add them to OR conditions
      if (hasSingleResourceManagement && assignedResourceIds.length > 0) {
        orConditions.push({
          id: { in: assignedResourceIds },
        });
      }

      // If we have any conditions to filter by
      if (orConditions.length > 0) {
        where.resourceVersion = {
          ...where.resourceVersion,
          resource: {
            ...where.resourceVersion?.resource,
            OR: orConditions,
          },
        };
      } else {
        // If user has no relevant permissions or assignments, return empty
        return {
          data: [],
          pagination: {
            total: 0,
            page: pageNum,
            limit: limitNum,
            totalPages: 0,
          },
        };
      }
    } else if (roleType === "USER") {
      // Handle user role type based on the permission in the request
      if (permission === "EDIT") {
        // User with EDIT permission sees requests where they are EDITOR or SENDER
        where.OR = [
          // Requests where user is the sender
          { senderId: userId },
          // Requests for resources where user is assigned as EDITOR with ACTIVE status
          {
            resourceVersion: {
              ...where.resourceVersion?.resourceVersion,
              resource: {
                ...where.resourceVersion?.resource,
                roles: {
                  some: {
                    userId,
                    role: "EDITOR",
                    status: "ACTIVE",
                  },
                },
              },
            },
          },
        ];
      } else if (permission === "VERIFY") {
        // User with VERIFY permission sees requests where they are a VERIFIER
        where.resourceVersion = {
          ...where.resourceVersion,
          resource: {
            ...where.resourceVersion?.resource,
            verifiers: {
              some: {
                userId,
                status: "ACTIVE",
              },
            },
          },
        };
      } else if (permission === "PUBLISH") {
        // User with PUBLISH permission sees publication requests where they are a PUBLISHER
        where.type = "PUBLICATION"; // Only show publication requests
        where.resourceVersion = {
          ...where.resourceVersion,
          resource: {
            ...where.resourceVersion?.resource,
            roles: {
              some: {
                userId,
                role: "PUBLISHER",
                status: "ACTIVE",
              },
            },
          },
        };
      } else {
        // If no valid permission specified, return empty
        return {
          data: [],
          pagination: {
            total: 0,
            page: pageNum,
            limit: limitNum,
            totalPages: 0,
          },
        };
      }
    }
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
              resourceTag: true,
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
                orderBy: {
                  stage: "asc",
                },
              },
              // liveVersion: true,
              // newVersionEditMode: true,
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
                where: {
                  status: "ACTIVE",
                },
                include: {
                  user: true,
                },
              },
              verifiers: {
                where: {
                  status: "ACTIVE",
                },
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
    details: {
      resource: request.resourceVersion.resource.titleEn,
      resourceType: request.resourceVersion.resource.resourceType,
      resourceTag: request.resourceVersion.resource.resourceTag,
      slug: request.resourceVersion.resource.slug,
      status: request.status,
      assignedUsers: {
        manager:
          request.resourceVersion.resource.roles
            .filter((role) => role.role === "MANAGER")
            .map((role) => role.user.name)
            .join(", ") || "Not assigned",
        editor:
          request.resourceVersion.resource.roles
            .filter((role) => role.role === "EDITOR")
            .map((role) => role.user.name)
            .join(", ") || "Not assigned",
        verifiers: request.resourceVersion.resource.verifiers.reduce(
          (acc, verifier) => {
            const level = `level ${verifier.stage}`;
            if (!acc[level]) acc[level] = verifier.user.name;
            // acc[level].push(verifier.user.name);
            return acc;
          },
          {}
        ),
        publisher:
          request.resourceVersion.resource.roles
            .filter((role) => role.role === "PUBLISHER")
            .map((role) => role.user.name)
            .join(", ") || "Not assigned",
      },
      submittedDate: request.createdAt,
      comment: request.editorComments || "No comments",
      submittedBy: request.sender.name,
      submittedTo:
        request.approvals.length > 0
          ? request.approvals[0].approver.name
          : "Not assigned",
      "versionNo.": `V ${request.resourceVersion.versionNumber}`,
      referenceDocument: request.resourceVersion.referenceDoc || "No document",
      requestType: request.type,
      "requestNo.": request.id.slice(0, 4).toUpperCase(),
      previousRequest: request.previousRequest
        ? `${request.previousRequest.type} | ${request.previousRequest.id
            .slice(0, 4)
            .toUpperCase()}`
        : "None",
      approvalStatus: request.approvals.map((approval) => ({
        role: getRoleForApprover(
          approval.approver.id,
          request.resourceVersion.resource
        ),
        stage: approval.stage,
        status: approval.status,
        comment: approval.comments || "No comments",
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

export const approveRequestInVerification = async (requestId, userId) => {
  return await prismaClient.$transaction(async (tx) => {
    // Find the specific approval log for this user
    const approvalLog = await tx.requestApproval.findFirst({
      where: {
        requestId: requestId,
        approverId: userId,
        status: "PENDING",
      },
    });

    if (!approvalLog) {
      throw new Error("Approval log not found");
    }

    // Update the approval status
    await tx.requestApproval.update({
      where: { id: approvalLog.id },
      data: {
        status: "APPROVED",
      },
    });

    // Check if all verifiers have approved
    const pendingApprovals = await tx.requestApproval.count({
      where: {
        requestId: requestId,
        status: "PENDING",
        stage: { not: null },
      },
    });

    // If no pending approvals remain, update the request status and resource version status
    if (pendingApprovals === 0) {
      // Get the request to find the resourceVersionId
      const request = await tx.resourceVersioningRequest.findUnique({
        where: { id: requestId },
        select: { resourceVersionId: true },
      });

      // Update request status
      await tx.resourceVersioningRequest.update({
        where: { id: requestId },
        data: {
          status: "APPROVED",
        },
      });

      // Update resource version status to PUBLISH_PENDING
      await tx.resourceVersion.update({
        where: { id: request.resourceVersionId },
        data: {
          versionStatus: "PUBLISH_PENDING",
        },
      });
    }

    // Get the updated request to return
    const request = await tx.resourceVersioningRequest.findUnique({
      where: { id: requestId },
      include: {
        approvals: true,
      },
    });

    return request;
  });
};

export const rejectRequestInVerification = async (
  requestId,
  userId,
  rejectReason
) => {
  return await prismaClient.$transaction(async (tx) => {
    // Find and update the specific approval log for this verifier
    const approvalLog = await tx.resourceVersioningRequestApproval.updateMany({
      where: {
        requestId: requestId,
        approverId: userId,
        status: "PENDING",
      },
      data: {
        status: "REJECTED",
        comments: rejectReason,
      },
    });

    // Update the request status to REJECTED
    await tx.resourceVersioningRequest.update({
      where: { id: requestId },
      data: {
        status: "REJECTED",
      },
    });

    // Get the updated request to return
    const request = await tx.resourceVersioningRequest.findUnique({
      where: { id: requestId },
      include: {
        approvals: true,
      },
    });

    return request;
  });
};

export const fetchVersionsList = async (
  resourceId,
  search,
  status,
  page,
  limit
) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  // Fetch the resource to get liveVersionId and newVersionEditModeId
  const resource = await prismaClient.resource.findUnique({
    where: { id: resourceId },
    select: {
      liveVersionId: true,
      newVersionEditModeId: true,
    },
  });

  const [versions, totalVersions] = await Promise.all([
    prismaClient.resourceVersion.findMany({
      where: {
        resourceId: resourceId,
        status: status ? status : undefined,
        OR: search
          ? [
              { titleEn: { contains: search, mode: "insensitive" } },
              { titleAr: { contains: search, mode: "insensitive" } },
            ]
          : undefined,
      },
      orderBy: {
        versionNumber: "desc",
      },
      skip: skip,
      take: limitNum,
    }),
    prismaClient.resourceVersion.count({
      where: {
        resourceId: resourceId,
        status: status ? status : undefined,
        OR: search
          ? [
              { titleEn: { contains: search, mode: "insensitive" } },
              { titleAr: { contains: search, mode: "insensitive" } },
            ]
          : undefined,
      },
    }),
  ]);

  // Add flags to each version
  const versionsWithFlags = versions.map((version) => ({
    ...version,
    isLive: version.id === resource.liveVersionId,
    isUnderEditing: version.id === resource.newVersionEditModeId,
  }));

  return {
    versions: versionsWithFlags,
    pagination: {
      totalVersions,
      totalPages: Math.ceil(totalVersions / limitNum),
      currentPage: pageNum,
      limit: limitNum,
    },
  };
};
