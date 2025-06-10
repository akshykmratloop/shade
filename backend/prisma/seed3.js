import prisma from "../src/config/dbConfig.js";
import content from "./content.json" with { type: "json" };
import crypto from "crypto";

const sectionTypes = [
  "HERO_BANNER",
  "MARKDOWN_CONTENT",
  "STATISTICS",
  "MULTI_SECTION",
  "EXTERNAL_ITEMS",
  "CLIENT_LOGOS",
  "TESTIMONIALS",
  "NORMAL_CONTENT",
  "INTRO_CONTENT",
  "GALLERY_GRID",
  "QUOTES",
  "CARD_GRID",
  "CONTACT_FORM",
  "TEAM",
  "CLIENTS",
  "MARKETS",
  "CAREER_LISTING",
  "NEWS_FEED",
  "FOOTER_COLUMNS",
  "HEADER_NAV",
  "SERVICE_DETAIL",
  "SERVICE_CHILDREN",
  "CAREER_DETAILS",
  "NEWS_DETAIL",
  "CONTACT_INFO",
  "TESTIMONIAL",
];

const filters = [
  {
    nameEn: "COMPLETE",
    nameAr: "مكتمل",
  },
  {
    nameEn: "ONGOING",
    nameAr: "قيد التنفيذ",
  },
  {
    nameEn: "FULL-TIME",
    nameAr: "دوام كامل",
  },
  {
    nameEn: "PART-TIME",
    nameAr: "دوام جزئي",
  },
  {
    nameEn: "FREELANCE",
    nameAr: "عمل حر",
  },
  {
    nameEn: "INFORMATION TECHNOLOGY",
    nameAr: "تكنولوجيا المعلومات",
  },
  {
    nameEn: "MARKETING",
    nameAr: "التسويق",
  },
  {
    nameEn: "FINANCE",
    nameAr: "المالية",
  },
  {
    nameEn: "ENTRY LEVEL",
    nameAr: "مبتدئ",
  },
  {
    nameEn: "MID-LEVEL",
    nameAr: "متوسط",
  },
  {
    nameEn: "SENIOR",
    nameAr: "خبير",
  },
];

async function main() {
  try {
    // Wrap the entire seeding process in a single transaction
    await prisma.$transaction(
      async (tx) => {
        async function createSectionTypes(sectionTypeNames) {
          await Promise.all(
            sectionTypeNames.map(async (name) => {
              const existing = await tx.sectionType.findUnique({
                where: { name },
              });

              if (!existing) {
                await tx.sectionType.create({
                  data: {
                    name,
                  },
                });
                console.log(`✅ Created SectionType: ${name}`);
              } else {
                console.log(`ℹ️ SectionType "${name}" already exists`);
              }
            })
          );
        }

        async function createFilters(filters) {
          await Promise.all(
            filters.map(async (filter) => {
              try {
                // First try to find by nameEn
                const existingFilter = await tx.filters.findUnique({
                  where: { nameEn: filter.nameEn },
                });

                if (existingFilter) {
                  // If found, update it
                  await tx.filters.update({
                    where: { id: existingFilter.id },
                    data: {
                      nameEn: filter.nameEn,
                      nameAr: filter.nameAr,
                    },
                  });
                } else {
                  // If not found, create a new one
                  await tx.filters.create({
                    data: {
                      nameEn: filter.nameEn,
                      nameAr: filter.nameAr,
                    },
                  });
                }
                console.log(`✅ Upserted Filter: ${filter.nameEn}`);
              } catch (error) {
                console.error(
                  `Error upserting filter ${filter.nameEn}:`,
                  error
                );
                throw error;
              }
            })
          );
        }

        // Create SectionTypes
        await createSectionTypes(sectionTypes);
        await createFilters(filters);

        // Helper function to create resources with nested sections
        async function createResource(
          titleEn,
          titleAr,
          slug,
          resourceType,
          resourceTag,
          relationType,
          sections,
          filters,
          childResources
        ) {
          // Ensure sections is an array
          if (!Array.isArray(sections)) {
            console.warn(
              `Sections for resource ${titleEn} is not an array. Using empty array instead.`
            );
            sections = [];
          }

          try {
            // Use the transaction context from the outer scope
            return await (async () => {
              // Create main resource
              const resource = await tx.resource.create({
                data: {
                  titleEn: titleEn,
                  titleAr: titleAr,
                  slug: slug,
                  resourceType: resourceType,
                  resourceTag: resourceTag,
                  relationType: relationType,
                  isAssigned: false,
                  status: "ACTIVE",
                },
              });

              // Create initial version
              const version = await tx.resourceVersion.create({
                data: {
                  resourceId: resource.id,
                  versionNumber: 1,
                  versionStatus: "LIVE",
                  notes: "Initial version created by system",
                  content: {},
                },
              });

              // Update resource with live version
              await tx.resource.update({
                where: { id: resource.id },
                data: { liveVersionId: version.id },
              });


              // Add the filter in resource
              if (filters && filters.length > 0) {
                // Process filters
                for (
                  let filterOrder = 0;
                  filterOrder < filters.length;
                  filterOrder++
                ) {
                  const filterName = filters[filterOrder];

                  try {
                    // Find filter by nameEn
                    const filter = await tx.filters.findUnique({
                      where: { nameEn: filterName },
                    });

                    if (filter) {
                      // Connect filter to resource
                      await tx.resource.update({
                        where: { id: resource.id },
                        data: {
                          filters: {
                            connect: { id: filter.id },
                          },
                        },
                      });
                      console.log(
                        `✅ Connected filter ${filterName} to resource ${resource.id}`
                      );
                    } else {
                      console.warn(
                        `⚠️ Filter ${filterName} not found, skipping connection to resource`
                      );
                    }
                  } catch (error) {
                    console.error(
                      `Error connecting filter ${filterName} to resource:`,
                      error
                    );
                    throw error;
                  }
                }
              }


              // if any child resource add the parent or child id
              if (childResources && childResources.length > 0) {
                // Process child resources
                for (
                  let childOrder = 0;
                  childOrder < childResources.length;
                  childOrder++
                ) {
                  const childSlug = childResources[childOrder];

                  // Find child resource
                  const childResource = await tx.resource.findUnique({
                    where: { slug: childSlug },
                  });

                  if (childResource) {
                    // Connect child resource
                    await tx.resource.update({
                      where: { id: resource.id },
                      data: {
                        children: {
                          connect: { id: childResource.id },
                        },
                      },
                    });
                  }
                }
              }

              // Process sections
              for (
                let sectionOrder = 0;
                sectionOrder < sections.length;
                sectionOrder++
              ) {
                const sectionData = sections[sectionOrder];

                // Upsert SectionType
                const sectionType = await tx.sectionType.upsert({
                  where: { name: sectionData.SectionType },
                  update: {},
                  create: {
                    name: sectionData.SectionType,
                  },
                });

                // Create Section with unique title (append resource slug to ensure uniqueness)
                const uniqueSectionTitle = `${sectionData.title
                  }-${slug}-${crypto.randomBytes(2).toString("hex")}`;
                const section = await tx.section.create({
                  data: {
                    title: uniqueSectionTitle,
                    sectionType: {
                      connect: { id: sectionType.id },
                    },
                    isGlobal: sectionData.isGlobal || false,
                  },
                });

                // Create SectionVersion
                const sectionVersion = await tx.sectionVersion.create({
                  data: {
                    sectionId: section.id,
                    resourceId: resource.id,
                    resourceVersionId: version.id,
                    version: 1,
                    content: sectionData.content,
                    sectionVersionTitle:
                      sectionData.sectionVersionTitle || null,
                  },
                });

                // Link to ResourceVersion
                await tx.resourceVersionSection.create({
                  data: {
                    order: sectionOrder + 1,
                    resourceVersionId: version.id,
                    sectionVersionId: sectionVersion.id,
                  },
                });

                // Create SectionVersionItems if needed
                if (Array.isArray(sectionData.items)) {
                  for (
                    let itemOrder = 0;
                    itemOrder < sectionData.items.length;
                    itemOrder++
                  ) {
                    const item = sectionData.items[itemOrder];
                    if (item.resourceType === "SUB_PAGE" || "SUB_PAGE_ITEM") {
                      const linkedResource = await tx.resource.findUnique({
                        where: { slug: item.slug },
                      });

                      if (linkedResource) {
                        await tx.sectionVersionItem.create({
                          data: {
                            order: itemOrder + 1,
                            sectionVersionId: sectionVersion.id,
                            resourceId: linkedResource.id,
                          },
                        });
                      }
                    }
                  }
                }

                // Handle nested child sections (if any)
                if (
                  Array.isArray(sectionData.sections) &&
                  sectionData.sections.length > 0
                ) {
                  let childOrder = 1;
                  for (const childData of sectionData.sections) {
                    // Upsert child SectionType
                    const childSectionType = await tx.sectionType.upsert({
                      where: { name: childData.SectionType },
                      update: {},
                      create: {
                        name: childData.SectionType,
                      },
                    });

                    // Create child Section with unique title
                    const uniqueChildSectionTitle = `${childData.title
                      }-${slug}-child-${crypto.randomBytes(2).toString("hex")}`;
                    const childSection = await tx.section.create({
                      data: {
                        title: uniqueChildSectionTitle,
                        sectionType: {
                          connect: { id: childSectionType.id },
                        },
                        isGlobal: childData.isGlobal || false,
                      },
                    });

                    // Create child SectionVersion with parentVersionId
                    const childSectionVersion = await tx.sectionVersion.create({
                      data: {
                        sectionId: childSection.id,
                        resourceId: resource.id,
                        resourceVersionId: version.id,
                        version: 1,
                        content: childData.content,
                        sectionVersionTitle:
                          childData.sectionVersionTitle || null,
                        parentVersionId: sectionVersion.id, // Link to parent
                      },
                    });

                    // Link child version to ResourceVersion
                    await tx.resourceVersionSection.create({
                      data: {
                        order: childOrder++, // Child ordering resets — you can adjust this
                        resourceVersionId: version.id,
                        sectionVersionId: childSectionVersion.id,
                      },
                    });

                    // Handle items in child
                    if (
                      Array.isArray(childData.items) &&
                      childData.items.length > 0
                    ) {
                      for (
                        let itemOrder = 0;
                        itemOrder < childData.items.length;
                        itemOrder++
                      ) {
                        const item = childData.items[itemOrder];
                        if (item.resourceType === "SUB_PAGE" || "SUB_PAGE_ITEM") {
                          const linkedResource = await tx.resource.findUnique({
                            where: { slug: item.slug },
                          });

                          if (linkedResource) {
                            await tx.sectionVersionItem.create({
                              data: {
                                order: itemOrder + 1,
                                sectionVersionId: childSectionVersion.id,
                                resourceId: linkedResource.id,
                              },
                            });
                          }
                        }
                      }
                    }
                  }
                }
              }

              return resource;
            })();
          } catch (error) {
            console.error(
              `Transaction failed for resource ${titleEn} (${slug}):`,
              error
            );
            throw error; // Re-throw to be caught by the caller
          }
        }

        //  1. Create individual News Items first
        const newsSlugs = [];
        for (const newsItem of content.newsBlogsDetails) {
          newsSlugs.push(newsItem.slug);
          await createResource(
            newsItem.resourceTitle.en,
            newsItem.resourceTitle.ar,
            newsItem.slug,
            "SUB_PAGE",
            "NEWS",
            "CHILD",
            [
              {
                title: "heroSection",
                SectionType: "NEWS_DETAIL",
                content: newsItem.heroSection,
                sectionVersionTitle: `${newsItem.resourceTitle.en}-heroSection`,
              },
              {
                title: "newsDetails",
                SectionType: "MARKDOWN_CONTENT",
                content: newsItem.newsDetails,
                sectionVersionTitle: `${newsItem.resourceTitle.en}-newsDetails`,
              },
              {
                title: "latestNewsSection",
                SectionType: "EXTERNAL_ITEMS",
                content: newsItem.latestNewsSection,
                sectionVersionTitle: `${newsItem.resourceTitle.en}-latestNewsSection`,
                items: [],
              },
            ]
          );
        }

        const testimonialSlug = [];
        // 2. Create Testimonials as standalone resources
        for (const testimonial of content.testimonials) {
          const slug = testimonial.slug;
          testimonialSlug.push(slug);
          await createResource(
            `${testimonial.testimonialBody.name.en}`,
            `${testimonial.testimonialBody.name.ar}`,
            slug,
            "SUB_PAGE",
            "TESTIMONIAL",
            "CHILD",
            [
              {
                title: `testimonialBodySection`,
                SectionType: "TESTIMONIAL",
                content: testimonial.testimonialBody,
                sectionVersionTitle: "Testimonial-testimonialBodySection",
              },
            ]
          );
        }

        // 7. Create Projects as standalone resources
        const projectsSlugs = [];
        for (const project of content.projectDetail) {
          const slug = project.slug;
          projectsSlugs.push(slug);
          await createResource(
            project.introSection.title.en,
            project.introSection.title.ar,
            slug,
            "SUB_PAGE",
            "PROJECT",
            "CHILD",
            [
              {
                title: "introSection",
                SectionType: "HERO_BANNER",
                content: project.introSection,
                sectionVersionTitle: "Project-introSection",
              },
              {
                title: "projectInfoCard",
                SectionType: "MARKDOWN_CONTENT",
                content: project.projectInfoCard,
                sectionVersionTitle: "Project-projectInfoCard",
              },
              {
                title: "projectDescriptionSection",
                SectionType: "MARKDOWN_CONTENT",
                content: project.projectDescriptionSection,
                sectionVersionTitle: "Project-projectDescriptionSection",
              },
              {
                title: "gallerySection",
                SectionType: "GALLERY_GRID",
                content: project.gallerySection,
                sectionVersionTitle: "Project-gallerySection",
              },
              {
                title: "moreProjects",
                SectionType: "EXTERNAL_ITEMS",
                content: project.moreProjects,
                sectionVersionTitle: "Project-moreProjects",
                items: [],
              },
            ],
            [project.filter], // Pass filter as an array with a single string
            []
          );
        }

        const marketItemSlug = [];
        for (const marketItem of content.singleMarketItems) {
          const slug = marketItem.slug;
          marketItemSlug.push(slug);
          await createResource(
            marketItem.resourceTitle.en,
            marketItem.resourceTitle.ar,
            slug,
            "SUB_PAGE",
            "MARKET",
            "CHILD",
            [
              {
                title: "heroSection",
                SectionType: "HERO_BANNER",
                content: marketItem.heroSection,
                sectionVersionTitle: "MarketItem-heroSection",
              },
              {
                title: "marketBodySection",
                SectionType: "MARKDOWN_CONTENT",
                content: marketItem.marketBodySection,
                sectionVersionTitle: "MarketItem-marketBodySection",
              },
              {
                title: "projectsGridSection",
                SectionType: "EXTERNAL_ITEMS",
                content: marketItem.projectsGridSection,
                sectionVersionTitle: "MarketItem-projectsGridSection",
                items: projectsSlugs.map((slug) => ({
                  resourceType: "SUB_PAGE",
                  slug: slug,
                })),
              },
            ]
          );
        }

        //checkpoint

        const thirdLevelOfServices = [];
        for (const childService of content.thirdLevelOfServices) {
          const slug = childService.slug;
          thirdLevelOfServices.push(slug);

          await createResource(
            childService.resourceTitle.en,
            childService.resourceTitle.ar,
            slug,
            "SUB_PAGE_ITEM",
            "SERVICE",
            "CHILD",
            [
              {
                title: "heroSection",
                SectionType: "HERO_BANNER",
                content: childService.heroSection,
                sectionVersionTitle: `${childService.resourceTitle.en}-heroSection`,
              },
              {
                title: "ServicePointsGrid1",
                SectionType: "SERVICE_CHILDREN",
                content: childService.ServicePointsGrid1,
                sectionVersionTitle: `${childService.resourceTitle.en}-ServicePointsGrid1`,
              },
              {
                title: "ServicePointsGrid2",
                SectionType: "SERVICE_CHILDREN",
                content: childService.ServicePointsGrid2,
                sectionVersionTitle: `${childService.resourceTitle.en}-ServicePointsGrid2`,
              },
            ]
          );
        }

        // 10. Create individual Services first (as subpages)
        const secondLevelOFServices = [];
        for (const service of content.secondLevelOFServices) {
          const slug = service.slug;
          secondLevelOFServices.push(slug);
          await createResource(
            service.resourceTitle.en,
            service.resourceTitle.ar,
            slug,
            "SUB_PAGE",
            "SERVICE",
            "CHILD",
            [
              {
                title: `introSection`,
                SectionType: "HERO_BANNER",
                content: service.introSection,
                sectionVersionTitle: `${service.resourceTitle.en}-introSection`,
              },
              {
                title: `childrenServices`,
                SectionType: "EXTERNAL_ITEMS",
                content: service.childrenServices,
                sectionVersionTitle: `${service.resourceTitle.en}-childrenServices`,
                items: service.childService.map((slug) => ({
                  resourceType: "SUB_PAGE_ITEM",
                  slug: slug,
                })),
              },
              {
                title: `otherSecondLevelOFServices`,
                SectionType: "EXTERNAL_ITEMS",
                content: service.otherSecondLevelOFServices,
                sectionVersionTitle: `${service.resourceTitle.en}-otherSecondLevelOFServices`,
                items: secondLevelOFServices?.map((slug) => ({
                  resourceType: "SUB_PAGE_ITEM",
                  slug: slug,
                })) || [],
              },
            ],
            [],
            [...service.childService]
          );
        }

        const safetyPoliciesSlug = [];
        for (const policy of content.safetyPolicies) {
          const slug = policy.slug;
          safetyPoliciesSlug.push(slug);
          await createResource(
            policy.resourceTitle.en,
            policy.resourceTitle.ar,
            slug,
            "SUB_PAGE",
            "SAFETY_RESPONSIBILITY",
            "CHILD",
            [
              {
                title: `overviewSection`,
                SectionType: "MARKDOWN_CONTENT",
                content: policy.overviewSection,
                sectionVersionTitle: `${policy.resourceTitle.en}-overviewSection`,
              },
              {
                title: `commitmentSection`,
                SectionType: "MARKDOWN_CONTENT",
                content: policy.commitmentSection,
                sectionVersionTitle: `${policy.resourceTitle.en}-commitmentSection`,
              },
              {
                title: `additionalInfoSection`,
                SectionType: "EXTERNAL_ITEMS",
                content: policy.additionalInfoSection,
                sectionVersionTitle: `${policy.resourceTitle.en}-additionalInfoSection`,
              },
            ]
          );
        }

        // 2. Create safetyPage
        await createResource(
          "Safety & Responsibility Page",
          "السلامة: مسؤوليتنا",
          content.safetyPage.slug,
          "MAIN_PAGE",
          "SAFETY_RESPONSIBILITY",
          "PARENT",
          [
            {
              title: "heroSection",
              SectionType: "HERO_BANNER",
              content: content.safetyPage.heroSection,
              sectionVersionTitle: "Safety-heroSection",
            },
            {
              title: "safetyTerms",
              SectionType: "MARKDOWN_CONTENT",
              content: content.safetyPage.safetyTerms,
              sectionVersionTitle: "Safety-heroSection",
              items: safetyPoliciesSlug.map((slug) => ({
                resourceType: "SUB_PAGE",
                slug: slug,
              })),
            },
          ],
          [],
          [...safetyPoliciesSlug]
        );

        // 3. Create History Page
        await createResource(
          "History",
          "تاريخ",
          content.history.slug,
          "MAIN_PAGE",
          "HISTORY",
          "PARENT",
          [
            {
              title: "heroSection",
              SectionType: "HERO_BANNER",
              content: content.history.heroSection,
              sectionVersionTitle: "History-heroSection",
            },
           {
            title: "descriptionSection",
            SectionType: "MARKDOWN_CONTENT",
            content: content.history.descriptionSection,
            sectionVersionTitle: "History-descriptionSection",
           }
          ]
        );


        // 2. Create Footer
        await createResource(
          "Footer",
          "تذييل الصفحة",
          content.footer.slug,
          "FOOTER",
          "FOOTER",
          "PARENT",
          [
            {
              title: "companyInfo",
              SectionType: "FOOTER_COLUMNS",
              content: content.footer.companyInfo,
              sectionVersionTitle: "Footer-companyInfo",
            },
            {
              title: "navColumns",
              SectionType: "FOOTER_COLUMNS",
              content: content.footer.navColumns,
              sectionVersionTitle: "Footer-navColumns",
            },
            {
              title: "contacts",
              SectionType: "FOOTER_COLUMNS",
              content: content.footer.contacts,
              sectionVersionTitle: "Footer-contacts",
            },
            {
              title: "copyright",
              SectionType: "FOOTER_COLUMNS",
              content: content.footer.copyright,
              sectionVersionTitle: "Footer-copyright",
            },
          ]
        );

        // 2. Create Header
        await createResource(
          "Header",
          "رأس الصفحة",
          content.header.slug,
          "HEADER",
          "HEADER",
          "PARENT",
          [
            {
              title: "navItems",
              SectionType: "HEADER_NAV",
              content: content.header.navItems,
              isGlobal: true,
              sectionVersionTitle: "Header-navItems",
            },
            {
              title: "other-buttons",
              SectionType: "EXTRA_KEY",
              content: content.header.otherButtons,
              isGlobal: true,
              sectionVersionTitle: "Header-otherButtons"
            }
          ]
        );

        // 4. Create News & Blogs Page
        await createResource(
          "News & Blogs Page",
          "الأخبار و المدونات",
          content.newsBlogs.slug,
          "MAIN_PAGE",
          "NEWS",
          "PARENT",
          [
            {
              title: "bannerSection",
              SectionType: "HERO_BANNER",
              content: content.newsBlogs.heroSection,
              sectionVersionTitle: "News-bannerSection",
            },
            {
              title: "featuredArticle",
              SectionType: "EXTERNAL_ITEMS",
              content: content.newsBlogs.featuredArticle,
              sectionVersionTitle: "News-featuredArticle",
              items: [
                {
                  resourceType: "SUB_PAGE",
                  slug: newsSlugs[0],
                },
              ],
            },
            {
              title: "latestNewCards",
              SectionType: "EXTERNAL_ITEMS",
              content: content.newsBlogs.latestNewCards,
              sectionVersionTitle: "News-latestNewCards",
              items: newsSlugs.map((slug) => ({
                resourceType: "SUB_PAGE",
                slug: slug,
              })),
            },
            {
              title: "featuredArticle",
              SectionType: "EXTERNAL_ITEMS",
              content: content.newsBlogs.trendingCard,
              sectionVersionTitle: "News-trendingCard",
              items: [
                {
                  resourceType: "SUB_PAGE",
                  slug: newsSlugs[1],
                },
              ],
            },
          ],
          [],
          [...newsSlugs]
        );

        // 8. Create Projects Page
        await createResource(
          "Projects Page",
          "المشاريع الصفحة",
          content.project.slug,
          "MAIN_PAGE",
          "PROJECT",
          "PARENT",
          [
            // sections
            {
              title: "bannerSection",
              SectionType: "HERO_BANNER",
              content: content.project.bannerSection,
              sectionVersionTitle: "Project-bannerSection",
            },
            {
              title: "multiSection",
              SectionType: "MULTI_SECTION",
              content: content.project.multiSection.content,
              sectionVersionTitle: "Project-multiSection",
              sections: content.project.multiSection.sections?.map(
                (section) => ({
                  title: section.title?.en || null,
                  SectionType: "EXTERNAL_ITEMS",
                  content: section,
                  sectionVersionTitle: `Project-${section.title?.en}`,
                  items:
                    section.title?.en === "ALL"
                      ? projectsSlugs.map((slug) => ({
                        resourceType: "SUB_PAGE",
                        slug: slug,
                      }))
                      : section.title?.en === "ONGOING"
                        ? content.projectDetail
                          .filter((project) => project.filter === "ONGOING")
                          .map((project) => ({
                            resourceType: "SUB_PAGE",
                            slug: project.slug,
                          }))
                        : section.title?.en === "COMPLETE"
                          ? content.projectDetail
                            .filter((project) => project.filter === "COMPLETE")
                            .map((project) => ({
                              resourceType: "SUB_PAGE",
                              slug: project.slug,
                            }))
                          : [],
                })
              ),
            },
          ],
          [
            // Filters
            "COMPLETE",
            "ONGOING",
          ],
          [...projectsSlugs]
        );

        // 9. Create Market Page
        await createResource(
          "Market Page",
          "صفحة السوق",
          content.market.slug,
          "MAIN_PAGE",
          "MARKET",
          "PARENT",
          [
            {
              title: "heroSection",
              SectionType: "HERO_BANNER",
              content: content.market.heroSection,
              sectionVersionTitle: "Market-heroSection",
            },
            {
              title: "quoteSection",
              SectionType: "QUOTES",
              content: content.market.quoteSection,
              sectionVersionTitle: "Market-quoteSection",
            },
            {
              title: "marketItemsSection",
              SectionType: "EXTERNAL_ITEMS",
              content: content.market.marketItemsSection,
              sectionVersionTitle: "Market-marketItemsSection",
              items: marketItemSlug.map((slug) => ({
                resourceType: "SUB_PAGE",
                slug: slug,
              })),
            },
            {
              title: "testimonialSection",
              SectionType: "EXTERNAL_ITEMS",
              content: content.market.testimonialSection,
              sectionVersionTitle: "Market-testimonialSection",
              items: testimonialSlug.map((slug) => ({
                resourceType: "SUB_PAGE",
                slug: slug,
              })),
            },
          ],
          [],
          [...marketItemSlug]
        );

        // 11. Create Services Main Page
        await createResource(
          "Services Page",
          "خدمات الصفحة",
          content.services.slug,
          "MAIN_PAGE",
          "SERVICE",
          "PARENT",
          [
            {
              title: "HeroSection",
              SectionType: "HERO_BANNER",
              content: content.services.heroSection,
              sectionVersionTitle: "Services-heroSection",
            },
            {
              title: "serviceCardsSection",
              SectionType: "EXTERNAL_ITEMS",
              content: content.services.serviceCardsSection,
              sectionVersionTitle: "Services-serviceCardsSection",
              items: secondLevelOFServices.map((slug) => ({
                resourceType: "SUB_PAGE",
                slug: slug,
              })),
            },
          ],
          [], // this should be black if no filter is associated with this resource
          [...secondLevelOFServices]
        );

        // 12. Create Solutions Page
        await createResource(
          "Solutions Page",
          "صفحة الحلول",
          content.solution.slug,
          "MAIN_PAGE",
          "SOLUTION",
          "PARENT",
          [
            {
              title: "heroSection",
              SectionType: "HERO_BANNER",
              content: content.solution.heroSection,
              sectionVersionTitle: "Solution-heroSection",
            },
            {
              title: "detailsSection",
              SectionType: "MARKDOWN_CONTENT",
              content: content.solution.detailsSection,
              sectionVersionTitle: "Solution-detailsSection",
            },
            {
              title: "GallerySection",
              SectionType: "GALLERY_GRID",
              content: content.solution.GallerySection,
              sectionVersionTitle: "Solution-GallerySection",
            }
          ]
        );

        // 13. Create About Us Page
        await createResource(
          "About Us Page",
          "من نحن",
          content.aboutUs.slug,
          "MAIN_PAGE",
          "ABOUT",
          "PARENT",
          [
            {
              title: "introSection",
              SectionType: "INTRO_CONTENT",
              content: content.aboutUs.introSection,
              sectionVersionTitle: "About-introSection",
            },
            {
              title: "videoSection",
              SectionType: "MARKDOWN_CONTENT",
              content: content.aboutUs.videoSection,
              sectionVersionTitle: "About-videoSection",
            },
          ]
        );

        // 14. Create Home Page
        await createResource(
          "Home Page",
          "الصفحة الرئيسية",
          content.home.slug,
          "MAIN_PAGE",
          "HOME",
          "PARENT",
          [
            {
              title: "HeroSection",
              SectionType: "HERO_BANNER",
              content: content.home.heroSection,
              sectionVersionTitle: "Home-heroSection",
            },
            {
              title: "aboutUsSection",
              SectionType: "MARKDOWN_CONTENT",
              content: content.home.aboutUsSection,
              sectionVersionTitle: "Home-aboutUsSection",
            },
            {
              title: "serviceSection",
              SectionType: "EXTERNAL_ITEMS",
              content: content.home.serviceSection,
              sectionVersionTitle: "Home-serviceSection",
              items: secondLevelOFServices.map((slug) => ({
                resourceType: "SUB_PAGE",
                slug: slug,
              })),
            },
            {
              title: "experienceSection",
              SectionType: "STATISTICS",
              content: content.home.experienceSection,
              sectionVersionTitle: "Home-experienceSection",
            },
            {
              title: "multiSection",
              SectionType: "MULTI_SECTION",
              content: content.home.multiSection.content,
              sectionVersionTitle: "Home-multiSection",
              sections:
                content.home.multiSection.sections?.map((section) => ({
                  title: section.title?.en || null,
                  SectionType: "EXTERNAL_ITEMS",
                  content: section,
                  sectionVersionTitle: `Home-multiSection-${section.title?.en || null
                    }`,
                  items: eval(section.id).map((slug) => ({
                    resourceType: "SUB_PAGE",
                    slug: slug,
                  })),
                })) || [],
            },
            {
              title: "clientSection",
              SectionType: "CLIENT_LOGOS",
              content: content.home.clientSection,
              sectionVersionTitle: "Home-clientSection",
            },
            {
              title: "testimonialSection",
              SectionType: "EXTERNAL_ITEMS",
              content: content.home.testimonialSection,
              sectionVersionTitle: "Home-testimonialSection",
              items: testimonialSlug.map((slug) => ({
                resourceType: "SUB_PAGE",
                slug: slug,
              })),
            },
            {
              title: "newProjectSection",
              SectionType: "NORMAL_CONTENT",
              content: content.home.newProjectSection,
              sectionVersionTitle: "Home-newProjectSection",
            },
          ]
        );

        console.log("All resources seeded successfully!");
      },
      {
        maxWait: 30000, // 30 seconds max wait time
        timeout: 300000, // 5 minutes transaction timeout
        isolationLevel: "Serializable", // Highest isolation level
      }
    ); // End of transaction
  } catch (error) {
    console.error("Error in main function:", error);
    throw error; // Re-throw to be caught by the outer catch block
  }
} 

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
