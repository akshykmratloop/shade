import { useSelector } from "react-redux";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../../app/fontSizes";
import { Img_url } from "../../../../../routes/backend";
import ProjectDetailPage from "./ProjectDetails";
import { projectPageData } from "../../../../../assets";
import { TruncateText } from "../../../../../app/capitalizeword";

const MarketDetails = ({ language, content, screen, width, highlight, liveContent }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 738;
    const isLeftAlign = language === 'en';
    const fontLight = useSelector(state => state.fontStyle.light)
    const slug = useSelector(state => state.homeContent?.present?.content?.slug)


    const titleLan = isLeftAlign ? "titleEn" : "titleAr";

    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => ""

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)

    return (
        <div dir={isLeftAlign ? "ltr" : "rtl"}>
            <section
                className={`relative w-full py-[100px] ${isPhone ? "px-8" : "px-10"} bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}`}
                style={{// image
                    backgroundImage: `url("${
                        // Img_url + content?.['1']?.content?.images?.[0]?.url
                        projectPageData.asphaltWork
                        }")`,
                    backgroundPosition: "bottom",
                    height: isComputer && getDynamicSize(600),
                    padding: isComputer && `${getDynamicSize(100)} ${getDynamicSize(150)}`
                }}
            >
                {/* banner gradient */}
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-end overflow-hidden">
                    <div
                        style={{ width: getDynamicSize(750), height: getDynamicSize(650) }}
                        className="rounded-full bg-white opacity-[.9] blur-[120px] mix-blend-screen"></div>
                </div>
                {/* banner Text */}
                <div className="container relative h-full flex items-center justify-end"
                >
                    <div
                        className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} ${isPhone ? "w-full" : isTablet ? "" : ""} flex flex-col ${isPhone ? "items-start" : " space-y-4"} `}>
                        <h2 className={`text-[#292E3D] font-medium ${isPhone ? "text-[40px]" : isTablet ? "text-[45px]" : "text-[45px]"} tracking-[-3px] mb-4
                                    ${checkDifference(content?.['1']?.content?.title?.[language], liveContent?.['1']?.content?.title?.[language])}
                        `}
                            style={{
                                fontSize: fontSize.mainHeading, lineHeight: fontSize.headingLeading,
                                margin: `${getDynamicSize(16)} 0px`
                            }}
                        >
                            {content?.['1']?.content?.title?.[language]}
                        </h2>
                        <p
                            style={{ fontSize: fontSize.mainPara, lineHeight: fontSize.paraLeading }}
                            className={`text-[#0E172FB2] text-[12px] leading-[26px] ${fontLight} word-spacing-5 ${isPhone ? "w-4/5" : isTablet ? "w-2/3" : "w-1/2"}
                                    ${checkDifference(content?.['1']?.content?.description?.[language], liveContent?.['1']?.content?.description?.[language])}
                            `}>
                            {content?.['1']?.content?.description?.[language]}
                        </p>
                    </div>
                </div>
            </section>

            <section
                className={`relative w-full ${isPhone ? "px-10 py-10 pb-5" : "px-10"} bg-cover bg-center`}
                style={{
                    padding: (isComputer || isTablet) && `${getDynamicSize(60)} ${getDynamicSize(120)}`
                }}
            >
                {/* sub heading text */}
                <section className={`flex gap-[30px] ${isPhone ? "flex-col" : ""}`}>
                    <h2 className={`text-[32px] flex-1 leading-[28px]
                        ${checkDifference(content?.[2]?.content?.title?.[language], liveContent?.[2]?.content?.title?.[language])}
                        `}
                        style={{ fontSize: fontSize.serviceHeading, lineHeight: isComputer && getDynamicSize(35) }}
                    >{content?.[2]?.content?.title?.[language]}</h2>
                    <div className={`text-[9.5px] flex-1
                        ${checkDifference(content?.[2]?.content?.description?.[language], liveContent?.[2]?.content?.description?.[language])}
                        `}
                        style={{ fontSize: fontSize.mainPara }}
                        dangerouslySetInnerHTML={{ __html: content?.[2]?.content?.description?.[language] }} />
                </section>
            </section>

            <section dir={isLeftAlign ? 'ltr' : 'rtl'}
                className={`${isPhone ? "py-[80px] pb-16 " : isTablet ? "" : ""} ${isTablet ? "px-[60px]" : isPhone ? "px-[40px]" : ""} `}
                style={{
                    padding: isComputer && `${getDynamicSize(10)} ${getDynamicSize(120)}`
                }}
            >
                <div
                    style={{
                        gap: isComputer ? getDynamicSize(20) : isTablet ? getDynamicSize(50) : getDynamicSize(100),
                    }}
                    className={`grid ${isPhone ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-3"} gap-x-[28px] gap-y-10 auto-rows-fr
                                ${checkDifference(content?.['2']?.content?.points, liveContent?.['2']?.content?.points)}
                            `}>

                    {content?.['2']?.content?.points?.map((service, idx) => {
                        return (
                            <article
                                key={idx}
                                className="flex flex-col h-full bg-white \ overflow-hidden shadow"
                            >
                                <img
                                    src={service.images?.[0]?.url ? (Img_url + service.images?.[0]?.url) : projectPageData.swccWaterSupply}
                                    alt="img"
                                    className="w-full aspect-[2.1/1] object-cover"
                                />
                                <section className="bg-[#F8F8F8] py-[14px] px-[18px] flex flex-col  flex-1">
                                    <h1 className={`text-[#292E3D] text-[22px] font-[400]
                                            ${checkDifference(service?.title?.[language], liveContent?.['2']?.content?.points?.[idx]?.service?.title?.[language])}
                                            `}
                                        style={{ fontSize: fontSize.aboutMainPara }}
                                    >
                                        {TruncateText(service?.title?.[language], isTablet ? 15 : 23)}
                                    </h1>
                                    <p className={`text-[#292E3D] ${fontLight} text-[10px] mb-2
                                            ${checkDifference(service?.description?.[language], liveContent?.['2']?.content?.points?.[idx]?.service?.description?.[language])}
                                            `}
                                        style={{ fontSize: fontSize.mainPara }}
                                    >
                                        {service?.description?.[language]}
                                    </p>
                                </section>
                            </article>
                        )
                    })}
                </div>
            </section >

            <section style={{
                padding: `${getDynamicSize(60)} 0px`
            }}>
                <h3
                    className={`text-[#292E3D] font-[400] ${isPhone ? "mx-5 py-4" : ""}`}
                    style={{
                        fontSize: fontSize.aboutMainPara,
                        margin: `0px ${getDynamicSize(76)}`,
                        padding: (isComputer || isTablet) && `${getDynamicSize(10)} 0px`
                    }}
                >
                    Other Markets
                </h3>
                <section className={`overflow-x-scroll rm-scroll py-5 pt-2
                    ${(checkDifference(content?.['3']?.items, liveContent?.['3']?.items))}
                `}
                    style={{
                        padding: `${getDynamicSize(20)}`,
                        paddingBottom: `${getDynamicSize(60)}`,
                    }}
                >
                    <section
                        dir={isLeftAlign ? 'ltr' : 'rtl'}
                        className={`flex gap-7 ${isPhone ? "px-[38px] flex-col" : ""} pr-[38px] w-fit items-stretch`}
                        style={{
                            padding: isComputer ? `0px ${getDynamicSize(76)}` : isTablet ? `0px ${getDynamicSize(76)}` : "",
                            width: "fit-content"
                        }}
                    >
                        {
                            (content?.['3']?.items || [])?.map((service, idx) => {
                                if (service.slug === slug) return null
                                return (
                                    <article
                                        key={idx}
                                        className="flex flex-col bg-white overflow-hidden shadow"
                                        style={{ width: isComputer ? getDynamicSize(437) : isTablet ? getDynamicSize(600) : "" }}
                                    >
                                        <img src={
                                            // Img_url+service.image 
                                            projectPageData.businessGate
                                        } alt="img"
                                            className="w-full object-cover"
                                            style={{ height: isComputer ? getDynamicSize(210) : isTablet ? getDynamicSize(400) : "" }}
                                        />
                                        <section className="bg-[#F8F8F8] flex flex-col justify-between flex-1 px-4 py-5"
                                            style={{
                                                padding: (isComputer || isTablet) && `${getDynamicSize(16)} ${getDynamicSize(25)}`,
                                                gap: isComputer ? getDynamicSize(10) : getDynamicSize(25)
                                            }}
                                        >
                                            <h1 className="text-[#292E3D] text-[22px] font-[400]"
                                                style={{ fontSize: fontSize.aboutMainPara, lineHeight: getDynamicSize(30) }}
                                            >
                                                {TruncateText(service?.[titleLan], isTablet ? 18 : 20)}
                                            </h1>
                                        </section>
                                    </article>
                                )
                            })}
                    </section>
                </section>
            </section>
        </div >
    )
}

export default MarketDetails