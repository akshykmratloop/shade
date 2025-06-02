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
import dynamicSize from "../../../../app/fontSizes";

const MarketPage = ({ language, screen, currentContent }) => {
    const testimonialPrevRef = useRef(null);
    const testimonialNextRef = useRef(null);
    // const currentContent = content?.market;
    // const handleContactUSClose = () => {
    //     setIsModal(false);
    // };
    const dispatch = useDispatch()
    const isComputer = screen > 1100
    const isPhone = screen < 760
    const isTablet = screen > 761 && screen < 1100
    const [activeTab, setActiveTab] = useState("buildings");
    const ImageFromRedux = useSelector((state) => state.homeContent.present.images)
    const isLeftAlign = language === 'en'
    const [filterMarketItems, setFilterMarketItems] = useState([]);
    const [width, setWidth] = useState(0)
    const [visibleMarketItemsCount, setVisibleMarketItemCount] = useState(6);
    const divRef = useRef(null)
    const getDynamicSize = (size) => {
        if (isComputer) { return dynamicSize(size, width) }
    }
    const titleLan = isLeftAlign ? 'titleEn' : "titleAr"


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


    return (
        <div ref={divRef} className={``}>
            {/* hero banner  */}
            <section className={`relative h-[487px] w-full bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''} ${isPhone ? "px-10" : "px-30"} `}
                style={{
                    padding: `0px ${isTablet ? '80px' : getDynamicSize(112)}`,
                    height: getDynamicSize(726),
                    backgroundImage: currentContent?.['1']?.content?.images?.[0]?.url ? `url(${Img_url + currentContent?.['1']?.content?.images?.[0]?.url})` :
                        "url('https://frequencyimage.s3.ap-south-1.amazonaws.com/b9961a33-e840-4982-bd19-a7dcc52fdd95-Hero.jpg')"
                }}>
                <div className={`container h-full relative  flex items-center ${isLeftAlign ? "justify-end" : "justify-end"}   `}>
                    <div className={`flex flex-col ${isLeftAlign ? 'right-5 text-left items-start ' : 'left-5 text-right items-end'} ${isPhone ? "max-w-[70%]" : "max-w-[55%]"} w-full ${isLeftAlign ? 'scale-x-[-1]' : ''}`}>
                        <h1
                            style={{ fontSize: isPhone ? "40px" : getDynamicSize(70) }}
                            className={`text-[#292E3D] ${isPhone ? "text-3xl" : "text-[50px] leading-[77px] tracking-[-3.5px]"} font-medium  mb-4`}>
                            {currentContent?.['1']?.content?.title?.[language]}
                        </h1>
                        <p
                            style={{ fontSize: getDynamicSize(14), width: getDynamicSize(486), lineHeight: getDynamicSize(28) }}
                            className={`text-[#0E172FB3] ${isPhone ? "" : "leading-[28px]"} text-sm font-semibold  mb-6 word-spacing-5`}>
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
                            <p>
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
                    padding: `0px ${getDynamicSize(112)}`,
                    margin: `${getDynamicSize(70)} 0px`
                }}
                className={`flex gap-[30px] ${isPhone ? "flex-col px-[30px]" : ""} ${isPhone ? "px-10" : "px-20"} my-[33px]`}>
                <h2
                    style={{ fontSize: getDynamicSize(60) }}
                    className={`text-[35px] ${isPhone ? "" : "w-1/2"} ${(isTablet || isPhone) && "leading-[34px]"}`}>
                    {currentContent?.['3']?.content?.introSection?.title?.[language]}
                </h2>
                <div
                    style={{ fontSize: getDynamicSize(14) }}
                    className={`text-[9.5px] ${isPhone ? "" : "w-1/2"}`}
                    dangerouslySetInnerHTML={{ __html: currentContent?.['3']?.content?.introSection?.description?.[language] || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, aliquam. Eum architecto alias adipisci tempore nemo tenetur accusantium id voluptatibus?   " }}
                />
            </section>

            <div className={`${isPhone ? "px-10" : "px-20"} flex flex-col gap-[20px]`}
                dir={isLeftAlign ? "ltr" : "rtl"}
                style={{
                    gap: getDynamicSize(30),
                    padding: `0px ${getDynamicSize(112)}`,
                    // margin: `${getDynamicSize(70)} 0px`
                }}
            >
                {
                    currentContent?.['3']?.items?.map((e, i) => {
                        let odd = i % 2 !== 0
                        return (
                            <section
                                style={{
                                    height: getDynamicSize(359),
                                    // width: getDynamicSize(1216)
                                    // gap: getDynamicSize(30),
                                    // padding: `0px ${getDynamicSize(112)}`,
                                    // margin: `${getDynamicSize(70)} 0px`
                                }}
                                className={`flex ${isPhone ? "flex-col" : odd && "flex-row-reverse"} bg-[#F8F8F8]`} key={e.id}>
                                <div className={` flex-[2_0_auto] border border-cyan-500`}
                                    style={{ width: isPhone ? '100%' : isTablet ? "300px" : getDynamicSize(463), height: isPhone ? '50%' : isTablet ? "40vh" : '100%' }}
                                >
                                    <img
                                        src="https://frequencyimage.s3.ap-south-1.amazonaws.com/851e35b5-9b3b-4d9f-91b4-9b60ef2a102c-Rectangle%2034624110.png"
                                        alt=""
                                        style={{
                                            width: isPhone ? '100%' : isTablet ? "300px" : getDynamicSize(463),
                                            height: isPhone ? '50vh' : isTablet ? "40vh" : '100%'
                                        }}
                                    />
                                </div>
                                <article
                                    dir={isLeftAlign ? "ltr" : "rtl"}
                                    className={`flex flex-col flex-[1_1_auto] gap-[13px] items-start justify-center text-[#292E3D] px-[38px] ${isPhone && "py-10"}`}>
                                    <h3 className="font-[400] text-[21px]"
                                        style={{
                                            fontSize: getDynamicSize(32)
                                        }}
                                    >{TruncateText(e?.[titleLan], 35)} </h3>
                                    <p className="font-[300] text-[10px]"
                                        style={{
                                            fontSize: getDynamicSize(16)
                                        }}>
                                        {TruncateText(e.description?.[language], 350)}
                                    </p>
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
                            {currentContent?.['2']?.content?.text?.[language]}
                        </p>
                        <h5 className="text-[rgba(11,54,156,0.3)] font-Arial text-[18px] italic font-bold leading-[27px] tracking-[0.01em] text-center">
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
                        <h2 className="text-black text-3xl font-medium"
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
                            < Swiper
                                modules={[Navigation, Autoplay, EffectCoverflow]}
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={isPhone ? 1 : 2}
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
                                }}
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 250,
                                    modifier: 2,
                                    slideShadows: false,
                                }}
                                autoplay={{ delay: 2500 }}
                                breakpoints={{
                                    724: { slidesPerView: isPhone ? 1 : 1.5 },
                                    500: { slidesPerView: 1 },
                                }}
                            >
                                {currentContent?.["4"]?.items?.map(
                                    (testimonial, index) => (
                                        <SwiperSlide key={index}
                                            dir={isLeftAlign ? "ltr" : "rtl"}
                                        >
                                            <div className={`border bg-white p-3 rounded-xl flex justify-center  shadow-md`}>

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
                                                        <img
                                                            src="https://frequencyimage.s3.ap-south-1.amazonaws.com/a813959c-7b67-400b-a0b7-f806e63339e5-ph_building%20%281%29.svg"
                                                            height={18}
                                                            width={18}
                                                            alt={testimonial?.name}
                                                            className="h-[18px] w-[18px]"
                                                        />
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


                        <div className={`flex justify-center items-center gap-7 mt-5 ${!isLeftAlign && "flex-row-reverse"}`}>
                            <button
                                ref={testimonialPrevRef}
                                className="w-[42px] h-[42px] rounded-full border border-[#00B9F2] flex justify-center items-center cursor-pointer"
                            >
                                <img
                                    src="https://frequencyimage.s3.ap-south-1.amazonaws.com/b2872383-e9d5-4dd7-ae00-8ae00cc4e87e-Vector%20%286%29.svg"
                                    width="22"
                                    height="17"
                                    alt=""
                                    className={`${isLeftAlign && 'scale-x-[-1]'}`}
                                />
                            </button>
                            <button
                                ref={testimonialNextRef}
                                className="w-[42px] h-[42px] rounded-full border border-[#00B9F2] flex justify-center items-center cursor-pointer"
                            >
                                <img
                                    src="https://frequencyimage.s3.ap-south-1.amazonaws.com/de8581fe-4796-404c-a956-8e951ccb355a-Vector%20%287%29.svg"
                                    width="22"
                                    height="17"
                                    alt=""
                                    className={`${isLeftAlign && 'scale-x-[-1]'}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </section >


        </div >
    );
};

export default MarketPage;