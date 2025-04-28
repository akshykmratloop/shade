export default function createContent(content, path, subPath) {

    const currentContent = content?.home?.editVersion?.sections
    const contentIndexes = {
        homeBanner: currentContent?.findIndex(e => e.order === 1),
        markDown: currentContent?.findIndex(e => e.order === 2),
        serviceCards: currentContent?.findIndex(e => e.order === 3),
        statistics: currentContent?.findIndex(e => e.order === 4),
        projectGrid: currentContent?.findIndex(e => e.order === 5),
        clientLogo: currentContent?.findIndex(e => e.order === 6),
        testimonials: currentContent?.findIndex(e => e.order === 7),
        normalContent: currentContent?.findIndex(e => e.order === 8),
    }

    const contentHome = {
        homeBanner: currentContent?.[contentIndexes.homeBanner],
        markDown: currentContent?.[contentIndexes.markDown],
        serviceCards: currentContent?.[contentIndexes.serviceCards],
        statistics: currentContent?.[contentIndexes.statistics],
        projectGrid: currentContent?.[contentIndexes.projectGrid],
        clientLogo: currentContent?.[contentIndexes.clientLogo],
        testimonials: currentContent?.[contentIndexes.testimonials],
        normalContent: currentContent?.[contentIndexes.normalContent],
    }





    switch (path) {
        case "home":
            return { content: contentHome, index: contentIndexes }
            break;

        default:
    }
}