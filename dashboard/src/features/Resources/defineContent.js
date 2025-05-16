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
        tempIndex[toCamelCase(e.order)] = i
        tempContent[toCamelCase(e.order)] = currentContent[i]
    })


    return { content: tempContent, indexes: tempIndex }
}