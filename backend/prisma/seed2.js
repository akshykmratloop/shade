import prisma from "../src/config/dbConfig.js";
import content from "./content.json" assert { type: "json" };

function generateSlug(input, prefix = "") {
  const randomId = Math.random().toString(36).substring(2, 8);

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
  // Helper function to create resources with nested sections
  async function createResource(
    title,
    slug,
    resourceType,
    resourceTag,
    relationType,
    contentData,
    sections
  ) {
    // Create main resource
    const resource = await prisma.resource.create({
      data: {
        title: title,
        slug: slug,
        resourceType: resourceType,
        resourceTag: resourceTag,
        relationType: relationType,
        isAssigned: false,
        status: "ACTIVE",
      },
    });

    // Create initial version
    const version = await prisma.resourceVersion.create({
      data: {
        resourceId: resource.id,
        versionNumber: 1,
        versionStatus: "PUBLISHED",
        notes : "Initial version created",
      },
    });

    // Update resource with live version
    await prisma.resource.update({
      where: { id: resource.id },
      data: { liveVersionId: version.id },
    });

    // Process sections
    for (const [sectionOrder, sectionData] of sections.entries()) {
      // Create section
      const section = await prisma.section.create({
        data: {
          title: sectionData.title,
          SectionType: sectionData.SectionType,
          isGlobal: sectionData.isGlobal || false,
        },
      });

      // Create section version
      const sectionVersion = await prisma.sectionVersion.create({
        data: {
          sectionId: section.id,
          resourceId: resource.id,
          resourceVersionId: version.id,
          version: 1,
          content: sectionData.content,
          heading: sectionData.heading || null,
          description: sectionData.description || null,
        },
      });

      // Link section to resource version
      await prisma.resourceVersionSection.create({
        data: {
          order: sectionOrder + 1,
          resourceVersionId: version.id,
          sectionVersionId: sectionVersion.id,
        },
      });

      // Process section items if they exist
      if (sectionData.items) {
        for (const [itemOrder, item] of sectionData.items.entries()) {
          if (item.resourceType === "SUB_PAGE") {
            const linkedResource = await prisma.resource.findUnique({
              where: { slug: item.slug },
            });

            if (linkedResource) {
              await prisma.sectionVersionItem.create({
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
    }

    return resource;
  }

  // 1. Create Testimonials as standalone resources
  for (const testimonial of content.home.testimonialSection.testimonials) {
    const slug = generateSlug(testimonial.name, "testimonial-");

    await createResource(
      `${testimonial.name.en}`,
      slug,
      "SUB_PAGE",
      "TESTIMONIAL",
      "CHILD",
      testimonial,
      [
        {
          title: `Testimonial from ${testimonial.name}`,
          SectionType: "TESTIMONIAL",
          content: testimonial,
        },
      ]
    );
  }
  // 2. Create Footer
  await createResource(
    "Footer",
    "footer",
    "FOOTER",
    "NULL",
    "PARENT",
    content.footer,
    [
      {
        title: "Footer Content",
        SectionType: "FOOTER_COLUMNS",
        content: content.footer,
        isGlobal: true,
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
    "news",
    "MAIN_PAGE",
    "NEWS",
    "PARENT",
    content.newsBlogs,
    [
      {
        title: "News Banner",
        SectionType: "HERO_BANNER",
        content: content.newsBlogs.bannerSection,
        heading: content.newsBlogs.bannerSection.title?.en || null,
        description: content.newsBlogs.bannerSection.description?.en || null,
      },
      {
        title: "Featured Article",
        SectionType: "NEWS_FEED",
        content: content.newsBlogs.mainCard,
        heading: content.newsBlogs.mainCard.title?.en || null,
        description: content.newsBlogs.mainCard.description?.en || null,
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
        heading: content.newsBlogs.latestNewCards.title?.en || null,
        description: content.newsBlogs.latestNewCards.subtitle?.en || null,
        items: newsSlugs.map((slug) => ({
          resourceType: "SUB_PAGE",
          slug: slug,
        })),
      },
    ]
  );
  // 5. Create individual Career Posts first
  const careerSlugs = [];
  for (const career of content.career.jobListSection.jobs) {
    const jobTitle = career?.title?.value?.en || "Untitled Job Position";
    const slug = generateSlug(career?.title?.value, "career-");

    careerSlugs.push(slug);

    await createResource(
      jobTitle,
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
        },
      ]
    );
  }
  // 6. Create Careers Page
  await createResource(
    "Careers Page",
    "careers",
    "MAIN_PAGE",
    "CAREER",
    "PARENT",
    content.career,
    [
      {
        title: "Careers Banner",
        SectionType: "HERO_BANNER",
        content: content.career.bannerSection,
        heading: content.career.bannerSection.title?.en || null,
        description: content.career.bannerSection.description?.en || null,
      },
      {
        title: "Jobs List",
        SectionType: "CAREER_LISTING",
        content: content.career.jobListSection,
        heading: content.career.jobListSection.title?.en || null,
        description: content.career.jobListSection.subtitle?.en || null,
        items: careerSlugs.map((slug) => ({
          resourceType: "SUB_PAGE",
          slug: slug,
        })),
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
      slug,
      "SUB_PAGE",
      "PROJECT",
      "CHILD",
      project,
      [
        {
          title: "Project Intro",
          SectionType: "HERO_BANNER",
          content: project.introSection,
          heading: project.introSection.title?.en || null,
          description: project.introSection.description?.en || null,
        },
        {
          title: "Project Details",
          SectionType: "MARKDOWN_CONTENT",
          content: project.descriptionSection,
          heading: project.descriptionSection.title?.en || null,
          description: project.descriptionSection.subtitle?.en || null,
        },
        {
          title: "Project Gallery",
          SectionType: "PROJECT_GRID",
          content: project.gallerySection,
          heading: project.gallerySection.title?.en || null,
          description: project.gallerySection.subtitle?.en || null,
        },
      ]
    );
  }
  // 8. Create Projects Page
  await createResource(
    "Projects Page",
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
        heading: content.projectsPage.bannerSection.title?.en || null,
        description: content.projectsPage.bannerSection.description?.en || null,
      },
      {
        title: "Projects List",
        SectionType: "PROJECT_GRID",
        content: content.projectsPage.projectsSection,
        heading: content.projectsPage.projectsSection.title?.en || null,
        description: content.projectsPage.projectsSection.subtitle?.en || null,
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
        heading: content.market.banner.title?.en || null,
        description: content.market.banner.description?.en || null,
      },
      {
        title: "Market Tabs",
        SectionType: "MARKETS",
        content: content.market.tabSection,
        heading: content.market.tabSection.title?.en || null,
        description: content.market.tabSection.subtitle?.en || null,
      },
      {
        title: "Market Testimonials",
        SectionType: "TESTIMONIALS",
        content: content.market.testimonialSection,
        heading: content.market.testimonialSection.title?.en || null,
        description: content.market.testimonialSection.subtitle?.en || null,
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
      slug,
      "SUB_PAGE",
      "SERVICE",
      "CHILD",
      service,
      [
        {
          title: `${service.title.en} Details`,
          SectionType: "SERVICE_DETAIL",
          content: service,
          heading: service.title?.en || null,
          description: service.subtitle?.en || null,
        },
      ]
    );
  }
  // 11. Create Services Main Page
  await createResource(
    "Services Page",
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
        heading: content.services.banner.title?.en || null,
        description: content.services.banner.description?.en || null,
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
        heading: content.solution.banner.title?.en || null,
        description: content.solution.banner.description?.en || null,
      },
      {
        title: "What We Do",
        SectionType: "MARKDOWN_CONTENT",
        content: content.solution.whatWeDo,
        heading: content.solution.whatWeDo.title?.en || null,
        description: content.solution.whatWeDo.subtitle?.en || null,
      },
      {
        title: "How We Do It",
        SectionType: "MARKDOWN_CONTENT",
        content: content.solution.howWeDo,
        heading: content.solution.howWeDo.title?.en || null,
        description: content.solution.howWeDo.subtitle?.en || null,
      },
      {
        title: "Project Gallery",
        SectionType: "PROJECT_GRID",
        content: content.solution.gallery,
        heading: content.solution.gallery.title?.en || null,
        description: content.solution.gallery.subtitle?.en || null,
      },
    ]
  );
  // 13. Create About Us Page
  await createResource(
    "About Us Page",
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
        heading: content.aboutUs.main.title?.en || null,
        description: content.aboutUs.main.description?.en || null,
      },
      {
        title: "Mission Vision",
        SectionType: "CARD_GRID",
        content: content.aboutUs.services,
        heading: content.aboutUs.services.title?.en || null,
        description: content.aboutUs.services.subtitle?.en || null,
      },
    ]
  );
  // 14. Create Home Page
  await createResource(
    "Home Page",
    "home",
    "MAIN_PAGE",
    "HOME",
    "PARENT",
    content.home,
    [
      {
        title: "Home Banner",
        SectionType: "HERO_BANNER",
        content: content.home.homeBanner,
        heading: content.home.homeBanner.title?.en || null,
        description: content.home.homeBanner.description?.en || null,
      },
      {
        title: "About Us",
        SectionType: "MARKDOWN_CONTENT",
        content: content.home.aboutUsSection,
        heading: content.home.aboutUsSection.title?.en || null,
        description: content.home.aboutUsSection.subtitle?.en || null,
      },
      {
        title: "Our Services",
        SectionType: "SERVICE_CARDS",
        content: content.home.serviceSection,
        heading: content.home.serviceSection.title?.en || null,
        description: content.home.serviceSection.subtitle?.en || null,
        items: serviceSlugs.map((slug) => ({
          resourceType: "SUB_PAGE",
          slug: slug,
        })),
      },
      {
        title: "Experience Section",
        SectionType: "STATISTICS",
        content: content.home.experienceSection,
        heading: content.home.experienceSection.title?.en || null,
      },
      {
        title: "Projects Showcase",
        SectionType: "PROJECT_GRID",
        content: content.home.recentProjectsSection,
        heading: content.home.recentProjectsSection.title?.en || null,
        description: content.home.recentProjectsSection.subtitle?.en || null,
      },
      {
        title: "Testimonials",
        SectionType: "TESTIMONIALS",
        content: content.home.testimonialSection,
        heading: content.home.testimonialSection.title?.en || null,
        description: content.home.testimonialSection.subtitle?.en || null,
      },
      {
        title: "New Project CTA",
        SectionType: "CONTACT_FORM",
        content: content.home.newProjectSection,
        heading: content.home.newProjectSection.title?.en || null,
        description: content.home.newProjectSection.subtitle?.en || null,
      },
    ]
  );
  // 15. Create Header
  await createResource(
    "Header",
    "header",
    "HEADER",
    "HEADER",
    "PARENT",
    content.header,
    [
      {
        title: "Main Navigation",
        SectionType: "HEADER_NAV",
        content: content.header,
        isGlobal: true,
      },
    ]
  );

  console.log("All resources seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
