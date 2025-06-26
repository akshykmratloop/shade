import { useState, useEffect, useRef } from "react";
// import content from "./content.json"
import Arrow from "../../../../assets/icons/right-wrrow.svg";
import "swiper/css";
import "swiper/css/pagination";
import { useDispatch, useSelector } from "react-redux";
// import { updateMainContent } from "../../../common/homeContentSlice";
import doubleQuotes from "../../../../assets/right-quote.png"
import { Swiper, SwiperSlide } from "swiper/react";
import {
    //   Pagination,
    Navigation,
    Autoplay,
    EffectCoverflow,
} from "swiper/modules";
// import { projectPageData } from "../../../../assets/index";
import { TruncateText } from "../../../../app/capitalizeword";
import { Img_url } from "../../../../routes/backend";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";
import { FaArrowLeftLong, FaRegBuilding } from "react-icons/fa6";
import bracket_l from "../../../../assets/bracket-l.svg"
import bracket_r from "../../../../assets/bracket-r.svg"

const MarketPage = ({ language, screen, currentContent, highlight, liveContent, purpose }) => {
    const testimonialPrevRef = useRef(null);
    const testimonialNextRef = useRef(null);
    const isComputer = screen > 900 || highlight;
    const isTablet = (screen < 900 && screen > 730) && !highlight;
    const isPhone = screen < 500 && !highlight;
    const [activeTab, setActiveTab] = useState("buildings");
    const isLeftAlign = language === 'en'
    const [filterMarketItems, setFilterMarketItems] = useState([]);
    const [width, setWidth] = useState(0)
    const [visibleMarketItemsCount, setVisibleMarketItemCount] = useState(6);
    const divRef = useRef(null)
    const getDynamicSize = (size) => {
        if (isComputer) { return dynamicSize(size, width) }
    }
    const titleLan = isLeftAlign ? 'titleEn' : "titleAr"
    const checkDifference = (!purpose && highlight) ? differentText?.checkDifference?.bind(differentText) : () => ""


    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const fontLight = useSelector(state => state.fontStyle.light)

    const slidesPerView = isPhone ? 1 : 1.5;


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
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });

        if (divRef.current) {
            observer.observe(divRef.current);
        }

        return () => {
            if (divRef.current) {
                observer.unobserve(divRef.current);
            }
        };
    }, []);
    const [swiperInstance, setSwiperInstance] = useState(null);

    return (
        <div ref={divRef} className={``} dir={isLeftAlign ? "ltr" : "rtl"}>
            {/* hero banner  */}
            <section className={`relative h-[487px] w-full bg-cover bg-center  ${isPhone ? "px-10" : "px-30"} `}
                style={{
                    padding: isComputer ? `0px ${getDynamicSize(150)}` : isTablet ? "100px" : "",
                    height: getDynamicSize(726),
                    backgroundImage: currentContent?.['1']?.content?.images?.[0]?.url ? `url(${Img_url + currentContent?.['1']?.content?.images?.[0]?.url})` :
                        "url('https://frequencyimage.s3.ap-south-1.amazonaws.com/b9961a33-e840-4982-bd19-a7dcc52fdd95-Hero.jpg')"
                }}>
                <div className="absolute inset-0 pointer-events-none z-[0] flex items-center justify-start overflow-hidden">
                    <div
                        style={{ width: (isTablet || isPhone) ? "60%" : getDynamicSize(850), height: (isTablet || isPhone) ? "60%" : getDynamicSize(650) }}
                        className="rounded-full bg-white opacity-[.9] blur-[120px] mix-blend-screen"></div>
                </div>
                <div className={`container h-full relative  flex items-center `}>
                    <div className={`flex flex-col ${isPhone ? "max-w-[85%]" : "max-w-[55%]"} w-full items-start`}>
                        <h1
                            style={{ fontSize: isPhone ? "40px" : fontSize.mainHeading, lineHeight: fontSize.headingLeading }}
                            className={`text-[#292E3D] ${isPhone ? "text-3xl" : "text-[50px] leading-[77px] tracking-[-3.5px]"} font-medium  mb-4
                            ${checkDifference(currentContent?.['1']?.content?.title?.[language],
                                liveContent?.['1']?.content?.title?.[language])}
                            `}>
                            {currentContent?.['1']?.content?.title?.[language]}
                        </h1>
                        <p
                            style={{
                                fontSize: fontSize.mainPara,
                                width: getDynamicSize(486),
                                lineHeight: getDynamicSize(28)
                            }}
                            className={`text-[#0E172FB3] ${isPhone ? "" : "leading-[28px]"} text-sm font-semibold  mb-6 word-spacing-5
                            ${checkDifference(currentContent?.['1']?.content?.description?.[language],
                                liveContent?.['1']?.content?.description?.[language])}
                            `}>
                            {currentContent?.['1']?.content?.description?.[language]}
                        </p>
                        <button
                            className={`relative py-[6px] px-[12px] text-xs font-medium bg-[#00B9F2] text-white rounded flex items-center justify-start gap-2 ${isLeftAlign ? "flex-row-reverse" : ""}`}
                            style={{ fontSize: getDynamicSize(16), lineHeight: getDynamicSize(28) }}
                        >
                            <img
                                src={Arrow}
                                alt="Arrow"
                                className={`${isLeftAlign ? 'scale-x-[-1]' : ''} w-[11px] h-[11px]`}
                            />
                            <p
                                className={`
                                         ${checkDifference(currentContent?.['1']?.content?.button?.[0]?.text?.[language],
                                    liveContent?.['1']?.content?.button?.[0]?.text?.[language])}
                                `}
                            >
                                {currentContent?.['1']?.content?.button?.[0]?.text?.[language]}
                            </p>
                        </button>
                    </div>
                </div>
            </section>

            <section
                dir={isLeftAlign ? "ltr" : "rtl"}
                style={{
                    gap: getDynamicSize(30),
                    padding: isComputer ? `0px ${getDynamicSize(150)}` : isTablet ? "100px" : "",

                    margin: `${getDynamicSize(70)} 0px`
                }}
                className={`flex gap-[30px] ${isPhone ? "flex-col px-[30px]" : ""} ${isPhone ? "px-10" : "px-20"} my-[33px]`}
            >
                <h2
                    style={{ fontSize: getDynamicSize(60) }}
                    className={`text-[35px] ${isPhone ? "" : "w-1/2"} ${(isTablet || isPhone) && "leading-[34px]"}
                                ${checkDifference(currentContent?.['3']?.content?.introSection?.title?.[language],
                        liveContent?.['3']?.content?.introSection?.title?.[language])}
                            `}>
                    {currentContent?.['3']?.content?.introSection?.title?.[language]}
                </h2>
                <div
                    style={{ fontSize: fontSize.mainPara }}
                    className={` ${isPhone ? "" : "w-1/2"} ${fontLight}
                                ${checkDifference(currentContent?.['3']?.content?.introSection?.description?.[language],
                        liveContent?.['3']?.content?.introSection?.description?.[language])}
                                `}
                    dangerouslySetInnerHTML={{ __html: currentContent?.['3']?.content?.introSection?.description?.[language] }}
                />
            </section>

            <div className={`${isPhone ? "px-12" : "px-20"} flex flex-col gap-[20px]
            ${checkDifference(currentContent?.['3']?.items, liveContent?.['3']?.items)}
            `}
                dir={isLeftAlign ? "ltr" : "rtl"}
                style={{
                    gap: getDynamicSize(30),
                    padding: isComputer && `0px ${getDynamicSize(150)}`,
                }}
            >
                {
                    currentContent?.['3']?.items?.map((e, i) => {
                        let odd = i % 2 !== 0
                        return (
                            <section
                                style={{
                                    height: getDynamicSize(359),
                                }}
                                className={`flex ${isPhone ? "flex-col" : odd && "flex-row-reverse"} bg-[#F8F8F8]`} key={e.id}>
                                <div className={` flex-[2_0_auto] `}
                                    style={{ width: isPhone ? '100%' : isTablet ? "300px" : getDynamicSize(463), height: isPhone ? '50%' : isTablet ? "40vh" : '100%' }}
                                >
                                    <img
                                        src={`${Img_url + e.image}`}
                                        alt=""
                                        style={{
                                            width: isPhone ? '100%' : isTablet ? "300px" : getDynamicSize(463),
                                            height: isPhone ? '50vh' : isTablet ? "40vh" : '100%'
                                        }}
                                    />
                                </div>
                                <article
                                    dir={isLeftAlign ? "ltr" : "rtl"}
                                    className={`flex flex-col flex-[1_1_auto] gap-[13px] items-start justify-center text-[#292E3D] ${isPhone ? "py-5 px-[20px] w-full" : "px-[38px]"}`}>
                                    <h3 className="font-[400] text-[21px]"
                                        style={{
                                            fontSize: fontSize.subProjectHeadings
                                        }}
                                    >{TruncateText(e?.[titleLan], 35)} </h3>
                                    <div className={`${fontLight} text-[10px]`}
                                        style={{
                                            fontSize: fontSize.mainPara
                                        }}
                                        dangerouslySetInnerHTML={{ __html: TruncateText(e.description?.[language], 350) }}
                                    >
                                        {/* {TruncateText(e.description?.[language], 350)} */}
                                    </div>
                                    <button
                                        className={`relative py-[6px] px-[12px] text-xs font-medium bg-[#00B9F2] text-white rounded flex items-center justify-start gap-2 ${isLeftAlign ? "flex-row-reverse" : ""}`}
                                        style={{
                                            fontSize: getDynamicSize(16),
                                            padding: getDynamicSize(15)
                                        }}
                                    >
                                        <img
                                            src={Arrow}
                                            alt="Arrow"
                                            className={` ${isLeftAlign ? 'scale-x-[-1]' : ''}  w-[11px] h-[11px]`}
                                        />
                                        <p>
                                            {currentContent?.["3"]?.content?.button?.[0]?.text?.[language]}
                                        </p>
                                    </button>
                                </article>
                            </section>
                        )
                    })
                }
            </div>

            {/* qoutes */}
            <section
                className={`${isLeftAlign && "text-left"} py-[256px] h-[400px] flex justify-center items-center ${isPhone ? "px-0" : "px-20"}`}
            >
                <div className="container flex justify-center items-center">
                    <div className="relative w-[634px] p-[45px] h-[327px] flex flex-col items-center justify-center bg-white rounded-lg">
                        <div
                            className={`absolute top-0 ${isPhone ? "-left-36" : "-left-40"} ${isPhone ? "h-[350px]" : "h-[327px]"} w-full`}
                        >
                            <img src={bracket_l} style={{ height: "110%" }} alt="" />
                        </div>
                        <div
                            className={`absolute -top-0 ${isPhone ? "-right-36" : "-right-40"} ${isPhone ? "h-[350px]" : "h-[327px]"} bg-tranparent bg-no-repeat bg-center`}
                        >
                            <img src={bracket_r} style={{ height: "110%" }} alt="" />
                        </div>
                        <img
                            src={doubleQuotes}
                            width="40"
                            height="40"
                            alt="asd"
                            className="mb-[24px] rotate-180 opacity-[.3]"
                        />
                        <p className={`text-[#97b3d8] font-Arial ${isPhone ? "" : "text-[20px]"} font-normal leading-[30px] tracking-[0.02em] text-center mb-[20px]
                        ${checkDifference(currentContent?.['2']?.content?.text?.[language], liveContent?.['2']?.content?.text?.[language])}
                        `}>
                            {currentContent?.['2']?.content?.text?.[language]}
                        </p>
                        <h5 className={`text-[rgba(11,54,156,0.3)] font-Arial text-[18px] italic font-bold leading-[27px] tracking-[0.01em] text-center
                            ${checkDifference(currentContent?.['2']?.content?.author?.[language], liveContent?.['2']?.content?.author?.[language])}
                            `}>
                            {currentContent?.['2']?.content?.author?.[language]}
                        </h5>
                    </div>
                </div>
            </section>

            {/* testomonials section 7 */}
            < section
                className={`py-[40px] pb-[40px] ${!isLeftAlign && 'rtl'} mx-auto relative overflow-hidden`}
                style={{
                    width: isComputer ? "800px" : `${screen - 10}px`,
                }}
            >
                <div className="container mx-auto" >
                    <div className="text-center mb-16">
                        <h2 className={`text-black text-3xl font-medium
                            ${checkDifference(currentContent?.["4"]?.content?.title?.[language], liveContent?.["4"]?.content?.title?.[language])}
                        
                        `}
                            style={{ fontSize: isComputer && dynamicSize(36, width) }}
                        >
                            {currentContent?.["4"]?.content?.title?.[language]}
                        </h2>
                    </div>

                    <div className="relative w-full" >
                        {/* Blur effect container */}
                        {
                            !isPhone &&
                            <div className="absolute top-0 left-0 h-full w-[20%] bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
                        }
                        {
                            !isPhone &&
                            <div className="absolute top-0 right-0 h-full w-[20%] bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
                        }
                        {currentContent?.["4"]?.items?.length > 1 &&
                            <Swiper
                                key={language}
                                modules={[Navigation, Autoplay, EffectCoverflow]}
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={slidesPerView}
                                loop={true}
                                spaceBetween={10}
                                effect="coverflow"
                                navigation={{
                                    prevEl: testimonialPrevRef.current,
                                    nextEl: testimonialNextRef.current,
                                }}
                                onSwiper={(swiper) => {
                                    swiper.params.navigation.prevEl = testimonialPrevRef.current;
                                    swiper.params.navigation.nextEl = testimonialNextRef.current;
                                    swiper.navigation.init();
                                    swiper.navigation.update();
                                    setSwiperInstance(swiper)
                                }}
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 250,
                                    modifier: 2,
                                    slideShadows: false,
                                }}
                                autoplay={{ delay: 2500 }}
                                // breakpoints={{
                                //     724: { slidesPerView: isPhone ? 1 : 1.5 },
                                //     500: { slidesPerView: 1 },
                                // }}
                                className={`${checkDifference(currentContent?.["4"]?.items, liveContent?.["4"]?.items)}`}
                                dir={isLeftAlign ? "ltr" : "rtl"}
                            >
                                {currentContent?.["4"]?.items?.map(
                                    (testimonial, index) => (
                                        <SwiperSlide key={index}
                                            dir={isLeftAlign ? "ltr" : "rtl"}
                                        >
                                            <div className={`border bg-white p-3 rounded-xl flex justify-center shadow-md`}>

                                                <div className="flex 1">
                                                    <img
                                                        src={testimonial?.liveModeVersionData?.image}
                                                        height={70}
                                                        width={70}
                                                        alt={testimonial?.name}
                                                        className="rounded-full h-[70px] w-[75px] object-cover border border-gray-200"
                                                    />
                                                </div>

                                                <div className="p-5 w-full">
                                                    <h3 className="text-gray-900 text-md font-bold"
                                                        style={{ fontSize: isComputer && dynamicSize(20, width) }}
                                                    >
                                                        {testimonial?.[titleLan]}
                                                    </h3>
                                                    <p className="text-gray-500 text-xs font-light mb-4"
                                                        style={{ fontSize: isComputer && dynamicSize(12, width) }}
                                                    >
                                                        {testimonial?.liveModeVersionData?.sections?.[0]?.content?.position?.[language]}
                                                    </p>
                                                    <p className="text-gray-900 text-xs font-light mb-6 leading-5"
                                                        style={{ fontSize: isComputer && dynamicSize(14, width) }}
                                                    >
                                                        {testimonial?.liveModeVersionData?.sections?.[0]?.content?.quote?.[language]}
                                                    </p>
                                                    <div className={`flex items-center justify- gap-2`}>
                                                        <span><FaRegBuilding /></span>
                                                        <p className={`text-gray-500 text-base font-bold ${isLeftAlign ? "text-left" : "text-right"}`}
                                                            style={{ fontSize: isComputer && dynamicSize(16, width) }}
                                                        >
                                                            {testimonial?.liveModeVersionData?.sections?.[0]?.content?.company?.[language]}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </SwiperSlide>
                                    )
                                )}
                            </Swiper>
                        }


                        <div className={`flex justify-center items-center gap-7 mt-5 ${!isLeftAlign && "flex-row-reverse"} text-[#00B9F2]`} dir={isLeftAlign ? "ltr" : "rtl"}>
                            <button
                                ref={testimonialNextRef}
                                className="w-[42px] h-[42px] rounded-full border border-[#00B9F2] flex justify-center items-center cursor-pointer"
                            >
                                {/* <img
                                    src="https://frequencyimage.s3.ap-south-1.amazonaws.com/de8581fe-4796-404c-a956-8e951ccb355a-Vector%20%287%29.svg"
                                    width="22"
                                    height="17"
                                    alt=""
                                    className={``}
                                /> */}
                                <span className={``} style={{ fontSize: fontSize.aboutMainPara }}><FaArrowLeftLong /></span>
                            </button>
                            <button
                                ref={testimonialPrevRef}
                                className="w-[42px] h-[42px] rounded-full border border-[#00B9F2] flex justify-center items-center cursor-pointer"
                            >
                                {/* <img
                                    src="https://frequencyimage.s3.ap-south-1.amazonaws.com/b2872383-e9d5-4dd7-ae00-8ae00cc4e87e-Vector%20%286%29.svg"
                                    width="22"
                                    height="17"
                                    alt=""
                                    className={``}
                                /> */}
                                <span dir="" className={`scale-x-[-1]`} style={{ fontSize: fontSize.aboutMainPara }}><FaArrowLeftLong /></span>
                            </button>

                        </div>
                    </div>
                </div>
            </section >


        </div >
    );
};

export default MarketPage;