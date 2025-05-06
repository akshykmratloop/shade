import { toCamelCase } from "../../app/capitalizeword"

export default function createContent(content, purpose, path, subPath) {


    let currentContent = []
    if (purpose === "edit") {
        currentContent = content?.content?.editVersion?.sections
    } else {
        currentContent = content?.editVersion?.sections
    }

    const tempIndex = {}
    const tempContent = {}

    currentContent?.forEach((e, i) => {
        tempIndex[toCamelCase(e.SectionType)] = i
        tempContent[toCamelCase(e.SectionType)] = currentContent[i]
        console.log(toCamelCase(e.SectionType))
    })

    // const contentIndexes = {
    //     homeBanner: currentContent?.findIndex(e => e.order === 1),
    //     markDown: currentContent?.findIndex(e => e.order === 2),
    //     serviceCards: currentContent?.findIndex(e => e.order === 3),
    //     statistics: currentContent?.findIndex(e => e.order === 4),
    //     projectGrid: currentContent?.findIndex(e => e.order === 5),
    //     clientLogo: currentContent?.findIndex(e => e.order === 6),
    //     testimonials: currentContent?.findIndex(e => e.order === 7),
    //     normalContent: currentContent?.findIndex(e => e.order === 8),
    // }

    // const contentHome = {
    //     homeBanner: currentContent?.[contentIndexes.homeBanner],
    //     markDown: currentContent?.[contentIndexes.markDown],
    //     serviceCards: currentContent?.[contentIndexes.serviceCards],
    //     statistics: currentContent?.[contentIndexes.statistics],
    //     projectGrid: currentContent?.[contentIndexes.projectGrid],
    //     clientLogo: currentContent?.[contentIndexes.clientLogo],
    //     testimonials: currentContent?.[contentIndexes.testimonials],
    //     normalContent: currentContent?.[contentIndexes.normalContent],
    // }



    console.log(tempContent)
    // console.log(contentHome)


    return { content: tempContent, index: tempIndex }
    // switch (path) {
    //     case "home":
    //         break;

    //     default:
    // }
}