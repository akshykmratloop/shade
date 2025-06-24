import { useSelector } from "react-redux";
import { Img_url } from "../../../../routes/backend";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
// import { useState } from "react";
// import content from "./content.json"
// import { updateMainContent } from "../../../common/homeContentSlice";
// import { projectPageData } from "../../../../assets/index";
// import { TruncateText } from "../../../../../app/capitalizeword";
// import blueCheckIcon from "../../../../../assets/bluecheckicon.svg"

const History = ({ currentContent, screen, language, width, highlight, liveContent }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 738;
    const isLeftAlign = language === 'en';
    const fontLight = useSelector(state => state.fontStyle.light)

    // const titleLan = isLeftAlign ? "titleEn" : "titleAr";

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)

    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => ""

    return (
        <div className="" dir={isLeftAlign ? "ltr" : "rtl"}>
            <section
                className={`relative w-full ${isPhone ? "px-8" : ""}
                ${checkDifference(currentContent?.['1']?.content?.images?.[0]?.url, liveContent?.['1']?.content?.images?.[0]?.url)}
                flex items-center bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}`}
                style={{
                    backgroundImage: `url("${Img_url + currentContent?.['1']?.content?.images?.[0]?.url}")`,
                    backgroundPosition: "bottom",
                    height: isComputer ? getDynamicSize(600) : "70vh",
                    padding: (isComputer) && `${getDynamicSize(100)} ${getDynamicSize(120)}`
                }}
            >
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-end overflow-hidden">
                    <div
                        style={{ width: getDynamicSize(750), height: getDynamicSize(650) }}
                        className="rounded-full bg-white opacity-[.9] blur-[120px] mix-blend-screen"></div>
                </div>

                <div className="container relative flex items-center justify-center"
                >
                    <div
                        className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} w-full  flex flex-col 
                        ${isPhone ? "items-start" : "items-start p-6 space-y-4"} `}
                        style={{
                            padding: (isTablet) && `${getDynamicSize(100)} ${getDynamicSize(110)}`
                        }}
                    >
                        <h2 className={`text-[#292E3D] font-medium ${isPhone ? "text-[40px]" : isTablet ? "text-[45px]" : "text-[45px]"} tracking-[-3px] mb-4
                                    ${checkDifference(currentContent?.['1']?.content?.title?.[language], liveContent?.['1']?.content?.title?.[language])}
                                    `}
                            style={{
                                fontSize: fontSize.mainHeading, lineHeight: fontSize.headingLeading,
                                margin: `${getDynamicSize(16)} 0px`
                            }}
                        >
                            {currentContent?.['1']?.content?.title?.[language]}
                        </h2>
                        <p
                            style={{ fontSize: fontSize.mainPara, lineHeight: fontSize.paraLeading }}
                            className={`text-[#0E172FB2] text-[12px] leading-[26px] ${fontLight} word-spacing-5 ${isPhone ? "w-4/5" : isTablet ? "w-2/3" : "w-1/2"} 
                                    ${checkDifference(currentContent?.['1']?.content?.description?.[language], liveContent?.['1']?.content?.description?.[language])}
                            `}>
                            {currentContent?.['1']?.content?.description?.[language]}
                        </p>
                    </div>
                </div>
            </section>

            <section className={`flex ${(isPhone || isTablet) && 'flex-col'}`}
                style={{
                    margin: `${isComputer ? getDynamicSize(50) : getDynamicSize(150)} ${getDynamicSize(110)}`,
                    gap: getDynamicSize(120)
                }}
            >
                <div className="flex-[1] flex flex-col"
                    style={{ gap: getDynamicSize(30) }}
                >
                    <h2 className={`
                    ${checkDifference(currentContent?.['2']?.content?.title?.[language], liveContent?.['2']?.content?.title?.[language])}
                    `}
                        style={{ fontSize: fontSize.SnRSubHeading, lineHeight: fontSize.headingLeading }}
                    >
                        {currentContent?.['2']?.content?.title?.[language]}
                    </h2>

                    <div
                        style={{ fontSize: fontSize.mainPara }}
                        className={`${fontLight} pr-3
                                ${checkDifference(currentContent?.['2']?.content?.description?.[language], liveContent?.['2']?.content?.description?.[language])}
                        `}
                        dangerouslySetInnerHTML={{ __html: currentContent?.['2']?.content?.description?.[language] }}
                    />

                </div>

                <div className={`grid ${(isPhone) ? "grid-cols-1" : "grid-cols-2"} py-20 gap-[10px] relative`}
                    style={{ gap: isComputer ? getDynamicSize(30) : getDynamicSize(80), padding: isTablet ? `0px ${getDynamicSize(100)}` : isPhone ? `0px ${getDynamicSize(120)}` : "" }}
                >
                    {
                        isComputer &&
                        <div className={`bg-[#F1F4F9] rounded-lg absolute right-[0%] w-[115%] top-1/2 -translate-y-1/2 h-[40%]  z-[1]`}></div>
                    }
                    {
                        currentContent?.['2']?.content?.images?.map((image, i) => {

                            return (
                                <div className={`flex relative z-[2] ${isTablet && ""}
                                        ${checkDifference(image.url, liveContent?.['2']?.content?.images?.[i]?.url)}
                                `} key={i}>
                                    <img
                                        style={{ aspectRatio: "2/2.2", width: isComputer && getDynamicSize(273), height: isComputer && getDynamicSize(304) }}
                                        className="object-cover w-full"
                                        src={Img_url + image.url} alt={i} />
                                </div>
                            )
                        })
                    }

                </div>
            </section>
        </div >
    );
};

export default History;