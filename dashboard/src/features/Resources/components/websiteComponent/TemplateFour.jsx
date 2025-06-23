import { useSelector } from "react-redux";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
import { Img_url } from "../../../../routes/backend";
import { aboutUsIcons, projectPageData } from "../../../../assets";
import { services } from "../../../../assets";


const TemplateFour = ({ content, screen, language, width, highlight, liveContent }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 738;
    const isLeftAlign = language === 'en';

    // const titleLan = isLeftAlign ? "titleEn" : "titleAr";
    const fontLight = useSelector(state => state.fontStyle.light);

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width);
    const getDynamicSize = (size) => dynamicSize(size, width);

    const tempArr = [1, 2, 3, 4]

    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => "";

    return (
        <div>
            <section
                className={`relative w-full ${isPhone ? "px-8" : ""}
                            ${checkDifference(content?.['1']?.content?.images?.[0]?.url, liveContent?.['1']?.content?.images?.[0]?.url)}
                            flex items-center bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}`}
                style={{
                    backgroundImage: `url("${
                        // Img_url + content?.['1']?.content?.images?.[0]?.url
                        services.contructionTowerImage
                        }")`,
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

                <div className="container relative flex items-center justify-center">
                    <div
                        className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} w-full  flex flex-col 
                                    ${isPhone ? "items-start" : "items-start p-6 space-y-4"} `}
                        style={{
                            padding: (isTablet) && `${getDynamicSize(100)} ${getDynamicSize(110)}`
                        }}
                    >
                        <h2 className={`text-[#292E3D] font-medium ${isPhone ? "text-[40px]" : isTablet ? "text-[45px]" : "text-[45px]"} tracking-[-3px] mb-4
                                                ${checkDifference(content?.['1']?.content?.title?.[language], liveContent?.['1']?.content?.title?.[language])}
                                                `}
                            style={{
                                fontSize: fontSize.mainHeading, lineHeight: fontSize.headingLeading,
                                margin: `${getDynamicSize(16)} 0px`
                            }}
                        >
                            {content?.['1']?.content?.title?.[language] || "Lorem Ipsum"}
                        </h2>
                        <p
                            style={{ fontSize: fontSize.mainPara, lineHeight: fontSize.paraLeading }}
                            className={`text-[#0E172FB2] text-[12px] leading-[26px] ${fontLight} word-spacing-5 ${isPhone ? "w-4/5" : isTablet ? "w-2/3" : "w-1/2"} 
                                                ${checkDifference(content?.['1']?.content?.description?.[language], liveContent?.['1']?.content?.description?.[language])}
                                        `}>
                            {
                                content?.['1']?.content?.description?.[language]
                                || "Discover the exceptional excellence of Shade Corporation, the premier Engineering, Procurement, and Construction powerhouse in Saudi Arabia."
                            }
                        </p>
                    </div>
                </div>
            </section>
        </div>)
}


export default TemplateFour