import prisma from "../src/config/dbConfig.js";
import content from "./content.json" assert { type: "json" };
import crypto from "crypto";

const sectionTypes = [
  "HERO_BANNER",
  "MARKDOWN_CONTENT",
  "SERVICE_CARDS",
  "STATISTICS",
  "PROJECT_GRID",
  "CLIENT_LOGOS",
  "TESTIMONIALS",
  "NORMAL_CONTENT",

  "INTRO_CONTENT",

  "GALLERY_GRID",

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

function generateSlug(input, prefix = "") {
  const randomId = crypto.randomBytes(4).toString("hex");

  const slugify = (str) =>
    `${prefix}${str}`
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "") + `-${randomId}`;

  if (typeof input === "string") {
    return slugify(input);
  }

  if (input?.en) {
    return slugify(input.en);
  }

  if (input?.value?.en) {
    return slugify(input.value.en);
  }

  if (input?.name) {
    return slugify(input.name);
  }

  return `${prefix}untitled-${randomId}`;
}

async function main() {
  try {
    async function createSectionTypes(sectionTypeNames) {
      await Promise.all(
        sectionTypeNames.map(async (name) => {
          const existing = await prisma.sectionType.findUnique({
            where: { name },
          });

          if (!existing) {
            await prisma.sectionType.create({
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

    // Create SectionTypes
    await createSectionTypes(sectionTypes);

    // Helper function to create resources with nested sections
    async function createResource(
      titleEn,
      titleAr,
      slug,
      resourceType,
      resourceTag,
      relationType,
      sections
    ) {
      // Ensure sections is an array
      if (!Array.isArray(sections)) {
        console.warn(
          `Sections for resource ${titleEn} is not an array. Using empty array instead.`
        );
        sections = [];
      }

      // Use transaction to ensure data consistency
      return await prisma.$transaction(
        async (tx) => {
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
              versionStatus: "PUBLISHED",
              notes: "Initial version created",
              content: {},
            },
          });

          // Update resource with live version
          await tx.resource.update({
            where: { id: resource.id },
            data: { liveVersionId: version.id },
          });

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
            const uniqueSectionTitle = `${sectionData.title}-${slug}-${crypto
              .randomBytes(2)
              .toString("hex")}`;
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
                sectionVersionTitle: sectionData.sectionVersionTitle || null,
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
                if (item.resourceType === "SUB_PAGE") {
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
                const uniqueChildSectionTitle = `${
                  childData.title
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
                    sectionVersionTitle: childData.sectionVersionTitle || null,
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
                    if (item.resourceType === "SUB_PAGE") {
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
        },
        {
          // Transaction options - adjust timeout if needed for large datasets
          timeout: 30000, // 30 seconds
        }
      );
    }

    const testimonialSlug = [];
    // 1. Create Testimonials as standalone resources
    for (const testimonial of content.testimonials) {
      const slug = generateSlug(testimonial.name, "testimonial-");
      testimonialSlug.push(slug);

      await createResource(
        `${testimonial.name.en}`,
        `${testimonial.name.ar}`,
        slug,
        "SUB_PAGE",
        "TESTIMONIAL",
        "CHILD",
        [
          {
            title: `testimonialBodySection`,
            SectionType: "TESTIMONIAL",
            content: testimonial,
            sectionVersionTitle: testimonial.name?.en || null,
          },
        ]
      );
    }

    // 2. Create Footer
    await createResource(
      "Footer",
      "التذييل",
      "footer",
      "FOOTER",
      "FOOTER",
      "PARENT",
      [
        {
          title: "Footer Content",
          SectionType: "FOOTER_COLUMNS",
          content: content.footer,
          isGlobal: true,
          sectionVersionTitle: "Footer Body",
        },
      ]
    );

    // 2. Create Header
    await createResource(
      "Header",
      "الرأس",
      "header",
      "HEADER",
      "HEADER",
      "PARENT",
      [
        {
          title: "Header Content",
          SectionType: "HEADER_NAV",
          content: content.header,
          isGlobal: true,
          sectionVersionTitle: "Header Body",
        },
      ]
    );

    // 3. Create individual News Items first
    const newsSlugs = [];
    //   for (const newsItem of content.newsBlogs.latestNewCards.newsItems) {
    //     const slug = generateSlug(newsItem.title, "news-");

    //     newsSlugs.push(slug);

    //     await createResource(
    //       newsItem.title.en,
    //       newsItem.title.ar,
    //       slug,
    //       "SUB_PAGE",
    //       "NEWS",
    //       "CHILD",
    //       newsItem,
    //       [
    //         {
    //           title: `${newsItem.title.en} Content`,
    //           SectionType: "NEWS_DETAIL",
    //           content: newsItem,
    //         },
    //       ]
    //     );
    //   }

    // 4. Create News & Blogs Page
    await createResource(
      "News & Blogs",
      "الأخبار والمدونات",
      "news",
      "MAIN_PAGE",
      "NEWS",
      "PARENT",
      [
        {
          title: "News Banner",
          SectionType: "HERO_BANNER",
          content: content.newsBlogs.bannerSection,
          sectionVersionTitle:
            content.newsBlogs.bannerSection.title?.en || null,
        },
        {
          title: "Featured Article",
          SectionType: "NEWS_FEED",
          content: content.newsBlogs.mainCard,
          sectionVersionTitle: content.newsBlogs.mainCard.title?.en || null,
          items:
            newsSlugs.length > 0
              ? [
                  {
                    resourceType: "SUB_PAGE",
                    slug: newsSlugs[0], // Link first news item as featured
                  },
                ]
              : [],
        },
        {
          title: "News Grid",
          SectionType: "CARD_GRID",
          content: content.newsBlogs.latestNewCards,
          sectionVersionTitle:
            content.newsBlogs.latestNewCards.title?.en || null,
          items:
            newsSlugs.length > 0
              ? [
                  {
                    resourceType: "SUB_PAGE",
                    slug: newsSlugs[0], // Link first news item as featured
                  },
                ]
              : [],
        },
      ]
    );

    // 5. Create individual Career Posts first
    const careerSlugs = [];
    for (const career of content.career.jobListSection.jobs) {
      const jobTitle = career?.title?.value?.en || "Untitled Job Position";
      const slug = generateSlug(career?.title?.value, "career-");

      careerSlugs.push(slug);
      const randomId = crypto.randomBytes(4).toString("hex");
      await createResource(
        career?.title?.value?.en || `Job Position ${randomId}`,
        career?.title?.value?.ar || `Job Position ${randomId}`,
        slug,
        "SUB_PAGE",
        "CAREER",
        "CHILD",
        career,
        [
          {
            title: `${career.title.en} Details`,
            SectionType: "CAREER_DETAILS",
            content: career,
            sectionVersionTitle: career.title?.en || null,
          },
        ]
      );
    }

    // 6. Create Careers Page
    await createResource(
      "Careers Page",
      "الوظائف",
      "careers",
      "MAIN_PAGE",
      "CAREER",
      "PARENT",
      [
        {
          title: "Careers Banner",
          SectionType: "HERO_BANNER",
          content: content.career.bannerSection,
          sectionVersionTitle: content.career.bannerSection.title?.en || null,
        },
        {
          title: "Jobs List",
          SectionType: "CAREER_LISTING",
          content: content.career.jobListSection,
          sectionVersionTitle: content.career.jobListSection.title?.en || null,
          items:
            careerSlugs.length > 0
              ? careerSlugs.map((slug) => ({
                  resourceType: "SUB_PAGE",
                  slug: slug,
                }))
              : [],
        },
      ]
    );

    // 7. Create Projects
    const projectSlugs = [];
    for (const project of content.projectDetail) {
      const slug = generateSlug(project.introSection?.title, "project-");
      projectSlugs.push(slug);

      await createResource(
        project.introSection.title.en,
        project.introSection.title.ar,
        slug,
        "SUB_PAGE",
        "PROJECT",
        "CHILD",
        [
          {
            title: "Project Intro",
            SectionType: "HERO_BANNER",
            content: project.introSection,
            sectionVersionTitle: project.introSection.title?.en || null,
          },
          {
            title: "Project Details",
            SectionType: "MARKDOWN_CONTENT",
            content: project.descriptionSection,
            sectionVersionTitle: project.descriptionSection.title?.en || null,
          },
          {
            title: "Project Gallery",
            SectionType: "PROJECT_GRID",
            content: project.gallerySection,
            sectionVersionTitle: project.gallerySection.title?.en || null,
          },
        ]
      );
    }

    // 8. Create Projects Page
    await createResource(
      "Projects Page",
      "صفحة المشاريع",
      "projects",
      "MAIN_PAGE",
      "PROJECT",
      "PARENT",
      content.projectsPage,
      [
        {
          title: "Projects Banner",
          SectionType: "HERO_BANNER",
          content: content.projectsPage.bannerSection,
          sectionVersionTitle:
            content.projectsPage.bannerSection.title?.en || null,
        },
        {
          title: "Projects List",
          SectionType: "PROJECT_GRID",
          content: content.projectsPage.projectsSection,
          sectionVersionTitle:
            content.projectsPage.projectsSection.title?.en || null,
          items: projectSlugs.map((slug) => ({
            resourceType: "SUB_PAGE",
            slug: slug,
          })),
        },
      ]
    );



    // 9. Create Market Page
    await createResource(
      "Market Page",
      "صفحة السوق",
      content.market.slug,
      "MAIN_PAGE",
      "MARKET",
      "PARENT",
      content.market,
      [
        {
          title: "Market Banner",
          SectionType: "HERO_BANNER",
          content: content.market.banner,
          sectionVersionTitle: content.market.banner.title?.en || null,
        },
        {
          title: "Market Tabs",
          SectionType: "MARKETS",
          content: content.market.tabSection,
          sectionVersionTitle: content.market.tabSection.title?.en || null,
        },
        {
          title: "Market Testimonials",
          SectionType: "TESTIMONIALS",
          content: content.market.testimonialSection,
          sectionVersionTitle:
            content.market.testimonialSection.title?.en || null,
        },
      ]
    );

    const serviceChildSlugs = [];
    for (const childService of content.thirdLevelOfServices) {
      // const slug = generateSlug(childService.title, "childService-");
      serviceChildSlugs.push(slug);

      await createResource(
        childService.resourceTitle.en,
        childService.resourceTitle.ar,
        childService.slug,
        "SUB_PAGE_ITEM",
        "SERVICE",
        "CHILD",
        [
          {
            title: `Intro Section of child Service`,
            SectionType: "HERO_BANNER",
            content: childService.banner,
            sectionVersionTitle: childService.banner.title?.en || null,
          },
          {
            title: 'ServicePointsGrid1',
            SectionType: "SERVICE_CHILDREN",
            content: childService.ServicePointsGrid1,
            sectionVersionTitle: `ServicePointsGrid1` || null,
          },
          {
            title: 'ServicePointsGrid2',
            SectionType: "SERVICE_CHILDREN",
            content: childService.ServicePointsGrid2,
            sectionVersionTitle: `ServicePointsGrid2` || null,
          },
        ]
      );
    }

    // 10. Create individual Services first (as subpages)
    const serviceSlugs = [];
    for (const service of content.secondLevelOFServices) {
      // const slug = generateSlug(service.title, "service-");
      serviceSlugs.push(service.slug);

      await createResource(
        service.resourceTitle.en,
        service.resourceTitle.ar,
        service.slug,
        "SUB_PAGE",
        "SERVICE",
        "CHILD",
        [
          {
            title: `Intro Section of Service`,
            SectionType: "HERO_BANNER",
            content: service.introSection,
            sectionVersionTitle: service.introSection.title?.en || null,
          },
          {
            title: `Children Services of ${service.resourceTitle.en}`,
            SectionType: "SERVICE_CHILDREN",
            content: service.childrenServices,
            sectionVersionTitle: `Children Services of ${service.resourceTitle.en}` || null,
            items: {
              resourceType: "SUB_PAGE",
              slug: service.childrenServices.childService,
            }
          },
        ]
      );
    }

    
    // 11. Create Services Main Page
    await createResource(
      "Services Page",
      "صفحة الخدمات",
      content.services.slug,
      "MAIN_PAGE",
      "SERVICE",
      "PARENT",
      content.services,
      [
        {
          title: "Services Banner",
          SectionType: "HERO_BANNER",
          content: content.services.banner,
          sectionVersionTitle: content.services.banner.title?.en || null,
        },
        {
          title: "Our Services",
          SectionType: "SERVICE_CARDS",
          content: content.services.serviceCards,
          items: serviceSlugs.map((slug) => ({
            resourceType: "SUB_PAGE",
            slug: slug,
          })),
        },
      ]
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
          title: "Solutions Banner",
          SectionType: "HERO_BANNER",
          content: content.solution.banner,
          sectionVersionTitle: content.solution.banner.title?.en || null,
        },
        {
          title: "Solution Description",
          SectionType: "MARKDOWN_CONTENT",
          content: content.solution.sectionContent,
          sectionVersionTitle: "Solution Description",
        },
        {
          title: "Project Gallery1",
          SectionType: "GALLERY_GRID",
          content: content.solution.gallery1,
          sectionVersionTitle: "Project Gallery1",
        },
        {
          title: "Project Gallery2",
          SectionType: "GALLERY_GRID",
          content: content.solution.gallery2,
          sectionVersionTitle: "Project Gallery2",
        },
      ]
    );

    // 13. Create About Us Page
    await createResource(
      "About Us Page",
      "صفحة من نحن",
      content.aboutUs.slug,
      "MAIN_PAGE",
      "ABOUT",
      "PARENT",
      [
        {
          title: "About Intro",
          SectionType: "INTRO_CONTENT",
          content: content.aboutUs.intro,
          sectionVersionTitle: content.aboutUs.intro.title?.en || null,
        },
        {
          title: "About Video Section",
          SectionType: "MARKDOWN_CONTENT",
          content: content.aboutUs.videoSection,
          sectionVersionTitle: content.aboutUs.videoSection.title?.en || null,
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
          content: content.home.homeBanner,
          sectionVersionTitle: content.home.homeBanner.title?.en || null,
        },
        {
          title: "aboutUsSection",
          SectionType: "MARKDOWN_CONTENT",
          content: content.home.aboutUsSection,
          sectionVersionTitle: content.home.aboutUsSection.title?.en || null,
        },
        {
          title: "serviceSection",
          SectionType: "SERVICE_CARDS",
          content: content.home.serviceSection,
          sectionVersionTitle: content.home.serviceSection.title?.en || null,
          items: serviceSlugs.map((slug) => ({
            resourceType: "SUB_PAGE",
            slug: slug,
          })),
        },
        {
          title: "experienceSection",
          SectionType: "STATISTICS",
          content: content.home.experienceSection,
          sectionVersionTitle: content.home.experienceSection.title?.en || null,
        },
        {
          title: "recentProjectsSection",
          SectionType: "PROJECT_GRID",
          content: content.home.recentProjectsSection,
          sectionVersionTitle: "Recent Projects. Markets & Safety Grid",
          sections:
            content.home.recentProjectsSection.sections?.map((section) => ({
              title: section.title?.en || null,
              SectionType: "PROJECT_GRID",
              content: section,
              sectionVersionTitle: section.title?.en || null,
              items: projectSlugs.map((slug) => ({
                resourceType: "SUB_PAGE",
                slug: slug,
              })),
            })) || [],
        },
        {
          title: "clientSection",
          SectionType: "CLIENT_LOGOS",
          content: content.home.clientSection,
          sectionVersionTitle: content.home.clientSection.title?.en || null,
        },
        {
          title: "testimonialSection",
          SectionType: "TESTIMONIALS",
          content: content.home.testimonialSection,
          sectionVersionTitle:
            content.home.testimonialSection.title?.en || null,
          items: testimonialSlug.map((slug) => ({
            resourceType: "SUB_PAGE",
            slug: slug,
          })),
        },
        {
          title: "newProjectSection",
          SectionType: "NORMAL_CONTENT",
          content: content.home.newProjectSection,
          sectionVersionTitle: content.home.newProjectSection.title?.en || null,
        },
      ]
    );

    console.log("All resources seeded successfully!");
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
