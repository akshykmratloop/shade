export default function setFontSize(size, width) {
    return `${(width / 1532 * size).toFixed(0)}px`
}

