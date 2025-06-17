// import { useState } from "react";
import { useSelector } from "react-redux";
// import content from "./content.json"
// import { updateMainContent } from "../../../common/homeContentSlice";
// import { TruncateText } from "../../../../../app/capitalizeword";
import { Img_url } from "../../../../routes/backend";
import dynamicSize, { defineDevice, generatefontSize } from "../../../../app/fontSizes";
import blueCheckIcon from "../../../../assets/bluecheckicon.svg"
import { projectPageData } from "../../../../assets/index";


const HSnE = ({ currentContent, screen, language, width }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 638;
    const isLeftAlign = language === 'en';
    const fontLight = useSelector(state => state.fontStyle.light)

    const p1 = "The SHADE HS&E Management Systems is designed and implemented to protect its employees and sub-contractors from unacceptable HS&E risks. This system also safeguards the health, safety and environment of persons not employed by Shade, but could be impacted by the company’s activities."
    const p2 = "The SHADE HS&E Management Systems is designed and implemented to protect its employees and sub-contractors from unacceptable HS&E risks. This system also safeguards the health, safety and environment of persons not employed by Shade, but could be impacted by the company’s activities."
    const p3 = "The SHADE HS&E Management Systems is designed and implemented to protect its employees and sub-contractors from unacceptable HS&E risks. This system also safeguards the health, safety and environment of persons not employed by Shade, but could be impacted by the company’s activities."
    const p4 = "The SHADE HS&E Management Systems is designed and implemented to protect its employees and sub-contractors from unacceptable HS&E risks. This system also safeguards the health, safety and environment of persons not employed by Shade, but could be impacted by the company’s activities."
    const pA = [p1, p2, p3, p4]
    const titleLan = isLeftAlign ? "titleEn" : "titleAr";

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)

    return (
        <div className="" dir={isLeftAlign ? "ltr" : "rtl"}>
            <section
                className={`relative border w-full py-[100px] ${isPhone ? "px-8" : "px-10"} bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}`}
                style={{
                    backgroundImage: `url("${currentContent?.['1']?.content?.images?.[0]?.url ? Img_url + currentContent?.['1']?.content?.images?.[0]?.url : projectPageData.aiKhobarTunnel}")`,
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
                                "HS&E"
                            }
                        </h2>
                        <p
                            style={{ fontSize: fontSize.mainPara, lineHeight: fontSize.paraLeading }}
                            className={`text-[#0E172FB2] text-[12px] leading-[26px] ${fontLight} word-spacing-5 ${isPhone ? "w-4/5" : isTablet ? "w-2/3" : "w-1/2"} `}>
                            {
                                // currentContent?.['1']?.content?.description?.[language] ||
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut lab"
                            }
                        </p>
                    </div>
                </div>
            </section>

            {/* <section
                style={{ padding: `${getDynamicSize(80)} ${getDynamicSize(112)}` }}
                className={`flex gap-[30px]  ${isPhone ? "flex-col px-[30px]" : ""}`}>
                <h2 className='text-[32px]  flex-1 leading-[28px]'>
                    {currentContent?.subBanner?.title?.[language] ||
                        "Lorem ipsum dolor sit."
                    }
                </h2>
                <div className='text-[9.5px] flex-1' dangerouslySetInnerHTML={{
                    __html:
                        currentContent?.subBanner?.description?.[language] ||
                        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti voluptatem pariatur corrupti error ut vero expedita inventore repudiandae nostrum assumenda!"
                }} />

            </section> */}

            <section className={`grid grid-cols-2 gap-x-20 gap-y-5 py-10 px-20`}>
                <div className="relative pr-10 pb-5 flex gap-2">
                    <div className=""><img src={blueCheckIcon} alt="" className="w-[120px] h-[50px]" /></div>
                    <div className="flex flex-col gap-2">
                        <h3>Health</h3>
                        <p className="text-[10px]">
                            Our core values define the character and shape the culture of our company. They serve as the foundation for how we act, make decisions and interact with our communities.
                        </p>
                    </div>
                </div>
                <div className="relative pr-10 pb-5 flex gap-2">
                    <div className=""><img src={blueCheckIcon} alt="" className="w-[120px] h-[50px]" /></div>
                    <div className="flex flex-col gap-2">
                        <h3>Safety</h3>
                        <p className="text-[10px]">
                            Our core values define the character and shape the culture of our company. They serve as the foundation for how we act, make decisions and interact with our communities.
                        </p>
                    </div>
                </div>
                <div className="relative pr-10 pb-5 flex gap-2">
                    <div className=""><img src={blueCheckIcon} alt="" className="w-[120px] h-[50px]" /></div>
                    <div className="flex flex-col gap-2">
                        <h3>Environment</h3>
                        <p className="text-[10px]">
                            Our core values define the character and shape the culture of our company. They serve as the foundation for how we act, make decisions and interact with our communities.
                        </p>
                    </div>
                </div>
            </section>

            <div className="w-[800px] h-[270px] mx-auto">
                <img src={projectPageData.asphaltWork} alt="" className="w-[800px] h-[270px] object-cover object-bottom" />
            </div>

            <section className={`flex gap-5 py-10 px-20 flex-col`}>
                <h2 className="text-[18px]"
                    style={{ lineHeight: fontSize.headingLeading }}
                >
                    {
                        // currentContent?.['2']?.content?.title?.[language] ||
                        "Quality, HSE, and Security is fundamental to our mission"
                    }
                </h2>
                {pA.map((e, i) => {
                    return (
                        <p
                            key={i}
                            style={{ fontSize: fontSize.mainPara }}
                            className={`${fontLight} pr-3`}>
                            {e}
                        </p>
                    )
                })}

            </section>

            <section className={`flex gap-5 px-20 flex-col`}>
                {
                    pA?.map((description, i) => {
                        return (
                            <div className="flex items-start" style={{ gap: isPhone ? "4px" : getDynamicSize(8) }}>
                                <img src={blueCheckIcon} alt="" className="translate-y-[1px]"
                                    style={{ width: isPhone ? "" : getDynamicSize(20), height: isPhone ? "" : getDynamicSize(20) }} />
                                <p className={`font-[300] text-[10px] ${fontLight}`}
                                    key={i}
                                    style={{
                                        fontSize: fontSize.mainPara
                                    }}>
                                    {description}
                                </p>
                            </div>
                        )
                    })
                }
            </section>

        </div >
    );
};

export default HSnE;