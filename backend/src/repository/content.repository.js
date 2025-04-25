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
    result.liveVersion = await formatResourceVersion(resource.liveVersion);
  }

  // Process edit version if it exists
  if (resource.newVersionEditMode) {
    result.editVersion = await formatResourceVersion(
      resource.newVersionEditMode
    );
  }

  return result;
};

// Helper function to format a resource version with its sections
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
  const formattedSections = sortedSectionVersions.map((sectionVersion) => {
    // Format the main section
    const formattedSection = {
      sectionId : sectionVersion.sectionId,
      sectionVersionId: sectionVersion.id,
      order: sectionOrderMap[sectionVersion.id] || 999,
      version: sectionVersion.version,
      title: sectionVersion.section?.title || "",
      SectionType: sectionVersion.section?.sectionType?.name || "",
      content: sectionVersion.content || {},
    };

    // Add items if they exist
    if (sectionVersion.items && sectionVersion.items.length > 0) {
      formattedSection.items = sectionVersion.items.map((item) => {
        // Get the resource and its live version
        const resource = item.resource;
        const liveVersion = resource.liveVersion;

        return {
          resourceType: resource.resourceType || "SUB_PAGE",
          order: item.order,
          id: resource.id,
          slug: resource.slug,
          titleEn: resource.titleEn,
          titleAr: resource.titleAr,
          // Use icon from live version if available
          icon: liveVersion?.icon || null,
          image: liveVersion?.Image || null,
          // data: formatResourceVersion(),
        };
      });
    }

    // Add child sections if they exist
    if (sectionVersion.children && sectionVersion.children.length > 0) {
      formattedSection.sections = sectionVersion.children.map(
        (childSection) => {
          const formattedChild = {
            sectionId : childSection.sectionId,
            sectionVersionId: childSection.id,
            order: sectionOrderMap[childSection.id] || 999,
            title: childSection.section?.title || "",
            SectionType: childSection.section?.sectionType?.name || "",
            content: childSection.content || {},
          };

          // Add items to child section if they exist
          if (childSection.items && childSection.items.length > 0) {
            formattedChild.items = childSection.items.map((item) => {
              // Get the resource and its live version
              const resource = item.resource;
              const liveVersion = resource.liveVersion;

              return {
                resourceType: resource.resourceType || "SUB_PAGE",
                order: item.order,
                id: resource.id,
                slug: resource.slug,
                titleEn: resource.titleEn,
                titleAr: resource.titleAr,
                // Use icon from live version if available
                icon: liveVersion?.icon || null,
                image: liveVersion?.Image || null,
              };
            });
          }

          return formattedChild;
        }
      );
    }

    return formattedSection;
  });

  return {
    id: resourceVersion.id,
    versionNumber: resourceVersion.versionNumber,
    content: resourceVersion.content || {},
    icon: resourceVersion.icon || null,
    image: resourceVersion.Image || null,
    sections: formattedSections,
  };
}



// {
//   "content": {
//       "resourceId": "cm9wm4s4m008zlq0i6t2r7rub",
//       "titleEn": "Home Page",
//       "titleAr": "الصفحة الرئيسية",
//       "slug": "home",
//       "resourceType": "MAIN_PAGE",
//       "resourceTag": "HOME",
//       "relationType": "PARENT",
//       "newVersionEditMode": {
//           "versionStatus": "",
//           "comments" : "",
//           "referenceDoc" : "",
//           "content": {},
//           "icon": null,
//           "image": null,
//           "sections": [
//               {
//                   "sectionId": "cm9wm4s4u0093lq0ifykodj04",
//                   "order": 1,
//                   "content": {
//                       "image": [
//                           "https://loopwebsite.s3.ap-south-1.amazonaws.com/Frame+44+(1).png"
//                       ],
//                       "title": {
//                           "ar": "بناء مستقبل أقوى",
//                           "en": "Building a Stronger Future"
//                       },
//                       "buttonText": {
//                           "ar": "أعمالنا",
//                           "en": "View Our Work"
//                       },
//                       "description": {
//                           "ar": "التزامنا الثابت الذي يعزز الشراكات والتعاونات القوية مع القادة الرؤوساء لمواجهة أصعب التحديات واستغلال أعظم الفرص، وخلق إنجازات هندسية واختراقات تحولية تتوافق مع رؤية المملكة ٢٠٣٠.",
//                           "en": "Our unwavering commitment that forge partnerships and strong collaborations with visionary leaders to take their most critical challenges, capture their greatest opportunities, and create engineering feats and breakthroughs that are transformative and coincides with the Kingdom’s Vision 2030."
//                       }
//                   }
//               },
//               {
//                   "sectionId": "cm9wm4s540099lq0ile0a8gnd",
//                   "order": 2,
//                   "content": {
//                       "image": [
//                           "https://loopwebsite.s3.ap-south-1.amazonaws.com/Frame+44+(1).png"
//                       ],
//                       "title": {
//                           "ar": "مدفوعون بالتميز في التنفيذ",
//                           "en": "Driven by excellence in execution"
//                       },
//                       "buttonText": {
//                           "ar": "اعرف عنا",
//                           "en": "Know About Us"
//                       },
//                       "description": {
//                           "ar": "مع عملائنا، نعتمد نهجًا تحوليًا من خلال تمكين المؤسسات لبناء ميزة تنافسية مستدامة والمساعدة في دفع النمو.",
//                           "en": "With our clients, we adopt a transformational approach by empowering organizations to build a sustainable competitive advantage and help drive growth.We work with the most dynamic organizations and have helped them by mobilizing change, accelerating value engineering with creative solutions, and partnering them towards achieving global prominence."
//                       }
//                   }
//               },
//               {
//                   "sectionId": "cm9wm4s5o009flq0itibw3lrf",
//                   "order": 3,
//                   "content": {
//                       "title": {
//                           "ar": "خدماتنا",
//                           "en": "OUR SERVICES"
//                       }
//                   },
//                   "items": [
//                       {
//                           "resourceType": "SUB_PAGE",
//                           "order": 1,
//                           "id": "cm9wm4s0n007hlq0iv78rn7ya"
//                       },
//                       {
//                           "resourceType": "SUB_PAGE",
//                           "order": 2,
//                           "id": "cm9wm4s15007qlq0irib8w0i7"
//                       },
//                       {
//                           "resourceType": "SUB_PAGE",
//                           "order": 3,
//                           "id": "cm9wm4s1p007zlq0iy263u2nw"
//                       },
//                       {
//                           "resourceType": "SUB_PAGE",
//                           "order": 4,
//                           "id": "cm9wm4s2a0088lq0id4p6itaf"
//                       },
//                       {
//                           "resourceType": "SUB_PAGE",
//                           "order": 5,
//                           "id": "cm9wm4s33008hlq0izitv0mr1"
//                       }
//                   ]
//               },
//               {
//                   "sectionId": "cm9wm4s6r009vlq0irk2aerlt",
//                   "order": 4,
//                   "content": {
//                       "cards": [
//                           {
//                               "count": "123",
//                               "title": {
//                                   "ar": "المشاريع المنجزة",
//                                   "en": "Projects Completed"
//                               },
//                               "iconName": "projectCompleted"
//                           },
//                           {
//                               "count": "84",
//                               "title": {
//                                   "ar": "عملاء سعداء",
//                                   "en": "Happy Clients"
//                               },
//                               "iconName": "happyClient"
//                           },
//                           {
//                               "count": "32",
//                               "title": {
//                                   "ar": "سنوات في العمل",
//                                   "en": "Years in Business"
//                               },
//                               "iconName": "yearOfBusiness"
//                           },
//                           {
//                               "count": "42",
//                               "title": {
//                                   "ar": "الفوز بالجوائز",
//                                   "en": "Awards Won"
//                               },
//                               "iconName": "awardWin"
//                           }
//                       ],
//                       "title": {
//                           "ar": "٣٢ عاماً من الخبرة",
//                           "en": "32 Years of Experience"
//                       },
//                       "button": {
//                           "text": {
//                               "ar": "اتصل بنا",
//                               "en": "Contact Us"
//                           }
//                       },
//                       "description": {
//                           "ar": "كانت شركتنا رائدة في تقديم خدمات البناء للعملاء في جميع أنحاء دبي منذ عام 1992.",
//                           "en": "Our company has been the leading provided construction services to clients throughout the Dubai since 1992."
//                       }
//                   }
//               },
//               {
//                   "sectionId": "cm9wm4s7100a1lq0i19yw2zcw",
//                   "order": 5,
//                   "content": {
//                       "buttons": [
//                           {
//                               "id": "btn1",
//                               "text": {
//                                   "ar": "عرض الكل",
//                                   "en": "View All"
//                               }
//                           },
//                           {
//                               "id": "btn2",
//                               "text": {
//                                   "ar": "العودة",
//                                   "en": "Back"
//                               }
//                           },
//                           {
//                               "id": "btn3",
//                               "text": {
//                                   "ar": "التالي",
//                                   "en": "Next"
//                               }
//                           }
//                       ]
//                   },
//                   "sections": [
//                       {
//                           "sectionId": "cm9wm4s7900a7lq0i442itc4o",
//                           "order": 1,
//                           "content": {
//                               "id": "projectList",
//                               "title": {
//                                   "ar": "المشاريع الأخيرة",
//                                   "en": "Recent Projects"
//                               },
//                               "description": {
//                                   "ar": "تفتخر شركة شيد بمحفظة متزايدة من العملاء الراضين، سواء على الصعيد العالمي أو المحلي، الذين استفادوا بشكل كبير من تعاونهم معنا. تُعتبر حلولنا مطلوبة من قبل الشركات بمختلف أحجامها – الكبيرة، والمتوسطة، والصغيرة. نحن نؤمن بشدة بضرورة إقامة شراكات استراتيجية مع منظمات متنوعة، وتقديم حلول توفر قيمة تجارية ملموسة. من بين مشاريعنا الأخيرة والبارزة:",
//                                   "en": "Shade Corporation boasts a continually growing portfolio of satisfied clients, both global and local, who have derived tremendous benefits from their engagement with us. Our solutions are sought after by companies of all sizes – large, mid-sized, and small. We firmly believe in establishing strategic partnerships with diversed organizations, delivering solutions that provide tangible business value. Among our recent and notable projects are:"
//                               }
//                           },
//                           "items": [
//                               {
//                                   "resourceType": "SUB_PAGE",
//                                   "order": 1,
//                                   "id": "cm9wm4rw3004zlq0issn28sqk"
//                               },
//                               {
//                                   "resourceType": "SUB_PAGE",
//                                   "order": 2,
//                                   "id": "cm9wm4rx9005klq0iehj5dmbb"
//                               },
//                               {
//                                   "resourceType": "SUB_PAGE",
//                                   "order": 3,
//                                   "id": "cm9wm4ry30065lq0iwld328mn"
//                               },
//                               {
//                                   "resourceType": "SUB_PAGE",
//                                   "order": 4,
//                                   "id": "cm9wm4rz0006qlq0i6hm35gvu"
//                               }
//                           ]
//                       },
//                       {
//                           "sectionId": "cm9wm4s7x00allq0iiwt8wboa",
//                           "order": 2,
//                           "content": {
//                               "id": "markets",
//                               "title": {
//                                   "ar": "أسواقنا",
//                                   "en": "Our Markets"
//                               },
//                               "description": {
//                                   "ar": "التنقل عبر شبكة من الأسواق، تستفيد شركة شيد من ثروة من الخبرة، مما يتيح لها تحقيق ميزة استراتيجية. إن رحلتنا عبر صناعات متنوعة توفر رؤى عميقة، مما يشكل نهجًا يجمع بين الخبرة والإبداع والرؤية المستقبلية. من فهم التحديات الفريدة إلى توقع اتجاهات السوق، نستفيد من حكمتنا الجماعية لتحقيق النجاح في كل مشروع.",
//                                   "en": "Navigating a tapestry of markets, Shade Corporation draws from a wealth of experience, cultivating a strategic advantage. Our journey through diverse industries provides profound insights, shaping an approach that is both seasoned, creative and forward-thinking. From understanding unique challenges to anticipating market trends, we leverage our collective wisdom to drive success in every venture."
//                               }
//                           },
//                           "items": [
//                               {
//                                   "resourceType": "SUB_PAGE",
//                                   "order": 1,
//                                   "id": "cm9wm4rw3004zlq0issn28sqk"
//                               },
//                               {
//                                   "resourceType": "SUB_PAGE",
//                                   "order": 2,
//                                   "id": "cm9wm4rx9005klq0iehj5dmbb"
//                               },
//                               {
//                                   "resourceType": "SUB_PAGE",
//                                   "order": 3,
//                                   "id": "cm9wm4ry30065lq0iwld328mn"
//                               },
//                               {
//                                   "resourceType": "SUB_PAGE",
//                                   "order": 4,
//                                   "id": "cm9wm4rz0006qlq0i6hm35gvu"
//                               }
//                           ]
//                       },
//                       {
//                           "sectionId": "cm9wm4s8j00azlq0iquen8v64",
//                           "order": 3,
//                           "content": {
//                               "id": "safety",
//                               "title": {
//                                   "ar": "السلامة: مسؤوليتنا",
//                                   "en": "Safety: Our Responsibility"
//                               },
//                               "description": {
//                                   "ar": "في شركة شيد، السلامة ليست مجرد سياسة، بل هي قيمة أساسية نزرعها في كل مشروع. من خلال التخطيط الدقيق، والتكنولوجيا المتقدمة، والالتزام الصارم ببروتوكولات السلامة، نضمن حماية جميع الأطراف المعنية وتنفيذ كل عملية بأعلى معايير السلامة.",
//                                   "en": "At Shade Corporation, safety isn't just a policy—it's a core value that we instill in every project. Through meticulous planning, advanced technology, and strict adherence to safety protocols, we ensure that every stakeholder is protected and every operation is conducted with the highest level of safety standards."
//                               }
//                           },
//                           "items": [
//                               {
//                                   "resourceType": "SUB_PAGE",
//                                   "order": 1,
//                                   "id": "cm9wm4rw3004zlq0issn28sqk"
//                               },
//                               {
//                                   "resourceType": "SUB_PAGE",
//                                   "order": 2,
//                                   "id": "cm9wm4rx9005klq0iehj5dmbb",
//                                   "slug": "project-non-metallic-manufacturing-plant-3520666a"
//                               },
//                               {
//                                   "resourceType": "SUB_PAGE",
//                                   "order": 3,
//                                   "id": "cm9wm4ry30065lq0iwld328mn"
//                               },
//                               {
//                                   "resourceType": "SUB_PAGE",
//                                   "order": 4,
//                                   "id": "cm9wm4rz0006qlq0i6hm35gvu"
//                               }
//                           ]
//                       }
//                   ]
//               },
//               {
//                   "sectionId": "cm9wm4s9600bdlq0i8tpoiehr",
//                   "order": 6,
//                   "content": {
//                       "title": {
//                           "ar": "عملائنا السعداء",
//                           "en": "Our Happy Clients"
//                       },
//                       "clients": [
//                           {
//                               "alt": {
//                                   "ar": "عميل 1",
//                                   "en": "Client 1"
//                               },
//                               "image": "client1"
//                           },
//                           {
//                               "alt": {
//                                   "ar": "عميل 2",
//                                   "en": "Client 2"
//                               },
//                               "image": "client2"
//                           },
//                           {
//                               "alt": {
//                                   "ar": "عميل 3",
//                                   "en": "Client 3"
//                               },
//                               "image": "client3"
//                           },
//                           {
//                               "alt": {
//                                   "ar": "عميل 4",
//                                   "en": "Client 4"
//                               },
//                               "image": "client4"
//                           }
//                       ],
//                       "description": {
//                           "ar": "شركاء موثوقون في النجاح",
//                           "en": "Trusted Partners in Success"
//                       }
//                   }
//               },
//               {
//                   "sectionId": "cm9wm4s9e00bjlq0iezf3zrx5",
//                   "order": 7,
//                   "content": {
//                       "title": {
//                           "ar": "ماذا يقول عملاؤنا عنا؟",
//                           "en": "What Our Clients Say About Us?"
//                       }
//                   },
//                   "items": [
//                       {
//                           "resourceType": "SUB_PAGE",
//                           "order": 1,
//                           "id": "cm9wm4ri70000lq0if7n4lzma"
//                       },
//                       {
//                           "resourceType": "SUB_PAGE",
//                           "order": 2,
//                           "id": "cm9wm4rjt0009lq0ivhu0bb7z"
//                       },
//                       {
//                           "resourceType": "SUB_PAGE",
//                           "order": 3,
//                           "id": "cm9wm4rkc000ilq0i2j1p9x40"
                      
//                       },
//                       {
//                           "resourceType": "SUB_PAGE",
//                           "order": 4,
//                           "id": "cm9wm4rkw000rlq0i08m07i87"
                      
//                       },
//                       {
//                           "resourceType": "SUB_PAGE",
//                           "order": 5,
//                           "id": "cm9wm4rlg0010lq0iftb59a9s"
                         
//                       },
//                       {
//                           "resourceType": "SUB_PAGE",
//                           "order": 6,
//                           "id": "cm9wm4rm70019lq0ia929g0bj"
                     
//                       }
//                   ]
//               },
//               {
//                   "sectionId": "cm9wm4sa400c1lq0i2ji152j6",
//                   "order": 8,
//                   "content": {
//                       "title": {
//                           "ar": "هل تريد بدء مشروع جديد أو التعاون معنا؟",
//                           "en": "Want to Start a New Project OR Collaborate with us?"
//                       },
//                       "button": {
//                           "text": {
//                               "ar": "اتصل بنا",
//                               "en": "Contact Us"
//                           }
//                       },
//                       "description": {
//                           "ar": "وفقًا لفلسفتنا المتمثلة في “بناء مستقبل أقوى”، تؤمن شركة شيد بشراكات مربحة للجانبين مع جميع أصحاب المصلحة، وتهدف باستمرار إلى إنشاء علاقات مستدامة وطويلة الأمد لخلق القيمة. يتضمن نموذج المشاركة الخاص بنا منهجيات خاصة وحلولًا شاملة من شأنها تحويل اقتصاديات مشروعك وفتح إمكانيات جديدة ودعم أهداف النمو التنظيمي لديك.",
//                           "en": "True to our philosophy of “Building a Stronger Future”, Shade Corporation believes in win-win partnerships with all stakeholders, and continually aims at creating sustainable and long-term relationships for value creation. Our engagement model includes proprietary methodologies and comprehensive solutions that will transform your project economics, unlock new possibilities and support your organizational growth goals. In the last few decades, we have served many of Saudi's leading companies and public institutions to create winning strategies, solve some of the complex problems, and deliver consistent outcomes. If you're looking to drive performance, execute growth strategies, and build new capabilities, collaborate with us now."
//                       },
//                       "description2": {
//                           "ar": "في العقود القليلة الماضية، قمنا بخدمة العديد من الشركات والمؤسسات العامة الرائدة في السعودية لوضع استراتيجيات رابحة، وحل بعض المشاكل المعقدة، وتحقيق نتائج متسقة. إذا كنت تتطلع إلى تعزيز الأداء وتنفيذ استراتيجيات النمو وبناء قدرات جديدة، فتعاون معنا الآن.",
//                           "en": "In the last few decades, we have served many of Saudi's leading companies and public institutions to create winning strategies, solve some of the complex problems, and deliver consistent outcomes. If you're looking to drive performance, execute growth strategies, and build new capabilities, collaborate with us now."
//                       },
//                       "highlightedText": {
//                           "ar": "بناء مستقبل أقوى",
//                           "en": "Building a Stronger Future"
//                       }
//                   }
//               }
//           ]
//       }
//   }
// }