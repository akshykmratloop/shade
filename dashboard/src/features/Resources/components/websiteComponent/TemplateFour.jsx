import { useSelector } from "react-redux";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
import { Img_url } from "../../../../routes/backend";
import { aboutUsIcons, projectPageData } from "../../../../assets";
import { services } from "../../../../assets";


const TemplateFour = ({ content, screen, language, width, highlight, liveContent, purpose }) => {
    const isComputer = screen > 900 || highlight;
    const isTablet = (screen < 900 && screen > 730) && !highlight;
    const isPhone = screen < 738 && !highlight;
    const isLeftAlign = language === 'en';

    // const titleLan = isLeftAlign ? "titleEn" : "titleAr";
    const fontLight = useSelector(state => state.fontStyle.light);

    const fontSize = generatefontSize(defineDevice(screen, highlight), dynamicSize, width);
    const getDynamicSize = (size) => dynamicSize(size, width);

    const tempArr = [1, 2, 3, 4]

    const checkDifference = (purpose ? "" : highlight) ? differentText?.checkDifference?.bind(differentText) : () => "";

    return (
        <div dir={isLeftAlign ? "ltr" : "rtl"}>
            <section
                className={`relative w-full ${isPhone ? "px-8" : ""}
                            ${checkDifference(content?.['1']?.content?.images?.[0]?.url, liveContent?.['1']?.content?.images?.[0]?.url)}
                            flex items-center bg-cover bg-center ${isLeftAlign ? '' : ''}`}
                style={{
                    backgroundImage: `url("${content?.['1']?.content?.images?.[0]?.url ?
                        Img_url + content?.['1']?.content?.images?.[0]?.url :
                        services.contructionTowerImage
                        }")`,
                    backgroundPosition: "bottom",
                    height: isComputer ? getDynamicSize(740) : "80vh",
                    padding: (isComputer || isTablet) && `${getDynamicSize(100)} ${getDynamicSize(150)}`
                }}
            >
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-start overflow-hidden">
                    <div
                        style={{ width: isComputer ? getDynamicSize(750) : "60%", height: getDynamicSize(650) }}
                        className="rounded-full bg-white opacity-[.9] blur-[100px] mix-blend-screen"></div>
                </div>

                <div className="container relative flex items-center justify-center">
                    <div
                        className={` ${isLeftAlign ? '' : ''} w-full  flex flex-col 
                                    ${isPhone ? "items-start" : "items-start p-6 space-y-4"} `}
                        style={{
                            padding: (isTablet) && `${getDynamicSize(100)} ${getDynamicSize(0)}`
                        }}
                    >
                        <h2 className={`text-[#292E3D] font-medium ${isPhone ? "text-[40px]" : isTablet ? "text-[50px]" : "text-[45px]"} tracking-[-3px] mb-4
                                                ${checkDifference(content?.['1']?.content?.title?.[language], liveContent?.['1']?.content?.title?.[language])}
                                                `}
                            style={{
                                fontSize: isComputer && fontSize.mainHeading, lineHeight: fontSize.headingLeading,
                                margin: `${getDynamicSize(16)} 0px`
                            }}
                        >
                            {content?.['1']?.content?.title?.[language] || "Lorem Ipsum"}
                        </h2>
                        <p
                            style={{
                                fontSize: isComputer ? fontSize.mainPara : isTablet ? "14px" : "",
                                lineHeight: isComputer ? fontSize.paraLeading : isTablet ? "px" : ""
                            }}
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

            <section
                style={{
                    padding: (isComputer) ? `${getDynamicSize(100)} ${getDynamicSize(145)}` : isTablet ? "40px 40px" :"40px 20px"
                }}
            >
                <div className={`flex ${isPhone && "flex-col gap-2"}`}
                    style={{
                        gap: (isComputer || isTablet) && getDynamicSize(20)
                    }}
                >
                    <div className=""
                        style={{
                            width: (isComputer) ? getDynamicSize(693) : isTablet ? "60%" : "100%",
                        }}
                    >
                        <img src={
                            content?.[2]?.content?.images?.[0]?.url ?
                                Img_url + content?.[2]?.content?.images?.[0]?.url :
                                projectPageData.asphaltWork
                        } alt=""

                            className={`h-full ${isPhone && "aspect-[1.3/1]"}
                                ${checkDifference(content?.[2]?.content?.images?.[0]?.url, liveContent?.[2]?.content?.images?.[0]?.url)}
                                `}
                        />
                    </div>
                    <div className={`flex flex-col gap-2`}
                        style={{
                            width: isComputer && getDynamicSize(503),
                            gap: (isComputer || isTablet) && getDynamicSize(20)
                        }}
                    >
                        <img src={content?.[2]?.content?.images?.[1]?.url ?
                            Img_url + content?.[2]?.content?.images?.[1]?.url :
                            projectPageData.asphaltWork} alt="" className={`${isPhone?"aspect-[1.3/1]":"aspect-[2/1]"} object-cover object-center
                            ${checkDifference(content?.[2]?.content?.images?.[1]?.url, liveContent?.[2]?.content?.images?.[1]?.url)}
                            `} />
                        <img src={content?.[2]?.content?.images?.[2]?.url ?
                            Img_url + content?.[2]?.content?.images?.[2]?.url :
                            projectPageData.asphaltWork} alt="" className={`${isPhone?"aspect-[1.3/1]":"aspect-[2/1]"} object-cover object-center
                            ${checkDifference(content?.[2]?.content?.images?.[2]?.url, liveContent?.[2]?.content?.images?.[2]?.url)}
                            `} />
                    </div>
                </div>
            </section>

            <section
                className="px-10 py-10"
                style={{
                    padding: (isComputer) ? `${getDynamicSize(0)} ${getDynamicSize(150)}` : isTablet ? "0px 40px" : "0px 20px"
                }}>
                <section className={`flex gap-[10px] ${isPhone ? "flex-col p-1" : ""} justify-between`}>
                    <h2 className={`text-[32px]  leading-[28px]
                                    ${checkDifference(content?.[3]?.content?.title?.[language], liveContent?.[3]?.content?.title?.[language])}
                                    `}
                        style={{
                            fontSize: fontSize.experienceHeading,
                            lineHeight: isComputer ? getDynamicSize(40) : "36px",
                            width: (isComputer) ? getDynamicSize(505) : "276px"
                        }}
                    >
                        {
                            content?.[3]?.content?.title?.[language] ||
                            "Project Description"
                        }
                    </h2>
                    <div className={`text-[9.5px]  ${fontLight}
                                    ${checkDifference(content?.[3]?.content?.description?.[language], liveContent?.[3]?.content?.description?.[language])}
                                    `}
                        style={{
                            fontSize: isComputer ? getDynamicSize(14) : "14px",
                            lineHeight: "100%",
                            width: (isComputer) ? getDynamicSize(530) : "360px"
                        }}
                        dangerouslySetInnerHTML={{
                            __html:
                                content?.[3]?.content?.description?.[language] ||
                                "The scope of work for the project is to demolish, procure and Construct an IT Lab in Al-Midra Tower located in Dhahran."
                        }}
                    />
                </section>
            </section>

            <section
                className={`bg-[#00B9F20A]`}
                style={{
                    padding: (isComputer) ? `${getDynamicSize(25)} ${getDynamicSize(150)}` : isTablet ? "25px 40px" : "20px 20px",
                    margin: (isComputer) ? `${getDynamicSize(100)} ${getDynamicSize(0)}` : isTablet ? "40px 0px" : "40px 0px"
                }}
            >
                <div className="flex-[1] flex flex-col"
                    style={{ gap: getDynamicSize(30) }}
                >
                    <h2 className={`
                    ${checkDifference(content?.['4']?.content?.title?.[language], liveContent?.['4']?.content?.title?.[language])}
                    `}
                        style={{ fontSize: fontSize.aboutMainPara, lineHeight: fontSize.headingLeading }}
                    >
                        {content?.['4']?.content?.title?.[language] ||
                            "Lorem Ipsum"}
                    </h2>

                    <div
                        style={{ fontSize: fontSize.mainPara }}
                        className={`${fontLight} pr-3
                                ${checkDifference(content?.['4']?.content?.description?.[language], liveContent?.['4']?.content?.description?.[language])}
                        `}
                        dangerouslySetInnerHTML={{
                            __html: content?.['4']?.content?.description?.[language] ||
                                "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that dffvdfvf dfj dsiwns vdjjs sssiiijee It is a long established fact that a reader will be distracted by the readable content of a page when fgdgdg It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that dffvdfvf dfj dsiwns vdjjs sssiiijee It is a long established fact that a reader will be distracted by the readable content of a page when fgdgdg It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that dffvdfvf dfj dsiwns vdjjs sssiiijee It is a long established fact that a reader will be distracted by the readable content of a page when fgdgdg"
                        }}
                    />

                </div>
            </section>


            <section
                style={{
                    padding: (isComputer) ? `${getDynamicSize(0)} ${getDynamicSize(148)} ${getDynamicSize(100)}` : isTablet ? "0px 40px 40px" : "20px 20px"
                }}
                className=""
            >

                <div className={`grid ${(isComputer) ? "grid-cols-3" : isTablet ? "grid-cols-2" : "grid-cols-1  gap-10"} p-1
                ${checkDifference(content?.[5]?.content?.cards, liveContent?.[5]?.content?.cards)}
                `}
                    style={{ gap: (isComputer || isTablet) && `${getDynamicSize(36)}` }}
                >
                    {
                        (content?.[5]?.content?.cards || tempArr)?.map((e, i) => {
                            return (
                                <div className="bg-white flex flex-col border rounded-lg"
                                    style={{
                                        padding: isComputer ? `${getDynamicSize(16)}` : getDynamicSize(32),
                                        gap: getDynamicSize(16)
                                    }}
                                    key={i}
                                >
                                    <div className="flex gap-4 items-center"
                                        style={{ gap: (isComputer || isTablet) && getDynamicSize(10) }}
                                    >
                                        <img
                                            src={
                                                // aboutUsIcons.ourGoal
                                                Img_url + e?.images?.[0]?.url
                                            }
                                            alt=""
                                            style={{ width: (isComputer) && getDynamicSize(46) }}
                                            className={`aspect-[1/1] w-[46px]
                                                ${checkDifference(e?.images?.[0]?.url, liveContent?.[5]?.content?.cards?.[i]?.images?.[0]?.url)}
                                                `}
                                        />
                                        <h3
                                            className={`
                                                ${checkDifference(e?.title?.[language], liveContent?.[5]?.content?.cards?.[i]?.title?.[language])}
                                                `}
                                            style={{ fontSize: fontSize.aboutMainPara, lineHeight: isComputer && getDynamicSize(26) }}
                                        >
                                            {e?.title?.[language] || "LOREM"}
                                        </h3>
                                    </div>
                                    <p className={`${fontLight} text-[#718096]
                                                ${checkDifference(e?.description?.[language], liveContent?.[5]?.content?.cards?.[i]?.description?.[language])}
                                    `}
                                        style={{ fontSize: fontSize.mainPara }}
                                    >
                                        {e?.description?.[language] ||
                                            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content"
                                        }
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
        </div >
    )
}


export default TemplateFour