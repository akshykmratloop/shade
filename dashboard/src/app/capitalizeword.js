export default function capitalizeword(word) {
    console.log(word)
    if(typeof(word) === "string"){
        return word[0].toUpperCase() + word.toLowerCase().slice(1)
    }
}