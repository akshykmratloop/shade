import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Arrow from "../../../../assets/icons/right-wrrow.svg";
import AboutUs from "../../../../assets/images/aboutus.png";
import background from "../../../../assets/images/Hero.png";
import highlightsvg from "../../../../assets/highlight.svg"
import {
    services,
    experience,
    recentProjects,
    markets,
    safety,
    clients,
    testimonials,
} from "../../../../assets/index";
import content from './content.json'
import { updateContent } from "../../../common/homeContentSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Pagination,
    Navigation,
    Autoplay,
    EffectCoverflow,
} from "swiper/modules";
import "swiper/css/navigation";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import { useGlobalContext } from "../../contexts/GlobalContext";
import blankImage from "../../../../assets/images/blankImage.webp";
import { isPlainObject } from "@reduxjs/toolkit";
import { TruncateText } from "../../../../app/capitalizeword";
// import dynamic from 'next/dynamic';
// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
// import ContactUsModal from "../header/ContactUsModal";
// import patch from "../../contexts/svg/path.jsx";
// // Font files can be colocated inside of `app`
// const BankGothic = localFont({
//   src: "../../../public/font/BankGothicLtBTLight.ttf",
//   display: "swap",
// });
// import Card from "./Card"; // Adjust the path accordingly
// import styles from "./Home.module.scss";
// import button from "@/common/button";
// import Image from "next/image";
// import Client from "../../assets/icons/client.svg";
// import required modules
// import localFont from "next/font/local";



const HomePage = ({ language, screen }) => {
    const isComputer = screen > 1100;
    const isTablet = screen < 1100 && screen > 730;
    const isPhone = screen < 738;
    const dispatch = useDispatch();
    const currentContent = useSelector((state) => state.homeContent.present.home)
    const ImagesFromRedux = useSelector((state) => {
        return state.homeContent.present.images
    })
    const [isModal, setIsModal] = useState(false);
    const [swiperInstance, setSwiperInstance] = useState(null);
    let isLeftAlign = language === "en"
    let textAlignment = isLeftAlign ? "text-left" : "text-right"
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [activeRecentProjectSection, setActiveRecentProjectSection] = useState(0);
    let chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };
    const projectsPerSlide = 4;
    let projectChunks = chunkArray(
        currentContent?.recentProjectsSection?.sections[activeRecentProjectSection]
            ?.projects || [],
        projectsPerSlide
    );
    const ProjectSlider = { ...recentProjects, ...markets, ...safety };


    useEffect(() => {
        if (swiperInstance) {
            swiperInstance.update();
        }
    }, [language]);

    useEffect(() => {
        dispatch(updateContent({ currentPath: "home", payload: (content?.home) }))
    }, [])
    //   const { language, content } = useGlobalContext();
    // const styles = ''
    // const currentContent = content?.home;
    // // Create refs for the navigation buttons
    const testimonialPrevRef = useRef(null);
    const testimonialNextRef = useRef(null);
    // const redirectionUrlForRecentProject = ["/project", "/market", "/"];
    // // Helper function to chunk array into groups of 4

    // const handleContactUSClose = () => {
    //     setIsModal(false);
    // };

    // // Inside your component, before the return statement:
    // console.log(currentContent?.recentProjectsSection);
    return (
        <div className={`w-[100%] relative ${textAlignment} bankgothic-medium-dt bg-[white]`}   >
            {/* banner */}
            <section className="w-full relative"
            >
                <span
                    className={`w-full block ${language === "en" ? "scale-x-100" : "scale-x-[-1]"
                        }`}
                >
                    <img
                        src={ImagesFromRedux.homeBanner || background}
                        alt="about-us"
                        className="w-[full] h-full object-cover"
                        style={{ objectPosition: "center", transform: "scaleX(-1)", height: isTablet ? "500px" : isPhone && "500px" }} />
                </span>
                <div
                    className={`container mx-auto absolute ${isComputer ? "top-[20%]" : "top-16"}  left-0 right-0 px-4`}>
                    <div className={`text-left flex flex-col ${language === "en" ? "items-start" : "items-end"} ${textAlignment} ${isPhone ? "px-[0px] py-10" : "px-[80px]"}`}>
                        <h1 className={`text-[#292E3D] text-[35px] tracking-[0px] leading-[2.5rem] capitalize font-[500] mb-4 ${isPhone ? "w-full" : "w-1/2"} ${(450 / 1182) * screen} `}
                        >
                            {currentContent?.homeBanner?.title[language]}
                        </h1>
                        <p className={`text-[#0E172FB3] font-semibold leading-[16px] mb-6 ${isPhone ? "w-full text-[12px]" : "w-1/2 text-[10px]"} tracking-[1px]`}>
                            {currentContent?.homeBanner?.description[language]}
                        </p>
                        <button
                            className={`relative items-center flex ${isLeftAlign ? "" : "flex-row-reverse"} gap-1 text-[12px] font-medium px-[12px] py-[6px] px-[12px] bg-[#00b9f2] text-white rounded-md`}
                            onClick={() => { }}
                        >
                            <span>{currentContent?.homeBanner?.buttonText[language]}</span>
                            <img
                                src={Arrow}
                                width="10"
                                height="11"
                                alt=""
                                style={{ transform: isLeftAlign ? "rotate(180deg)" : "" }}
                            />
                        </button>
                    </div>
                </div>
            </section>
            {/* about us section */}
            <section className={` ${isPhone ? "px-2 py-[60px]" : "px-20 py-[120px]"} ${language === "en" ? "" : " direction-rtl"} items-start`}>
                <div className={`relative container mx-auto flex ${isPhone ? "flex-col" : ""} ${isLeftAlign ? "" : "flex-row-reverse"} items-center`}>
                    {/* Image section */}
                    <div className={`${isPhone ? "w-[90%]" : "w-[70%]"} border border-[#00B9F2] h-[500px] overflow-hidden rounded-sm shadow-lg`}>
                        <img src={ImagesFromRedux.aboutUsSection || AboutUs} alt="about-us" className="w-full h-[500px] object-cover" />
                    </div>
                    {/* About content */}
                    <div className={`${isPhone ? " " : "absolute "} ${isLeftAlign ? "right-0 text-left" : "left-0 text-right"} bg-[#145098] ${isTablet ? "p-10 py-14" : "p-14 py-20"} rounded-sm w-[23rem]`} >
                        <h2 className="text-white text-[28px] leading-[1.8rem] mb-4 font-normal">
                            {currentContent?.aboutUsSection?.title[language]}
                        </h2>
                        <p className="text-white text-[12px] font-light leading-[16px] mb-4">
                            {currentContent?.aboutUsSection?.description[language]}
                        </p>
                        <p className="text-white text-[12px] font-light leading-[16px] mb-4">
                            {currentContent?.aboutUsSection?.description2[language]}
                        </p>
                        <button className="px-[6px] py-[2px] bg-[#00B9F2] text-white text-[12px] rounded-md hover:bg-opacity-90 text-right">
                            {currentContent?.aboutUsSection?.buttonText[language]}
                        </button>
                    </div>

                </div>
            </section>
            {/* service section */}
            <section className="py-10 bg-gray-100 ">
                <div className="container mx-auto px-6">
                    <h2 className="text-center text-3xl font-light text-[#292E3D] mb-9">
                        {currentContent?.serviceSection?.title[language]}
                    </h2>

                    <div className={`${isPhone ? "flex gap-4 flex-col" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-12 sm:gap-6 px-8"}`}>
                        {currentContent?.serviceSection?.cards?.map((card, key) => {
                            if (!card.display) return null
                            return (
                                <div key={key} className={`w-full h-44 flex items-center justify-center p-6 rounded-md transition-transform duration-300 hover:scale-105 cursor-pointer ${key % 2 !== 0 ? "bg-stone-200 " : "bg-blue-900 text-[white]"} `}>
                                    <div className="flex flex-col items-center gap-4">
                                        <img src={services?.[card.iconName]} width={40} height={40} alt="Icon" className="h-10 w-10" />
                                        <h5 className="relative text-lg font-light text-center">
                                            {card.title[language]}
                                            <span className="block h-[2px] w-16 bg-gray-300 mt-2 mx-auto"></span>
                                        </h5>
                                    </div>
                                </div>)
                        })}
                    </div>
                </div>
            </section>
            {/* experience section */}
            <section className={`py-[115px] pb-[186px]  ${isComputer ? "px-20" : !isLeftAlign ? "px-8" : "px-10"}`} dir={isLeftAlign ? 'ltr' : "rtl"}>
                <div
                    className={`container mx-auto flex ${isPhone ? "flex-col gap-[350px]" : "gap-10"} `}>
                    <div className={`w-10 relative flex-1`}
                    >
                        <div className={`relative ${ isTablet ? (!isLeftAlign ? "left-[-70px]" : "left-[15px]") :""} ${!isLeftAlign && isPhone && "left-[-310px]"}`}>
                            {currentContent?.experienceSection?.cards?.map((item, key) => {
                                // Set top position based on whether key is odd or even
                                const topValue = Math.floor(key / 2) * 140 + (key % 2 !== 0 ? -35 : 25); // Odd = move up, Even = move down
                                return (
                                    <div
                                        key={key}
                                        style={{ top: `${topValue}px`, zIndex: key + 1 }}
                                        className={`w-[180px] h-[100px] absolute rounded-md bg-white shadow-lg p-4 ${key % 2 !== 0 ? !isLeftAlign ? "left-[170px]" : "xl:left-[150px]" : "left-0"}`}
                                    >
                                        <div className="relative">
                                            <img
                                                className={`absolute ${key % 2 === 1 ? "top-[-22px] right-[-32px]" : "left-[-36px] top-[-27px]"}`}
                                                src={ImagesFromRedux[item.items] || experience?.[item.iconName]}
                                                width={40}
                                                height={key === 1 ? 47 : 60}
                                                alt=""
                                            />
                                        </div>
                                        <h3 className="text-[#292E3D] text-2xl font-semibold pl-2 font-sans">{item.count}</h3>
                                        <h5 className={`text-black text-xs font-light relative before:absolute ${isLeftAlign ? "before:left-[-10px]" : "before:right-[-10px]"} before:top-0 before:w-[5px] before:h-[25px] before:bg-orange-500`}>
                                            {item.title[language]}
                                        </h5>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={`max-w-[420px] ${isPhone ? "" : "pt-12"} ${isTablet ? !isLeftAlign ? "pr-[64px]" : "pl-[40px]" : ""}  flex-1 `}>
                        <h2 className="text-[#00B9F2] text-4xl font-bold leading-[50px] mb-6 ">
                            {currentContent?.experienceSection?.title[language]}
                        </h2>
                        <p className="text-[#292E3D] text-sm font-[300] leading-4 mb-8" style={{ fontWeight: "200" }}>
                            {currentContent?.experienceSection?.description[language]}
                        </p>
                        <button
                            className={`text-white bg-[#00B9F2] px-[12px] py-1 text-sm text-lg rounded-md ${language === "ar" ? '!px-4' : ''}`}
                            onClick={() => setIsModal(true)}
                        >
                            {currentContent?.experienceSection?.buttonText?.[language]}
                        </button>
                    </div>
                </div>
            </section>
            {/* subProjects */}
            <section className={`py-[58px] ${isPhone ? "px-2" : "px-8"} overflow-hidden relative `} dir={isLeftAlign? 'ltr' : 'rtl'}>
                <div className={`container mx-auto flex  ${!isLeftAlign && 'flex-row-reverse'} ${!isLeftAlign && isTablet && "pl-[200px]"}`}>
                    <div className={`flex justify-end absolute top-[10px]   ${isLeftAlign ? "right-7" : "left-7"}`}>
                        {activeRecentProjectSection === 2 ? (
                            ""
                        ) : (
                            <button
                                type="button"
                                className={`relative bg-transparent border-none text-[#667085] text-right text-[16px] leading-[24px] cursor-pointer flex gap-2 items-center `}
                                onClick={() => { }}
                            >
                                {
                                    currentContent?.recentProjectsSection?.buttons[0]?.text[language]
                                }
                                <img
                                    src="https://frequencyimage.s3.ap-south-1.amazonaws.com/5d82e78b-cb95-4768-abfe-247369079ce6-bi_arrow-up.svg"
                                    width="18"
                                    height="17"
                                    alt=""
                                    className={`w-[18px] h-[17px] ${isLeftAlign ? 'transform scale-x-[-1]' : ''}`}
                                />
                            </button>
                        )}
                    </div>


                    <div className={`flex ${isTablet ? isPhone ? "gap-[20px]" : "gap-[30px]" : "gap-[30px]"} ${isLeftAlign && "pr-20"}`}>
                        <div className={`leftDetails min-w-[150px]  ${isTablet&&"w-[180px]"}`}>
                            {currentContent?.recentProjectsSection?.sections?.map((section, index) => (
                                <div
                                    key={index}
                                    className={`relative `}
                                >
                                    <span
                                        className={
                                            activeRecentProjectSection === index
                                                ? 'font-bold leading-[36px] mb-[16px] cursor-pointer relative'
                                                : 'font-bold leading-[36px] mb-[16px] cursor-pointer'
                                        }
                                        onClick={() => setActiveRecentProjectSection(index)}
                                    >
                                        <h2
                                            className={`${activeRecentProjectSection === index ? 'text-[#292e3d]' : 'text-[#292e3d]'} text-md`}
                                        >
                                            {section?.title[language]}
                                        </h2>
                                    </span>

                                    <p
                                        className={`${activeRecentProjectSection === index
                                            ? 'text-[#292e3d] text-xs leading-[25px] mb-[24px] opacity-100 transform translate-y-0 transition-opacity duration-300'
                                            : 'text-[#292e3d] text-xs leading-[25px] mb-[24px] opacity-0 h-0 transform translate-y-[-20px] transition-opacity duration-300'
                                            }`}
                                    >
                                        {section?.description[language]}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className={`${isPhone ? "w-[220px]" : isTablet ? "w-[300px]" : "w-[600px]"} `}>
                            <Swiper
                                key={language}
                                modules={[Pagination, Navigation]}
                                className={`mySwiper w-[722px]  pb-[65px]`}

                                navigation={{
                                    prevEl: prevRef.current,
                                    nextEl: nextRef.current,
                                }}
                                onSwiper={(swiper) => {
                                    setSwiperInstance(swiper);
                                    swiper.params.navigation.prevEl = prevRef.current;
                                    swiper.params.navigation.nextEl = nextRef.current;
                                    swiper.navigation.init();
                                    swiper.navigation.update();
                                }}
                            >
                                {projectChunks?.map((chunk, slideIndex) => (
                                    <SwiperSlide key={slideIndex}>
                                        <div className={`${isPhone ? "flex flex-col" : `grid grid-cols-2 gap-[12px] ${isTablet ? "w-[350px] " : "w-[600px]"}`}`}
                                            style={{ width: isComputer ? "" : isPhone ? `${(600 / 1180) * screen}px` : `${(750 / 1180) * screen}px`, gap: isComputer ? "" : `${(40 / 1180) * screen}px` }}
                                        >
                                            {chunk?.map((project, cardIndex) => {
                                                if (!project.display) return null
                                                return (
                                                    <div className=" rounded-[4px]" key={cardIndex}>
                                                        <div className={`w-full ${isComputer ? "h-[200px]" : "h-[150px]"}`} >
                                                            <img
                                                                className={`w-full h-full object-cover object-center ${project.image
                                                                    ? ''
                                                                    : 'opacity-[0.1]'
                                                                    }`}
                                                                alt={project?.title[language]}
                                                                src={ImagesFromRedux[project.image] ? ImagesFromRedux[project.image] : project.image
                                                                    ? ProjectSlider?.[project?.image]
                                                                    : blankImage}
                                                            />
                                                        </div>
                                                        <div className="p-[18px_12px_12px_12px] flex flex-col justify-center items-start gap-[16px] bg-[#00B9F2]">
                                                            <h5
                                                                title={project?.title[language]}
                                                                className="text-white text-[20px] font-semibold leading-[normal] h-[40px]"
                                                            >
                                                                {TruncateText(project?.title[language], 45)}
                                                            </h5>
                                                            <p
                                                                title={project?.subtitle[language]}
                                                                className="text-white text-[16px] font-light leading-[normal]"
                                                            >
                                                                {TruncateText(project?.subtitle[language], (isTablet ? 16 : 25))}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            )}
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Custom buttons */}
                            <div
                                className={`flex items-center justify-between relative mt-8 font-sans`}
                                style={{ width: isComputer ? "" : isPhone ? "220px" : `${(400 / 1180) * screen}px` }}
                            // ${projectChunks?.length <= 1 ? 'hidden' : ''}
                            >
                                <button ref={prevRef} className={`py-[12px] px-[20px] text-[#00B9F2] text-md font-medium border-[1px] border-[#00B9F2] rounded-[6px] flex gap-2 items-center ${isPhone ? "w-[120px]" : "min-w-[246px]"} justify-center  bg-white transition-all duration-200`}>
                                    <img
                                        src="https://frequencyimage.s3.ap-south-1.amazonaws.com/b2872383-e9d5-4dd7-ae00-8ae00cc4e87e-Vector%20%286%29.svg"
                                        width="18"
                                        height="17"
                                        alt=""
                                        className={`w-[18px] h-[17px] ${language === "en" && 'transform scale-x-[-1]'}`}
                                    />
                                    
                                    {!isPhone &&
                                        currentContent?.recentProjectsSection?.buttons[1]?.text[language]
                                    }
                                </button>
                                <button ref={nextRef} className={`py-[12px] px-[20px] text-[#00B9F2] text-md font-medium border-[1px] border-[#00B9F2] rounded-[6px] flex gap-2 items-center ${isPhone ? "w-[120px]" : "min-w-[246px]"} justify-center bg-white transition-all duration-200`}>
                                    {!isPhone &&
                                        currentContent?.recentProjectsSection?.buttons[2]?.text[language]
                                    }
                                    <img
                                        src="https://frequencyimage.s3.ap-south-1.amazonaws.com/de8581fe-4796-404c-a956-8e951ccb355a-Vector%20%287%29.svg"
                                        width="18"
                                        height="17"
                                        alt=""
                                        className={`w-[18px] h-[17px] ${isLeftAlign && 'transform scale-x-[-1]'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* client section */}
            <section className="bg-[#00B9F2] py-12 relative">
                <img
                    src="https://frequencyimage.s3.ap-south-1.amazonaws.com/98d10161-fc9a-464f-86cb-7f69a0bebbd5-Group%2061%20%281%29.svg"
                    width="143"
                    height="144"
                    alt="about-us"
                    className="absolute top-0 left-0"
                />
                <img
                    src="https://frequencyimage.s3.ap-south-1.amazonaws.com/216c2752-9d74-4567-a5fc-b5df034eba6e-Group%2062%20%281%29.svg"
                    width="180"
                    height="181"
                    alt="about-us"
                    className="absolute bottom-0 right-0"
                />
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-white text-3xl font-bold mb-4">
                            {currentContent?.clientSection?.title[language]}
                        </h2>
                        <p className="text-white text-base font-light leading-6">
                            {currentContent?.clientSection?.description[language]}
                        </p>
                    </div>
                    <div className={`flex items-center justify-around ${isPhone ? "flex-col gap-4" : "flex-wrap gap-2"}`}>
                        {currentContent?.clientSection?.clients?.map((client, key) => (
                            <div
                                key={key}
                                className="w-[120px] h-[120px] bg-white rounded-full flex items-center justify-center p-5"
                            >
                                <img
                                    src={ImagesFromRedux[client.image] || clients?.[client?.image]}
                                    width={key === 3 ? 100 : 66}
                                    height={key === 3 ? 30 : 66}
                                    alt="about-us"
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* testomonials section  */}
            <section
                className={`py-[40px] pb-[40px] ${!isLeftAlign && 'rtl'} mx-auto relative overflow-hidden`}
                style={{ width: isComputer ? "800px" : `${screen - 10}px` }}
            >
                <div className="container mx-auto" >
                    <div className="text-center mb-5">
                        <h2 className="text-black text-3xl font-medium">
                            {currentContent?.testimonialSection?.title[language]}
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

                        <Swiper
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
                            {currentContent?.testimonialSection?.testimonials?.map(
                                (testimonial, index) => (
                                    <SwiperSlide key={index}
                                        dir={isLeftAlign ? "ltr" : "rtl"}
                                    >
                                        <div className={`border bg-white p-3 rounded-xl flex justify-center  shadow-md`}>

                                            <div className="flex 1">
                                                <img
                                                    src={testimonials?.[testimonial?.image]}
                                                    height={70}
                                                    width={70}
                                                    alt={testimonial?.name}
                                                    className="rounded-full h-[70px] w-[75px] object-cover border border-gray-200"
                                                />
                                            </div>

                                            <div className="p-5 w-full">
                                                <h3 className="text-gray-900 text-md font-bold">
                                                    {testimonial?.name?.[language]}
                                                </h3>
                                                <p className="text-gray-500 text-xs font-light mb-4">
                                                    {testimonial?.position?.[language]}
                                                </p>
                                                <p className="text-gray-900 text-xs font-light mb-6 leading-5">
                                                    {testimonial?.quote?.[language]}
                                                </p>
                                                <div className={`flex items-center justify- gap-2`}>
                                                    <img
                                                        src="https://frequencyimage.s3.ap-south-1.amazonaws.com/a813959c-7b67-400b-a0b7-f806e63339e5-ph_building%20%281%29.svg"
                                                        height={18}
                                                        width={18}
                                                        alt={testimonial?.name}
                                                        className="h-[18px] w-[18px]"
                                                    />
                                                    <p className={`text-gray-500 text-base font-bold ${isLeftAlign ? "text-left" : "text-right"}`}>
                                                        {testimonial?.company?.[language]}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </SwiperSlide>
                                )
                            )}
                        </Swiper>

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
            </section>

            {/* new project section */}
            <section className={`py-16 w-[100%] ${isPhone ? "px-[30px]" : "px-[80px]"} bg-transparent`}>
                <div className="container mx-auto">
                    <div className="text-center bg-transparent">
                        <h2 className="text-3xl font-medium text-black mb-5">
                            {currentContent?.newProjectSection?.title[language]}
                        </h2>
                        <p className="text-xs font-light text-black leading-7 mb-2 relative bg-transparent">
                            {currentContent?.newProjectSection?.description1[language].replace(
                                currentContent?.newProjectSection?.highlightedText[language],
                                `"${currentContent?.newProjectSection?.highlightedText[language]}"`
                            )}
                            <i
                                className={`absolute ${isLeftAlign ? isPhone ? "right-[130px] top-[55px]" : "right-[250px]" : "right-[152px]"} top-0  opacity-70 z-10 
                    ${language === 'ar' ? 'right-48' : ''}`}
                                style={{
                                    backgroundImage: `url(${highlightsvg})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'contain',
                                    width: '120px',
                                    height: '100%',
                                    mixBlendMode: 'multiply',
                                }}
                            />
                        </p>
                        <p className="text-xs font-light text-black leading-7 mb-2">
                            {currentContent?.newProjectSection?.description2[language]}
                        </p>
                        <button
                            className="bg-[#00B9F2] text-xs text-white px-4 py-2 text-lg mt-11 mx-auto block rounded"
                            onClick={() => setIsModal(true)}
                        >
                            {currentContent?.newProjectSection?.button?.[language]}
                        </button>
                    </div>
                </div>
            </section>
            {/* <ContactUsModal isModal={isModal} onClose={handleContactUSClose} /> */}


        </div>)
};

// <section className={styles.new_project_wrapper}>
//     <div className={`container ${styles.main_container}`}>
//         <div className={styles.Client_content}>
//             <h2 className={`${styles.title}`}>
//                 {currentContent?.newProjectSection?.title[language]}
//             </h2>
//             <p className={`${styles.description}  `}>
//                 {currentContent?.newProjectSection?.description1[
//                     language
//                 ].replace(
//                     currentContent?.newProjectSection?.highlightedText[language],
//                     `"${currentContent?.newProjectSection?.highlightedText[language]}"`
//                 )}

//                 <i className={language === "ar" && styles.arabicVersion}>
//                     {/* {patch()} */}
//                 </i>
//             </p>
//             <p className={`${styles.description}  `}>
//                 {currentContent?.newProjectSection?.description2[language]}
//             </p>
//             <button
//                 className={styles.view_btn}
//                 onClick={() => setIsModal(true)}
//             >
//                 {currentContent?.newProjectSection?.button?.text[language]}
//             </button>
//         </div>
//     </div>
// </section>
//     );
// };

export default HomePage;
