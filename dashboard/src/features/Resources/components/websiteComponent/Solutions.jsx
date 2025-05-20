import React, { useEffect, useState } from "react";
import arrow from "../../../../assets/icons/right-wrrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { updateMainContent } from "../../../common/homeContentSlice";
import content from "./content.json"
import { SwiperSlide } from "swiper/react";
import { Swiper } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';
import { Img_url } from "../../../../routes/backend";

// import localFont from "next/font/local";
// import Button from "@/common/Button";
// import Image from "next/image";
// import { useGlobalContext } from "../../contexts/GlobalContext";
// import { useRouter } from "next/router";
// Font files can be colocated inside of `app`
// const BankGothic = localFont({
//   src: "../../../public/font/BankGothicLtBTLight.ttf",
//   display: "swap",
// });
// import dynamic from 'next/dynamic';
// import patch from "../../contexts/svg/path.jsx";
// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
// const ContactUsModal = dynamic(() => import('../header/ContactUsModal'), { ssr: false });

const SolutionPage = ({ currentContent, language, screen }) => {
    console.log(currentContent)
    const isComputer = screen > 1100
    const isTablet = 1100 > screen && screen > 767
    const isPhone = screen < 767
    // const currentContent = useSelector((state) => state.homeContent.present.solutions)
    const ImageFromRedux = useSelector((state) => state.homeContent.present.images)
    const dispatch = useDispatch()

    // const [isModal, setIsModal] = useState(false);
    // const handleContactUSClose = () => {
    //     setIsModal(false);
    // };

    const isLeftAlign = language === 'en'

    return (
        <div className=" bankgothic-medium-dt pb-8" dir={language === 'en' ? 'ltr' : "rtl"}>
            {/** banner  1 */}
            <section
                className={`relative py-[8rem] w-full bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''} px-12 ${isPhone ? "h-screen/2" : ""}`}
                style={{ backgroundImage: `url(${Img_url + currentContent?.['1']?.content?.images?.[0]?.url})` }}
            >
                <div className="container h-full relative flex">
                    <div className={`text-${isLeftAlign ? 'left' : 'right'} w-full transform ${isLeftAlign ? 'scale-x-[-1]' : ''}`}>
                        <h1 className="text-[#292E3D] text-[40px] font-medium leading-[77px] tracking-[-3.5px] mb-4">
                            {currentContent?.["1"]?.content?.title?.[language]}
                        </h1>
                        <p className={`text-[#0E172FB3] text-left text-xs font-semibold leading-[26px] mb-6 ${isLeftAlign ? "" : "ml-auto"} ${isPhone ? "w-[70%]" : "w-[50%]"} word-spacing-[5px]`}>
                            {currentContent?.["1"]?.content?.description?.[language]}
                        </p>
                        <button
                            className={`relative flex gap-2 items-center text-xs text-[white] font-medium py-[6px] px-[12px] ${isLeftAlign ? "" : "ml-auto"} bg-[#00B9F2] rounded-[4px] border-none cursor-pointer`}
                        // onClick={() => router.push('/project')}
                        >
                            {currentContent?.["1"]?.content?.button?.[0]?.text?.[language]}
                            <img
                                src={arrow}
                                width={11}
                                height={11}
                                alt="arrow"
                                className="left-[32px] scale-x-[-1]"
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/** What we do 2 */}
            <section
                className={`py-[88px] pb-[120px] px-10 ${language === "en" ? "text-left" : "text-right"
                    }`}
            >
                {currentContent?.["2"]?.content?.map((e, i) => {

                    return (
                        <div className="container bankgothic-regular-db-mt" key={i}>
                            <div className={`${isPhone ? "flex flex-col" : "grid grid-cols-[129px_1fr] gap-[67px]"} `}>
                                <div className={`flex justify-start w-[190px] py-[14px]`}>
                                    <span className="relative w-[10px] h-[20px]">
                                        <span className="absolute top-[1px] w-[4px] h-[20px] bg-red-500 rotate-[-15deg]"></span>
                                    </span>
                                    <h1 className="text-[20px] text-[#1F2937] font-bold leading-[20px] pr-[20px]">
                                        {e?.title?.[language]}
                                    </h1>
                                </div>
                                <div className="text-[#2A303C]">
                                    <div
                                        className={`  ${isPhone ? "leading-[20px] text-sm" : "leading-[40px]"} tracking-[-1.2px] mb-[32px]`}
                                        // className={` font-light text-[#1F2937] ${isPhone ? "leading-[20px] text-sm" : "leading-[40px]"} tracking-[-1.2px] mb-[32px] `}
                                        dangerouslySetInnerHTML={{ __html: e?.description?.[language] }}
                                    />

                                </div>
                            </div>
                        </div>
                    )
                })}
            </section>


            {/** gallary wrap 3 */}
            <div
                className="w-[800px] mx-auto"
                style={{
                    width: isComputer ? "50rem" : `${screen - 30}px`,
                    // direction: isRTL ? "rtl" : "ltr"  // Add this line
                }}
            >
                <Swiper
                    className=""
                    modules={[Navigation, Autoplay, EffectCoverflow]}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={isPhone ? 1 : 2}
                    loop={true}
                    spaceBetween={10}
                    onSwiper={(swiper) => {
                        setTimeout(() => {
                            swiper?.autoplay?.start();
                        }, 500);
                    }}
                    effect="coverflow"
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 250,
                        modifier: 2,
                        slideShadows: false,
                    }}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    // dir={isRTL ? "rtl" : "ltr"} // Add this line
                    breakpoints={{
                        724: { slidesPerView: isPhone ? 1 : 2 },
                        500: { slidesPerView: isPhone ? 1 : 2 },
                    }}
                >
                    {(currentContent?.["3"]?.content?.images || []).map((image, index) => (
                        <SwiperSlide key={`slide-${index}`}>
                            <div className="flex justify-center">
                                <img
                                    src={image.url.slice(0, 5) === "https" ? image.url : Img_url + image.url}
                                    alt={`Image ${index + 1}`}
                                    className="object-cover w-[400px] h-[400px] rounded-md border"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>


            {/** HowWeDo */}
            <section
                className={`py-[88px] pb-[120px] px-10 ${language === "en" ? "text-left" : "text-right"}`}
            >
                {currentContent?.howWeDo?.map((e, i) => {
                    return (
                        <div className="container bankgothic-regular-db-mt" key={i}>
                            <div className={`${isPhone ? "flex flex-col" : "grid grid-cols-[129px_1fr] gap-[67px]"} `}>
                                <div className={`flex justify-start w-[190px] py-[14px]`}>
                                    <span className="relative w-[10px] h-[20px]">
                                        <span className="absolute top-[1px] w-[4px] h-[20px] bg-red-500 rotate-[-15deg]"></span>
                                    </span>
                                    <h1 className="text-[20px] text-[#1F2937] font-bold leading-[20px] pr-[20px]">
                                        {e?.title?.[language]}
                                    </h1>
                                </div>
                                <div>
                                    <div
                                        className={` font-light ${isPhone ? "leading-[20px] text-sm" : "leading-[40px]"} tracking-[-1.2px] mb-[32px] `}
                                        // className={` font-light text-[#1F2937] ${isPhone ? "leading-[20px] text-sm" : "leading-[40px]"} tracking-[-1.2px] mb-[32px] `}
                                        dangerouslySetInnerHTML={{ __html: e?.description?.[language] }}
                                    />

                                </div>
                            </div>
                        </div>
                    )
                })}
            </section>

            {/** Showcase gallery wrap */}
            {/* <div
                className="w-[800px] mx-auto "
                style={{ width: isComputer ? "50rem" : `${screen - 30}px` }}
            >
                <Swiper
                    className=""
                    modules={[Navigation, Autoplay, EffectCoverflow]}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={isPhone ? 1 : 2} // Adjust dynamically
                    loop={currentContent?.gallery?.images?.length > 3} // Enable loop only if enough slides exist
                    spaceBetween={10}
                    onSwiper={(swiper) => {
                        setTimeout(() => {
                            swiper?.autoplay?.start();
                        }, 500);
                    }}

                    effect="coverflow"
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 250,
                        modifier: 2,
                        slideShadows: false,
                    }}
                    autoplay={{ delay: 2500, disableOnInteraction: false }} // Ensure autoplay works
                    breakpoints={{
                        724: { slidesPerView: isPhone ? 1 : 2 },
                        500: { slidesPerView: isPhone ? 1 : 2 },
                    }}
                >
                    {currentContent?.["4"]?.content?.images.map(
                        (image, index) => (
                            <SwiperSlide key={index}>
                                <div className={`rounded-lg overflow-hidden  transition-transform transform ${isPhone ? "h-[50vh]" : "h-[400px]"}`}>
                                    <img
                                        src={ImageFromRedux[`Image ${index + 4}`] || image.url}
                                        alt={`Image ${index + 1}`}
                                        className="object-cover w-[400px] h-[400px] rounded-md"
                                        style={{ objectPosition: "center" }}
                                    />
                                </div>
                            </SwiperSlide>
                        )
                    )}
                </Swiper>
            </div> */}

        </div>
    );
};

export default SolutionPage;