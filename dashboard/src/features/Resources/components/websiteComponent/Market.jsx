import React, { useState, useEffect } from "react";
import content from "./content.json"
import Arrow from "../../../../assets/icons/right-wrrow.svg";
import "swiper/css";
import "swiper/css/pagination";
import { useDispatch, useSelector } from "react-redux";
import { updateContent } from "../../../common/homeContentSlice";
import doubleQuotes from "../../../../assets/right-quote.png"
// import { Swiper, SwiperSlide } from "swiper/react";
// import {
//     //   Pagination,
//     Navigation,
//     Autoplay,
//     EffectCoverflow,
// } from "swiper/modules";
// import styles from "./market.module.scss";
// import localFont from "next/font/local";
// import img from "next/img";
// import button from "@/common/button";
// import patch from "../../contexts/svg/path.jsx";
// Font files can be colocated inside of `app`
// const BankGothic = localFont({
//     src: "../../../public/font/BankGothicLtBTLight.ttf",
//     display: "swap",
// });
// import { testimonials } from "../../assets/index";
// import dynamic from "next/dynamic";
// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
// import { useGlobalContext } from "../../contexts/GlobalContext";
// const ContactUsModal = dynamic(() => import("../header/ContactUsModal"), {
//     ssr: false,
// });
import { projectPageData } from "../../../../assets/index";
import { TruncateText } from "../../../../app/capitalizeword";

const MarketPage = ({ language, screen }) => {
    // const testimonialPrevRef = useRef(null);
    // const testimonialNextRef = useRef(null);
    // const currentContent = content?.market;
    // const handleContactUSClose = () => {
    //     setIsModal(false);
    // };
    // const [isModal, setIsModal] = useState(false);
    const dispatch = useDispatch()
    const isPhone = screen < 760
    const isTablet = screen > 761 && screen < 1100
    console.log(isPhone)
    const [activeTab, setActiveTab] = useState("buildings");
    const currentContent = useSelector((state) => state.homeContent.present.markets)
    const ImageFromRedux = useSelector((state) => state.homeContent.present.images)
    const isLeftAlign = language === 'en'
    const [filterMarketItems, setFilterMarketItems] = useState([]);
    const [visibleMarketItemsCount, setVisibleMarketItemCount] = useState(6);

    useEffect(() => {
        setFilterMarketItems(
            currentContent?.tabSection?.marketItems
                ? currentContent?.tabSection?.marketItems.filter(
                    (item) => item?.type === activeTab
                )
                : []
        );
        setVisibleMarketItemCount(6);
    }, [activeTab, currentContent]); // Added currentContent as a dependency



    useEffect(() => {
        dispatch(updateContent({ currentPath: "markets", payload: content.market }))
    }, [])

    return (
        <div >
            {/* hero banner  */}
            <section className={`relative h-full w-full bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}  `}
                style={{
                    height: 1200 * 0.436,
                    backgroundImage: ImageFromRedux.marketBanner ? `url(${ImageFromRedux.marketBanner})` :
                        "url('https://frequencyimage.s3.ap-south-1.amazonaws.com/b9961a33-e840-4982-bd19-a7dcc52fdd95-Hero.jpg')"
                }}>
                <div className={`container h-full relative ${isPhone ? "px-10" : "px-20"} flex items-center ${isLeftAlign ? "justify-end" : "justify-end"}   `}>
                    <div className={`flex flex-col ${isLeftAlign ? 'right-5 text-left items-start ' : 'left-5 text-right items-end'} ${isPhone ? "max-w-[70%]" : "max-w-[55%]"} w-full ${isLeftAlign ? 'scale-x-[-1]' : ''}`}>
                        <h1 className={`text-[#292E3D] ${isPhone ? "text-3xl" : "text-[50px] leading-[77px] tracking-[-3.5px]"} font-medium  mb-4`}>
                            {currentContent?.banner?.title[language]}
                        </h1>
                        <p className={`text-[#0E172FB3] ${isPhone ? "" : "leading-[28px]"} text-sm font-semibold  mb-6 word-spacing-5`}>
                            {currentContent?.banner?.description[language]}
                        </p>
                        <button
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
                        </button>
                    </div>
                </div>
            </section>

            {/* qoutes */}
            <section
                className={`${isLeftAlign && "text-left"} py-[256px] h-[400px] flex justify-center items-center`}
            >
                <div className="container flex justify-center items-center">
                    <div className="relative w-[634px] p-[45px] h-[327px] flex flex-col items-center justify-center bg-white rounded-lg">
                        <div
                            className={`absolute top-0 ${isPhone ? "left-5" : "left-0"} ${isPhone ? "h-[350px]" : "h-[327px]"} w-[154px] bg-no-repeat bg-center`}
                            style={{
                                backgroundImage:
                                    "url('https://frequencyimage.s3.ap-south-1.amazonaws.com/dedcd7a4-2f65-4cde-bbc3-008818e2581d-Pattern.svg')",
                            }}
                        ></div>
                        <div
                            className={`absolute top-0 ${isPhone ? "right-5" : "right-0"} ${isPhone ? "h-[350px]" : "h-[327px]"} w-[154px] bg-no-repeat bg-center`}
                            style={{
                                backgroundImage:
                                    "url('https://frequencyimage.s3.ap-south-1.amazonaws.com/ac99188b-3b99-4708-b075-8a660e9aac8f-Pattern%20%281%29.svg')",
                            }}
                        ></div>
                        <img
                            src={doubleQuotes}
                            width="40"
                            height="40"
                            alt="asd"
                            className="mb-[24px] rotate-180 opacity-[.3]"
                        />
                        <p className={`text-[#97b3d8] font-Arial ${isPhone ? "" : "text-[20px]"} font-normal leading-[30px] tracking-[0.02em] text-center mb-[20px]`}>
                            {currentContent?.quote?.text[language]}
                        </p>
                        <h5 className="text-[rgba(11,54,156,0.3)] font-Arial text-[18px] italic font-bold leading-[27px] tracking-[0.01em] text-center">
                            -{currentContent?.quote?.author[language]}
                        </h5>
                    </div>
                </div>
            </section>

            {/* market projects */}
            <section className={` pb-[45px] px-14 ${language === "en" ? "text-left" : "text-right"}`}>
                <div className="container mx-auto px-4">
                    <div>
                        {/* Tabs or Dropdown */}
                        <div className="w-full flex flex-col items-center mb-10">
                            {isPhone ? (
                                // Dropdown for mobile view
                                <div className="relative w-full max-w-xs">
                                    <select
                                        className="w-full p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#00B9F2] focus:border-[#00B9F2]"
                                        value={activeTab}
                                        onChange={(e) => setActiveTab(e.target.value)}
                                    >
                                        {currentContent?.tabSection?.tabs.map((tab, index) => (
                                            <option key={index} value={tab?.id}>
                                                {tab.title[language]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                // Tabs for larger screens
                                <div className={`flex items-center justify-center gap-6 ${!isLeftAlign && "flex-row-reverse"}`}>
                                    {currentContent?.tabSection?.tabs.map((tab, index) => (
                                        <button
                                            key={index}
                                            className={`relative px-4 py-2 text-sm font-medium uppercase transition-all duration-300 ${activeTab === tab?.id
                                                    ? "text-[#00B9F2] border-b-2 border-[#00B9F2]"
                                                    : "text-gray-600 hover:text-gray-800"
                                                }`}
                                            onClick={() => setActiveTab(tab?.id)}
                                        >
                                            {tab.title[language]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* Cards */}
                        <div
                            className={`${isPhone ? "flex flex-col" : `grid ${isTablet?"grid-cols-2":"grid-cols-3"} gap-x-16 gap-y-6 mt-12`} ${language === "ar" ? "rtl" : ""}`}
                            style={language === "ar" ? { direction: "rtl" } : {}}
                        >
                            {filterMarketItems
                                ?.slice(0, visibleMarketItemsCount)
                                ?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="rounded-md p-3 flex flex-col items-start gap-2 overflow-hidden"
                                    >
                                        <img
                                            src={projectPageData[item.imgUrl]}
                                            width="339"
                                            height="190"
                                            alt={item.title[language]}
                                            className="object-cover w-full h-[50%]"
                                        />
                                        <h5
                                            title={item?.title[language]}
                                            className="text-[#292E3D] text-lg font-bold mt-4 h-10"
                                        >
                                            {TruncateText(item.title[language], (isPhone ? 20 : 25))}
                                        </h5>
                                        <button
                                            className="text-[#00B9F2] text-center text-base font-normal flex items-center gap-2 mt-2"
                                        >
                                            {currentContent?.tabSection?.button[0]?.text[language]}
                                            <p className={`text-[1.6em] -translate-y-[2px] ${language === "ar" && "scale-x-[-1]"}`}>→</p>
                                        </button>
                                    </div>
                                ))}
                        </div>


                        {/* View More Button */}
                        {visibleMarketItemsCount < filterMarketItems.length && (
                            <div className="flex justify-center mt-11">
                                <button
                                    className="flex items-center gap-2 text-base"
                                    onClick={() => setVisibleMarketItemCount(visibleMarketItemsCount + 6)}
                                >
                                    {currentContent?.tabSection?.button[1]?.text[language]}
                                    <img
                                        src="https://loopwebsite.s3.ap-south-1.amazonaws.com/weui_arrow-outlined.svg"
                                        width={24}
                                        height={24}
                                        alt="icon"
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            {/* <ContactUsModal isModal={isModal} onClose={handleContactUSClose} /> */}
        </div>
    );
};

export default MarketPage;

// <section
//     className={` ${language === "en" && styles.leftAlign}   ${styles.market_tab_container
//         }`}
// >
//     <div className="container">
//         <div className={styles.tabContainer}>
//             {/* Tabs */}
//             <div className={styles.tabs}>
//                 {currentContent?.tabSection?.tabs.map((tab, index) => (
//                     <button
//                         key={index}
//                         className={`${styles.tabbutton} ${activeTab === tab?.id ? styles.activeTab : ""
//                             }`}
//                         onClick={() => setActiveTab(tab?.id)}
//                     >
//                         {tab.title[language]}
//                     </button>
//                 ))}
//             </div>

//             {/* Cards */}
//             <div className={styles.card_group}>
//                 {filterMarketItems
//                     ?.slice(0, visibleMarketItemsCount)
//                     ?.map((item, index) => (
//                         <div className={styles.card} key={index}>
//                             <img
//                                 src={projectPageData[item.imgUrl]}
//                                 width="339"
//                                 height="190"
//                                 alt={item.title[language]}
//                                 className={styles.card_img}
//                             />
//                             <h5
//                                 title={item?.title[language]}
//                                 className={`${styles.title} ${BankGothic.className}`}
//                             >
//                                 {TruncateText(item.title[language], 45)}
//                             </h5>
//                             <button
//                                 onClick={() => router.push(`/market/${index + 1}`)}
//                                 className={`${styles.button} ${BankGothic.className}`}
//                             >
//                                 {currentContent?.tabSection?.button[0]?.text[language]}
//                                 <img
//                                     className={` ${language === "en" && styles.leftAlign
//                                         }   ${styles.icon}`}
//                                     src="https://frequencyimg.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
//                                     width={22}
//                                     height={22}
//                                     alt="icon"
//                                 />
//                             </button>
//                         </div>
//                     ))}
//             </div>
//             {visibleMarketItemsCount < filterMarketItems.length && ( // Show button only if there are more projects
//                 <div className={styles.button_wrap}>
//                     <button
//                         className={styles.view_more_btn}
//                         onClick={() =>
//                             setVisibleMarketItemCount(visibleMarketItemsCount + 6)
//                         } // Increase count by 4
//                     >
//                         {currentContent?.tabSection?.button[1]?.text[language]}
//                         <img
//                             src="https://loopwebsite.s3.ap-south-1.amazonaws.com/weui_arrow-outlined.svg"
//                             width={24}
//                             height={24}
//                             alt="icon"
//                         />
//                     </button>
//                 </div>
//             )}
//         </div>
//     </div>
// </section>
//     {/* testomonials section  */}

//     <section
//         className={` ${language !== "en" && styles.rightAlignment}   ${styles.testimonial_wrapper
//             }`}
//     >
//         <div className={`container ${styles.main_container}`}>
//             <div className={styles.testimonials_content}>
//                 {/* <AnimatedText text={currentContent?.testimonialSection?.title[language]} Wrapper="h2" repeatDelay={0.04} className={`${styles.title} ${BankGothic.className}`} /> */}
//                 <h2 className={`${styles.title}`}>
//                     {currentContent?.testimonialSection?.title[language]}
//                 </h2>
//             </div>

//             <div className={styles.testimonials_client}>


//             </div>
//         </div>
//     </section>