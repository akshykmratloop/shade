// import { useState } from "react";
import { useSelector } from "react-redux";
// import content from "./content.json"
// import { updateMainContent } from "../../../common/homeContentSlice";
import { projectPageData } from "../../../../assets/index";
// import { TruncateText } from "../../../../../app/capitalizeword";
import { Img_url } from "../../../../routes/backend";
import dynamicSize, { defineDevice, generatefontSize } from "../../../../app/fontSizes";
// import blueCheckIcon from "../../../../../assets/bluecheckicon.svg"

const History = ({ currentContent, screen, language, width }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 738;
    const isLeftAlign = language === 'en';
    const fontLight = useSelector(state => state.fontStyle.light)

    const p1 = "Founded in 1992 by a group of committed professionals, today Shade Corporation has a strong workforce of 2,000 employees across different locations. It has always served clients by providing innovative solutions to deliver capital efficiency and project certainty. Since our inception, we have expanded our services from General Contracting to Construction Management, Project Management, Design/Build, and Value Engineering; and have become integral players in the transportation, industrial, and building sectors."
    const p2 = "Shade started as a General Contractor and provided EPC, PM, CM, VE and Design/Built services to clients s such as Aramco, Royal Commission, Ministry of Transportation, SABIC, Maaden, Municipalities, Saudi Bahraini Causeway Authority, Water Directorate, Saudi Electric Company, Saudi Naval Forces, Qatar Petroleum and more."
    const p3 = "Founded in 1992 by a group of committed professionals, today Shade Corporation has a strong workforce of 2,000 employees across different locations. It has always served clients by providing innovative solutions to deliver capital efficiency and project certainty. Since our inception, we have expanded our services from General Contracting to Construction Management, Project Management, Design/Build, and Value Engineering; and have become integral players in the transportation, industrial, and building sectors."
    const p4 = "Shade started as a General Contractor and provided EPC, PM, CM, VE and Design/Built services to clients s such as Aramco, Royal Commission, Ministry of Transportation, SABIC, Maaden, Municipalities, Saudi Bahraini Causeway Authority, Water Directorate, Saudi Electric Company, Saudi Naval Forces, Qatar Petroleum and more."
    const pA = [p1, p2, p3, p4]


    const imageA = [projectPageData.asphaltWork, projectPageData.bridgeAndTunnelForHumair, projectPageData.renovation, projectPageData.nonMetallic]

    const titleLan = isLeftAlign ? "titleEn" : "titleAr";

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)

    return (
        <div className="" dir={isLeftAlign ? "ltr" : "rtl"}>
            <section
                className={`relative w-full py-[100px] ${isPhone ? "px-8" : "px-10"} bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}`}
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
                            {currentContent?.['1']?.content?.title?.[language] ||
                                "Trusted History"
                            }
                        </h2>
                        <p
                            style={{ fontSize: fontSize.mainPara, lineHeight: fontSize.paraLeading }}
                            className={`text-[#0E172FB2] text-[12px] leading-[26px] ${fontLight} word-spacing-5 ${isPhone ? "w-4/5" : isTablet ? "w-2/3" : "w-1/2"} `}>
                            {currentContent?.['1']?.content?.description?.[language] ||
                                "Experience the rich history of Shade Corporation — a legacy of innovation, resilience, and engineering excellence that shaped Saudi Arabia's EPC landscape"
                            }
                        </p>
                    </div>
                </div>
            </section>

            <section className={`flex ${isPhone && 'flex-col'}`}
                style={{
                    margin: `${getDynamicSize(50)} ${getDynamicSize(110)}`,
                    gap: getDynamicSize(120)
                }}
            >
                <div className="flex-[1] flex flex-col"
                    style={{ gap: getDynamicSize(30) }}
                >
                    <h2 className=""
                        style={{ fontSize: fontSize.SnRSubHeading, lineHeight: fontSize.headingLeading }}
                    >
                        {currentContent?.['2']?.content?.title?.[language] ||
                            "Where It All Began"
                        }
                    </h2>

                    <div
                        style={{ fontSize: fontSize.mainPara }}
                        className={`${fontLight} pr-3`}
                        dangerouslySetInnerHTML={{ __html: currentContent?.['2']?.content?.description?.[language] }}
                    />

                </div>

                <div className="grid grid-cols-2 py-20 gap-[10px] relative"
                    style={{ gap: getDynamicSize(30) }}
                >
                    <div className="bg-[#F1F4F9] rounded-lg absolute right-[0%] top-1/2 -translate-y-1/2 h-[40%] w-[115%] z-[1]"></div>
                    {
                        imageA?.map((term, i) => {

                            return (
                                <div className="flex relative z-[2]" key={i}>
                                    <img
                                        width={187}
                                        height={210}
                                        className="object-cover"
                                        src={term} alt={i} />
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