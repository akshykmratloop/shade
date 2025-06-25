import { cond } from "lodash"

export default function dynamicSize(size, width) {
    return `${(width / 1532 * size).toFixed(0)}px`
}

export const differentText = {
    highlight1: "outline-green-600 outline outline-[.5px]",
    image: "outline-red-400 outline outline-2",

    checkDifference: function (arg1, arg2, highlight, from) {

        if (Array.isArray(arg1) && Array.isArray(arg2)) {
            if (arg1.length !== arg2.length) return this?.highlight1
            return arg1.some((e, i) => e?.title?.en !== arg2[i]?.title?.en || e?.id !== arg2[i]?.id || e?.titleEn !== arg2[i]?.titleEn) ? this?.highlight1 : ""
        }

        if (arg1 !== arg2) {
            return this?.[highlight] ?? this?.highlight1
        } else return ""
    }
}


export function defineDevice(screen, highlight) {
    if (screen > 900 || highlight) {
        return "computer"
    } else if (screen < 900 && screen > 550 && !highlight) {
        return 'tablet'
    } else {
        return 'phone'
    }
}

const fontSizes = {
    computer: {
        // home -- some of them are used in other pages due similarity
        mainHeading: 70, mainPara: 16, mainButton: 18, markDownHead: 36, markDownPara: 15, markDownButton: 70,
        serviceHeading: 36, services: 20, experienceCount: 40, experienceTitle: 12, experienceHeading: 60,
        experiencePara: 16, experienceButton: 18, subProjectTopButton: 16, subProjectHeadings: 32,
        subProjectParas: 16, subProjectBoxHeading: 20, subProjectBoxPara: 16, subProjectButtons: 18,
        clientSection: 36, testimonialsHead: 36, testimonialsHeading: 20, testimonialsPosition: 12,
        testimonialsQuote: 14, testimonialsCompany: 16, SnRSubHeading: 50, cardTitle: 30,
        // about
        aboutMainPara: 26, aboutPaddingX: 150,
        aboutVideoW: 639, aboutVideoH: 457, // video size but not applied to the video
        aboutCardPaddingY: 40, aboutCardPaddingX: 10,
        // other sizes
        headingLeading: 50, paraLeading: 22
    },
    tablet: {
        // home -- some of them are used in other pages due similarity
        mainHeading: 70, mainPara: 32, mainButton: 30, markDownHead: 36, markDownPara: 15, markDownButton: 70,
        serviceHeading: 50, services: 20, experienceCount: 40, experienceTitle: 12, experienceHeading: 80,
        experiencePara: 16, experienceButton: 18, subProjectTopButton: 16, subProjectHeadings: 55,
        subProjectParas: 16, subProjectBoxHeading: 35, subProjectBoxPara: 16, subProjectButtons: 18,
        clientSection: 36, testimonialsHead: 36, testimonialsHeading: 40, testimonialsPosition: 12,
        testimonialsQuote: 29, testimonialsCompany: 16, SnRSubHeading: 50, cardTitle: 50,
        // about
        aboutMainPara: 45, aboutPaddingX: 50,
        aboutVideoW: 639, aboutVideoH: 457, // video size but not applied to the video
        aboutCardPaddingY: 40, aboutCardPaddingX: 30,
        // other sizes
        headingLeading: 40, paraLeading: 30
    },
    phone: {
        // home -- some of them are used in other pages due similarity
        mainHeading: 150, mainPara: 48, mainButton: 70, markDownHead: 36, markDownPara: 15, markDownButton: 70,
        serviceHeading: 110, services: 20, experienceCount: 40, experienceTitle: 12, experienceHeading: 120,
        experiencePara: 50, experienceButton: 18, subProjectTopButton: 16, subProjectHeadings: 80,
        subProjectParas: 16, subProjectBoxHeading: 70, subProjectBoxPara: 16, subProjectButtons: 18,
        clientSection: 90, testimonialsHead: 36, testimonialsHeading: 60, testimonialsPosition: 12,
        testimonialsQuote: 14, testimonialsCompany: 16, SnRSubHeading: 110, cardTitle: 100,
        // about
        aboutMainPara: 70, aboutPaddingX: 20,
        aboutVideoW: 639, aboutVideoH: 457, // video size but not applied to the video
        aboutCardPaddingY: 100, aboutCardPaddingX: 60,
        // other sizes
        headingLeading: 170, paraLeading: 70
    }
};

export const generatefontSize = (condition, fn, w) => {
    const result = {};
    for (const key in fontSizes.computer) {
        result[key] = fn(fontSizes[condition][key], w);
    }
    return result;
};