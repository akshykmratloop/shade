// export function toCamelCase(str) {
//     if (typeof str !== 'string') return str;
//     return str
//         .toLowerCase()
//         .split('_')
//         .map((word, index) =>
//             index === 0 ? word : word[0].toUpperCase() + word.slice(1)
//         )
//         .join('');
// }

export default function createContent(content) {

    let currentContent = content?.liveModeVersionData?.sections

    // const tempIndex = {}
    const tempContent = {}

    currentContent?.forEach((e, i) => {
        // tempIndex[(e.order)] = i
        tempContent[(e.order)] = currentContent[i]
    })

    return {
        content: tempContent,
        // indexes: tempIndex
    }
}

// section:[{}, {}] => content: {1: {}, 2:{}}

export const Img_url = "https://res.cloudinary.com/dmcxybhjm/image/upload/v1745838647/" 