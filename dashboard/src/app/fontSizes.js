export default function dynamicSize(size, width) {
    return `${(width / 1532 * size).toFixed(0)}px`
}

export const differentText = {
    highlight1: "border-green-600 border",

    checkDifference: function (arg1, arg2, highlight) {
        console.log(this)

        if (arg1 !== arg2) {
            return this?.[highlight] ?? this?.highlight1
        } else return ""
    }
} 