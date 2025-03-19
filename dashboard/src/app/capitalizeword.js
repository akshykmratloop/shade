export default function capitalizeword(word) {
    console.log(word)
    if(typeof(word) === "string"){
        return word[0].toUpperCase() + word.toLowerCase().slice(1)
    }
}

export function TruncateText (text, length) {
    if (text.length > (length || 50)) {
        return `${text.slice(0, length || 50)}...`;
    }
    return text;
};