// export default function capitalizeword(word) {
//     if(typeof(word) === "string"){
//         return word[0].toUpperCase() + word.toLowerCase().slice(1)
//     }
// }
import { useMemo } from 'react';



/**
 * Custom hook for truncating text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length of the text before truncation
 * @returns {string} - The truncated text with "..." appended if it exceeds maxLength
 */
export const useTruncate = (text, maxLength) => {
  const truncatedText = useMemo(() => {
    if (text.length > maxLength) {
      return `${text?.slice(0, maxLength)}...`;
    }
    return text;
  }, [text, maxLength]);

  return truncatedText;
};

export default function capitalizeWords(str) {
    return str
        .toLowerCase() // Convert the whole string to lowercase
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/(?:^|[\s])\w/g, match => match.toUpperCase()); // Capitalize words
}

export function TruncateText(text, length = 50, locale = "en") {
    if (!text || text.length <= length) return text;

    // Use grapheme segmentation
    const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
    const segments = Array.from(segmenter.segment(text), (s) => s.segment);

    // Handle Arabic specifically by truncating full words
    if (locale.startsWith("ar")) {
        if (segments.length > length) {
            return "\u202B" + segments.slice(0, length).join(" ") + "...\u202C";
        }
    } else {
        // For English and other languages, truncate at character level
        if (text.length > length) {
            return text.slice(0, length) + "...";
        }
    }

    return text;
}