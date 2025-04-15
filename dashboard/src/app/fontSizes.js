const font = {
    mainHead: "text-[70px]",
    mainPara: "text-[16px]",
    button: "text-[18px]",
    subHead: "text-[36px]",
    subPara: "text-[16px]",
    cardHead: "text-[20px]",
    ExperienceHead: "text-[60px]",
    testName: "text-[20px]",
    testContent: "text-[14px]",
    testDesignation: "text-[12px]",
    setFontSize(size) {
        return this[size]
    }
}

export default font

