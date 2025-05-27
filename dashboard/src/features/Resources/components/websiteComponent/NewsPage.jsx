import { useEffect } from "react";
import content from "./content.json"
import { newsBlogs } from "../../../../assets/index";
import { useDispatch, useSelector } from "react-redux";
// import { TruncateText } from "../../../../app/capitalizeword";
// import Arrow from "../../../../assets/icons/right-wrrow.svg";
import { updateMainContent } from "../../../common/homeContentSlice";
import TruncateComponent from "../../../../components/Truncate.jsx/TruncateComponent";
import { TruncateText } from "../../../../app/capitalizeword";
import { Img_url } from "../../../../routes/backend";
// import styles from "@/components/news-and-blogs/newsblogs.module.scss";
// Font files can be colocated inside of `app`
// const BankGothic = localFont({
//     src: "../../../public/font/BankGothicLtBTLight.ttf",
//     display: "swap",
// });
// import dynamic from 'next/dynamic';
// import localFont from "next/font/local";
// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });


const NewsBlogspage = ({ language, screen, content }) => {
    const isLeftAlign = language === 'en'
    const titleLan = isLeftAlign ? "titleEn" : "titleAr"
    const isPhone = screen < 761
    const isTablet = screen > 760 && screen < 900
    // const dispatch = useDispatch()
    // const currentContent = useSelector((state) => state.homeContent.present.newsBlogs)
    const ImageFromRedux = useSelector((state) => state.homeContent.present.images)
    const bannerTitle = content?.['1']?.content?.title?.[language];
    const bannerDescription = content?.['1']?.content?.description[language];
    const banner = content?.['1']?.content
    const mainCard = content?.['2']?.items?.[0]
    const latestNews = content?.['3']?.items;
    const trendingCard = content?.['4']?.items?.[0];

    return (
        <div>
            {/**Banner Section */}
            <section className={`relative px-5 w-full bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}  `}
                style={{
                    height: 1100 * 0.436,
                    backgroundImage: banner.images?.[0]?.url ? Img_url + banner.images?.[0]?.url : "url('https://loopwebsite.s3.ap-south-1.amazonaws.com/Hero+(2).png')"
                }}>
                <div className={`${isTablet && "py-[200px]"} container h-full relative ${isPhone ? "px-10" : "px-20"} flex items-center ${isLeftAlign ? "justify-end" : "justify-end"}`}>
                    <div className={`flex flex-col ${isLeftAlign ? 'right-5 text-left items-start ' : 'left-5 text-right items-end'} ${isPhone ? "max-w-[90%]" : isTablet ? "max-w-[70%]" : "max-w-[50%]"} w-full ${isLeftAlign ? 'scale-x-[-1]' : ''}`}>
                        <h1 className={`text-[#292E3D] ${isPhone ? "text-3xl" : "text-[50px] leading-[77px] tracking-[-3.5px]"} font-medium  mb-4`}>
                            {bannerTitle}
                        </h1>
                        <p className={`text-[#0E172FB3] ${isPhone ? "" : "leading-[28px]"} text-sm font-semibold w-[70%] mb-6 word-spacing-5`} dir={isLeftAlign ? "ltr" : "rtl"}>
                            {bannerDescription}
                        </p>
                        {/* <button
                            className={`relative px-5 py-2 ${isPhone ? "text-xs" : "text-sm"} font-medium bg-[#00B9F2] text-white rounded flex items-center justify-start gap-2 ${isLeftAlign ? "flex-row-reverse" : ""}`}
                        // onClick={() => router.push("/services")}
                        >
                            <img
                                src={Arrow}
                                alt="Arrow"
                                className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} ${isPhone ? "w-[12px] h-[12px]" : "w-[14px] h-[14px]"}`}
                            />
                            <p>
                                {currentContent?.banner?.button?.[language]}
                            </p>
                        </button> */}
                    </div>
                </div>
            </section>

            {/** main card */}
            {!mainCard?.id ? "" :
                <section className={`py-[88px] ${isPhone ? 'px-4' : "px-[100px]"}`}>
                    <div className="container">
                        <div className={`flex items-center ${!isLeftAlign && "flex-row-reverse text-right"} ${isTablet || isPhone ? "flex-col pb-6" : ""} justify-center gap-[50px] p-2 mx-auto rounded-md border border-gray-300 bg-white shadow-md shadow-gray-200`}>
                            <div className="p-[30px]">
                                <h2 title={mainCard?.title?.[language]} className="text-[#292E3D] text-[20px] font-bold mb-4">
                                    {TruncateText(mainCard?.[titleLan], 20)}
                                </h2>
                                <p
                                    title={mainCard?.description?.[language]}
                                    className="text-xs text-[rgba(0,26,88,0.51)] font-light leading-[22px] mb-6"
                                >
                                    {TruncateText(mainCard?.description?.[language], 150)}
                                </p>
                                <div className="flex items-center justify-between gap-5">
                                    <h6 className="text-[12px] text-gray-600 font-light">
                                        {mainCard?.date?.[language]}
                                    </h6>
                                    <button
                                        className="text-[14px] text-[#00b9f2] font-bold bg-transparent border-none cursor-pointer"
                                    >
                                        {content?.['2']?.button?.[0]?.text?.[language]}
                                    </button>
                                </div>
                            </div>
                            <img
                                src={mainCard?.image?.slice(0, 5) === "https" ? mainCard.image : Img_url + mainCard?.image}
                                className="rounded-md mr-1 h-[200px] object-cover object-left"
                                alt=""
                                width={333}
                            />
                        </div>
                    </div>
                </section>
            }

            {/* latest card */}
            <section className={`pb-20 ${language === "en" ? "text-left" : "text-right"}`}>
                <div className="container mx-auto px-16">
                    <h2 className={`text-[28px] text-[#0E172F] opacity-70 font-normal mb-6`}>
                        {content?.['3']?.content?.heading?.[language]}
                    </h2>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${isTablet ? "lg:grid-cols-3" : isPhone ? "lg:grid-cols-1" : "lg:grid-cols-4"} gap-3 justify-items-center ${isLeftAlign ? '' : 'scale-x-[-1]'}`}>
                        {latestNews?.map((card, index) => {
                            return (
                                <div key={index} className={`rounded-md border border-gray-300 bg-white shadow-md overflow-hidden ${isPhone ? "min-h-[390px]" : "min-h-[390px]"}`}>
                                    <img
                                        src={card.image?.slice(0, 5) === "https" ? card.image : Img_url + card?.image}
                                        alt=""
                                        className={`object-cover object-center w-full ${isPhone ? "h-[200px]" : "h-[130px]"}`}
                                        width={180}
                                    />
                                    <div className={`p-2 flex-auto flex flex-col justify-between ${isPhone ? "min-h-[48%]" : "min-h-[68%]"}`}>
                                        <div>
                                            <h2
                                                title={card?.[titleLan]}
                                                className={`text-[16px] font-bold mb-2 text-[#292E3D] ${isLeftAlign ? '' : 'scale-x-[-1] text-right'}`}
                                            >
                                                {TruncateText(card?.[titleLan], 25)}
                                            </h2>
                                            <p
                                                title={card.description[language]}
                                                className={`text-[13px] font-light text-[#001A58]/50 leading-4 mb-5 ${isLeftAlign ? '' : 'scale-x-[-1] text-right'}`}
                                            >
                                                {TruncateText(card.description[language], 150)}

                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <h6 className={`text-[10px] font-light text-gray-600 text- ${isLeftAlign ? '' : 'scale-x-[-1] text-right'}`} dir={language == "ar" ? "rtl" : "ltr"}>
                                                {card.date[language]}
                                            </h6>
                                            <button
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
                    dir={!isLeftAlign ? "rtl" : "ltr"}
                    className={`${language === "en" ? "text-left" : "text-right"} pb-20 ${isPhone ? "px-4" : "px-20"}`}>
                    <div className="container mx-auto">
                        <div className={`flex p-0 items-start ${!isLeftAlign && "flex-row-reverse text-right"} ${isTablet || isPhone && "flex-col-reverse"} gap-11 mx-auto rounded-md overflow-hidden bg-[rgba(20,80,152,0.06)]`}>
                            <div className="p-8 flex-1">
                                {<button className={`px-8 py-2 ${!trendingCard?.button && "invisible"} flex justify-center items-center gap-2 rounded-3xl bg-[#145098] text-white text-sm font-normal tracking-wide mb-8 border-none cursor-pointer`}>
                                    {trendingCard?.heading?.[language]}
                                </button>}
                                <h2
                                    title={trendingCard?.title?.[language]}
                                    className="font-bold text-lg leading-6 text-[#292E3D]"
                                >
                                    {TruncateText(trendingCard?.[titleLan], 35)}
                                </h2>
                                <p className="text-xs font-light leading- text-[rgba(0,26,88,0.51)] mb-6 h-[150px]">
                                    {TruncateText(trendingCard?.description?.[language], 150)}
                                </p>
                                <div className="flex items-center justify-between gap-5">
                                    <h6 className="text-xs font-light text-gray-600">
                                        {trendingCard?.date?.[language]}
                                    </h6>
                                    <button
                                        className="text-sm font-bold text-[#00b9f2] bg-transparent border-none cursor-pointer"
                                    >
                                        {content?.['4']?.content?.button?.[0]?.text?.[language]}
                                    </button>
                                </div>
                            </div>
                            <img
                                src={trendingCard?.image?.slice(0, 5) === "https" ? trendingCard?.image : Img_url + trendingCard?.image}
                                alt="Trending Card Image"
                                // width={439}
                                // height={329} 
                                className={` w-[50%] h-[372px] self-center object-cover object-center ${isTablet || isPhone && "w-full"}`}
                            />
                        </div>
                    </div>
                </section>}
        </div>
    );
};

export default NewsBlogspage;