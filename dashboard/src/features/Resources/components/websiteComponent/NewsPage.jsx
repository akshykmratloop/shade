import { newsBlogs } from "../../../../assets/index";
// import Arrow from "../../../../assets/icons/right-wrrow.svg";
import { TruncateText } from "../../../../app/capitalizeword";
import { Img_url } from "../../../../routes/backend";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
import { useSelector } from "react-redux";


const NewsBlogspage = ({ language, screen, content, highlight, liveContent, width }) => {
    const isComputer = screen > 1100
    const isLeftAlign = language === 'en'
    const titleLan = isLeftAlign ? "titleEn" : "titleAr"
    const isPhone = screen < 760
    const isTablet = screen > 760 && screen < 900
    const banner = content?.['1']?.content
    const mainCard = content?.['2']?.items?.[0]
    const latestNews = content?.['3']?.items;
    const trendingCard = content?.['4']?.items?.[0];
    const liveBanner = liveContent?.['1']?.content
    const liveMainCard = liveContent?.['2']?.items?.[0]
    const liveLatestNews = liveContent?.['3']?.items;
    const liveTrendingCard = liveContent?.['4']?.items?.[0];

    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => ""


    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)
    const fontLight = useSelector(state => state.fontStyle.light)

    return (
        <div dir={isLeftAlign ? "ltr" : "rtl"}>
            {/**Banner Section */}
            <section className={`relative px-5 w-full bg-cover bg-center `}
                style={{
                    height: isComputer ? getDynamicSize(715) : "500px",
                    backgroundImage: `url("${Img_url + content?.['1']?.content?.images?.[0]?.url}")`,
                }}>
                <div className="absolute inset-0 pointer-events-none z-[0] flex items-center justify-start overflow-hidden">
                    <div
                        style={{ width: (isTablet || isPhone) ? "60%" : getDynamicSize(850), height: (isTablet || isPhone) ? "60%" : getDynamicSize(650) }}
                        className="rounded-full bg-white opacity-[.9] blur-[120px] mix-blend-screen"></div>
                </div>
                <div
                    className={`${isTablet && "py-[200px]"} container h-full relative ${isPhone ? "px-10" : ""} flex items-center`}
                    style={{
                        padding: (isComputer || isTablet) && `0px ${getDynamicSize(150)}`,
                    }}
                >
                    <div
                        className={`flex flex-col ${isLeftAlign ? 'right-5 ' : 'left-5'} 
                                    ${isPhone ? "max-w-[90%]" : isTablet ? "max-w-[70%]" : "max-w-[50%]"} w-full`}
                    >
                        <h1 className={`text-[#292E3D] ${isPhone ? "text-3xl" : "text-[50px] leading-[77px] tracking-[-3.5px]"} font-medium  mb-4
                        ${checkDifference(banner?.title?.[language], liveBanner?.title?.[language])}
                        `}
                            style={{ fontSize: fontSize.mainHeading, lineHeight: (isComputer || isTablet) && fontSize.headingLeading }}
                        >
                            {banner?.title?.[language]}
                        </h1>
                        <p
                            style={{ fontSize: fontSize.mainPara, width: isComputer ? getDynamicSize(674) : "", lineHeight: isComputer && getDynamicSize(28) }}
                            className={`text-[#0E172FB3] 
                                ${checkDifference(banner?.description?.[language], liveBanner?.description?.[language])}
                            ${(isPhone || isTablet) ? "leading-[120%] bank-light" : "leading-[28px]"} text-sm font-semibold w-[70%] mb-6 word-spacing-5`} dir={isLeftAlign ? "ltr" : "rtl"}>
                            {banner?.description?.[language]}
                        </p>
                    </div>
                </div>
            </section>

            {/** main card */}
            {!mainCard?.id ? "" :
                <section className={`${isPhone ? 'px-4 py-16' : "px-[100px]"} 
                        ${checkDifference(mainCard?.title?.[language], liveMainCard?.title?.[language])}                
                `}
                    style={{
                        padding: (isComputer || isTablet) && `${getDynamicSize(100)} ${getDynamicSize(170)} ${getDynamicSize(50)}`,
                    }}
                >
                    <div className="container">
                        <div className={`flex  ${!isLeftAlign && "flex-row-reverse text-right"} 
                            ${isTablet || isPhone ? "flex-col-reverse" : ""} 
                            justify-center mx-auto rounded-md border border-gray-300 bg-white shadow-md shadow-gray-200`}>
                            <div className="p-[30px] flex flex-col justify-center">
                                <h2 title={mainCard?.title?.[language]}
                                    style={{ fontSize: fontSize.aboutMainPara }}
                                    className="text-[#292E3D] text-[20px] font-bold mb-4">
                                    {TruncateText(mainCard?.[titleLan], 26)}
                                </h2>
                                <div
                                    style={{ fontSize: fontSize.mainPara }}
                                    title={mainCard?.description?.[language]}
                                    className={`text-xs text-[rgba(0,26,88,0.51)] ${fontLight} leading-[22px] mb-6`}
                                    dangerouslySetInnerHTML={{ __html: TruncateText(mainCard?.description?.[language], 180) }}
                                >
                                </div>
                                <div className="flex items-center justify-between gap-5">
                                    <h6
                                        style={{ fontSize: fontSize.mainPara }}
                                        className={`text-[12px] text-gray-600 ${fontLight}`}>
                                        {mainCard?.date?.[language]}
                                    </h6>
                                    <button
                                        style={{ fontSize: fontSize.mainPara }}
                                        className="text-[14px] text-[#00b9f2] font-bold bg-transparent border-none cursor-pointer"
                                    >
                                        {content?.['3']?.content?.button?.[0]?.text?.[language]}
                                    </button>
                                </div>
                            </div>
                            <div className={`self-stretch flex-[3_0_auto] flex justify-end`}
                                style={{ flexBasis: isComputer && getDynamicSize(494) }}
                            >
                                <img
                                    src={mainCard.image ? Img_url + mainCard?.image : newsBlogs.news1}
                                    className={`rounded-md aspect-[1.9/1] w-full object-cover object-left`}
                                    alt=""
                                />
                            </div>

                        </div>
                    </div>
                </section>
            }

            {/* latest card */}
            <section className={` ${language === "en" ? "text-left" : "text-right"} ${isPhone && 'px-10'}`}
                style={{ padding: (isComputer || isTablet) && `${getDynamicSize(50)} ${getDynamicSize(150)}` }}
            >
                <div className="container mx-auto"
                >
                    <h2 className={`text-[28px] text-[#0E172F] opacity-70 font-normal mb-6
                        ${checkDifference(content?.['3']?.content?.heading?.[language], liveContent?.['3']?.content?.heading?.[language])}
                    `}
                        style={{ fontSize: fontSize.aboutMainPara, lineHeight: (isComputer || isTablet) && fontSize.headingLeading }}
                    >
                        {content?.['3']?.content?.heading?.[language]}
                    </h2>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-fr
                        ${isTablet ? "lg:grid-cols-3" : isPhone ? "lg:grid-cols-1" : "lg:grid-cols-4"}
                          justify-items-center ${isLeftAlign ? '' : 'scale-x-[-1]'}
                          ${checkDifference(latestNews, liveLatestNews)}
                          `}
                        style={{
                            gap: isComputer ? getDynamicSize(20) : isTablet ? getDynamicSize(40) : getDynamicSize(80)
                        }}
                    >
                        {latestNews?.map((card, index) => {
                            return (
                                <div key={index} className={`rounded-md flex flex-col border border-gray-300 bg-white shadow-md overflow-hidden`}>
                                    <img
                                        src={card.image ? Img_url + card?.image : newsBlogs.news2}
                                        alt=""
                                        className={`object-cover object-center w-full aspect-[1.8/1] ${isPhone ? "h-[200px]" : ""}`}
                                    // width={180}
                                    />
                                    <div
                                        style={{ padding: isComputer ? getDynamicSize(12) : isTablet ? getDynamicSize(20) : getDynamicSize(40) }}
                                        className={`flex-auto flex flex-col justify-between `}>
                                        <div>
                                            <h2
                                                title={card?.[titleLan]}
                                                style={{ fontSize: fontSize.mainButton }}
                                                className={`text-[16px] font-bold mb-2 text-[#292E3D] ${isLeftAlign ? '' : 'scale-x-[-1] text-right'}`}
                                            >
                                                {TruncateText(card?.[titleLan], 25)}
                                            </h2>
                                            <div
                                                style={{ fontSize: isComputer ? getDynamicSize(13) : isTablet ? getDynamicSize(20) : getDynamicSize(50) }}
                                                className={`text-[13px] ${fontLight} text-[#001A58]/50 leading-4 mb-5 ${isLeftAlign ? '' : 'scale-x-[-1] text-right'}`}
                                                dangerouslySetInnerHTML={{ __html: TruncateText(card.description[language], 150) }}
                                            >
                                            </div>
                                        </div>
                                        <div className={`flex ${isLeftAlign ? "flex-row" : "flex-row-reverse"} items-center justify-between`} dir={isLeftAlign ? "ltr" : "rtl"}>
                                            <h6
                                                style={{ fontSize: isComputer ? getDynamicSize(13) : isTablet ? getDynamicSize(24) : getDynamicSize(50) }}
                                                className={`${fontLight} text-gray-600 text- ${isLeftAlign ? '' : 'scale-x-[-1] text-right'}`} dir={language == "ar" ? "rtl" : "ltr"}>
                                                {card.date[language]}
                                            </h6>
                                            <button
                                                style={{ fontSize: isComputer ? getDynamicSize(13) : isTablet ? getDynamicSize(24) : getDynamicSize(50) }}
                                                dir={language == "ar" ? "rtl" : "ltr"}
                                                // onClick={() => router.push(`blog/${card.id}`)}
                                                className={`text-[10px] font-bold text-[#00B9F2] border-none bg-transparent cursor-pointer ${isLeftAlign ? '' : 'scale-x-[-1] text-right'}`}
                                            >
                                                {content?.['3']?.content.button?.[0]?.text?.[language]}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Trending Card */}
            {!trendingCard?.id ? "" :
                <section
                    // dir={!isLeftAlign ? "rtl" : "ltr"}
                    style={{ padding: (isComputer || isTablet) ? `${getDynamicSize(50)} ${getDynamicSize(150)}` : `${getDynamicSize(400)} ${getDynamicSize(200)} ${getDynamicSize(200)}` }}
                    className={`${language === "en" ? "text-left" : "text-right"} ${isPhone ? "px-4" : ""}`}
                >
                    <div className="container mx-auto"
                        style={{ padding: (isComputer || isTablet) && `0px ${getDynamicSize(115)}` }}
                    >
                        <div className={`flex items-start ${!isLeftAlign && "flex-row-reverse text-right"} 
                                             ${(isTablet || isPhone) && "flex-col-reverse"}
                                             mx-auto rounded-md overflow-hidden bg-[rgba(20,80,152,0.06)]
                                            ${checkDifference(trendingCard?.[titleLan], liveTrendingCard?.[titleLan])}
                                             `}>
                            <div className={`flex-1 flex flex-col justify-between self-stretch ${(isPhone || isTablet) && "gap-5"}`}
                                style={{ padding: (isComputer || isTablet) ? `${getDynamicSize(40)} ${getDynamicSize(40)}` : `${getDynamicSize(50)} ${getDynamicSize(80)}` }}
                            >
                                <div>
                                    <h2
                                        style={{ fontSize: fontSize.aboutMainPara, lineHeight: fontSize.headingLeading, marginBottom: getDynamicSize(10) }}
                                        title={trendingCard?.title?.[language]}
                                        className="font-bold text-[#292E3D]"
                                    >
                                        {TruncateText(trendingCard?.[titleLan], (isTablet || isPhone) ? 20 : 35)}
                                    </h2>
                                    <div className={`text-xs ${fontLight} text-[rgba(0,26,88,0.51)]`}
                                        style={{ fontSize: isComputer ? getDynamicSize(14) : isTablet ? getDynamicSize(30) : getDynamicSize(50) }}
                                        dangerouslySetInnerHTML={{ __html: TruncateText(trendingCard?.description?.[language], 250) }}
                                    >
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <h6
                                        style={{ fontSize: isComputer ? getDynamicSize(14) : isTablet ? getDynamicSize(25) : getDynamicSize(50) }}
                                        className={`text-xs ${fontLight} text-gray-600`}>
                                        {trendingCard?.date?.[language]}
                                    </h6>
                                    <button
                                        style={{ fontSize: isComputer ? getDynamicSize(14) : isTablet ? getDynamicSize(25) : getDynamicSize(50) }}
                                        className="text-sm font-bold text-[#00b9f2] bg-transparent border-none cursor-pointer"
                                    >
                                        {content?.['4']?.content?.button?.[0]?.text?.[language]}
                                    </button>
                                </div>
                            </div>
                            <div style={{
                                flexBasis: isComputer && getDynamicSize(529)
                            }} className={`${(isTablet || isPhone) ? "self-stretch" : ""}`}
                            >
                                <img
                                    src={trendingCard.image ? Img_url + trendingCard?.image : newsBlogs.news1}
                                    alt="Trending Card Image"
                                    className={`w-full ${(isTablet || isPhone) ? "" : "aspect-[1.3/1]"} self-center object-cover object-center ${isTablet || isPhone && "w-full"}`}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            }
        </div>
    );
};

export default NewsBlogspage;