import React, { useEffect } from "react";
import { newsBlogs } from "../../../../../assets/index";
import content from "../content.json"
import { TruncateText } from "../../../../../app/capitalizeword";
import { updateMainContent } from "../../../../common/homeContentSlice";
import { useDispatch, useSelector } from "react-redux";
import structureOfNewsDetails from '../structures/structureOFNewsDetails.json';
import { Img_url } from "../../../../../routes/backend";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../../app/fontSizes";

const NewsBlogDetailPage = ({ language, screen, content, width, highlight, liveContent }) => {
    const isComputer = screen > 1100;
    const isTablet = 1100 > screen && screen > 767;
    const isPhone = screen < 767;

    const isLeftAlign = language === "en";
    const titleLan = isLeftAlign ? "titleEn" : "titleAr";

    const banner = content?.[1]?.content;
    const newsPoints = content?.[2]?.content;
    const latestNewCards = content?.[3];
    const LiveBanner = liveContent?.[1]?.content;
    const liveNewsPoints = liveContent?.[2]?.content;
    const liveLatestNewCards = liveContent?.[3];


    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => ""

    // Font and Size
    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)
    const fontLight = useSelector(state => state.fontStyle.light)


    return (
        <div className={`${isPhone ? "px-1" : `px-10`}`}>
            <section
                className={` mb-5 ${language === "ar" ? "text-right" : ""}`}
                style={{ padding: `${getDynamicSize(50)} ${getDynamicSize(120)}` }}
            >
                <div className="container"
                >
                    <div className={`relative pb-8 border-b border-[#E8E7E7] mb-8 ${isPhone ? "px-1" : ""}`}
                        style={{ padding: `0px ${getDynamicSize(20)} ${getDynamicSize(20)}` }}

                    >
                        <img
                            src={Img_url + banner?.images?.[0]?.url || "https://loopwebsite.s3.ap-south-1.amazonaws.com/image+2+(3).png"}
                            alt=""
                            height={380}
                            className={`w-full h-[380px] object-cover ${isPhone ? "object-[-40px]" : "object-center"} mb-7`}
                        />

                        <button
                            className={`absolute top-[50px] bg-white p-3 flex items-center gap-2 text-[16px] font-bold text-[rgba(14,23,47,0.7)] 
                                ${language === "ar" ? `${isPhone ? "right-0" : "right-[0%]"}` : `${isPhone ? "left-0" : "left-[0%]"}`}`}
                        >
                            <img
                                src="https://loopwebsite.s3.ap-south-1.amazonaws.com/bx_arrow-back.svg"
                                alt=""
                                width={20}
                                height={20}
                                className={`${language === "ar" ? "scale-x-100" : "scale-x-[-1]"} `}
                            />
                            {banner?.button?.[0]?.text?.[language]}
                        </button>

                        <h2 className={`text-[#292E3D] mb-5 ${isPhone ? "px-2" : ""}
                        ${checkDifference(banner?.title?.[language], LiveBanner?.title?.[language])}
                        `}
                            style={{ fontSize: fontSize.serviceHeading }}
                        >
                            {banner?.title[language] || "Heading"}
                        </h2>
                        <p className={`${fontLight} text-[#718096] ${isPhone ? "px-2" : ""}
                        ${checkDifference(banner?.date?.[language], LiveBanner?.date?.[language])}
                        `}
                            style={{ fontSize: fontSize.mainPara }}
                        >
                            {banner?.date?.[language] || "day Month date"}
                        </p>
                    </div>

                    {newsPoints?.map((item, index) => (
                        <div key={index} className={`${isPhone ? "px-" : ""} mb-12`}>
                            <h2 className={`text-[20px] ${fontLight} text-[#292E3D] mb-4
                                     ${checkDifference(item?.title?.[language], liveNewsPoints?.[index]?.title?.[language])}
                            `}
                                style={{ fontSize: fontSize.aboutMainPara }}
                            >
                                {item?.title?.[language] || "News Point"}
                            </h2>
                            <div
                                style={{ fontSize: fontSize.mainPara }}
                                className={` text-[rgba(0,26,88,0.51)] leading-6 mb-6
                                ${checkDifference(item?.description?.[language], liveNewsPoints?.[index]?.description?.[language])}
                                    `}
                                dangerouslySetInnerHTML={{ __html: item?.description?.[language] || "News Point Description" }} />
                        </div>
                    ))}
                </div>
            </section>


            <section className={`${language === "en" ? "text-left" : "text-right"} pb-[88px]`}
                style={{ padding: `${getDynamicSize(50)} ${getDynamicSize(120)}` }}
            >
                <div className="container">
                    <h2 className={`text-[28px] ${fontLight} text-[rgba(14,23,47,0.7)] mb-6 ${isPhone ? "px-6" : ""}`}>
                        {latestNewCards?.content?.title?.[language]}
                    </h2>

                    <div className={`grid ${isPhone ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-4"} gap-y-6 justify-center items-center auto-rows-fr
                                    ${checkDifference(latestNewCards?.items, liveLatestNewCards.items)}
                    `}
                        style={{
                            gap: isComputer ? getDynamicSize(20) : isTablet ? getDynamicSize(40) : getDynamicSize(80)
                        }}
                    >
                        {latestNewCards?.items?.map((card, index) => {
                            return (
                                <div key={index} className={`rounded-md flex flex-col border border-gray-300 bg-white shadow-md overflow-hidden h-full `}>
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
                                            <p
                                                style={{ fontSize: isComputer ? getDynamicSize(13) : isTablet ? getDynamicSize(20) : getDynamicSize(50) }}
                                                title={card.description[language]}
                                                className={`text-[13px] ${fontLight}  text-[#001A58]/50 leading-4 mb-5 ${isLeftAlign ? '' : 'scale-x-[-1] text-right'}`}
                                            >
                                                {TruncateText(card.description[language], 150)}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
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

        </div>
    );
};

export default NewsBlogDetailPage;
