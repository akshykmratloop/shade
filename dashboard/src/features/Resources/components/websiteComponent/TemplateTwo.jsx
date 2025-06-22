import { useSelector } from "react-redux";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
import { projectPageData, services } from "../../../../assets";
import { Img_url } from "../../../../routes/backend";
import { TruncateText } from "../../../../app/capitalizeword";
import blueCheckIcon from "../../../../assets/bluecheckicon.svg"

const TemplateTwo = ({ content, screen, language, width, highlight, liveContent }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 738;
    const isLeftAlign = language === 'en';

    const titleLan = isLeftAlign ? "titleEn" : "titleAr";
    const fontLight = useSelector(state => state.fontStyle.light)

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)

    const indexStyle = [
        { bg: "#00B9F212", text: "#718096" },
        { bg: "#00B9F236", text: "#718096" },
        { bg: "#53D3FF8C", text: "#718096" },
        { bg: "#00B9F2B2", text: "#718096" },
        { bg: "#00B9F2", text: "#FFFFFF" },
    ]

    const tempArr = [1, 2, 3, 4, 5]

    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => ""

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

            <section style={{
                padding: (isComputer || isTablet) && `${getDynamicSize(100)} ${getDynamicSize(150)}`
            }}>

                <section className={`flex gap-[10px] ${isPhone ? "flex-col p-1" : ""}`}>
                    <h2 className={`text-[32px] flex-1 leading-[28px]
                                                    ${checkDifference(content?.[2]?.content?.title?.[language], liveContent?.[2]?.content?.title?.[language])}
                                                    `}
                        style={{ fontSize: fontSize.experienceHeading, lineHeight: isComputer && getDynamicSize(40) }}
                    >
                        {
                            content?.[2]?.content?.title?.[language] ||
                            "Project Description"
                        }
                    </h2>
                    <div className={`text-[9.5px] flex-1 ${fontLight}
                                    ${checkDifference(content?.[2]?.content?.description?.[language], liveContent?.[2]?.content?.description?.[language])}
                                    `}
                        style={{ fontSize: fontSize.mainPara }}
                        dangerouslySetInnerHTML={{
                            __html:
                                content?.[2]?.content?.description?.[language] ||
                                "The scope of work for the project is to demolish, procure and Construct an IT Lab in Al-Midra Tower located in Dhahran."
                        }}
                    />
                </section>
            </section>

            <section
                style={{
                    padding: (isComputer || isTablet) && `${getDynamicSize(0)} ${getDynamicSize(150)}`
                }}
            >
                <div className={`${isComputer ?"grid grid-cols-5":isTablet? "flex flex-wrap":""}`}
                    style={{
                        gap: (isComputer  || isTablet) && `${getDynamicSize(15)}`
                    }}
                >
                    {tempArr?.map((e, i) => {
                        const colors = i % 5
                        return (
                            <div className={`${fontLight} flex-[1_1_300px] ${(isPhone || isTablet) && "p-4"}`} style={{
                                backgroundColor: indexStyle[colors].bg,
                                color: indexStyle[colors].text,
                                padding: (isComputer) && `${getDynamicSize(15)}`,
                                fontSize: fontSize.mainPara
                            }}>
                                <p
                                    className={`mb-10`}
                                    style={{
                                        marginBottom: (isComputer) && `${getDynamicSize(85)}`,
                                    }}
                                >
                                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using  content
                                </p>
                            </div>
                        )
                    })}
                </div>
            </section>

            <section
                className={`bg-[#00B9F20A]`}
                style={{
                    padding: (isComputer || isTablet) && `${getDynamicSize(100)} ${getDynamicSize(150)}`,
                    margin: (isComputer || isTablet) && `${getDynamicSize(100)} ${getDynamicSize(0)}`
                }}
            >
                <div className="flex flex-col"
                    style={{ gap: (isComputer) && getDynamicSize(100) }}
                >
                    {
                        tempArr.slice(0, 3).map((e, i) => {
                            let odd = i % 2 !== 0
                            return (
                                <article
                                    className={`flex border items-center justify-between relative ${isPhone ? "flex-col" : !odd && "flex-row-reverse"}`}
                                    style={{ gap: getDynamicSize(70) }}
                                    key={i}
                                >
                                    <div className={`${!isPhone && ''} `}
                                        style={{
                                            width: isPhone ? '100%' : isTablet ? "300px" : getDynamicSize(512),
                                        }}
                                    >
                                        <img
                                            src={
                                                projectPageData.aiKhobarTunnel
                                            }
                                            alt=""
                                            style={{
                                                width: isPhone ? '100%' : isTablet ? "300px" : getDynamicSize(512),
                                            }}
                                            className="object-cover aspect-[1/1]"
                                        />
                                    </div>

                                    <div
                                        dir={isLeftAlign ? "ltr" : "rtl"}
                                        style={{
                                            flex: `1 1 ${getDynamicSize(600)}`
                                        }}
                                        className={`flex flex-col flex-[3_1_600px] gap-[13px] items-start justify-center text-[#292E3D]  
                                        ${isPhone ? "py-4 px-[18px]" : "py-4 px-[38px]"}`}>
                                        <h3 className="font-[400] text-[21px]"
                                            style={{
                                                fontSize: fontSize.aboutMainPara
                                            }}
                                        >{TruncateText(e?.[titleLan], 35)} </h3>

                                        {
                                            (
                                                // e.descriptions
                                                tempArr
                                            )?.map((description, i) => {
                                                return (
                                                    <div className="flex items-start"
                                                        style={{
                                                            gap: isPhone ? "4px" : getDynamicSize(8),
                                                            padding: `${getDynamicSize(10)} 0px`
                                                        }}
                                                    >
                                                        <img src={blueCheckIcon} alt="" className="translate-y-[1px]"
                                                            style={{ width: isPhone ? "" : getDynamicSize(20), height: isPhone ? "" : getDynamicSize(20) }} />
                                                        <p className={`font-[300] text-[10px] ${fontLight}`}
                                                            key={i}
                                                            style={{
                                                                fontSize: fontSize.mainPara
                                                            }}>
                                                            {/* {TruncateText(description?.[language], 120)} */}
                                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, modi?
                                                        </p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </article>
                            )
                        })
                    }
                </div>
            </section>

            <section
                style={{
                    padding: (isComputer) && `${getDynamicSize(0)} ${getDynamicSize(150)} ${getDynamicSize(100)}`,
                }}
            >
                <div
                    className="flex"
                    style={{ gap: (isComputer) && getDynamicSize(60) }}
                >
                    <div className="flex flex-col p-1"
                        style={{
                            // flexBasis: (isComputer) && getDynamicSize(304)
                            flex: `1 1 ${getDynamicSize(304)}`
                        }}
                    >
                        <h3
                            style={{ fontSize: fontSize.subProjectHeadings }}
                        >Lorem Ispum</h3>
                        <p
                            className={`${fontLight}`}
                            style={{ fontSize: fontSize.mainPara }}
                        >Shade Corporation boasts a continually growing portfolio of satisfied clients, both global and local, who have derived tremendous benefits from their engagement with us. Our solutions are sought after by companies of all sizes – large, mid-sized, an</p>
                    </div>

                    <div className="flex"
                        style={{
                            gap: (isComputer) && getDynamicSize(10),
                            flex: `1 1 ${getDynamicSize(870)}`
                        }}
                    >
                        {
                            tempArr.slice(0, 3).map((e, i) => {
                                return (
                                    <div>
                                        <img src={projectPageData.developmentOfHo} alt="" className="w-full object-cover aspect-[1/1.8]" />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </section>
        </div >
    )
}

export default TemplateTwo