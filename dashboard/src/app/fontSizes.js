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

export const generatefontSize = (condition, fn, w) => {
    let obj = {
        mainHeading: "",
        mainPara: "",
        mainButton: "",

        markDownHead: "",
        markDownPara: "",
        markDownButton: "",

        serviceHeading: "",
        services: "",

        experienceCount: "",
        experienceTitle: "",

        experienceHeading: "",
        experiencePara: "",
        experienceButton: "",

        subProjectTopButton: "",
        subProjectHeadings: "",
        subProjectParas: "",

        subProjectBoxHeading: "",
        subProjectBoxPara: "",

        subProjectButtons: "",

        clientSection: "",
        clientSection: "",

        testimonialsHead: "",
        testimonialsHeading: "",
        testimonialsPosition: "",
        testimonialsQuote: "",
        testimonialsCompany: "",
    }
    if (condition) {
        obj = {
            mainHeading: fn(70, w),
            mainPara: fn(16, w),
            mainButton: fn(18, w),

            markDownHead: fn(36, w),
            markDownPara: fn(15, w),
            markDownButton: fn(70, w),

            serviceHeading: fn(36, w),
            services: fn(20, w),

            experienceCount: fn(40, w),
            experienceTitle: fn(12, w),

            experienceHeading: fn(60, w),
            experiencePara: fn(16, w),
            experienceButton: fn(18, w),

            subProjectTopButton: fn(16, w),
            subProjectHeadings: fn(32, w),
            subProjectParas: fn(16, w),

            subProjectBoxHeading: fn(20, w),
            subProjectBoxPara: fn(16, w),

            subProjectButtons: fn(18, w),

            clientSection: fn(36, w),
            clientSection: fn(36, w),

            testimonialsHead: fn(36, w),
            testimonialsHeading: fn(20, w),
            testimonialsPosition: fn(12, w),
            testimonialsQuote: fn(14, w),
            testimonialsCompany: fn(16, w),
        }
    }
    return obj
}