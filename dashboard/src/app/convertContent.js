
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

// processFile();



// export default function transformContent(input) {
//     if (!input || !input.editVersion) return null;

//     const { editVersion } = input;

//     // Transform sections
//     const transformedSections = editVersion.sections.map(section => {
//         const baseSection = {
//             sectionId: section.sectionId,
//             order: section.order,
//             content: section.content
//         };

//         // Handle different section types
//         switch (section.order) {
//             case 3:
//                 return {
//                     ...baseSection,
//                     items: section.items ? section.items.map(item => ({
//                         resourceType: "SUB_PAGE",
//                         order: item.order,
//                         id: item.id
//                     })) : []
//                 };

//             case 5:
//                 // Handle nested sections in PROJECT_GRID
//                 if (section.sections) {
//                     return {
//                         ...baseSection,
//                         content: section.content,
//                         sections: section.sections.map(subSection => ({
//                             sectionId: subSection.sectionId,
//                             order: subSection.order,
//                             content: subSection.content,
//                             items: subSection.items ? subSection.items.map(item => ({
//                                 resourceType: "SUB_PAGE",
//                                 order: item.order,
//                                 id: item.id
//                             })) : []
//                         }))
//                     };
//                 }
//                 return baseSection;

//             case 7:
//                 return {
//                     ...baseSection,
//                     items: section.items ? section.items.map(item => ({
//                         resourceType: "SUB_PAGE",
//                         order: item.order,
//                         id: item.id
//                     })) : []
//                 };

//             default:
//                 return baseSection;
//         }
//     });

//     // Create the transformed content
//     const transformedContent = {
//         resourceId: input.id,
//         titleEn: input.titleEn,
//         titleAr: input.titleAr,
//         slug: input.slug,
//         resourceType: input.resourceType,
//         resourceTag: input.resourceTag,
//         relationType: input.relationType,
//         newVersionEditMode: {
//             versionStatus: "",
//             comments: "",
//             referenceDoc: "",
//             content: editVersion.content,
//             icon: editVersion.icon,
//             image: editVersion.image,
//             sections: transformedSections
//         }
//     };

//     return transformedContent;
// }