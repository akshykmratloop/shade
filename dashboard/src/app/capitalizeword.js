// export default function capitalizeword(word) {
//     console.log(word)
//     if(typeof(word) === "string"){
//         return word[0].toUpperCase() + word.toLowerCase().slice(1)
//     }
// }

export default function capitalizeWords(str) {
    return str
        .toLowerCase() // Convert the whole string to lowercase
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/(?:^|[\s])\w/g, match => match.toUpperCase()); // Capitalize words
}



export function TruncateText(text, length) {
    if (text.length > (length || 50)) {
        return `${text.slice(0, length || 50)}...`;
    }
    return text;
};