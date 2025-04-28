export default function transformContent(input) {
    if (!input || !input.editVersion) return null;

    const { editVersion } = input;

    // Transform sections
    const transformedSections = editVersion.sections.map(section => {
        const baseSection = {
            sectionId: section.sectionId,
            order: section.order,
            content: section.content
        };

        // Handle different section types
        switch (section.SectionType) {
            case 'SERVICE_CARDS':
                return {
                    ...baseSection,
                    items: section.items ? section.items.map(item => ({
                        resourceType: "SUB_PAGE",
                        order: item.order,
                        id: item.id
                    })) : []
                };

            case 'PROJECT_GRID':
                // Handle nested sections in PROJECT_GRID
                if (section.sections) {
                    return {
                        ...baseSection,
                        content: section.content,
                        sections: section.sections.map(subSection => ({
                            sectionId: subSection.sectionId,
                            order: subSection.order,
                            content: subSection.content,
                            items: subSection.items ? subSection.items.map(item => ({
                                resourceType: "SUB_PAGE",
                                order: item.order,
                                id: item.id
                            })) : []
                        }))
                    };
                }
                return baseSection;

            case 'TESTIMONIALS':
                return {
                    ...baseSection,
                    items: section.items ? section.items.map(item => ({
                        resourceType: "SUB_PAGE",
                        order: item.order,
                        id: item.id
                    })) : []
                };

            default:
                return baseSection;
        }
    });

    // Create the transformed content
    const transformedContent = {
        content: {
            resourceId: input.id,
            titleEn: input.titleEn,
            titleAr: input.titleAr,
            slug: input.slug,
            resourceType: input.resourceType,
            resourceTag: input.resourceTag,
            relationType: input.relationType,
            newVersionEditMode: {
                versionStatus: "",
                comments: "",
                referenceDoc: "",
                content: editVersion.content,
                icon: editVersion.icon,
                image: editVersion.image,
                sections: transformedSections
            }
        }
    };

    return transformedContent;
}