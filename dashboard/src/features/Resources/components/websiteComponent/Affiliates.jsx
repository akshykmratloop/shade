import { useSelector } from "react-redux";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
import { projectPageData } from "../../../../assets";
import { Img_url } from "../../../../routes/backend";

const AffiliatesPage = ({ language, screen, content, width, highlight, liveContent }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 700;
    const isPhone = screen < 700;
    const isLeftAlign = language === 'en';
    const fontLight = useSelector(state => state.fontStyle.light)
    // const slug = useSelector(state => state.homeContent?.present?.content?.slug)


    const titleLan = isLeftAlign ? "titleEn" : "titleAr";

    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => ""

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)

    return (
        <div>
            <section
                className={`relative w-full h-[70vh] py-[100px] ${isPhone ? "px-8" : "px-10"} bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}
                ${checkDifference(content?.['1']?.content?.images?.[0]?.url, liveContent?.['1']?.content?.images?.[0]?.url)}
                `}
                style={{
                    backgroundImage: `url("${Img_url + content?.['1']?.content?.images?.[0]?.url
                        // projectPageData.asphaltWork
                        }")`,
                    backgroundPosition: "bottom",
                    height: isComputer && getDynamicSize(600),
                    padding: isComputer && `${getDynamicSize(100)} ${getDynamicSize(150)}`
                }}
                dir={isLeftAlign?"ltr":"rtl"}
            >

                <div className={`absolute inset-0 pointer-events-none z-0 flex items-center border ${isLeftAlign ? 'scale-x-[-1]' : ''} justify-start overflow-hidden`}>
                    <div
                        style={{ width: isComputer ? getDynamicSize(750) : isTablet ? getDynamicSize(1200) : getDynamicSize(1200), height: isComputer && getDynamicSize(650) }}
                        className="rounded-full bg-white opacity-[.9] blur-[160px] mix-blend-screen h-[60vh]"></div>
                </div>

                <div className="container relative h-full flex items-center justify-end "
                >
                    <div
                        className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} w-full flex flex-col ${isPhone ? "items-start" : "space-y-4"} `}>
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
                className={`${isPhone ? "px-8" : isTablet ? "px-10" : ""} py-10`}
                style={{
                    padding: isComputer && `${getDynamicSize(60)} ${getDynamicSize(150)}`
                }}
            >
                <div className={`grid ${isPhone ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-3"} gap-[20px]
                ${checkDifference(content?.[2]?.content?.cards, liveContent?.[2]?.content?.cards)}
                `}>
                    {content?.[2]?.content?.cards?.map((card, i) => {
                        return (
                            <div key={i}
                                className={`aspect-[1.2/1]
                                ${checkDifference(card?.images?.[0]?.url, liveContent?.[2]?.content?.cards?.[i]?.images?.[0]?.url)} 
                                    `}
                                style={{}}
                            >
                                <img
                                    src={Img_url + card?.images?.[0]?.url}
                                    alt={card?.images?.[0]?.text?.[language]}
                                    className={`h-full`}
                                />
                            </div>
                        )
                    })}
                </div>
            </section>

        </div>
    )
}

export default AffiliatesPage