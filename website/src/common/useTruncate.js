// useTruncate.js
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
      return `${text.slice(0, maxLength)}...`;
    }
    return text;
  }, [text, maxLength]);

  return truncatedText;
};
