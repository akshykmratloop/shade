// pages/api/resources/create.ts
import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({message: "Method not allowed"});
  }

  try {
    const {
      titleEn,
      titleAr,
      slug,
      resourceType,
      resourceTag,
      relationType,
      sections = [],
      filters = [],
      childResources = [],
    } = req.body;

    // Validate required fields
    if (!titleEn || !slug || !resourceType) {
      return res.status(400).json({error: "Missing required fields"});
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create resource
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

      // Create initial version
      const version = await tx.resourceVersion.create({
        data: {
          resourceId: resource.id,
          versionNumber: 1,
          versionStatus: "LIVE",
          notes: "Initial version created via API",
          content: {},
        },
      });

      // Update resource with live version
      await tx.resource.update({
        where: {id: resource.id},
        data: {liveVersionId: version.id},
      });

      // Connect filters
      for (const filterName of filters) {
        const filter = await tx.filters.findUnique({
          where: {nameEn: filterName},
        });
        if (filter) {
          await tx.resource.update({
            where: {id: resource.id},
            data: {filters: {connect: {id: filter.id}}},
          });
        }
      }

      // Connect child resources
      for (const childSlug of childResources) {
        const child = await tx.resource.findUnique({
          where: {slug: childSlug},
        });
        if (child) {
          await tx.resource.update({
            where: {id: resource.id},
            data: {children: {connect: {id: child.id}}},
          });
        }
      }

      // Process sections
      for (let i = 0; i < sections.length; i++) {
        const sectionData = sections[i];
        await processSection(
          tx,
          sectionData,
          resource.id,
          version.id,
          slug,
          i + 1
        );
      }

      return resource;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Resource creation failed:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}

// Helper function to process sections recursively
async function processSection(
  tx: any,
  sectionData: any,
  resourceId: string,
  versionId: string,
  resourceSlug: string,
  order: number,
  parentVersionId: string | null = null
) {
  // Upsert section type
  const sectionType = await tx.sectionType.upsert({
    where: {name: sectionData.SectionType},
    update: {},
    create: {name: sectionData.SectionType},
  });

  // Create unique section title
  const uniqueTitle = `${sectionData.title}-${resourceSlug}-${crypto
    .randomBytes(2)
    .toString("hex")}`;

  // Create section
  const section = await tx.section.create({
    data: {
      title: uniqueTitle,
      sectionTypeId: sectionType.id,
      isGlobal: sectionData.isGlobal || false,
    },
  });

  // Create section version
  const sectionVersion = await tx.sectionVersion.create({
    data: {
      sectionId: section.id,
      resourceId,
      resourceVersionId: versionId,
      version: 1,
      content: sectionData.content,
      sectionVersionTitle: sectionData.sectionVersionTitle || null,
      parentVersionId,
    },
  });

  // Link to resource version
  await tx.resourceVersionSection.create({
    data: {
      order,
      resourceVersionId: versionId,
      sectionVersionId: sectionVersion.id,
    },
  });

  // Process items
  if (sectionData.items) {
    for (let j = 0; j < sectionData.items.length; j++) {
      const item = sectionData.items[j];
      if (["SUB_PAGE", "SUB_PAGE_ITEM"].includes(item.resourceType)) {
        const linkedResource = await tx.resource.findUnique({
          where: {slug: item.slug},
        });
        if (linkedResource) {
          await tx.sectionVersionItem.create({
            data: {
              order: j + 1,
              sectionVersionId: sectionVersion.id,
              resourceId: linkedResource.id,
            },
          });
        }
      }
    }
  }

  // Process child sections
  if (sectionData.sections) {
    for (let k = 0; k < sectionData.sections.length; k++) {
      await processSection(
        tx,
        sectionData.sections[k],
        resourceId,
        versionId,
        resourceSlug,
        k + 1,
        sectionVersion.id
      );
    }
  }
}
