import { useSelector } from "react-redux";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
import { Img_url } from "../../../../routes/backend";

const Organization = ({ language, screen, content, width, highlight, liveContent }) => {
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 700;
    const isPhone = screen < 700;
    const isLeftAlign = language === 'en';
    const fontLight = useSelector(state => state.fontStyle.light)
    const slug = useSelector(state => state.homeContent?.present?.content?.slug)


    const titleLan = isLeftAlign ? "titleEn" : "titleAr";

    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText  ) : () => ""

    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)
    return (
        <div>
            <section
                className={`relative w-full py-[100px] ${isPhone ? "px-8" : "px-10"} bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}`}
                style={{
                    backgroundImage: `url("${Img_url + content?.['1']?.content?.images?.[0]?.url
                        // projectPageData.asphaltWork
                        }")`,
                    backgroundPosition: "bottom",
                    height: isComputer && getDynamicSize(600),
                    padding: isComputer && `${getDynamicSize(100)} ${getDynamicSize(150)}`
                }}
            >
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-end overflow-hidden">
                    <div
                        style={{ width: getDynamicSize(750), height: getDynamicSize(650) }}
                        className="rounded-full bg-white opacity-[.9] blur-[120px] mix-blend-screen"></div>
                </div>

                <div className="container relative h-full flex items-center justify-end "
                >
                    <div
                        className={` 
                            ${isLeftAlign ? 'scale-x-[-1]' : ''} 
                            w-full flex flex-col 
                            ${isPhone ? "items-start" : "items-left space-y-4"} `}
                    >
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
                style={{
                    padding: isComputer && `${getDynamicSize(100)} ${getDynamicSize(150)}`
                }}
                className={`${isPhone ? "px-3 py-10" : "px-10 py-20"}`}
            >
                <div
                    className={`aspect-[1.3/1] border
                                        ${checkDifference(content?.[2]?.content?.chart?.images?.[0]?.url, liveContent?.[2]?.content?.chart?.images?.[0]?.url)}
                        `}
                >
                    <img
                        src={Img_url + content?.[2]?.content?.chart?.images?.[0]?.url}
                        alt={content?.[2]?.content?.chart?.images?.[0]?.altText?.[language]}
                        className="w-full h-full"
                    />
                </div>
            </section>
        </div>
    )
}

export default Organization