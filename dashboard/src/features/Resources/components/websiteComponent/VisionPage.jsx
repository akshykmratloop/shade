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

const VisionNMission = ({ currentContent, screen, language, width }) => {
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
                                "Vision / Mission"
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

            <section
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

            </section>

            <section className=" flex gap-10 py-10 px-20">
                <div className="border-b border-[#0E172FB2] relative pr-10 pb-5">
                    <div className="bg-[#0E172FB2] absolute top-0 right-0 h-[90%] w-[.5px]"></div>
                    <div><img src="" alt="" /></div>
                    <h3>VALUES</h3>
                    <p className="text-[10px]">
                        Our core values define the character and shape the culture of our company. They serve as the foundation for how we act, make decisions and interact with our communities.
                    </p>
                </div>
                <div className="border-b border-[#0E172FB2] relative pr-10">
                    <div className="bg-[#0E172FB2] absolute top-0 right-0 h-[90%] w-[.5px]"></div>
                    <div><img src="" alt="" /></div>
                    <h3>VALUES</h3>
                    <p className="text-[10px]">
                        Our core values define the character and shape the culture of our company. They serve as the foundation for how we act, make decisions and interact with our communities.
                    </p>
                </div>
                <div className="border-b border-[#0E172FB2] relative pr-10">
                    <div className="bg-[#0E172FB2] absolute top-0 right-0 h-[90%] w-[.5px]"></div>
                    <div><img src="" alt="" /></div>
                    <h3>VALUES</h3>
                    <p className="text-[10px]">
                        Our core values define the character and shape the culture of our company. They serve as the foundation for how we act, make decisions and interact with our communities.
                    </p>
                </div>
            </section>

            <section className="flex gap-10 px-20">
                <div className="flex flex-col rounded-lg">
                    <h3 style={{ backgroundColor: bg1color[0] }} className="p-3 text-center">
                        Our Vision
                    </h3>
                    <p className="bg-[#F8F8F8] text-[10px] p-4">
                        We strive to be a leader in the EPC Engineering, Procurement, Construction industry with a steadfast commitment to “Building a Stronger Future.”
                    </p>
                </div>
                <div className="flex flex-col rounded-lg">
                    <h3 style={{ backgroundColor: bg1color[1] }} className="p-3 text-center">
                        Our Vision
                    </h3>
                    <p className="bg-[#F8F8F8] text-[10px] p-4">
                        We strive to be a leader in the EPC Engineering, Procurement, Construction industry with a steadfast commitment to “Building a Stronger Future.”
                    </p>
                </div>
                <div className="flex flex-col rounded-lg">
                    <h3 style={{ backgroundColor: bg1color[2] }} className="p-3 text-center">
                        Our Vision
                    </h3>
                    <p className="bg-[#F8F8F8] text-[10px] p-4">
                        We strive to be a leader in the EPC Engineering, Procurement, Construction industry with a steadfast commitment to “Building a Stronger Future.”
                    </p>
                </div>
            </section>

            <section className="flex gap-10 px-20 py-10">
                <div className="flex flex-col rounded-lg">
                    <h3 style={{ backgroundColor: bg2color[0] }} className="p-3 text-center text-white">
                        Our Vision
                    </h3>
                    <p className="bg-[#F8F8F8] text-[10px] p-4">
                        We strive to be a leader in the EPC Engineering, Procurement, Construction industry with a steadfast commitment to “Building a Stronger Future.”
                    </p>
                </div>
                <div className="flex flex-col rounded-lg">
                    <h3 style={{ backgroundColor: bg2color[1] }} className="p-3 text-center text-white">
                        Our Vision
                    </h3>
                    <p className="bg-[#F8F8F8] text-[10px] p-4">
                        We strive to be a leader in the EPC Engineering, Procurement, Construction industry with a steadfast commitment to “Building a Stronger Future.”
                    </p>
                </div>
                <div className="flex flex-col rounded-lg">
                    <h3 style={{ backgroundColor: bg2color[2] }} className="p-3 text-center text-white">
                        Our Vision
                    </h3>
                    <p className="bg-[#F8F8F8] text-[10px] p-4">
                        We strive to be a leader in the EPC Engineering, Procurement, Construction industry with a steadfast commitment to “Building a Stronger Future.”
                    </p>
                </div>
            </section>

        </div >
    );
};

export default VisionNMission;