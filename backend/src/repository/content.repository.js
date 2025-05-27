import prismaClient from "../config/dbConfig.js";
import {assert} from "../errors/assertError.js";

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
  apiCallType,
  filterText
) => {
  const skip = (page - 1) * limit;

  // First, fetch the user's roles and permissions
  const user = await prismaClient.user.findUnique({
    where: {id: userId},
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
      typeFilter = {resourceType};
    }
    if (resourceTag) {
      tagFilter = {resourceTag};
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
      resourceIdFilter = {id: {in: assignedResourceIds}};

      // Apply resource type filter if specified
      if (resourceType) {
        typeFilter = {resourceType};
      }

      // Apply resource tag filter if specified
      if (resourceTag) {
        tagFilter = {resourceTag};
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
        for (const [permission, {types, tags}] of Object.entries(
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
        const {types, tags} = permissionToResourceMap["FOOTER_MANAGEMENT"];
        types.forEach((type) => allowedTypes.add(type));
        tags.forEach((tag) => allowedTags.add(tag));
      }

      // Special case: If querying for MAIN_PAGE
      if (resourceType === "MAIN_PAGE") {
        // If user has PAGE_MANAGEMENT, they can see all MAIN_PAGEs
        if (hasPageManagement) {
          typeFilter = {resourceType: "MAIN_PAGE"};
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
              id: {in: assignedResourceIds},
              resourceType: "MAIN_PAGE",
            },
            select: {id: true},
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
          typeFilter = {resourceType: "MAIN_PAGE"};
          resourceIdFilter = {id: {in: mainPageResources.map((r) => r.id)}};
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
          typeFilter = {resourceType};
          tagFilter = {resourceTag};
        }
        // If user has SINGLE_RESOURCE_MANAGEMENT but no direct permission for this type
        else if (
          hasSingleResourceManagement &&
          assignedResourceIds.length > 0
        ) {
          // Get only resources of the specified type/tag from assigned resources
          const filteredResources = await prismaClient.resource.findMany({
            where: {
              id: {in: assignedResourceIds},
              resourceType,
              resourceTag,
            },
            select: {id: true},
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
          typeFilter = {resourceType};
          tagFilter = {resourceTag};
          resourceIdFilter = {id: {in: filteredResources.map((r) => r.id)}};
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
            resourceIdFilter = {id: {in: assignedResourceIds}};
          }
        }

        // If user has PAGE_MANAGEMENT, FOOTER_MANAGEMENT, or other management permissions
        if (hasPageManagement || hasOtherManagement || hasFooterManagement) {
          // If no specific resourceType is requested, use allowed types from permissions
          if (!resourceType && allowedTypes.size > 0) {
            typeFilter = {resourceType: {in: Array.from(allowedTypes)}};
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
            typeFilter = {resourceType};
          }

          // If no specific resourceTag is requested, use allowed tags from permissions
          if (!resourceTag && allowedTags.size > 0) {
            tagFilter = {resourceTag: {in: Array.from(allowedTags)}};
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
            tagFilter = {resourceTag};
          }
        }
        // If user only has SINGLE_RESOURCE_MANAGEMENT (no other permissions)
        else if (hasSingleResourceManagement) {
          // Apply resourceType and resourceTag filters if specified
          if (resourceType) {
            typeFilter = {resourceType};
          }
          if (resourceTag) {
            tagFilter = {resourceTag};
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
      typeFilter = {resourceType};
    }

    // Apply resource tag filter if specified
    if (resourceTag) {
      tagFilter = {resourceTag};
    }
  }

  // Build the base where clause
  const baseWhereClause = {
    ...typeFilter,
    ...tagFilter,
    ...resourceIdFilter,
    ...(relationType ? {relationType} : {}),
    ...(typeof isAssigned === "boolean" ? {isAssigned} : {}),
    ...(status ? {status} : {}),
    ...(search
      ? {
          OR: [
            {titleEn: {contains: search, mode: "insensitive"}},
            {titleAr: {contains: search, mode: "insensitive"}},
            {slug: {contains: search, mode: "insensitive"}},
          ],
        }
      : {}),
    ...(filterText && filterText !== "ALL"
      ? {
          filters: {
            some: {
              OR: [
                {nameEn: {equals: filterText}},
                {nameAr: {equals: filterText}},
              ],
            },
          },
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
      filters: {
        select: {
          id: true,
          nameEn: true,
          nameAr: true,
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
    orderBy: {createdAt: "desc"},
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
  apiCallType,
  filterText
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
    apiCallType,
    filterText
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

  // Fetch the resources with all necessary relations
  const resources = await prismaClient.resource.findMany({
    where: {
      id: {in: resourceIds},
    },
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
    orderBy: {createdAt: "desc"},
    skip: (page - 1) * limit,
    take: parseInt(limit),
  });

  // Process each resource with its versions
  const formattedResources = await Promise.all(
    resources.map(async (resource) => ({
      id: resource.id,
      titleEn: resource.titleEn,
      titleAr: resource.titleAr,
      slug: resource.slug,
      resourceType: resource.resourceType,
      resourceTag: resource.resourceTag,
      relationType: resource.relationType,
      ...(resource.liveVersion && {
        liveModeVersionData: await formatResourceVersionData(
          resource.liveVersion
        ),
      }),
    }))
  );

  return {
    resources: formattedResources,
    pagination: filteredResources.pagination,
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
              flowStatus: true,
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
        latestRequest.status === "VERIFICATION_PENDING"
      ) {
        // If flow status is REJECTED, it's in edit mode (for resubmission)
        if (latestRequest.flowStatus === "REJECTED") {
          versionMode = "editMode";
        } else {
          versionMode = "verificationMode";
        }
      } else if (
        latestRequest.type === "PUBLICATION" &&
        latestRequest.status === "PUBLISH_PENDING"
      ) {
        // If flow status is REJECTED, it's in edit mode (for resubmission)
        if (latestRequest.flowStatus === "REJECTED") {
          versionMode = "editMode";
        } else {
          versionMode = "publishMode";
        }
      } else if (latestRequest.status === "PUBLISHED") {
        versionMode = "published";
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
    where: {id: resourceId},
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
    // Helper function to get pending requests for a resource
    const getPendingRequests = async (resourceId, versionId = null) => {
      return await prisma.resourceVersioningRequest.findMany({
        where: {
          ...(versionId ? { resourceVersionId: versionId } : { resourceVersion: { resourceId } }),
          OR: [
            { status: "VERIFICATION_PENDING" },
            { status: "PUBLISH_PENDING" }
          ]
        },
        select: { id: true }
      });
    };

    // Helper function to check if a user has taken action on requests
    const hasUserTakenAction = async (userId, requestIds, stage = null) => {
      if (!requestIds.length) return false;

      const approvals = await prisma.requestApproval.findMany({
        where: {
          requestId: { in: requestIds },
          approverId: userId,
          stage,
          status: { not: "PENDING" } // Either APPROVED or REJECTED
        }
      });

      return approvals.length > 0;
    };

    const roleMap = {
      MANAGER: manager,
      EDITOR: editor,
      PUBLISHER: publisher,
    };

    // Check if publisher is being removed (was active but not in payload)
    const activePublisher = currentResource.roles.find(
      (r) => r.role === "PUBLISHER" && r.status === "ACTIVE"
    );

    if (activePublisher && !publisher) {
      const pendingRequests = await getPendingRequests(resourceId);

      if (pendingRequests.length > 0) {
        const hasTakenAction = await hasUserTakenAction(
          activePublisher.userId,
          pendingRequests.map(req => req.id),
          null
        );

        if (hasTakenAction) {
          throw new Error(`Cannot remove publisher - they've already acted on requests`);
        }
      }
    }

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
          where: {id: activeVerifierAssignment.id},
          data: {status: "INACTIVE"},
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

        // If the user was a publisher, mark their approval logs as inactive
        if (activeInOtherRole.role === "PUBLISHER") {
          // Find all pending requests for this resource
          const pendingRequests = await prisma.resourceVersioningRequest.findMany({
            where: {
              resourceVersion: {
                resourceId: resourceId
              },
              OR: [
                { status: "VERIFICATION_PENDING" },
                { status: "PUBLISH_PENDING" }
              ]
            },
            select: {
              id: true
            }
          });

          // Mark all publisher approval logs as inactive
          if (pendingRequests.length > 0) {
            await prisma.requestApproval.updateMany({
              where: {
                requestId: { in: pendingRequests.map(req => req.id) },
                approverId: userId,
                stage: null, // Publisher approvals have null stage
              },
              data: {
                approverStatus: "INACTIVE"
              }
            });
          }
        }
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

        // If replacing a publisher, check if they've approved any requests
        if (role === "PUBLISHER") {
          const pendingRequests = await getPendingRequests(resourceId);

          if (pendingRequests.length > 0) {
            const hasTakenAction = await hasUserTakenAction(
              otherUserActive.userId,
              pendingRequests.map(req => req.id),
              null
            );

            // If the publisher has taken any action (approved or rejected), we can't reassign them
            if (hasTakenAction) {
              throw new Error(`Cannot reassign publisher because they have already taken action on requests (approved or rejected). Only publishers who haven't taken any action can be reassigned.`);
            }

            // Mark all publisher approval logs as inactive
            await prisma.requestApproval.updateMany({
              where: {
                requestId: { in: pendingRequests.map(req => req.id) },
                approverId: otherUserActive.userId,
                stage: null, // Publisher approvals have null stage
              },
              data: {
                approverStatus: "INACTIVE"
              }
            });
          }
        }
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

        // If reactivating a publisher, check for inactive approval logs to reactivate
        if (role === "PUBLISHER") {
          const pendingRequests = await getPendingRequests(resourceId);

          if (pendingRequests.length > 0) {
            // Check for existing inactive approval logs for this user as publisher
            const inactiveApprovals = await prisma.requestApproval.findMany({
              where: {
                requestId: { in: pendingRequests.map(req => req.id) },
                approverId: userId,
                stage: null, // Publisher approvals have null stage
                approverStatus: "INACTIVE"
              }
            });

            // Reactivate existing approval logs
            if (inactiveApprovals.length > 0) {
              await prisma.requestApproval.updateMany({
                where: {
                  id: { in: inactiveApprovals.map(approval => approval.id) }
                },
                data: {
                  approverStatus: "ACTIVE"
                }
              });
            } else {
              // Create new approval logs if none exist
              for (const request of pendingRequests) {
                // Check if there's already an active approval for this request
                const existingApproval = await prisma.requestApproval.findFirst({
                  where: {
                    requestId: request.id,
                    stage: null, // Publisher approvals have null stage
                    approverStatus: "ACTIVE"
                  }
                });

                // Only create if no active approval exists
                if (!existingApproval) {
                  await prisma.requestApproval.create({
                    data: {
                      stage: null,
                      comments: null,
                      requestId: request.id,
                      approverId: userId
                    }
                  });
                }
              }
            }
          }
        }
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

        // If assigning a new publisher, create approval logs for pending requests
        if (role === "PUBLISHER") {
          const pendingRequests = await getPendingRequests(resourceId);

          // Create new approval logs for each pending request
          for (const request of pendingRequests) {
            // Check if there's already an active approval for this request
            const existingApproval = await prisma.requestApproval.findFirst({
              where: {
                requestId: request.id,
                stage: null, // Publisher approvals have null stage
                approverStatus: "ACTIVE"
              }
            });

            // Only create if no active approval exists
            if (!existingApproval) {
              await prisma.requestApproval.create({
                data: {
                  stage: null,
                  comments: null,
                  requestId: request.id,
                  approverId: userId
                }
              });
            }
          }
        }
      }
    }

    // 4. Process verifier assignments (after roles are processed)
    if (Array.isArray(verifiers)) {
      // Check if publisher has taken action on any pending requests
      const pendingRequests = await getPendingRequests(resourceId);
      let publisherHasTakenAction = false;

      if (pendingRequests.length > 0) {
        // Find current active publisher
        const currentPublisher = currentResource.roles.find(
          (r) => r.role === "PUBLISHER" && r.status === "ACTIVE"
        );

        if (currentPublisher) {
          publisherHasTakenAction = await hasUserTakenAction(
            currentPublisher.userId,
            pendingRequests.map(req => req.id),
            null // Publisher stage is null
          );
        }
      }

      // Deactivate verifiers not in payload
      const verifiersToDeactivate = currentActiveVerifiers.filter(
        (v) =>
          !verifiers.some((v2) => v2.id === v.userId && v2.stage === v.stage)
      );

      // If publisher has taken action, prevent ALL verifier modifications
      if (publisherHasTakenAction) {
        // Check if there are any changes to verifiers
        const hasVerifierChanges =
          verifiersToDeactivate.length > 0 ||
          verifiers.some(v => !currentActiveVerifiers.find(cv => cv.userId === v.id && cv.stage === v.stage));

        if (hasVerifierChanges) {
          throw new Error(`Cannot modify verifiers because the publisher has already taken action on pending requests. Verifier assignments cannot be changed once the publisher has approved or rejected a request.`);
        }

        // If no changes, skip verifier processing and continue to version assignments
      } else {
        // Publisher has NOT taken action, proceed with normal verifier processing
        for (const verifier of verifiersToDeactivate) {
        if (pendingRequests.length > 0) {
          const hasTakenAction = await hasUserTakenAction(
            verifier.userId,
            pendingRequests.map(req => req.id),
            verifier.stage
          );

          // If the verifier has taken any action (approved or rejected), we can't remove them
          if (hasTakenAction) {
            throw new Error(`Cannot remove verifier at stage ${verifier.stage} because they have already taken action on requests (approved or rejected). Only verifiers who haven't taken any action can be removed.`);
          }

          // Mark all verifier approval logs as inactive
          await prisma.requestApproval.updateMany({
            where: {
              requestId: { in: pendingRequests.map(req => req.id) },
              approverId: verifier.userId,
              stage: verifier.stage,
            },
            data: {
              approverStatus: "INACTIVE"
            }
          });
        }

        // If we get here, it's safe to deactivate the verifier
        await prisma.resourceVerifier.update({
          where: { id: verifier.id },
          data: { status: "INACTIVE" },
        });

        // Check if this was the last pending verifier and update request status if needed
        if (pendingRequests.length > 0) {
          for (const request of pendingRequests) {
            // Get all active approvals for this request
            const activeApprovals = await prisma.requestApproval.findMany({
              where: {
                requestId: request.id,
                approverStatus: "ACTIVE",
                stage: { not: null } // Only verifier approvals (exclude publisher)
              }
            });

            // Check if all remaining active verifier approvals are approved
            const allVerifiersApproved = activeApprovals.length > 0 &&
              activeApprovals.every(approval => approval.status === "APPROVED");

            // If all remaining verifiers have approved, transition to publish pending
            if (allVerifiersApproved) {
              // Update request status to PUBLISH_PENDING
              await prisma.resourceVersioningRequest.update({
                where: { id: request.id },
                data: {
                  status: "PUBLISH_PENDING",
                  type: "PUBLICATION",
                  flowStatus: "PENDING"
                }
              });

              // Update resource version status to PUBLISH_PENDING
              const requestDetails = await prisma.resourceVersioningRequest.findUnique({
                where: { id: request.id },
                select: { resourceVersionId: true }
              });

              if (requestDetails) {
                await prisma.resourceVersion.update({
                  where: { id: requestDetails.resourceVersionId },
                  data: {
                    versionStatus: "PUBLISH_PENDING"
                  }
                });
              }
            }
          }
        }
      }

      // Get all users being assigned to roles from the payload
      const usersBeingAssignedToRoles = new Set(
        Object.values(roleMap).filter(Boolean)
      );

      // Process each verifier in payload
      for (const {id: userId, stage} of verifiers) {
        // Skip if already active in this stage (idempotent)
        const existingActive = currentActiveVerifiers.find(
          (v) => v.userId === userId && v.stage === stage
        );
        if (existingActive) continue;

        // Modified check: If user is being assigned to BOTH role and verifier in THIS payload, throw an error
        // This prevents users from being assigned to both roles in the same API call
        if (usersBeingAssignedToRoles.has(userId)) {
          throw new Error(
            `User ${userId} cannot be assigned as both role and verifier in the same request`
          );
        }

        // But if the user already has an active role in the resource, we should deactivate it
        // This allows switching a user from a role to a verifier
        const userActiveRoles = currentActiveRoles.filter(
          (r) => r.userId === userId
        );

        // Deactivate any active roles for this user in the resource
        for (const role of userActiveRoles) {
          await prisma.resourceRole.update({
            where: { id: role.id },
            data: { status: "INACTIVE" },
          });

          // If the user was a publisher, mark their approval logs as inactive
          if (role.role === "PUBLISHER") {
            const pendingRequests = await getPendingRequests(resourceId);

            // Mark all publisher approval logs as inactive
            if (pendingRequests.length > 0) {
              await prisma.requestApproval.updateMany({
                where: {
                  requestId: { in: pendingRequests.map(req => req.id) },
                  approverId: userId,
                  stage: null, // Publisher approvals have null stage
                },
                data: {
                  approverStatus: "INACTIVE"
                }
              });
            }
          }
        }

        // Deactivate ANY existing assignment to this stage (Single Active User Per Verifier Stage)
        // This needs to happen BEFORE attempting to reactivate or create a new one
        const existingStageAssignments = currentResource.verifiers.filter(
          (v) => v.stage === stage && v.status === "ACTIVE"
        );

        // Check if any of the existing verifiers have approved any requests
        // If they have, we can't reassign them
        for (const assignment of existingStageAssignments) {
          const pendingRequests = await getPendingRequests(resourceId);

          if (pendingRequests.length > 0) {
            const hasTakenAction = await hasUserTakenAction(
              assignment.userId,
              pendingRequests.map(req => req.id),
              assignment.stage
            );

            // If the verifier has taken any action (approved or rejected), we can't reassign them
            if (hasTakenAction) {
              throw new Error(`Cannot reassign verifier at stage ${stage} because they have already taken action on requests (approved or rejected). Only verifiers who haven't taken any action can be reassigned.`);
            }
          }

          // If we get here, it's safe to deactivate the verifier
          await prisma.resourceVerifier.update({
            where: {id: assignment.id},
            data: {status: "INACTIVE"},
          });

          // Check if this was the last pending verifier and update request status if needed
          const pendingRequestsForReassignment = await getPendingRequests(resourceId);
          if (pendingRequestsForReassignment.length > 0) {
            for (const request of pendingRequestsForReassignment) {
              // Get all active approvals for this request
              const activeApprovals = await prisma.requestApproval.findMany({
                where: {
                  requestId: request.id,
                  approverStatus: "ACTIVE",
                  stage: { not: null } // Only verifier approvals (exclude publisher)
                }
              });

              // Check if all remaining active verifier approvals are approved
              const allVerifiersApproved = activeApprovals.length > 0 &&
                activeApprovals.every(approval => approval.status === "APPROVED");

              // If all remaining verifiers have approved, transition to publish pending
              if (allVerifiersApproved) {
                // Update request status to PUBLISH_PENDING
                await prisma.resourceVersioningRequest.update({
                  where: { id: request.id },
                  data: {
                    status: "PUBLISH_PENDING",
                    type: "PUBLICATION",
                    flowStatus: "PENDING"
                  }
                });

                // Update resource version status to PUBLISH_PENDING
                const requestDetails = await prisma.resourceVersioningRequest.findUnique({
                  where: { id: request.id },
                  select: { resourceVersionId: true }
                });

                if (requestDetails) {
                  await prisma.resourceVersion.update({
                    where: { id: requestDetails.resourceVersionId },
                    data: {
                      versionStatus: "PUBLISH_PENDING"
                    }
                  });
                }
              }
            }
          }
        }

        // Deactivate any other active verifier assignments for this user (Single Active Verifier Stage Per User)
        const userOtherActiveVerifiers = currentActiveVerifiers.filter(
          (v) => v.userId === userId && v.stage !== stage
        );
        for (const verifier of userOtherActiveVerifiers) {
          await prisma.resourceVerifier.update({
            where: {id: verifier.id},
            data: {status: "INACTIVE"},
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

          // Find all pending requests for this resource
          const pendingRequests = await prisma.resourceVersioningRequest.findMany({
            where: {
              resourceVersion: {
                resourceId: resourceId
              },
              OR: [
                { status: "VERIFICATION_PENDING" },
                { status: "PUBLISH_PENDING" }
              ]
            },
            include: {
              resourceVersion: {
                select: {
                  id: true,
                  versionStatus: true
                }
              },
              approvals: {
                where: {
                  approverStatus: "ACTIVE"
                },
                select: {
                  id: true,
                  stage: true,
                  status: true
                }
              }
            }
          });

          if (pendingRequests.length > 0) {
            // Check for existing inactive approval logs for this user as verifier
            const inactiveApprovals = await prisma.requestApproval.findMany({
              where: {
                requestId: { in: pendingRequests.map(req => req.id) },
                approverId: userId,
                stage: stage,
                approverStatus: "INACTIVE"
              }
            });

            // Process each request
            for (const request of pendingRequests) {
              // Check if this is a PUBLISH_PENDING request (all verifiers have approved)
              const isPublishPending = request.status === "PUBLISH_PENDING";

              // If we're reactivating existing approvals
              if (inactiveApprovals.length > 0) {
                // Find the inactive approval for this specific request
                const inactiveApproval = inactiveApprovals.find(
                  approval => approval.requestId === request.id
                );

                if (inactiveApproval) {
                  // Reactivate the existing approval
                  await prisma.requestApproval.update({
                    where: { id: inactiveApproval.id },
                    data: {
                      approverStatus: "ACTIVE",
                      status: "PENDING" // Reset to pending status
                    }
                  });

                  // If the request was in PUBLISH_PENDING status, change it back to VERIFICATION_PENDING
                  if (isPublishPending) {
                    // Update the request status
                    await prisma.resourceVersioningRequest.update({
                      where: { id: request.id },
                      data: {
                        status: "VERIFICATION_PENDING", // Change back to verification pending
                        type: "VERIFICATION", // Change type back to verification
                        flowStatus: "PENDING" // Reset flow status
                      }
                    });

                    // Update the resource version status
                    await prisma.resourceVersion.update({
                      where: { id: request.resourceVersion.id },
                      data: {
                        versionStatus: "VERIFICATION_PENDING" // Change version status back to verification pending
                      }
                    });
                  }
                }
              } else {
                // Check if there's already an active approval for this request and stage
                const existingApproval = await prisma.requestApproval.findFirst({
                  where: {
                    requestId: request.id,
                    stage: stage,
                    approverStatus: "ACTIVE"
                  }
                });

                // Only create if no active approval exists
                if (!existingApproval) {
                  // Create a new approval
                  await prisma.requestApproval.create({
                    data: {
                      stage: stage,
                      comments: null,
                      requestId: request.id,
                      approverId: userId,
                      status: "PENDING"
                    }
                  });

                  // If the request was in PUBLISH_PENDING status, change it back to VERIFICATION_PENDING
                  if (isPublishPending) {
                    // Update the request status
                    await prisma.resourceVersioningRequest.update({
                      where: { id: request.id },
                      data: {
                        status: "VERIFICATION_PENDING", // Change back to verification pending
                        type: "VERIFICATION", // Change type back to verification
                        flowStatus: "PENDING" // Reset flow status
                      }
                    });

                    // Update the resource version status
                    await prisma.resourceVersion.update({
                      where: { id: request.resourceVersion.id },
                      data: {
                        versionStatus: "VERIFICATION_PENDING" // Change version status back to verification pending
                      }
                    });
                  }
                }
              }
            }
          }
        } else {
          await prisma.resourceVerifier.create({
            data: {
              resourceId,
              userId,
              stage,
              status: "ACTIVE",
            },
          });

          // Find all pending requests for this resource
          const pendingRequests = await prisma.resourceVersioningRequest.findMany({
            where: {
              resourceVersion: {
                resourceId: resourceId
              },
              OR: [
                { status: "VERIFICATION_PENDING" },
                { status: "PUBLISH_PENDING" }
              ]
            },
            include: {
              resourceVersion: {
                select: {
                  id: true,
                  versionStatus: true
                }
              },
              approvals: {
                where: {
                  approverStatus: "ACTIVE"
                },
                select: {
                  id: true,
                  stage: true,
                  status: true
                }
              }
            }
          });

          // Process each pending request
          for (const request of pendingRequests) {
            // Check if this is a PUBLISH_PENDING request (all verifiers have approved)
            const isPublishPending = request.status === "PUBLISH_PENDING";

            // Check if there's already an active approval for this request and stage
            const existingApproval = await prisma.requestApproval.findFirst({
              where: {
                requestId: request.id,
                stage: stage,
                approverStatus: "ACTIVE"
              }
            });

            // Only create if no active approval exists
            if (!existingApproval) {
              // Create a new approval for this verifier
              await prisma.requestApproval.create({
                data: {
                  stage: stage,
                  comments: null,
                  requestId: request.id,
                  approverId: userId,
                  status: "PENDING"
                }
              });

              // If the request was in PUBLISH_PENDING status, change it back to VERIFICATION_PENDING
              if (isPublishPending) {
                // Update the request status
                await prisma.resourceVersioningRequest.update({
                  where: { id: request.id },
                  data: {
                    status: "VERIFICATION_PENDING", // Change back to verification pending
                    type: "VERIFICATION", // Change type back to verification
                    flowStatus: "PENDING" // Reset flow status
                  }
                });

                // Update the resource version status
                await prisma.resourceVersion.update({
                  where: { id: request.resourceVersion.id },
                  data: {
                    versionStatus: "VERIFICATION_PENDING" // Change version status back to verification pending
                  }
                });
              }
            }
          }
        }
      }
      } // End of else block for publisher has NOT taken action
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

      // Check if version publisher is being removed (was active but not in payload)
      const activeVersionPublisher = activeVersionRoles.find(
        (r) => r.role === "PUBLISHER"
      );

      if (activeVersionPublisher && !publisher) {
        const pendingRequests = await getPendingRequests(null, versionId);

        if (pendingRequests.length > 0) {
          const hasTakenAction = await hasUserTakenAction(
            activeVersionPublisher.userId,
            pendingRequests.map(req => req.id),
            null
          );

          // If the publisher has taken any action (approved or rejected), we can't remove them
          if (hasTakenAction) {
            throw new Error(`Cannot remove publisher for version because they have already taken action on requests (approved or rejected). Only publishers who haven't taken any action can be removed.`);
          }
        }
      }

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
            where: {id: activeVerifierAssignment.id},
            data: {status: "INACTIVE"},
          });
        }

        // Case 3: User active in different role - deactivate first (Single Active Role Per User Rule)
        const activeInOtherRole = activeVersionRoles.find(
          (r) => r.userId === userId && r.role !== role
        );
        if (activeInOtherRole) {
          await prisma.resourceVersionRole.update({
            where: {id: activeInOtherRole.id},
            data: {status: "INACTIVE"},
          });
        }

        // Case 4: Another user active in this role - deactivate them (Single Active User Per Role Rule)
        const otherUserActive = activeVersionRoles.find(
          (r) => r.role === role && r.userId !== userId
        );
        if (otherUserActive) {
          // If this is a publisher role, check if they've approved any requests
          if (role === "PUBLISHER") {
            const pendingRequests = await getPendingRequests(null, versionId);

            if (pendingRequests.length > 0) {
              const hasTakenAction = await hasUserTakenAction(
                otherUserActive.userId,
                pendingRequests.map(req => req.id),
                null
              );

              // If the publisher has taken any action (approved or rejected), we can't reassign them
              if (hasTakenAction) {
                throw new Error(`Cannot reassign publisher for version because they have already taken action on requests (approved or rejected). Only publishers who haven't taken any action can be reassigned.`);
              }
            }
          }

          await prisma.resourceVersionRole.update({
            where: {id: otherUserActive.id},
            data: {status: "INACTIVE"},
          });
        }

        // Case 5: Existing inactive assignment - reactivate (Inactive Reactivation Rule)
        const existingInactive = currentVersionRoles.find(
          (r) => r.role === role && r.userId === userId && r.status !== "ACTIVE"
        );
        if (existingInactive) {
          await prisma.resourceVersionRole.update({
            where: {id: existingInactive.id},
            data: {status: "ACTIVE"},
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
        // Check if version publisher has taken action on any pending requests
        const pendingVersionRequests = await getPendingRequests(null, versionId);
        let versionPublisherHasTakenAction = false;

        if (pendingVersionRequests.length > 0) {
          // Find current active version publisher
          const currentVersionPublisher = activeVersionRoles.find(
            (r) => r.role === "PUBLISHER"
          );

          if (currentVersionPublisher) {
            versionPublisherHasTakenAction = await hasUserTakenAction(
              currentVersionPublisher.userId,
              pendingVersionRequests.map(req => req.id),
              null // Publisher stage is null
            );
          }
        }

        // Deactivate verifiers not in payload
        const verifiersToDeactivate = activeVersionVerifiers.filter(
          (v) =>
            !verifiers.some((v2) => v2.id === v.userId && v2.stage === v.stage)
        );

        // If version publisher has taken action, prevent ALL verifier modifications
        if (versionPublisherHasTakenAction) {
          // Check if there are any changes to verifiers
          const hasVersionVerifierChanges =
            verifiersToDeactivate.length > 0 ||
            verifiers.some(v => !activeVersionVerifiers.find(cv => cv.userId === v.id && cv.stage === v.stage));

          if (hasVersionVerifierChanges) {
            throw new Error(`Cannot modify version verifiers because the publisher has already taken action on pending requests. Version verifier assignments cannot be changed once the publisher has approved or rejected a request.`);
          }

          // If no changes, skip version verifier processing
        } else {
          // Version publisher has NOT taken action, proceed with normal verifier processing
          for (const verifier of verifiersToDeactivate) {
            const pendingRequests = await getPendingRequests(null, versionId);

            if (pendingRequests.length > 0) {
              const hasTakenAction = await hasUserTakenAction(
                verifier.userId,
                pendingRequests.map(req => req.id),
                verifier.stage
              );

              // If the verifier has taken any action (approved or rejected), we can't remove them
              if (hasTakenAction) {
                throw new Error(`Cannot remove verifier at stage ${verifier.stage} for version because they have already taken action on requests (approved or rejected). Only verifiers who haven't taken any action can be removed.`);
              }
            }

            // If we get here, it's safe to deactivate the verifier
            await prisma.resourceVersionVerifier.update({
              where: {id: verifier.id},
              data: {status: "INACTIVE"},
            });

            // Check if this was the last pending verifier and update request status if needed
            if (pendingRequests.length > 0) {
              for (const request of pendingRequests) {
                // Get all active approvals for this request
                const activeApprovals = await prisma.requestApproval.findMany({
                  where: {
                    requestId: request.id,
                    approverStatus: "ACTIVE",
                    stage: { not: null } // Only verifier approvals (exclude publisher)
                  }
                });

                // Check if all remaining active verifier approvals are approved
                const allVerifiersApproved = activeApprovals.length > 0 &&
                  activeApprovals.every(approval => approval.status === "APPROVED");

                // If all remaining verifiers have approved, transition to publish pending
                if (allVerifiersApproved) {
                  // Update request status to PUBLISH_PENDING
                  await prisma.resourceVersioningRequest.update({
                    where: { id: request.id },
                    data: {
                      status: "PUBLISH_PENDING",
                      type: "PUBLICATION",
                      flowStatus: "PENDING"
                    }
                  });

                  // Update resource version status to PUBLISH_PENDING
                  const requestDetails = await prisma.resourceVersioningRequest.findUnique({
                    where: { id: request.id },
                    select: { resourceVersionId: true }
                  });

                  if (requestDetails) {
                    await prisma.resourceVersion.update({
                      where: { id: requestDetails.resourceVersionId },
                      data: {
                        versionStatus: "PUBLISH_PENDING"
                      }
                    });
                  }
                }
              }
            }
          }

        // Process each verifier in payload
        for (const {id: userId, stage} of verifiers) {
          // Skip if already active in this stage (idempotent)
          const existingActive = activeVersionVerifiers.find(
            (v) => v.userId === userId && v.stage === stage
          );
          if (existingActive) continue;

          // Check for active role conflict (No Role-Verifier Conflict Rule)
          // First, deactivate any active roles for this user in the version
          const userActiveRoles = activeVersionRoles.filter(
            (r) => r.userId === userId
          );

          // Deactivate any active roles for this user in the version
          for (const role of userActiveRoles) {
            await prisma.resourceVersionRole.update({
              where: { id: role.id },
              data: { status: "INACTIVE" },
            });
          }

          // Now the user doesn't have any active roles in the version, so we can proceed

          // Deactivate ANY existing assignment to this stage (Single Active User Per Verifier Stage)
          // This needs to happen BEFORE attempting to reactivate or create a new one
          const existingStageAssignments = activeVersionVerifiers.filter(
            (v) => v.stage === stage && v.status === "ACTIVE"
          );

          // Check if any of the existing verifiers have approved any requests
          // If they have, we can't reassign them
          for (const assignment of existingStageAssignments) {
            const pendingRequests = await getPendingRequests(null, versionId);

            if (pendingRequests.length > 0) {
              const hasTakenAction = await hasUserTakenAction(
                assignment.userId,
                pendingRequests.map(req => req.id),
                assignment.stage
              );

              // If the verifier has taken any action (approved or rejected), we can't reassign them
              if (hasTakenAction) {
                throw new Error(`Cannot reassign verifier at stage ${stage} for version because they have already taken action on requests (approved or rejected). Only verifiers who haven't taken any action can be reassigned.`);
              }
            }

            // If we get here, it's safe to deactivate the verifier
            await prisma.resourceVersionVerifier.update({
              where: {id: assignment.id},
              data: {status: "INACTIVE"},
            });

            // Check if this was the last pending verifier and update request status if needed
            const pendingVersionRequestsForReassignment = await getPendingRequests(null, versionId);
            if (pendingVersionRequestsForReassignment.length > 0) {
              for (const request of pendingVersionRequestsForReassignment) {
                // Get all active approvals for this request
                const activeApprovals = await prisma.requestApproval.findMany({
                  where: {
                    requestId: request.id,
                    approverStatus: "ACTIVE",
                    stage: { not: null } // Only verifier approvals (exclude publisher)
                  }
                });

                // Check if all remaining active verifier approvals are approved
                const allVerifiersApproved = activeApprovals.length > 0 &&
                  activeApprovals.every(approval => approval.status === "APPROVED");

                // If all remaining verifiers have approved, transition to publish pending
                if (allVerifiersApproved) {
                  // Update request status to PUBLISH_PENDING
                  await prisma.resourceVersioningRequest.update({
                    where: { id: request.id },
                    data: {
                      status: "PUBLISH_PENDING",
                      type: "PUBLICATION",
                      flowStatus: "PENDING"
                    }
                  });

                  // Update resource version status to PUBLISH_PENDING
                  const requestDetails = await prisma.resourceVersioningRequest.findUnique({
                    where: { id: request.id },
                    select: { resourceVersionId: true }
                  });

                  if (requestDetails) {
                    await prisma.resourceVersion.update({
                      where: { id: requestDetails.resourceVersionId },
                      data: {
                        versionStatus: "PUBLISH_PENDING"
                      }
                    });
                  }
                }
              }
            }
          }

          // Deactivate any other active verifier assignments for this user (Single Active Verifier Stage Per User)
          const userOtherActiveVerifiers = activeVersionVerifiers.filter(
            (v) => v.userId === userId && v.stage !== stage
          );
          for (const verifier of userOtherActiveVerifiers) {
            await prisma.resourceVersionVerifier.update({
              where: {id: verifier.id},
              data: {status: "INACTIVE"},
            });
          }

          // Reactivate existing inactive or create new
          const existingInactive = currentVersionVerifiers.find(
            (v) =>
              v.userId === userId && v.stage === stage && v.status !== "ACTIVE"
          );
          if (existingInactive) {
            await prisma.resourceVersionVerifier.update({
              where: {id: existingInactive.id},
              data: {status: "ACTIVE"},
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
        } // End of else block for version publisher has NOT taken action
      }
    }

    // 6. Return updated resource with active assignments
    return prisma.resource.update({
      where: {id: resourceId},
      data: {isAssigned: true},
      include: {
        roles: {
          where: {status: "ACTIVE"},
          include: {user: true},
        },
        verifiers: {
          where: {status: "ACTIVE"},
          include: {user: true},
        },
        newVersionEditMode: {
          include: {
            roles: {
              where: {status: "ACTIVE"},
              include: {user: true},
            },
            verifiers: {
              where: {status: "ACTIVE"},
              include: {user: true},
            },
          },
        },
      },
    });
  });
};


export const markAllAssignedUserInactive = async (resourceId) => {
  return await prismaClient.$transaction(async (prisma) => {
    // First, check if there are any versions in edit mode or with requests
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: {
        newVersionEditModeId: true,
        versions: {
          where: {
            versionStatus: {
              not: "PUBLISHED"
            }
          },
          select: {
            id: true,
            versionStatus: true,
            requests: {
              select: {
                id: true
              }
            }
          }
        }
      }
    });

    // Check if there's a version in edit mode
    if (resource.newVersionEditModeId) {
      throw new Error("Cannot mark all users as inactive because there is a version in edit mode. All versions must be published before reassigning all users.");
    }

    // Check if there are any versions with requests (in any state)
    const versionsWithRequests = resource.versions.filter(version =>
      version.requests && version.requests.length > 0
    );

    if (versionsWithRequests.length > 0) {
      throw new Error("Cannot mark all users as inactive because there are versions with requests. All requests must be completed and published before reassigning all users.");
    }

    // Get all active roles and verifiers before marking them inactive
    const activeRoles = await prisma.resourceRole.findMany({
      where: {
        resourceId,
        status: "ACTIVE",
      },
      select: {
        userId: true,
        role: true
      }
    });

    const activeVerifiers = await prisma.resourceVerifier.findMany({
      where: {
        resourceId,
        status: "ACTIVE",
      },
      select: {
        userId: true,
        stage: true
      }
    });

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

    // 3. Find all pending requests for this resource
    const pendingRequests = await prisma.resourceVersioningRequest.findMany({
      where: {
        resourceVersion: {
          resourceId: resourceId
        },
        OR: [
          { status: "VERIFICATION_PENDING" },
          { status: "PUBLISH_PENDING" }
        ]
      },
      select: {
        id: true
      }
    });

    if (pendingRequests.length > 0) {
      const requestIds = pendingRequests.map(req => req.id);

      // 4. Mark all publisher approval logs as inactive
      const publisherUserIds = activeRoles
        .filter(role => role.role === "PUBLISHER")
        .map(role => role.userId);

      if (publisherUserIds.length > 0) {
        await prisma.requestApproval.updateMany({
          where: {
            requestId: { in: requestIds },
            approverId: { in: publisherUserIds },
            stage: null, // Publisher approvals have null stage
          },
          data: {
            approverStatus: "INACTIVE"
          }
        });
      }

      // 5. Mark all verifier approval logs as inactive
      for (const verifier of activeVerifiers) {
        await prisma.requestApproval.updateMany({
          where: {
            requestId: { in: requestIds },
            approverId: verifier.userId,
            stage: verifier.stage,
          },
          data: {
            approverStatus: "INACTIVE"
          }
        });
      }
    }

    // 3. If there's a version, mark those assignments as inactive too
    const resourceWithVersion = await prisma.resource.findUnique({
      where: {id: resourceId},
      select: {newVersionEditModeId: true},
    });

    if (resourceWithVersion?.newVersionEditModeId) {
      // Get all active version roles and verifiers before marking them inactive
      const activeVersionRoles = await prisma.resourceVersionRole.findMany({
        where: {
          resourceVersionId: resourceWithVersion.newVersionEditModeId,
          status: "ACTIVE",
        },
        select: {
          userId: true,
          role: true
        }
      });

      const activeVersionVerifiers = await prisma.resourceVersionVerifier.findMany({
        where: {
          resourceVersionId: resourceWithVersion.newVersionEditModeId,
          status: "ACTIVE",
        },
        select: {
          userId: true,
          stage: true
        }
      });

      // Mark all active version roles as inactive
      await prisma.resourceVersionRole.updateMany({
        where: {
          resourceVersionId: resourceWithVersion.newVersionEditModeId,
          status: "ACTIVE",
        },
        data: {
          status: "INACTIVE",
        },
      });

      // Mark all active version verifiers as inactive
      await prisma.resourceVersionVerifier.updateMany({
        where: {
          resourceVersionId: resourceWithVersion.newVersionEditModeId,
          status: "ACTIVE",
        },
        data: {
          status: "INACTIVE",
        },
      });

      // If there are pending requests, mark approval logs for version roles and verifiers as inactive
      if (pendingRequests.length > 0) {
        const requestIds = pendingRequests.map(req => req.id);

        // Mark all publisher approval logs as inactive for version roles
        const versionPublisherUserIds = activeVersionRoles
          .filter(role => role.role === "PUBLISHER")
          .map(role => role.userId);

        if (versionPublisherUserIds.length > 0) {
          await prisma.requestApproval.updateMany({
            where: {
              requestId: { in: requestIds },
              approverId: { in: versionPublisherUserIds },
              stage: null, // Publisher approvals have null stage
            },
            data: {
              approverStatus: "INACTIVE"
            }
          });
        }

        // Mark all verifier approval logs as inactive for version verifiers
        for (const verifier of activeVersionVerifiers) {
          await prisma.requestApproval.updateMany({
            where: {
              requestId: { in: requestIds },
              approverId: verifier.userId,
              stage: verifier.stage,
            },
            data: {
              approverStatus: "INACTIVE"
            }
          });
        }
      }
    }

    // 4. Update the resource's isAssigned flag if needed
    await prisma.resource.update({
      where: {id: resourceId},
      data: {isAssigned: false},
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

  // Check if the resource is editable
  let isEditable = true;

  if (isItemFullContent) {
    // Find all requests for this resource
    const requests = await prismaClient.resourceVersioningRequest.findMany({
      where: {
        resourceVersion: {
          resourceId: resourceId
        }
      },
      include: {
        approvals: {
          select: {
            status: true
          }
        },
        resourceVersion: {
          select: {
            versionStatus: true
          }
        }
      }
    });

    // Check if there's any active request in verification process with pending approvals
    const hasActiveVerificationRequest = requests.some(request =>
      // Check if the request is in verification process
      (request.status === "VERIFICATION_PENDING" || request.status === "PUBLISH_PENDING") &&
      // And has no rejections
      !request.approvals.some(approval => approval.status === "REJECTED") &&
      // And the version is not published or scheduled
      request.resourceVersion.versionStatus !== "PUBLISHED" &&
      request.resourceVersion.versionStatus !== "SCHEDULED"
    );

    // Resource is NOT editable if there's an active verification request with no rejections
    isEditable = !hasActiveVerificationRequest;
  }

  // Process both live version and edit version
  const result = {
    id: resource.id,
    titleEn: resource.titleEn,
    titleAr: resource.titleAr,
    slug: resource.slug,
    isEditable: isEditable,
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
        sections: [], // Initialize sections array
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
              (resourceSlug === "home" &&
                sectionOrderMap[sectionVersion.id] === 7) ||
              (resourceSlug === "market" &&
                sectionOrderMap[sectionVersion.id] === 4) // to ge the full body of testimonials
            ) {
              returningBody = itemContent;
            }

            if (
              resourceSlug === "service" &&
              sectionOrderMap[sectionVersion.id] === 2
            ) {
              returningBody.description =
                itemContent.liveModeVersionData.sections[0].content.description; // including description in the item for services items
            }

            if (
              resourceSlug === "market" &&
              sectionOrderMap[sectionVersion.id] === 3
            ) {
              returningBody.description =
                itemContent.liveModeVersionData.sections[0].content.description; // including description in the item for market items
            }

            return {...returningBody, order: item.order};
          })
        );
      }

      // Add child sections if they exist
      if (sectionVersion.children && sectionVersion.children.length > 0) {
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

                  if (
                    resourceSlug === "project" &&
                    sectionOrderMap[sectionVersion.id] === 2
                  ) {
                    returningBody.location =
                      itemContent.liveModeVersionData.sections[1].content[0].value; // including description in the item for market items
                  }
                  return {...returningBody, order: item.order};
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
  console.log(contentData, "version+++++");

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

  const {newVersionEditMode} = contentData;

  console.log(resource.newVersionEditMode, "version+++++");

  if (resource && resource.newVersionEditMode) {
    // Check if there are any active requests for this resource version
    const activeRequests = await prismaClient.resourceVersioningRequest.findMany({
      where: {
        resourceVersionId: resource.newVersionEditModeId,
        OR: [
          { status: "VERIFICATION_PENDING" },
          { status: "PUBLISH_PENDING" }
        ]
      },
      include: {
        approvals: {
          select: {
            status: true
          }
        }
      }
    });

    // Check if there's any active request in verification process with no rejections
    const hasActiveVerificationRequest = activeRequests.some(request =>
      !request.approvals.some(approval => approval.status === "REJECTED")
    );

    // If there's an active verification request with no rejections, don't allow editing
    if (hasActiveVerificationRequest && resource.newVersionEditMode.versionStatus !== "DRAFT") {
      throw new Error("Cannot edit content that is under verification process. Wait for the verification to complete or for the request to be rejected.");
    }
  }

  // Extract the content from the request
  const saveAs = newVersionEditMode?.versionStatus || "DRAFT";

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
        where: {id: resource.id},
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
        where: {id: resource.newVersionEditModeId},
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
        where: {id: resource.id},
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
  {sectionData, resource, resourceVersion, parentVersionId = null, order = 1}
) {
  const sectionId = sectionData.sectionId;

  console.log("sectionId======================", sectionId);

  const section = await tx.section.findUnique({
    where: {id: sectionId},
    include: {
      _count: {
        select: {versions: true},
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
      where: {id: sectionVersion.id},
      data: {
        ...(sectionData.content !== undefined
          ? {content: sectionData.content}
          : {}),
      },
    });
  }

  // Delete existing items
  await tx.sectionVersionItem.deleteMany({
    where: {sectionVersionId: sectionVersion.id},
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

  const {newVersionEditMode = {}} = contentData;
  const {
    comments = "",
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
      where: {id: resource.id},
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
  const {newVersionEditMode} = contentData;
  const saveAs = "VERIFICATION_PENDING";

  const {
    comments = "",
    referenceDoc = null,
    content = {},
    icon = null,
    image = null,
    sections = [],
  } = newVersionEditMode;

  // Check if there are any active requests for this resource
  const existingRequests = await prismaClient.resourceVersioningRequest.findMany({
    where: {
      resourceVersion: {
        resourceId: contentData.resourceId
      },
      OR: [
        { status: "VERIFICATION_PENDING" },
        { status: "PUBLISH_PENDING" }
      ]
    },
    include: {
      approvals: {
        select: {
          id: true,
          status: true,
          stage: true,
          approverId: true,
          approverStatus: true
        }
      },
      resourceVersion: {
        select: {
          id: true,
          versionStatus: true
        }
      }
    }
  });

  // Check if there's any active request in verification process with no rejections
  const hasActiveVerificationRequest = existingRequests.some(request =>
    !request.approvals.some(approval => approval.status === "REJECTED") &&
    request.resourceVersion.versionStatus !== "PUBLISHED" &&
    request.resourceVersion.versionStatus !== "SCHEDULED"
  );

  // If there's an active verification request with no rejections, don't allow editing
  if (hasActiveVerificationRequest && resource.newVersionEditMode &&
      resource.newVersionEditMode.versionStatus !== "DRAFT") {
    throw new Error("Cannot submit content that is under verification process. Wait for the verification to complete or for the request to be rejected.");
  }

  // Start a transaction to ensure all operations succeed or fail together
  const result = await prismaClient.$transaction(async (tx) => {
    let resourceVersion;
    let updatedResource;
    let existingRequest = null;
    let hasRejectedApprovals = false;

    // Check if there's an existing request for the current edit version
    if (resource.newVersionEditModeId) {
      existingRequest = existingRequests.find(req =>
        req.resourceVersion.id === resource.newVersionEditModeId
      );

      // Check if this request has any rejected approvals
      if (existingRequest) {
        hasRejectedApprovals = existingRequest.approvals.some(
          approval => approval.status === "REJECTED" && approval.approverStatus === "ACTIVE"
        );
      }
    }

    // Find rejected stages from previous requests to reset them to PENDING
    const rejectedStages = [];
    const rejectedPublisher = [];

    if (existingRequest) {
      existingRequest.approvals.forEach(approval => {
        if (approval.status === "REJECTED" && approval.approverStatus === "ACTIVE") {
          if (approval.stage === null) {
            // Publisher rejection
            rejectedPublisher.push(approval.approverId);
          } else {
            // Verifier rejection
            rejectedStages.push({
              stage: approval.stage,
              approverId: approval.approverId
            });
          }
        }
      });
    } else {
      existingRequests.forEach(request => {
        request.approvals.forEach(approval => {
          if (approval.status === "REJECTED" && approval.approverStatus === "ACTIVE") {
            if (approval.stage === null) {
              // Publisher rejection
              rejectedPublisher.push(approval.approverId);
            } else {
              // Verifier rejection
              rejectedStages.push({
                stage: approval.stage,
                approverId: approval.approverId
              });
            }
          }
        });
      });
    }

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
        where: {id: resource.id},
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
        where: {id: resource.newVersionEditModeId},
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
        where: {id: resource.id},
        data: {
          titleEn: contentData.titleEn,
          titleAr: contentData.titleAr,
          slug: contentData.slug,
        },
      });
    }

    let generatedRequest;
    let generateRequestApprovalsForPublisher;
    let verifierApprovals;

    // If there's an existing request with rejected approvals, update those approvals instead of creating a new request
    if (existingRequest && hasRejectedApprovals) {
      // Update the existing request
      generatedRequest = await tx.resourceVersioningRequest.update({
        where: { id: existingRequest.id },
        data: {
          flowStatus: "PENDING", // Reset flow status to PENDING
          editorComments: comments,
        },
      });

      // Update all rejected approval logs to PENDING
      for (const approval of existingRequest.approvals) {
        if (approval.status === "REJECTED" && approval.approverStatus === "ACTIVE") {
          await tx.requestApproval.update({
            where: { id: approval.id },
            data: {
              status: "PENDING",
              // comments: null, // Clear previous rejection comments
            },
          });
        }
      }

      // Get updated approvals
      verifierApprovals = await tx.requestApproval.findMany({
        where: {
          requestId: generatedRequest.id,
          stage: { not: null }, // Only get verifier approvals
          approverStatus: "ACTIVE",
        },
      });

      generateRequestApprovalsForPublisher = await tx.requestApproval.findFirst({
        where: {
          requestId: generatedRequest.id,
          stage: null, // Publisher approval has null stage
          approverStatus: "ACTIVE",
        },
      });
    } else {
      // GENERATE A NEW REQ AND APPROVAL LOGS
      generatedRequest = await tx.resourceVersioningRequest.create({
        data: {
          type: "VERIFICATION",
          status: "VERIFICATION_PENDING", // Explicitly set the status
          flowStatus: "PENDING", // Set the initial flow status to PENDING
          editorComments: comments,
          resourceVersionId: resourceVersion.id,
          senderId: resource.roles.find((r) => r.role === "EDITOR").userId,
        },
      });

      // Get the publisher
      const publisher = resource.roles.find((r) => r.role === "PUBLISHER");

      // Check if the publisher was previously rejected
      const wasPublisherRejected = rejectedPublisher.includes(publisher.userId);

      // Create publisher approval with appropriate status
      generateRequestApprovalsForPublisher = await tx.requestApproval.create({
        data: {
          stage: null,
          comments: null,
          requestId: generatedRequest.id,
          approverId: publisher.userId,
          // If publisher previously rejected, set status to PENDING
          // This allows them to re-verify the request
          status: wasPublisherRejected ? "PENDING" : "PENDING"
        },
      });

      // Create verifier approvals with appropriate status
      await Promise.all(resource.verifiers.map(async (verifier) => {
        // Check if this verifier previously rejected at this stage
        const wasRejected = rejectedStages.some(
          rejected => rejected.stage === verifier.stage && rejected.approverId === verifier.userId
        );

        // Create approval with appropriate status
        return await tx.requestApproval.create({
          data: {
            stage: verifier.stage,
            comments: null,
            requestId: generatedRequest.id,
            approverId: verifier.userId,
            // If verifier previously rejected, set status to PENDING
            // This allows them to re-verify the request
            status: wasRejected ? "PENDING" : "PENDING"
          },
        });
      }));

      verifierApprovals = await tx.requestApproval.findMany({
        where: {
          requestId: generatedRequest.id,
          stage: { not: null }, // Only get verifier approvals (they have stage values)
        },
      });
    }

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
    message: existingRequests.some(req =>
      req.resourceVersion.id === resource.newVersionEditModeId &&
      req.approvals.some(approval => approval.status === "REJECTED" && approval.approverStatus === "ACTIVE")
    )
      ? "Existing request updated successfully"
      : "Update request generated successfully",
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
  limitNum = 10,
  resourceId = null // New parameter to filter by resource ID
) => {
  const skip = (pageNum - 1) * limitNum;

  // First, fetch the user's roles and permissions
  const user = await prismaClient.user.findUnique({
    where: {id: userId},
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
  let isUserActive = true;


  // Base where clause
  const where = {
    status: status || undefined, // Filter by status if provided
    // We can also filter by flowStatus if needed in the future
  };

  // Initialize resourceVersion filter if it doesn't exist
  if (!where.resourceVersion) {
    where.resourceVersion = {};
  }

  // Filter by resource ID if provided
  if (resourceId) {
    where.resourceVersion = {
      ...where.resourceVersion,
      resourceId: resourceId
    };
  }

  // Handle search term
  if (search) {
    where.resourceVersion = {
      ...where.resourceVersion,
      resource: {
        ...(where.resourceVersion.resource || {}),
        OR: [
          {titleEn: {contains: search, mode: "insensitive"}},
          {titleAr: {contains: search, mode: "insensitive"}},
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

        for (const [perm, {types, tags}] of Object.entries(
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
              resourceType: {in: types},
            });
          }
        }

        // Create conditions for each tag
        if (tagPermissions.size > 0) {
          const tags = Array.from(tagPermissions.keys());
          if (tags.length > 0) {
            orConditions.push({
              resourceTag: {in: tags},
            });
          }
        }
      }

      // If user has SINGLE_RESOURCE_MANAGEMENT and has assigned resources, add them to OR conditions
      if (hasSingleResourceManagement && assignedResourceIds.length > 0) {
        orConditions.push({
          id: {in: assignedResourceIds},
        });
      }

      // If we have any conditions to filter by
      if (orConditions.length > 0) {
        // If resourceId is provided, we need to add it to the filter
        if (resourceId) {
          // Add resource ID filter to each OR condition
          orConditions = orConditions.map(condition => ({
            ...condition,
            id: resourceId // This ensures each OR condition also checks for the specific resource ID
          }));
        }

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
        // But only if they are the sender OR they are CURRENTLY an ACTIVE editor
        // This ensures inactive editors don't see requests

        // First, get all resources where the user is currently an ACTIVE editor
        const activeEditorResources = await prismaClient.resourceRole.findMany({
          where: {
            userId,
            role: "EDITOR",
            status: "ACTIVE",
          },
          select: {
            resourceId: true,
          },
        });

        if(activeEditorResources.length <= 0){
            isUserActive = false;
            return;
        }
        const activeEditorResourceIds = activeEditorResources.map(r => r.resourceId);
        // Now build the OR conditions
        where.OR = [
          // Requests where user is the sender
          {
            senderId: userId,
            // If resourceId is provided, add it to the filter
            ...(resourceId ? {
              resourceVersion: {
                resourceId: resourceId
              }
            } : {})
          },
          // Requests for resources where user is CURRENTLY assigned as EDITOR with ACTIVE status
          {
            resourceVersion: {
              ...where.resourceVersion?.resourceVersion,
              ...(resourceId ? { resourceId: resourceId } : {}), // Add resourceId filter if provided
              resource: {
                ...where.resourceVersion?.resource,
                id: { in: activeEditorResourceIds },
                ...(resourceId ? { id: resourceId } : {}) // Add resourceId filter if provided
              },
            },
          },
        ];
      } else if (permission === "VERIFY") {
        // User with VERIFY permission sees requests where they are a VERIFIER
        const activeVerifierResources = await prismaClient.resourceVerifier.findMany({
          where: {
            userId,
            status: "ACTIVE",
          },
          select: {
            resourceId: true,
            stage: true, // Get the user's verification stage
          },
        });

        if(activeVerifierResources.length <= 0){
            isUserActive = false;
            return;
        }

        const activeVerifierResourceIds = activeVerifierResources.map(r => r.resourceId);

        // Get the user's verification stages for each resource
        const userVerificationStages = {};
        activeVerifierResources.forEach(r => {
          userVerificationStages[r.resourceId] = r.stage;
        });

        where.resourceVersion = {
          ...where.resourceVersion,
          ...(resourceId ? { resourceId: resourceId } : {}), // Add resourceId filter if provided
          resource: {
            ...where.resourceVersion?.resource,
            id: {
              in: activeVerifierResourceIds,
              ...(resourceId ? resourceId : undefined) // Add resourceId filter if provided
            },
            verifiers: {
              some: {
                userId,
                status: "ACTIVE",
              },
            },
          },
        };

        // Only include requests where the user has an active approval record
        where.approvals = {
          some: {
            approverId: userId,
            approverStatus: "ACTIVE"
          }
        };

        // We'll filter the requests after fetching them based on the verification stage
        // This will be done in the final findMany call
      } else if (permission === "PUBLISH") {
        // User with PUBLISH permission sees publication requests where they are a PUBLISHER
        const activePublisherResources = await prismaClient.resourceRole.findMany({
          where: {
            userId,
            role: "PUBLISHER",
            status: "ACTIVE",
          },
          select: {
            resourceId: true,
          },
        });

        if(activePublisherResources.length <= 0){
            isUserActive = false;
            return;
        }
        const activePublisherResourceIds = activePublisherResources.map(r => r.resourceId);
        where.type = "PUBLICATION"; // Only show publication requests
        where.resourceVersion = {
          ...where.resourceVersion,
          ...(resourceId ? { resourceId: resourceId } : {}), // Add resourceId filter if provided
          resource: {
            ...where.resourceVersion?.resource,
            id: {
              in: activePublisherResourceIds,
              ...(resourceId ? resourceId : undefined) // Add resourceId filter if provided
            },
            roles: {
              some: {
                userId,
                role: "PUBLISHER",
                status: "ACTIVE",
              },
            },
          },
        };

        // Only include requests where the user has an active approval record
        where.approvals = {
          some: {
            approverId: userId,
            approverStatus: "ACTIVE",
            stage: null // Publisher approvals have null stage
          }
        };

        // We'll filter the requests after fetching them to only show requests where all verifiers have approved
        // This will be done in the final findMany call
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

  if(!isUserActive){
  return {
    data: [],
    pagination: {
      total: 0,
      page: 0,
      limit: limitNum,
      totalPages: Math.ceil(0 / limitNum),
    },
  };
  }

  // Fetch all requests with related data
  const allRequests = await prismaClient.resourceVersioningRequest.findMany({
    where,
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
              relationType: true,
              slug : true,
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
        where: {
          approverStatus: "ACTIVE", // Only consider active approvals
        },
        select: {
          id: true,
          status: true,
          stage: true,
          comments: true,
          approverStatus: true,
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

  // Process requests in a single pass - filter and apply simplified flow status
  const processedRequests = allRequests.map(request => {
    // Determine simplified flow status
    let simplifiedFlowStatus = "PENDING"; // Default status

    // If request is already published or scheduled, use that status
    if (request.status === "PUBLISHED") {
      simplifiedFlowStatus = "PUBLISHED";
    } else if (request.resourceVersion.versionStatus === "SCHEDULED") {
      simplifiedFlowStatus = "SCHEDULED";
    } else {
      // Check if any approval is rejected
      const hasRejection = request.approvals.some(approval =>
        approval.status === "REJECTED" && approval.approverStatus === "ACTIVE"
      );

      if (hasRejection) {
        simplifiedFlowStatus = "REJECTED";
      }
      // Otherwise, it stays as PENDING
    }

    // Add simplified flow status to the request
    return {
      ...request,
      flowStatus: simplifiedFlowStatus, // Override the original flowStatus
      simplifiedFlowStatus, // Also keep the simplified version for backward compatibility
      shouldInclude: true // Default to include all requests
    };
  });

  // Apply role-based filtering
  if (permission === "VERIFY" && !isSuperAdmin) {
    // Get the user's verification stages for each resource
    const activeVerifierResources = await prismaClient.resourceVerifier.findMany({
      where: {
        userId,
        status: "ACTIVE",
      },
      select: {
        resourceId: true,
        stage: true,
      },
    });

    const userVerificationStages = {};
    activeVerifierResources.forEach(r => {
      userVerificationStages[r.resourceId] = r.stage;
    });

    // Filter requests based on verification stage
    processedRequests.forEach(request => {
      const resourceId = request.resourceVersion.resource.id;
      const userStage = userVerificationStages[resourceId];
      const approvals = request.approvals || [];

      // Check if this user has already approved this request
      const userHasApproved = approvals.some(approval =>
        approval.approver.id === userId && approval.status === "APPROVED"
      );

      // If user has already approved, don't show the request anymore
      if (userHasApproved) {
        request.shouldInclude = false;
        return;
      }

      // Find the highest approved stage
      let highestApprovedStage = 0;
      for (const approval of approvals) {
        if (approval.status === "APPROVED" && approval.stage !== null) {
          highestApprovedStage = Math.max(highestApprovedStage, approval.stage);
        }
      }

      // For stage 1 verifiers, they should see new requests that have no approvals yet
      if (userStage === 1) {
        request.shouldInclude = (highestApprovedStage === 0);
      }
      // For other stages, they should only see requests if the previous stage has been approved
      else if (userStage > 1) {
        request.shouldInclude = (highestApprovedStage === userStage - 1);
      } else {
        request.shouldInclude = false;
      }
    });
  } else if (permission === "PUBLISH" && !isSuperAdmin) {
    // Filter requests for publishers - they should only see requests where all verifiers have approved
    processedRequests.forEach(request => {
      const approvals = request.approvals || [];

      // Check if this publisher has already approved this request
      const userHasApproved = approvals.some(approval =>
        approval.approver.id === userId && approval.status === "APPROVED"
      );

      // If publisher has already approved, don't show the request anymore
      if (userHasApproved) {
        request.shouldInclude = false;
        return;
      }

      // Get all verifiers for this resource
      const resourceVerifiers = request.resourceVersion.resource.verifiers || [];

      // If there are no verifiers, publishers can see the request
      if (resourceVerifiers.length === 0) {
        request.shouldInclude = true;
        return;
      }

      // Get all stages that need approval
      const verifierStages = [...new Set(resourceVerifiers.map(v => v.stage))];

      // Check if all stages have been approved
      for (const stage of verifierStages) {
        // Check if this stage has been approved
        const stageApproved = approvals.some(approval =>
          approval.stage === stage && approval.status === "APPROVED"
        );

        // If any stage hasn't been approved, publisher shouldn't see the request
        if (!stageApproved) {
          request.shouldInclude = false;
          return;
        }
      }

      // All stages have been approved, publisher should see the request
      request.shouldInclude = true;
    });
  }

  // Filter out requests that shouldn't be included
  const filteredRequests = processedRequests.filter(request => request.shouldInclude);

  // Apply pagination
  const totalCount = filteredRequests.length;
  const paginatedRequests = filteredRequests.slice(skip, skip + limitNum);

  return {
    data: paginatedRequests,
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
    where: {id: requestId},
    include: {
      resourceVersion: {
        include: {
          // Include roles and verifiers from the resource version
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
          resource: {
            include: {
              // Also include resource roles and verifiers as fallback
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
      approvals: {
        where: {
          approverStatus: "ACTIVE",
        },
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

  // Determine simplified flow status
  let simplifiedFlowStatus = "PENDING"; // Default status

  // If request is already published or scheduled, use that status
  if (request.status === "PUBLISHED") {
    simplifiedFlowStatus = "PUBLISHED";
  } else if (request.resourceVersion.versionStatus === "SCHEDULED") {
    simplifiedFlowStatus = "SCHEDULED";
  } else {
    // Check if any approval is rejected
    const hasRejection = request.approvals.some(approval =>
      approval.status === "REJECTED" && approval.approverStatus === "ACTIVE"
    );

    if (hasRejection) {
      simplifiedFlowStatus = "REJECTED";
    }
    // Otherwise, it stays as PENDING
  }

  // Get roles from resource version first, then fall back to resource roles if needed
  const versionRoles = request.resourceVersion.roles || [];
  const versionVerifiers = request.resourceVersion.verifiers || [];

  // Format the data as per requirements
  const formattedData = {
    details: {
      resource: request.resourceVersion.resource.titleEn,
      resourceType: request.resourceVersion.resource.resourceType,
      resourceTag: request.resourceVersion.resource.resourceTag,
      slug: request.resourceVersion.resource.slug,
      status: request.status,
      flowStatus: simplifiedFlowStatus, // Use simplified flow status instead of original
      simplifiedFlowStatus: simplifiedFlowStatus,
      assignedUsers: {
        manager:
          versionRoles
            .filter((role) => role.role === "MANAGER")
            .map((role) => role.user.name)
            .join(", ") || "Not assigned",
        editor:
          versionRoles
            .filter((role) => role.role === "EDITOR")
            .map((role) => role.user.name)
            .join(", ") || "Not assigned",
        verifiers: versionVerifiers.reduce(
          (acc, verifier) => {
            const level = `level ${verifier.stage}`;
            if (!acc[level]) acc[level] = verifier.user.name;
            return acc;
          },
          {}
        ),
        publisher:
          versionRoles
            .filter((role) => role.role === "PUBLISHER")
            .map((role) => role.user.name)
            .join(", ") || "Not assigned",
      },
      submittedDate: request.createdAt,
      comment: request.editorComments,
      submittedBy: request.sender.name,
      "versionNo.": `V ${request.resourceVersion.versionNumber}`,
      referenceDocument: request.resourceVersion.referenceDoc || "No document",
      requestType: request.type,
      "requestNo.": request.id.slice(0, 4).toUpperCase(),
      approvalStatus: request.approvals
        .sort((a, b) => {
          // Handle null stages by treating them as 0
          const aStage = a.stage || 0;
          const bStage = b.stage || 0;

          // Sort in ascending order except for stage 0 which should be last
          if (aStage === 0) return 1;
          if (bStage === 0) return -1;
          return aStage - bStage;
        })
        .map((approval) => ({
          role: getRoleForApprover(
            approval.approver.id,
            request.resourceVersion
          ),
          approver: approval.approver.name,
          stage: approval.stage,
          status: approval.status,
          comment: approval.comments,
        })),
    },
  };

  return formattedData;
};

// Helper function to determine role for approver
function getRoleForApprover(userId, resourceVersion) {
  // First check roles in the resource version
  const role = resourceVersion.roles.find((r) => r.userId === userId);
  if (role) return role.role;

  // Then check verifiers in the resource version
  const verifier = resourceVersion.verifiers.find((v) => v.userId === userId);
  if (verifier) return `VERIFIER_LEVEL_${verifier.stage}`;

  // If not found in resource version, check the resource as fallback
  if (resourceVersion.resource) {
    const resourceRole = resourceVersion.resource.roles.find((r) => r.userId === userId);
    if (resourceRole) return resourceRole.role;

    const resourceVerifier = resourceVersion.resource.verifiers.find((v) => v.userId === userId);
    if (resourceVerifier) return `VERIFIER_LEVEL_${resourceVerifier.stage}`;
  }

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
        approverStatus: "ACTIVE", // Only active approvers can approve
      },
    });

    if (!approvalLog) {
      throw new Error("Approval log not found or user is not an active approver");
    }

    // Update the approval status
    await tx.requestApproval.update({
      where: {id: approvalLog.id},
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
        approverStatus : "ACTIVE"
      },
    });

    // If no pending approvals remain, update the request status and resource version status
    if (pendingApprovals === 0) {
      // Get the request to find the resourceVersionId
      const request = await tx.resourceVersioningRequest.findUnique({
        where: {id: requestId},
        select: {resourceVersionId: true},
      });

      // Update request status to PUBLISH_PENDING and type to PUBLICATION
      // Also update flowStatus to PENDING for the new publication flow
      await tx.resourceVersioningRequest.update({
        where: {id: requestId},
        data: {
          status: "PUBLISH_PENDING",
          type: "PUBLICATION",
          flowStatus: "PENDING" // Reset flow status for the publication phase
        },
      });

      // Update resource version status to PUBLISH_PENDING
      await tx.resourceVersion.update({
        where: {id: request.resourceVersionId},
        data: {
          versionStatus: "PUBLISH_PENDING",
        },
      });
    } else {
      // If there are still pending approvals, keep the flow status as PENDING
      // We don't want to show APPROVED as a status in the UI
      await tx.resourceVersioningRequest.update({
        where: { id: requestId },
        data: {
          flowStatus: "PENDING" // Keep as PENDING instead of APPROVED
        },
      });
    }

    // Get the updated request to return
    const request = await tx.resourceVersioningRequest.findUnique({
      where: {id: requestId},
      include: {
        approvals: true,
      },
    });

    return request;
  });
};

export const approveRequestInPublication = async (requestId, userId) => {
  return await prismaClient.$transaction(async (tx) => {
    // Find the specific approval log for this user
    const approvalLog = await tx.requestApproval.findFirst({
      where: {
        requestId: requestId,
        approverId: userId,
        status: "PENDING", // Using the correct ApprovalStatus enum value
        stage: null, // Publisher approvals have null stage
        approverStatus: "ACTIVE", // Only active approvers can approve
      },
    });

    if (!approvalLog) {
      throw new Error("Approval log not found or user is not an active approver");
    }

    // Update the approval status
    await tx.requestApproval.update({
      where: { id: approvalLog.id },
      data: {
        status: "APPROVED",
      },
    });

    // Get the request to find the resourceVersionId
    const request = await tx.resourceVersioningRequest.findUnique({
      where: { id: requestId },
      select: {
        resourceVersionId: true,
        type: true,
        resourceVersion: {
          select: {
            resourceId: true
          }
        }
      },
    });

    // Update request status and flow status
    await tx.resourceVersioningRequest.update({
      where: { id: requestId },
      data: {
        status: "PUBLISHED", // Change to PUBLISHED
        flowStatus: "PUBLISHED" // Use PUBLISHED instead of APPROVED for consistency
      },
    });

    // Update resource version status to PUBLISHED
    await tx.resourceVersion.update({
      where: { id: request.resourceVersionId },
      data: {
        versionStatus: "LIVE",
      },
    });

    // If this is a publication request, update the resource's liveVersionId
    if (request.type === "PUBLICATION") {
      await tx.resource.update({
        where: { id: request.resourceVersion.resourceId },
        data: {
          liveVersionId: request.resourceVersionId,
          newVersionEditModeId: null
        },
      });

      // After successful publication, remove all inactive roles from the resource
      await tx.resourceRole.deleteMany({
        where: {
          resourceId: request.resourceVersion.resourceId,
          status: "INACTIVE"
        }
      });

      // Also remove all inactive verifiers from the resource
      await tx.resourceVerifier.deleteMany({
        where: {
          resourceId: request.resourceVersion.resourceId,
          status: "INACTIVE"
        }
      });

      // Note: We don't delete inactive roles/verifiers from the resource version
      // as they serve as a historical record of who worked on that version
    }

    // Get the updated request to return
    const updatedRequest = await tx.resourceVersioningRequest.findUnique({
      where: { id: requestId },
      include: {
        approvals: true,
      },
    });

    return updatedRequest;
  });
};







export const rejectRequestInVerification = async (
  requestId,
  userId,
  rejectReason
) => {
  console.log("rejectRequestInVerification", requestId, userId, rejectReason);
  return await prismaClient.$transaction(async (tx) => {

    // Find the specific approval log for this user first to verify it exists and is active
    const approvalLog = await tx.requestApproval.findFirst({
      where: {
        requestId: requestId,
        approverId: userId,
        status: "PENDING",
        approverStatus: "ACTIVE", // Only active approvers can reject
      },
    });

    if (!approvalLog) {
      throw new Error("Approval log not found or user is not an active approver");
    }

    // Update the specific approval log we found
    await tx.requestApproval.update({
      where: { id: approvalLog.id },
      data: {
        status: "REJECTED",
        comments: rejectReason,
      },
    });

    // Update the request flow status to REJECTED but keep the request status as VERIFICATION_PENDING
    // This allows for resubmission later
    await tx.resourceVersioningRequest.update({
      where: { id: requestId },
      data: {
        flowStatus: "REJECTED", // Only update flow status, not request status
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

export const rejectRequestInPublication = async (
  requestId,
  userId,
  rejectReason
) => {
  return await prismaClient.$transaction(async (tx) => {
    // Find the specific approval log for this user first to verify it exists and is active
    const approvalLog = await tx.requestApproval.findFirst({
      where: {
        requestId: requestId,
        approverId: userId,
        status: "PENDING", // Using the correct ApprovalStatus enum value
        stage: null, // Publisher approvals have null stage
        approverStatus: "ACTIVE", // Only active approvers can reject
      },
    });

    if (!approvalLog) {
      throw new Error("Approval log not found or user is not an active approver");
    }

    // Update the specific approval log we found
    await tx.requestApproval.update({
      where: { id: approvalLog.id },
      data: {
        status: "REJECTED",
        comments: rejectReason,
      },
    });

    // Update the request flow status to REJECTED but keep the request status as PUBLISH_PENDING
    // This allows for resubmission later
    await tx.resourceVersioningRequest.update({
      where: {id: requestId},
      data: {
        flowStatus: "REJECTED", // Only update flow status, not request status
      },
    });

    // We don't change the resource version status to REJECTED anymore
    // It stays as PUBLISH_PENDING to allow for resubmission

    // Get the updated request to return
    const updatedRequest = await tx.resourceVersioningRequest.findUnique({
      where: { id: requestId },
      include: {
        approvals: true,
      },
    });

    return updatedRequest;
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
    where: {id: resourceId},
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
              {titleEn: {contains: search, mode: "insensitive"}},
              {titleAr: {contains: search, mode: "insensitive"}},
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
              {titleEn: {contains: search, mode: "insensitive"}},
              {titleAr: {contains: search, mode: "insensitive"}},
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



export const fetchVersionsInfo = async (versionId) => {
  // Get the specific version with comprehensive data
  const version = await prismaClient.resourceVersion.findUnique({
    where: { id: versionId },
    include: {
      // Include resource information
      resource: {
        select: {
          id: true,
          titleEn: true,
          titleAr: true,
          resourceType: true,
          resourceTag: true,
          liveVersionId: true,
          newVersionEditModeId: true,
        },
      },
      // Role assignments for this version (historical snapshot)
      roles: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      // Verifier assignments for this version (historical snapshot)
      verifiers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [
          { stage: "asc" },
          { createdAt: "asc" },
        ],
      },
      // All requests associated with this version
      requests: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          // All approval logs for each request
          approvals: {
            include: {
              approver: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: [
              { stage: "asc" },
              { createdAt: "asc" },
            ],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      // User who locked this version (if any)
      lockedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!version) {
    throw new Error("Version not found");
  }

  // Process the version to create comprehensive history
  // Group role history by role type
  const roleHistory = {
    MANAGER: [],
    EDITOR: [],
    PUBLISHER: [],
  };

  // Process role assignments with timestamps
  version.roles.forEach((roleAssignment) => {
    const roleType = roleAssignment.role;
    if (roleHistory[roleType]) {
      roleHistory[roleType].push({
        user: roleAssignment.user,
        status: roleAssignment.status,
        assignedAt: roleAssignment.createdAt,
        updatedAt: roleAssignment.updatedAt,
      });
    }
  });

  // Group verifier history by stage
  const verifierHistory = {};
  version.verifiers.forEach((verifierAssignment) => {
    const stage = verifierAssignment.stage;
    if (!verifierHistory[stage]) {
      verifierHistory[stage] = [];
    }
    verifierHistory[stage].push({
      user: verifierAssignment.user,
      status: verifierAssignment.status,
      assignedAt: verifierAssignment.createdAt,
      updatedAt: verifierAssignment.updatedAt,
    });
  });

  // Process request and approval history
  const requestHistory = version.requests.map((request) => {
    // Group approvals by stage (verifiers) and publisher (stage: null)
    const verifierApprovals = {};
    let publisherApproval = null;

    request.approvals.forEach((approval) => {
      if (approval.stage === null) {
        // Publisher approval
        publisherApproval = {
          approver: approval.approver,
          status: approval.status,
          comments: approval.comments,
          approverStatus: approval.approverStatus,
          createdAt: approval.createdAt,
          updatedAt: approval.updatedAt,
        };
      } else {
        // Verifier approval
        if (!verifierApprovals[approval.stage]) {
          verifierApprovals[approval.stage] = [];
        }
        verifierApprovals[approval.stage].push({
          approver: approval.approver,
          status: approval.status,
          comments: approval.comments,
          approverStatus: approval.approverStatus,
          createdAt: approval.createdAt,
          updatedAt: approval.updatedAt,
        });
      }
    });

    return {
      id: request.id,
      type: request.type,
      status: request.status,
      flowStatus: request.flowStatus,
      submittedBy: request.sender,
      submittedAt: request.createdAt,
      referenceDoc: request.referenceDoc,
      verifierApprovals,
      publisherApproval,
      updatedAt: request.updatedAt,
    };
  });

  return {
    resource: {
      id: version.resource.id,
      titleEn: version.resource.titleEn,
      titleAr: version.resource.titleAr,
      resourceType: version.resource.resourceType,
      resourceTag: version.resource.resourceTag,
    },
    version: {
      id: version.id,
      versionNumber: version.versionNumber,
      versionStatus: version.versionStatus,
      notes: version.notes,
      referenceDoc: version.referenceDoc,
      isLive: version.id === version.resource.liveVersionId,
      isUnderEditing: version.id === version.resource.newVersionEditModeId,

      // Timestamps
      createdAt: version.createdAt,
      updatedAt: version.updatedAt,
      scheduledAt: version.scheduledAt,
      publishedAt: version.publishedAt,

      // Lock information
      lockedBy: version.lockedBy,
      lockedAt: version.lockedAt,

      // Historical role assignments
      roleHistory,

      // Historical verifier assignments
      verifierHistory,

      // Request and approval history
      requestHistory,
    },
  };
};


export const restoreLiveVersion = async (versionId) => {
  const version = await prismaClient.resourceVersion.findUnique({
    where: { id: versionId },
    select: {
      id: true,
      resourceId: true,
    },
  });

  if (!version) {
    throw new Error("Version not found");
  }

  // Restore the version and update the resource's live version
  const [restoredVersion] = await prismaClient.$transaction([
    prismaClient.resourceVersion.update({
      where: { id: versionId },
      data: {
        versionStatus: "LIVE",
      },
    }),
    prismaClient.resource.update({
      where: { id: version.resourceId },
      data: {
        liveVersionId: versionId,
      },
    }),
  ]);

  return { message: "Success", content: restoredVersion };
};


export const deleteAllResourceRelatedDataFromDb = async () => {
  try {
    // Use a transaction to ensure all operations succeed or fail together
    return await prismaClient.$transaction(
      async (tx) => {
        // Step 1: Delete all approval logs and requests
        const deletedRequestApprovals = await tx.requestApproval.deleteMany({});
        console.log(
          `Deleted ${deletedRequestApprovals.count} request approvals`
        );

      // This will be handled later in the proper order

        // Now we can safely delete all requests
        const deletedRequests = await tx.resourceVersioningRequest.deleteMany(
          {}
        );
        console.log(
          `Deleted ${deletedRequests.count} resource versioning requests`
        );

        // Step 2: Delete all resource roles and verifiers
        const deletedResourceVersionRoles =
          await tx.resourceVersionRole.deleteMany({});
        console.log(
          `Deleted ${deletedResourceVersionRoles.count} resource version roles`
        );

        const deletedResourceVersionVerifiers =
          await tx.resourceVersionVerifier.deleteMany({});
        console.log(
          `Deleted ${deletedResourceVersionVerifiers.count} resource version verifiers`
        );

        const deletedResourceRoles = await tx.resourceRole.deleteMany({});
        console.log(`Deleted ${deletedResourceRoles.count} resource roles`);

        const deletedResourceVerifiers = await tx.resourceVerifier.deleteMany(
          {}
        );
        console.log(
          `Deleted ${deletedResourceVerifiers.count} resource verifiers`
        );

        // Step 3: Delete all section version items
        const deletedSectionVersionItems =
          await tx.sectionVersionItem.deleteMany({});
        console.log(
          `Deleted ${deletedSectionVersionItems.count} section version items`
        );

        // Step 4: Delete all resource version sections
        const deletedResourceVersionSections =
          await tx.resourceVersionSection.deleteMany({});
        console.log(
          `Deleted ${deletedResourceVersionSections.count} resource version sections`
        );

        // Step 5: Delete all section versions - SPECIAL HANDLING FOR PARENT-CHILD RELATIONSHIP
        // First, get all section versions
        const allSectionVersions = await tx.sectionVersion.findMany({
          select: {id: true, parentVersionId: true},
        });

        // Group them by whether they have a parent or not
        const childSectionVersions = allSectionVersions.filter(
          (sv) => sv.parentVersionId !== null
        );
        const parentSectionVersions = allSectionVersions.filter(
          (sv) => sv.parentVersionId === null
        );

        // Delete child section versions first
        let totalDeletedSectionVersions = 0;
        if (childSectionVersions.length > 0) {
          const childIds = childSectionVersions.map((sv) => sv.id);
          const deletedChildSectionVersions =
            await tx.sectionVersion.deleteMany({
              where: {id: {in: childIds}},
            });
          console.log(
            `Deleted ${deletedChildSectionVersions.count} child section versions`
          );
          totalDeletedSectionVersions += deletedChildSectionVersions.count;
        }

        // Then delete parent section versions
        if (parentSectionVersions.length > 0) {
          const parentIds = parentSectionVersions.map((sv) => sv.id);
          const deletedParentSectionVersions =
            await tx.sectionVersion.deleteMany({
              where: {id: {in: parentIds}},
            });
          console.log(
            `Deleted ${deletedParentSectionVersions.count} parent section versions`
          );
          totalDeletedSectionVersions += deletedParentSectionVersions.count;
        }

        console.log(
          `Deleted ${totalDeletedSectionVersions} total section versions`
        );

        // Step 6: Delete all sections
        const deletedSections = await tx.section.deleteMany({});
        console.log(`Deleted ${deletedSections.count} sections`);

        // Step 7: Handle Resource and ResourceVersion relationships
        // First, update all resources to remove references to versions
        // This is necessary because of the onDelete: Restrict constraints
        await tx.resource.updateMany({
          data: {
            liveVersionId: null,
            newVersionEditModeId: null,
            scheduledVersionId: null,
          },
        });
        console.log(`Updated resources to remove version references`);

        // Now we can safely delete all resource versions
        const deletedResourceVersions = await tx.resourceVersion.deleteMany({});
        console.log(
          `Deleted ${deletedResourceVersions.count} resource versions`
        );

        // Step 8: Delete all SEO data
        const deletedSEO = await tx.sEO.deleteMany({});
        console.log(`Deleted ${deletedSEO.count} SEO records`);

      // // Step 9: Delete all media
      // const deletedMedia = await tx.media.deleteMany({});
      // console.log(`Deleted ${deletedMedia.count} media records`);

        // Step 10: Delete all filters to resource relationships
        // await tx.$executeRaw`DELETE FROM "_FiltersToResource"`;
        // console.log(`Deleted filters to resource relationships`);
      // Step 10: Delete all filters to resource relationships
      await tx.$executeRaw`DELETE FROM "_FiltersToResource"`;
      console.log(`Deleted filters to resource relationships`);

      // Step 11: Delete all filters
      const deletedFilters = await tx.filters.deleteMany({});
      console.log(`Deleted ${deletedFilters.count} filters`);

        // Step 12: Handle Resource parent-child relationships
        // First, update all resources to remove parent references
        // This is necessary because of the onDelete: Restrict constraint on parent-child relationship
        await tx.resource.updateMany({
          data: {
            parentId: null,
          },
        });
        console.log(`Updated resources to remove parent references`);

        // Now we can safely delete all resources
        const deletedResources = await tx.resource.deleteMany({});
        console.log(`Deleted ${deletedResources.count} resources`);

      return {
        message: "Successfully deleted all content-related data",
        deletedCounts: {
          requestApprovals: deletedRequestApprovals.count,
          requests: deletedRequests.count,
          resourceVersionRoles: deletedResourceVersionRoles.count,
          resourceVersionVerifiers: deletedResourceVersionVerifiers.count,
          resourceRoles: deletedResourceRoles.count,
          resourceVerifiers: deletedResourceVerifiers.count,
          sectionVersionItems: deletedSectionVersionItems.count,
          resourceVersionSections: deletedResourceVersionSections.count,
          sectionVersions: totalDeletedSectionVersions,
          sections: deletedSections.count,
          resourceVersions: deletedResourceVersions.count,
          seo: deletedSEO.count,
          // media: deletedMedia.count,
          filters: deletedFilters.count,
          resources: deletedResources.count
        }
      };
    }, {
      maxWait: 60000, // 60 seconds max wait time
      timeout: 300000, // 5 minutes transaction timeout
      isolationLevel: 'Serializable', // Highest isolation level for data consistency
    });
  } catch (error) {
    console.error("Error deleting content data:", error);
    throw error;
  }
};

// fetchVersionsInfo function returns comprehensive version history data including:
// - Resource name and basic information
// - Assigned Users with complete role and verifier history showing how users were assigned to roles and later changed
// - Historical timestamps showing when each user was selected as manager/editor/publisher and when they were changed
// - Role status tracking (active/inactive) to maintain complete audit trail
// - Submitted Date, publisher approval datetime, Editor's Comments
// - Submitted By information, reference documents, approval status per user
// - All data is specific to each resource version as every version maintains its own history
