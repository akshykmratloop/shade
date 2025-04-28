import prisma from "../src/config/dbConfig.js";
import content from "./content.json" assert { type: "json" };
import crypto from "crypto";

const sectionTypes = [
  "HERO_BANNER",
  "CARD_GRID",
  "STATISTICS",
  "TESTIMONIALS",
  "CLIENT_LOGOS",
  "CONTACT_FORM",
  "MARKDOWN_CONTENT",
  "SERVICE_CARDS",
  "PROJECT_GRID",
  "TEAM",
  "CLIENTS",
  "MARKETS",
  "CAREER_LISTING",
  "NEWS_FEED",
  "FOOTER_COLUMNS",
  "HEADER_NAV",
  "SERVICE_DETAIL",
  "CAREER_DETAILS",
  "NEWS_DETAIL",
  "CONTACT_INFO",
  "TESTIMONIAL",
  "NORMAL_CONTENT",
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

    async function createResource(
      titleEn,
      titleAr,
      slug,
      resourceType,
      resourceTag,
      relationType,
      sections
    ) {
      if (!Array.isArray(sections)) {
        console.warn(`Sections for resource ${titleEn} is not an array. Using empty array instead.`);
        sections = [];
      }
    
      return await prisma.$transaction(async (tx) => {
        // 1. Create the base resource
        const resource = await tx.resource.create({
          data: {
            titleEn,
            titleAr,
            slug,
            resourceType,
            resourceTag,
            relationType,
            isAssigned: false,
            status: "ACTIVE",
          },
        });
    
        // 2. Create live and edit resource versions
        const liveVersion = await tx.resourceVersion.create({
          data: {
            resourceId: resource.id,
            versionNumber: 1,
            versionStatus: "PUBLISHED",
            notes: "Initial live version",
            content: {},
          },
        });
    
        const editVersion = await tx.resourceVersion.create({
          data: {
            resourceId: resource.id,
            versionNumber: 2,
            versionStatus: "DRAFT",
            notes: "Initial edit version",
            content: {},
          },
        });
    
        // 3. Update the resource with version references
        await tx.resource.update({
          where: { id: resource.id },
          data: {
            liveVersionId: liveVersion.id,
            editModeVersionId: editVersion.id,
          },
        });
    
        // Helper function to create a section and two section versions
        async function createSectionAndVersions(sectionData, parentSectionVersionLiveId = null, parentSectionVersionEditId = null, order = 1, isChild = false) {
          const sectionType = await tx.sectionType.upsert({
            where: { name: sectionData.SectionType },
            update: {},
            create: { name: sectionData.SectionType },
          });
    
          const titleSuffix = isChild ? "-child" : "";
          const uniqueTitle = `${sectionData.title}-${slug}${titleSuffix}-${crypto.randomBytes(2).toString("hex")}`;
    
          // Create one Section
          const section = await tx.section.create({
            data: {
              title: uniqueTitle,
              sectionType: { connect: { id: sectionType.id } },
              isGlobal: sectionData.isGlobal || false,
            },
          });
    
          // Create SectionVersions
          const sectionVersionLive = await tx.sectionVersion.create({
            data: {
              sectionId: section.id,
              resourceId: resource.id,
              resourceVersionId: liveVersion.id,
              version: 1,
              content: sectionData.content,
              sectionVersionTitle: sectionData.sectionVersionTitle || null,
              parentVersionId: parentSectionVersionLiveId,
            },
          });
    
          const sectionVersionEdit = await tx.sectionVersion.create({
            data: {
              sectionId: section.id,
              resourceId: resource.id,
              resourceVersionId: editVersion.id,
              version: 2,
              content: sectionData.content,
              sectionVersionTitle: sectionData.sectionVersionTitle || null,
              parentVersionId: parentSectionVersionEditId,
            },
          });
    
          // Link to ResourceVersionSection
          await tx.resourceVersionSection.create({
            data: {
              order,
              resourceVersionId: liveVersion.id,
              sectionVersionId: sectionVersionLive.id,
            },
          });
    
          await tx.resourceVersionSection.create({
            data: {
              order,
              resourceVersionId: editVersion.id,
              sectionVersionId: sectionVersionEdit.id,
            },
          });
    
          // Create SectionVersionItems if SUB_PAGE items exist
          if (Array.isArray(sectionData.items)) {
            for (let i = 0; i < sectionData.items.length; i++) {
              const item = sectionData.items[i];
              if (item.resourceType === "SUB_PAGE") {
                const linkedResource = await tx.resource.findUnique({ where: { slug: item.slug } });
                if (linkedResource) {
                  await tx.sectionVersionItem.create({
                    data: {
                      order: i + 1,
                      sectionVersionId: sectionVersionLive.id,
                      resourceId: linkedResource.id,
                    },
                  });
                  await tx.sectionVersionItem.create({
                    data: {
                      order: i + 1,
                      sectionVersionId: sectionVersionEdit.id,
                      resourceId: linkedResource.id,
                    },
                  });
                }
              }
            }
          }
    
          // Handle nested child sections
          if (Array.isArray(sectionData.sections)) {
            for (let j = 0; j < sectionData.sections.length; j++) {
              await createSectionAndVersions(
                sectionData.sections[j],
                sectionVersionLive.id,
                sectionVersionEdit.id,
                j + 1,
                true
              );
            }
          }
        }
    
        // 4. Loop through top-level sections
        for (let i = 0; i < sections.length; i++) {
          await createSectionAndVersions(sections[i], null, null, i + 1, false);
        }
    
        return resource;
      }, { timeout: 30000 });
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
    await createResource("Footer", "التذييل", "footer", "FOOTER", "NULL", "PARENT", [
      {
        title: "Footer Content",
        SectionType: "FOOTER_COLUMNS",
        content: content.footer,
        isGlobal: true,
        sectionVersionTitle: "Footer Body",
      },
    ]);

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
      "market",
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

    // 10. Create individual Services first (as subpages)
    const serviceSlugs = [];
    for (const service of content.services.serviceCards) {
      const slug = generateSlug(service.title, "service-");
      serviceSlugs.push(slug);

      await createResource(
        service.title.en,
        service.title.ar,
        slug,
        "SUB_PAGE",
        "SERVICE",
        "CHILD",
        [
          {
            title: `${service.title.en} Details`,
            SectionType: "SERVICE_DETAIL",
            content: service,
            sectionVersionTitle: service.title?.en || null,
          },
        ]
      );
    }
    // 11. Create Services Main Page
    await createResource(
      "Services Page",
      "صفحة الخدمات",
      "services",
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
          content: { serviceCards: content.services.serviceCards },
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
      "solutions",
      "MAIN_PAGE",
      "SOLUTION",
      "PARENT",
      content.solution,
      [
        {
          title: "Solutions Banner",
          SectionType: "HERO_BANNER",
          content: content.solution.banner,
          sectionVersionTitle: content.solution.banner.title?.en || null,
        },
        {
          title: "What We Do",
          SectionType: "MARKDOWN_CONTENT",
          content: content.solution.whatWeDo,
          sectionVersionTitle: content.solution.whatWeDo.title?.en || null,
        },
        {
          title: "How We Do It",
          SectionType: "MARKDOWN_CONTENT",
          content: content.solution.howWeDo,
          sectionVersionTitle: content.solution.howWeDo.title?.en || null,
        },
        {
          title: "Project Gallery",
          SectionType: "PROJECT_GRID",
          content: content.solution.gallery,
          sectionVersionTitle: content.solution.gallery.title?.en || null,
        },
      ]
    );
    // 13. Create About Us Page
    await createResource(
      "About Us Page",
      "صفحة من نحن",
      "about",
      "MAIN_PAGE",
      "ABOUT",
      "PARENT",
      content.aboutUs,
      [
        {
          title: "About Banner",
          SectionType: "HERO_BANNER",
          content: content.aboutUs.main,
          sectionVersionTitle: content.aboutUs.main.title?.en || null,
        },
        {
          title: "Mission Vision",
          SectionType: "CARD_GRID",
          content: content.aboutUs.services,
          sectionVersionTitle: content.aboutUs.services.title?.en || null,
        },
      ]
    );

    // 14. Create Home Page
    await createResource("Home Page", "الصفحة الرئيسية", "home", "MAIN_PAGE", "HOME", "PARENT", [
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
        sectionVersionTitle: content.home.testimonialSection.title?.en || null,
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
    ]);

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
