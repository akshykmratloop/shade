// import { useState } from "react";
import { useSelector } from "react-redux";
// import content from "./content.json"
// import { updateMainContent } from "../../../common/homeContentSlice";
import { services, projectPageData } from "../../../../assets/index";
// import { TruncateText } from "../../../../../app/capitalizeword";
import { Img_url } from "../../../../routes/backend";
import dynamicSize, { defineDevice, generatefontSize } from "../../../../app/fontSizes";
// import blueCheckIcon from "../../../../../assets/bluecheckicon.svg"

// const bg1color = {
//     0: "#EDFAFE",
//     1: "#D8F6FF",
//     2: "#C0F0FF"
// }

const bg2color = {
    0: "#84E2FE",
    1: "#06D5FF",
    2: "#00B9F2"
}

const VisionNMission = ({ currentContent, screen, language, width, liveContent, highlight }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 638;
    const isLeftAlign = language === 'en';
    const fontLight = useSelector(state => state.fontStyle.light)

    const titleLan = isLeftAlign ? "titleEn" : "titleAr";

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)

    return (
        <div className="" dir={isLeftAlign ? "ltr" : "rtl"}>
            <section
                className={`relative border w-full py-[100px] ${isPhone ? "px-8" : "px-10"} bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}`}
                style={{
                    backgroundImage: `url("${Img_url + currentContent?.['1']?.content?.images?.[0]?.url}")`,
                    backgroundPosition: "bottom",
                    height: isComputer && getDynamicSize(600),
                    padding: isComputer && `${getDynamicSize(100)} ${getDynamicSize(90)}`
                }}
            >
                <div className={`absolute inset-0 pointer-events-none z-0 flex items-start ${isLeftAlign ? "justify-end" : "justify-start"} overflow-hidden`}>
                    <div
                        style={{ width: getDynamicSize(750), height: getDynamicSize(650) }}
                        className=" rounded-full bg-white opacity-[.9] blur-[120px] mix-blend-screen"></div>
                </div>

                <div className="container relative h-full flex items-center justify-center "
                >
                    <div
                        className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} ${isPhone ? "w-full" : isTablet ? "w-2/3 " : ""} flex flex-col ${isPhone ? "items-start" : "items-start p-6 space-y-4"} `}>
                        <h2
                            className={`text-[#292E3D] font-medium ${isPhone ? "text-[40px]" : isTablet ? "text-[45px]" : "text-[45px]"} tracking-[-3px] mb-4`}
                            style={{
                                fontSize: fontSize.mainHeading, lineHeight: fontSize.headingLeading,
                                margin: `${getDynamicSize(16)} 0px`
                            }}
                        >
                            {currentContent?.['1']?.content?.title?.[language]}
                        </h2>
                        <p
                            style={{ fontSize: fontSize.mainPara, lineHeight: fontSize.paraLeading }}
                            className={`text-[#0E172FB2] text-[12px] leading-[26px] ${fontLight} word-spacing-5 ${isPhone ? "w-4/5" : isTablet ? "w-2/3" : "w-1/2"} `}>
                            {
                                currentContent?.['1']?.content?.description?.[language]
                            }
                        </p>
                    </div>
                </div>
            </section>

            <section
                style={{ padding: `${getDynamicSize(80)} ${getDynamicSize(112)}` }}
                className={`flex gap-[30px]  ${isPhone ? "flex-col px-[30px]" : ""}`}>
                <h2 className='text-[32px]  flex-1 leading-[28px]'
                    style={{
                        fontSize: fontSize.experienceHeading, lineHeight: fontSize.headingLeading,
                    }}
                >
                    {currentContent?.[2]?.content?.title?.[language]}
                </h2>
                <div className={`text-[9.5px] flex-1 ${fontLight}`}
                    style={{
                        fontSize: fontSize.mainPara,
                    }}
                    dangerouslySetInnerHTML={{
                        __html:
                            currentContent?.[2]?.content?.description?.[language]
                    }} />

            </section>

            <section className={` ${isPhone ? "flex" : "grid grid-cols-3"} gap-10 py-10 px-20`}
                style={{ padding: `${getDynamicSize(60)} ${getDynamicSize(112)}` }}
            >

                {currentContent?.[2]?.content?.cards?.map((card, index) => {

                    return (
                        <div className="border-b border-[#0E172FB2] relative pr-10 pb-5">
                            <div className="bg-[#0E172FB2] absolute top-0 right-0 h-[90%] w-[.5px]"></div>
                            <div>
                                <img src={Img_url + card?.images?.[0]?.url} alt={card?.images?.[0]?.alt?.[language]} />
                            </div>
                            <h3
                                style={{
                                    fontSize: fontSize.subProjectHeadings,
                                }}
                            >
                                {card?.title?.[language]}
                            </h3>
                            <p className={`text-[10px] ${fontLight}`}
                                style={{
                                    fontSize: fontSize.mainPara,
                                }}
                            >
                                {card?.description?.[language]}
                            </p>
                        </div>
                    )
                })}
            </section>

            <section
                style={{
                    padding: `${getDynamicSize(50)} ${getDynamicSize(112)}`,
                    gridTemplateRows: !isPhone && `repeat(${currentContent?.[3]?.content?.cards?.length / 3}, 1fr)`
                }}
                className={`grid grid-cols-3 gap-10 px-20 py-10 ${isPhone && "flex-col"}`}>
                {
                    currentContent?.[3]?.content?.cards?.map((card, index) => {
                        const color = index % 3
                        return (
                            <div className="flex flex-col rounded-lg">
                                <h3 style={{
                                    backgroundColor: bg2color[color],
                                    fontSize: fontSize.cardTitle,
                                    padding: `${getDynamicSize(12)}`
                                }} className="text-center text-white">
                                    {card?.title?.[language]}
                                </h3>
                                <p className={`${fontLight} bg-[#F8F8F8] h-full text-[10px] p-4`}
                                    style={{
                                        fontSize: fontSize.mainPara,
                                    }}
                                >
                                    {card?.description?.[language]}
                                </p>
                            </div>
                        )
                    })
                }
            </section>

        </div >
    );
};

export default VisionNMission;