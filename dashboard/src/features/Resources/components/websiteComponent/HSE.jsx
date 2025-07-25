import { useSelector } from "react-redux";

import { Img_url } from "../../../../routes/backend";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
import blueCheckIcon from "../../../../assets/bluecheckicon.svg"
import { projectPageData } from "../../../../assets/index";


const HSnE = ({ currentContent, screen, language, width, highlight, liveContent }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 638;
    const isLeftAlign = language === 'en';
    const fontLight = useSelector(state => state.fontStyle.light)

    const titleLan = isLeftAlign ? "titleEn" : "titleAr";

    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => ""


    const fontSize = generatefontSize(defineDevice(screen, highlight), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)

    return (
        <div className="" dir={isLeftAlign ? "ltr" : "rtl"}>
            <section
                className={`relative border w-full py-[100px] ${isPhone ? "px-8" : "px-10"} bg-cover bg-center ${isLeftAlign ? '' : ''}`}
                style={{
                    backgroundImage: `url("${currentContent?.['1']?.content?.images?.[0]?.url ? Img_url + currentContent?.['1']?.content?.images?.[0]?.url : projectPageData.aiKhobarTunnel}")`,
                    backgroundPosition: "bottom",
                    height: isComputer ? getDynamicSize(600) : isTablet ? getDynamicSize(700) : getDynamicSize(1200),
                    padding: (isComputer || isTablet) && `${getDynamicSize(100)} ${getDynamicSize(150)}`
                }}
            >
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-start overflow-hidden">
                    <div
                        style={{ width: getDynamicSize(750), height: getDynamicSize(650) }}
                        className=" rounded-full bg-white opacity-[.9] blur-[120px] mix-blend-screen"
                    ></div>
                </div>

                <div className="container relative h-full flex items-center justify-end "
                >
                    <div
                        className={`${isLeftAlign ? '' : ''} ${isPhone ? "w-full" : isTablet ? "" : "w-full"} flex flex-col ${isPhone ? "items-start" : "items-start space-y-4"} `}>
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


            <section className={`grid ${isPhone ? "grid-cols-1 p-10" : "grid-cols-2"} gap-x-20 gap-y-5 ${isTablet ? "p-10" : ""}`}
                style={{
                    padding: (isComputer) && `${getDynamicSize(100)} ${getDynamicSize(150)}`,
                    gap: `${getDynamicSize(40)} ${getDynamicSize(20)}`
                }}
            >
                {
                    currentContent?.[2]?.content?.cards?.map((card, i) => {

                        return (
                            <div className={`relative ${isComputer && "pr-10"}  pb-5 flex gap-2`} key={i}>
                                <div className={`${isTablet&& "w-[80px]"}`}
                                    style={{
                                        width: (isComputer) && getDynamicSize(83),
                                        padding: `0px ${isComputer && getDynamicSize(12)} 0px 0px`
                                    }}
                                >
                                    <img src={Img_url + card?.images?.[0]?.url} alt="" className={`w-[120px] h-[50px]`} />
                                </div>
                                <div className="flex flex-col gap-2"
                                style={{width: (isTablet) && getDynamicSize(500)}}
                                >
                                    <h3 className={`text-[#292E3D]
                                        ${checkDifference(card?.title?.[language], liveContent?.[2]?.content?.cards?.[i]?.title?.[language])}
                                        `} style={{ fontSize: fontSize.subProjectHeadings }}>{card?.title?.[language]}</h3>
                                    <p className={`text-[10px] text-[#718096] ${fontLight}
                                        ${checkDifference(card?.description?.[language], liveContent?.[2]?.content?.cards?.[i]?.description?.[language])}
                                    `} style={{ fontSize: fontSize.mainPara }}>
                                        {card?.description?.[language]}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </section>

            <div className="w-full"
                style={{
                    padding: (isComputer || isTablet) && `0px ${getDynamicSize(150)}`
                }}
            >
                <img
                    src={Img_url + currentContent?.[2]?.content?.images?.[0]?.url} alt=""
                    className={`w-full ${isPhone ? "aspect-[2/1.5]" : "aspect-[2.88/1]"} object-cover object-bottom
                    ${checkDifference(currentContent?.[2]?.content?.images?.[0]?.url, liveContent?.[2]?.content?.images?.[0]?.url)}
                    `}
                />
            </div>

            <section className={`flex gap-5 py-10 px-10 flex-col`}
                style={{
                    padding: isComputer && `${getDynamicSize(100)} ${getDynamicSize(150)} ${getDynamicSize(50)}`
                }}
            >
                <h2 className={`text-[18px]
                ${checkDifference(currentContent?.['2']?.content?.title?.[language], liveContent?.['2']?.content?.title?.[language])}
                `}
                    style={{
                        lineHeight: fontSize.headingLeading,
                        fontSize: fontSize.aboutMainPara
                    }}
                >
                    {
                        currentContent?.['2']?.content?.title?.[language]
                    }
                </h2>
                <div
                    style={{ fontSize: fontSize.mainPara, lineHeight: fontSize.paraLeading }}
                    className={`text-[#718096] text-[12px] ${fontLight}
                        ${checkDifference(currentContent?.['2']?.content?.description?.[language], liveContent?.['2']?.content?.description?.[language])}
                    `}
                    dangerouslySetInnerHTML={{ __html: currentContent?.['2']?.content?.description?.[language] }}
                >
                    {/* {currentContent?.['2']?.content?.description?.[language]} */}
                </div>
                {/* {currentContent?.['2']?.content?.sectionPointers?.map((e, i) => {
                    return (
                        <p
                            key={i}
                            style={{ fontSize: fontSize.mainPara }}
                            className={`${fontLight} pr-3 text-[#718096]`}>
                            {e?.text?.[language]}
                        </p>
                    )
                })} */}

            </section>

            <section className={`flex gap-5 px-7 py-5 pb-10 flex-col`}
                style={{
                    padding: (isComputer || isTablet) && `${getDynamicSize(50)} ${getDynamicSize(150)} ${getDynamicSize(100)}`
                }}
            >
                {
                    currentContent?.['2']?.content?.sectionPointers?.map((description, i) => {
                        return (
                            <div className="flex items-start" style={{ gap: isPhone ? "4px" : getDynamicSize(8) }}>
                                <img src={blueCheckIcon} alt="" className="translate-y-[1px]"
                                    style={{ width: isPhone ? "" : getDynamicSize(20), height: isPhone ? "" : getDynamicSize(20) }} />
                                <p className={`font-[300] text-[#718096] text-[10px] ${fontLight}
                                        ${checkDifference(description?.text?.[language], liveContent?.[2]?.content?.sectionPointers?.[i]?.text?.[language])}
                                        `}
                                    key={i}
                                    style={{
                                        fontSize: fontSize.mainPara
                                    }}>
                                    {description?.text?.[language]}
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