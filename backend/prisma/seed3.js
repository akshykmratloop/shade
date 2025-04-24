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

  // Helper function to create resources with nested sections
  async function createResource(
    title,
    slug,
    resourceType,
    resourceTag,
    relationType,
    // contentData,
    sections
  ) {
    // Ensure sections is an array
    if (!Array.isArray(sections)) {
      console.warn(`Sections for resource ${title} is not an array. Using empty array instead.`);
      sections = [];
    }

    // Use transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
      // Create main resource
      const resource = await tx.resource.create({
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
      for (let sectionOrder = 0; sectionOrder < sections.length; sectionOrder++) {
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
        const uniqueSectionTitle = `${sectionData.title}-${slug}-${crypto.randomBytes(2).toString('hex')}`;
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
            heading: sectionData.heading || null,
            description: sectionData.description || null,
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
          for (let itemOrder = 0; itemOrder < sectionData.items.length; itemOrder++) {
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
            const uniqueChildSectionTitle = `${childData.title}-${slug}-child-${crypto.randomBytes(2).toString('hex')}`;
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
                heading: childData.heading || null,
                description: childData.description || null,
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
            if (Array.isArray(childData.items) && childData.items.length > 0) {
              for (let itemOrder = 0; itemOrder < childData.items.length; itemOrder++) {
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
    }, {
      // Transaction options - adjust timeout if needed for large datasets
      timeout: 30000 // 30 seconds
    });
  }

  const testimonialSlug = [];
  // 1. Create Testimonials as standalone resources
  for (const testimonial of content.home.testimonialSection.testimonials) {
    const slug = generateSlug(testimonial.name, "testimonial-");
    testimonialSlug.push(slug);

    await createResource(
      `${testimonial.name.en}`,
      slug,
      "SUB_PAGE",
      "TESTIMONIAL",
      "CHILD",
      [
        {
          title: `testimonialBodySection`,
          SectionType: "TESTIMONIAL",
          content: testimonial,
          heading: testimonial.name?.en || null,
          description: testimonial.quote?.en || null,
        },
      ]
    );
  }

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

  // 14. Create Home Page
  await createResource(
    "Home Page",
    "home",
    "MAIN_PAGE",
    "HOME",
    "PARENT",
    [
      {
        title: "HeroSection",
        SectionType: "HERO_BANNER",
        content: content.home.homeBanner,
        heading: content.home.homeBanner.title?.en || null,
        description: content.home.homeBanner.description?.en || null,
      },
      {
        title: "aboutUsSection",
        SectionType: "MARKDOWN_CONTENT",
        content: content.home.aboutUsSection,
        heading: content.home.aboutUsSection.title?.en || null,
        description: content.home.aboutUsSection.description?.en || null,
      },
      {
        title: "serviceSection",
        SectionType: "SERVICE_CARDS",
        content: content.home.serviceSection,
        heading: content.home.serviceSection.title?.en || null,
        description: null,
        items: serviceSlugs.map((slug) => ({
          resourceType: "SUB_PAGE",
          slug: slug,
        })),
      },
      {
        title: "experienceSection",
        SectionType: "STATISTICS",
        content: content.home.experienceSection,
        heading: content.home.experienceSection.title?.en || null,
        description: content.home.experienceSection.description?.en || null,
      },
      {
        title: "recentProjectsSection",
        SectionType: "PROJECT_GRID",
        content: content.home.recentProjectsSection,
        heading: 'Recent Projects. Markets & Safety Grid',
        description: null,
        sections:
          content.home.recentProjectsSection.sections?.map((section) => ({
            title: section.title?.en || null,
            SectionType: "PROJECT_GRID",
            content: section,
            heading: section.title?.en || null,
            description: section.description?.en || null,
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
        heading: content.home.clientSection.title?.en || null,
        description: content.home.clientSection.subtitle?.en || null,
      },
      {
        title: "testimonialSection",
        SectionType: "TESTIMONIALS",
        content: content.home.testimonialSection,
        heading: content.home.testimonialSection.title?.en || null,
        description: null,
        items: testimonialSlug.map((slug) => ({
          resourceType: "SUB_PAGE",
          slug: slug,
        })),
      },
      {
        title: "newProjectSection",
        SectionType: "NORMAL_CONTENT",
        content: content.home.newProjectSection,
        heading: content.home.newProjectSection.title?.en || null,
        description: content.home.newProjectSection.description?.en || null,
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
