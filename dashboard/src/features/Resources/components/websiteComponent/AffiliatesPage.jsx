// import { useState } from "react";
import { useSelector } from "react-redux";
// import content from "./content.json"
// import { updateMainContent } from "../../../common/homeContentSlice";
import { services, projectPageData } from "../../../../assets/index";
// import { TruncateText } from "../../../../../app/capitalizeword";
import { Img_url } from "../../../../routes/backend";
import dynamicSize, { defineDevice, generatefontSize } from "../../../../app/fontSizes";
// import blueCheckIcon from "../../../../../assets/bluecheckicon.svg"

const bg1color = {
    0: "#EDFAFE",
    1: "#D8F6FF",
    2: "#C0F0FF"
}

const bg2color = {
    0: "#84E2FE",
    1: "#06D5FF",
    2: "#00B9F2"
}

const AffiliatesPage = ({ currentContent, screen, language, width }) => {
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
                    padding: isComputer && `${getDynamicSize(100)} ${getDynamicSize(120)}`
                }}
            >
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
                    <div
                        style={{ width: getDynamicSize(750), height: getDynamicSize(650) }}
                        className=" rounded-full bg-white opacity-[.9] blur-[120px] mix-blend-screen"></div>
                </div>

                <div className="container relative h-full flex items-center justify-center "
                >
                    <div
                        className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} ${isPhone ? "w-full" : isTablet ? "w-2/3 text-center" : "text-center"} flex flex-col ${isPhone ? "items-start" : "items-center p-6 space-y-4"} `}>
                        <h2 className={`text-[#292E3D] font-medium ${isPhone ? "text-[40px]" : isTablet ? "text-[45px]" : "text-[45px]"} tracking-[-3px] mb-4`}
                            style={{
                                fontSize: fontSize.mainHeading, lineHeight: fontSize.headingLeading,
                                margin: `${getDynamicSize(16)} 0px`
                            }}
                        >
                            {
                                // currentContent?.['1']?.content?.title?.[language] ||
                                "Affiliates"
                            }
                        </h2>
                        <p
                            style={{ fontSize: fontSize.mainPara, lineHeight: fontSize.paraLeading }}
                            className={`text-[#0E172FB2] text-[12px] leading-[26px] ${fontLight} word-spacing-5 ${isPhone ? "w-4/5" : isTablet ? "w-2/3" : "w-1/2"} `}>
                            {
                                // currentContent?.['1']?.content?.description?.[language] ||
                                "Experience the rich history of Shade Corporation — a legacy of innovation, resilience, and engineering excellence that shaped Saudi Arabia's EPC landscape"
                            }
                        </p>
                    </div>
                </div>
            </section>

   

        </div >
    );
};

export default AffiliatesPage;