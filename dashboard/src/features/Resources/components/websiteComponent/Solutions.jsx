import React, { useEffect, useState } from "react";
import arrow from "../../../../assets/icons/right-wrrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { updateContent } from "../../../common/homeContentSlice";
import content from "./content.json"
import { SwiperSlide } from "swiper/react";
import { Swiper } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";
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

const SolutionPage = ({ language, screen }) => {
    const isComputer = screen > 1100
    const isTablet = 1100 > screen && screen > 767
    const isPhone = screen < 767
    const currentContent = useSelector((state) => state.homeContent.present.solution)
    const ImageFromRedux = useSelector((state) => state.homeContent.present.images)
    const dispatch = useDispatch()


    // const [isModal, setIsModal] = useState(false);
    // const handleContactUSClose = () => {
    //     setIsModal(false);
    // };

    const isLeftAlign = language === 'en'

    useEffect(() => {
        dispatch(updateContent({ currentPath: "solution", payload: content.solution }))

    }, [])
    return (
        <div className=" bankgothic-medium-dt">
            {/** banner */}
            <section
                className={`relative py-[10rem] w-full bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''} px-12 ${isPhone?"h-screen":""}`}
                style={{ backgroundImage: ImageFromRedux.bannerBackground ? `url(${ImageFromRedux.bannerBackground})` : 'url("https://frequencyimage.s3.ap-south-1.amazonaws.com/310398e2-856d-4e59-b0b0-10e811ca1f82-solution%20%281%29.png")' }}
            >
                <div className="container h-full relative flex">
                    <div className={`text-${isLeftAlign ? 'left' : 'right'} w-full transform ${isLeftAlign ? 'scale-x-[-1]' : ''}`}>
                        <h1 className="text-[#292E3D] text-[40px] font-medium leading-[77px] tracking-[-3.5px] mb-4">
                            {currentContent?.banner?.title[language]}
                        </h1>
                        <p className={`text-para-light text-left text-xs font-semibold leading-[26px] mb-6 ${isLeftAlign ? "" : "ml-auto"} w-[50%] word-spacing-[5px]`}>
                            {currentContent?.banner?.description[language]}
                        </p>
                        <button
                            className={`relative flex items-center text-xs text-[white] font-medium py-[12px] px-[48px] ${isLeftAlign ? "" : "ml-auto"} bg-sky-500 rounded-xl border-none cursor-pointer`}
                        // onClick={() => router.push('/project')}
                        >
                            <img
                                src={arrow}
                                width={18}
                                height={17}
                                alt="arrow"
                                className="absolute left-[32px] top-1/2 -translate-y-1/2"
                            />
                            &nbsp;{currentContent?.banner?.button?.[language]}
                        </button>
                    </div>
                </div>
            </section>

            {/** What we do */}
            <section
                className={`py-[88px] pb-[120px] px-10 ${language === "en" ? "text-left" : "text-right"
                    }`}
            >
                <div className="container bankgothic-regular-db-mt">
                    <div className={`${isPhone ? "flex flex-col" : "grid grid-cols-[129px_1fr] gap-[67px]"} `}>
                        <div className={`flex justify-center w-[190px] py-[14px]`}>
                            <span className="relative w-[10px] h-[20px]">
                                <span className="absolute top-[1px] w-[4px] h-[20px] bg-red-500 rotate-[-15deg]"></span>
                            </span>
                            <h1 className="text-[20px] font-bold leading-[20px] pr-[20px]">
                                {currentContent?.whatWeDo?.title[language]}
                            </h1>
                        </div>
                        <div>
                            <p
                                className={` font-light ${isPhone?"leading-[20px] text-sm":"leading-[40px]"} tracking-[-1.2px] mb-[32px] `}
                            >
                                {currentContent?.whatWeDo?.description1[language]}
                            </p>
                            <p
                                className={` font-light ${isPhone?"leading-[20px] text-sm":"leading-[40px]"} tracking-[-1.2px] mb-[32px] `}
                            >
                                {currentContent?.whatWeDo?.description2[language]}
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/** gallary wrap */}

            <div
                className="w-[800px] mx-auto "
                style={{width:isComputer ? "30rem":`${screen-30}px`}}
            >
                <Swiper
                    modules={[Navigation, Autoplay, EffectCoverflow]}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{ delay: 2500 }}
                    effect="coverflow"
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 300,
                        modifier: 1.5,
                        slideShadows: false,
                    }}
                   
                >
                    {currentContent?.gallery?.images.map(
                        (image, index) => (
                            <SwiperSlide key={index}>
                                <div className={`rounded-lg overflow-hidden shadow-lg transition-transform transform ${isPhone?"h-[50vh]":"h-[500px]"}`}>

                                    <img
                                        src={ImageFromRedux[`Image ${index + 1}`] || image.url}
                                        alt={`Image ${index + 1}`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </SwiperSlide>
                        )
                    )}
                </Swiper>
            </div>

            {/** HowWeDo */}
            <section
                className={`py-[88px] pb-[120px] px-10 ${language === "en" ? "text-left" : "text-right"}`}
            >
                <div className="container">
                    {/* <div className="grid grid-cols-[129px_1fr] gap-[67px]"> */}
                    <div className={`${isPhone ? "flex flex-col" : "grid grid-cols-[129px_1fr] gap-[67px]"} `}>

                        <div className="flex justify-center  w-[190px] py-[14px]">
                            <span className="relative w-[10px] h-[20px]">
                                <span className="absolute top-[1px] w-[4px] h-[20px] bg-red-500 rotate-[-15deg]"></span>
                            </span>
                            <h1 className="text-right  font-bold text-[20px] leading-[20px] pr-[20px]">
                                {currentContent?.howWeDo?.title[language]}
                            </h1>
                        </div>
                        <div>
                            <p
                                className={`${isPhone?"leading-[20px] text-sm":"leading-[40px]"} font-light tracking-[-1.2px] mb-[32px]`}
                            >
                                {currentContent?.howWeDo?.description[language]}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/** Showcase gallery wrap */}
            <div
                className="w-[800px] mx-auto "
                style={{width:isComputer ? "40rem":`${screen-30}px`}}
            >
                <Swiper
                    modules={[Navigation, Autoplay, EffectCoverflow]}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{ delay: 2500 }}
                    effect="coverflow"
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 300,
                        modifier: 1.5,
                        slideShadows: false,
                    }}
                >
                    {currentContent?.gallery?.showcase.map(
                        (image, index) => (
                            <SwiperSlide key={index}>
                                <div className={`rounded-lg overflow-hidden shadow-lg transition-transform transform ${isPhone?"h-[50vh]":"h-[500px]"}`}>
                                    <img
                                        src={ImageFromRedux[`Image ${index + 1}`] || image.url}
                                        alt={`Image ${index + 1}`}
                                        className="object-cover w-full h-full"
                                        style={{objectPosition:"center"}}
                                    />
                                </div>
                            </SwiperSlide>
                        )
                    )}
                </Swiper>
            </div>



            {/* <ContactUsModal isModal={isModal} onClose={handleContactUSClose} /> */}

        </div>
    );
};

export default SolutionPage;


// {/* 

// <section
// className={` ${language === "en" && styles.leftAlign}   ${styles.new_project_wrapper
//     }`}
// >
// <div className={`container ${styles.main_container}`}>
//     <div className={styles.Client_content}>
//         {/* <AnimatedText text={currentContent?.newProject?.title[language]} Wrapper="h2" repeatDelay={0.03} className={`${styles.title} ${BankGothic.className}`} /> */}
//         <h2 className={`${styles.title}`}>
//             {currentContent?.newProject?.title[language]}
//         </h2>
//         <p className={`${styles.description} ${BankGothic.className}`}>
//             {currentContent?.newProject?.description1[language].replace(
//                 currentContent?.newProject?.highlightedText[language],
//                 `"${currentContent?.newProject?.highlightedText[language]}"`
//             )}
//             <i className={language === "ar" && styles.arabicVersion}>
//                 {patch()}
//             </i>
//         </p>

//         <p className={`${styles.description} ${BankGothic.className}`}>
//             {currentContent?.newProject?.description2[language]}
//         </p>
//         <Button className={styles.view_btn}
//             onClick={() => setIsModal(true)}

//         >
//             {currentContent?.newProject?.button.text[language]}
//         </Button>
//     </div>
// </div>
// </section> 
// 
// */}