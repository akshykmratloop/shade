export default function dynamicSize(size, width) {
    return `${(width / 1532 * size).toFixed(0)}px`
}

export const differentText = {
    highlight1: "border-green-600 border",

    checkDifference: function (arg1, arg2, highlight) {
        if (Array.isArray(arg1) && Array.isArray(arg2)) {
            return arg1.forEach((e, i) => e.id === arg2[i].id)
        }

        if (arg1 !== arg2) {
            return this?.[highlight] ?? this?.highlight1
        } else return ""
    }
}


const fontKeys = [
    "mainHeading", "mainPara", "mainButton",
    "markDownHead", "markDownPara", "markDownButton",
    "serviceHeading", "services",
    "experienceCount", "experienceTitle",
    "experienceHeading", "experiencePara", "experienceButton",
    "subProjectTopButton", "subProjectHeadings", "subProjectParas",
    "subProjectBoxHeading", "subProjectBoxPara",
    "subProjectButtons",
    "clientSection",
    "testimonialsHead", "testimonialsHeading", "testimonialsPosition",
    "testimonialsQuote", "testimonialsCompany"
];

const fontSizes = {
    mainHeading: 70,
    mainPara: 16,
    mainButton: 18,
    markDownHead: 36,
    markDownPara: 15,
    markDownButton: 70,
    serviceHeading: 36,
    services: 20,
    experienceCount: 40,
    experienceTitle: 12,
    experienceHeading: 60,
    experiencePara: 16,
    experienceButton: 18,
    subProjectTopButton: 16,
    subProjectHeadings: 32,
    subProjectParas: 16,
    subProjectBoxHeading: 20,
    subProjectBoxPara: 16,
    subProjectButtons: 18,
    clientSection: 36,
    testimonialsHead: 36,
    testimonialsHeading: 20,
    testimonialsPosition: 12,
    testimonialsQuote: 14,
    testimonialsCompany: 16
};

export const generatefontSize = (condition, fn, w) => {
    const result = {};
    for (const key of fontKeys) {
        result[key] = condition ? fn(fontSizes[key], w) : "";
    }
    return result;
};