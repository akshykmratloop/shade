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


    return { content: tempContent, index: tempIndex }
}