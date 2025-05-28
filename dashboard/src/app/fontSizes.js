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

export function defineDevice(screen) {
    if (screen > 900) {
        return "computer"
    } else if (screen < 900 && screen > 550) {
        return 'tablet'
    } else {
        return 'phone'
    }
}

// const fontKeys = [
//     "mainHeading", "mainPara", "mainButton",
//     "markDownHead", "markDownPara", "markDownButton",
//     "serviceHeading", "services",
//     "experienceCount", "experienceTitle",
//     "experienceHeading", "experiencePara", "experienceButton",
//     "subProjectTopButton", "subProjectHeadings", "subProjectParas",
//     "subProjectBoxHeading", "subProjectBoxPara",
//     "subProjectButtons",
//     "clientSection",
//     "testimonialsHead", "testimonialsHeading", "testimonialsPosition",
//     "testimonialsQuote", "testimonialsCompany", 'aboutMainPara'
// ];

const fontSizes = {
    computer: {
        // home -- some of them are used in other pages due similarity
        mainHeading: 70, mainPara: 16, mainButton: 18, markDownHead: 36, markDownPara: 15, markDownButton: 70,
        serviceHeading: 36, services: 20, experienceCount: 40, experienceTitle: 12, experienceHeading: 60,
        experiencePara: 16, experienceButton: 18, subProjectTopButton: 16, subProjectHeadings: 32,
        subProjectParas: 16, subProjectBoxHeading: 20, subProjectBoxPara: 16, subProjectButtons: 18,
        clientSection: 36, testimonialsHead: 36, testimonialsHeading: 20, testimonialsPosition: 12,
        testimonialsQuote: 14, testimonialsCompany: 16,
        // about
        aboutMainPara: 26, aboutPaddingX: 150,
        aboutVideoW: 639, aboutVideoH: 457, // video size but not applied to the video
        aboutCardPaddingY: 40, aboutCardPaddingX: 10
    },
    tablet: {
        // home -- some of them are used in other pages due similarity
        mainHeading: 70, mainPara: 16, mainButton: 18, markDownHead: 36, markDownPara: 15, markDownButton: 70,
        serviceHeading: 36, services: 20, experienceCount: 40, experienceTitle: 12, experienceHeading: 60,
        experiencePara: 16, experienceButton: 18, subProjectTopButton: 16, subProjectHeadings: 32,
        subProjectParas: 16, subProjectBoxHeading: 20, subProjectBoxPara: 16, subProjectButtons: 18,
        clientSection: 36, testimonialsHead: 36, testimonialsHeading: 20, testimonialsPosition: 12,
        testimonialsQuote: 14, testimonialsCompany: 16,
        // about
        aboutMainPara: 26, aboutPaddingX: 50,
        aboutVideoW: 639, aboutVideoH: 457, // video size but not applied to the video
        aboutCardPaddingY: 40, aboutCardPaddingX: 30
    },
    phone: {
        // home -- some of them are used in other pages due similarity
        mainHeading: 150, mainPara: 48, mainButton: 50, markDownHead: 36, markDownPara: 15, markDownButton: 70,
        serviceHeading: 36, services: 20, experienceCount: 40, experienceTitle: 12, experienceHeading: 60,
        experiencePara: 50, experienceButton: 18, subProjectTopButton: 16, subProjectHeadings: 32,
        subProjectParas: 16, subProjectBoxHeading: 20, subProjectBoxPara: 16, subProjectButtons: 18,
        clientSection: 90, testimonialsHead: 36, testimonialsHeading: 20, testimonialsPosition: 12,
        testimonialsQuote: 14, testimonialsCompany: 16,
        // about
        aboutMainPara: 70, aboutPaddingX: 20,
        aboutVideoW: 639, aboutVideoH: 457, // video size but not applied to the video
        aboutCardPaddingY: 100, aboutCardPaddingX: 60
    }
};

export const generatefontSize = (condition, fn, w) => {
    const result = {};
    for (const key in fontSizes.computer) {
        result[key] = fn(fontSizes[condition][key], w);
    }
    return result;
};