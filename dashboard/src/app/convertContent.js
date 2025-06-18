
function transformContentfunction(input) {
    const version = input.editVersion || input.content.liveModeVersionData;

    // Helper function to transform a section (handles nested sections recursively)
    const transformSection = (section) => {
        const formattedSection = {
            sectionId: section.sectionId,
            order: section.order,
            content: section.content,
        };

        // Handle items if they exist
        if (section.items) {
            formattedSection.items = section.items.map((item) => ({
                order: item.order,
                id: item.id,
                resourceType: item.resourceType,
            }));
        }

        // Handle nested sections if they exist
        if (section.sections) {
            formattedSection.sections = section.sections.map(transformSection);
        }

        return formattedSection;
    };

    const formattedContent = {
        resourceId: input.id,
        titleEn: input.titleEn,
        titleAr: input.titleAr,
        slug: input.slug,
        newVersionEditMode: {
            comments: version.comments,
            referenceDoc: version.referenceDoc,
            content: version.content,
            icon: version.icon,
            image: version.image,
            sections: version.sections.map(transformSection),
        },
    };

    return formattedContent;
}

export default function transformContent(rawData) {
    try {
        const transformed = transformContentfunction(rawData);
        console.log(`File successfully transformed`);
        return transformed
    } catch (error) {
        console.error("Error:", error.message);
    }
}


export function baseTransform(obj) {
    return ({
        titleEn: obj.titleEn,
        titleAr: obj.titleAr,
        slug: obj.slug,
        resourceType: obj.resourceType,
        resourceTag: obj.resourceTag,
        relationType: obj.relationType,
        parentId: obj.parentId,
        filters: [],
        icon: obj.editVersion.icon,
        image: obj.editVersion.image,
        referenceDoc: obj.editVersion.referenceDoc,
        comments: obj.editVersion.comments,
        sections: obj.editVersion.sections
    })
}