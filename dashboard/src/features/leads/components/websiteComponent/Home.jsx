import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Arrow from "../../../../assets/icons/right-wrrow.svg";
import AboutUs from "../../../../assets/images/aboutus.png";
import background from "../../../../assets/images/Hero.png";
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



const HomePage = ({ language }) => {
    const dispatch = useDispatch();
    const currentContent = useSelector((state) => state.homeContent.present.home)
    const ImagesFromRedux = useSelector((state) => {
        return state.homeContent.present.images
    })
    const [isModal, setIsModal] = useState(false);
    const [swiperInstance, setSwiperInstance] = useState(null);
    let isEnglish = language === "en"
    let textAlignment = isEnglish ? "text-left" : "text-right"
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

    const TruncateText = (text, length) => {
        if (text.length > (length || 50)) {
            return `${text.slice(0, length || 50)}...`;
        }
        return text;
    };

    useEffect(() => {
        if (swiperInstance) {
            swiperInstance.update();
        }
    }, [language]);

    useEffect(() => {
        dispatch(updateContent((content?.home)))
    }, [])
    //   const { language, content } = useGlobalContext();
    // const styles = ''
    // const currentContent = content?.home;
    // // Create refs for the navigation buttons
    // const testimonialPrevRef = useRef(null);
    // const testimonialNextRef = useRef(null);
    // const redirectionUrlForRecentProject = ["/project", "/market", "/"];
    // // Helper function to chunk array into groups of 4

    // const handleContactUSClose = () => {
    //     setIsModal(false);
    // };

    // // Inside your component, before the return statement:
    // console.log(currentContent?.recentProjectsSection);
    return (
        <div className={`w-[100%] relative ${textAlignment} bankgothic-medium-dt bg-[white]`}>
            {/* banner */}
            <section className="w-full relative " >
                <span
                    className={`w-full block ${language === "en" ? "scale-x-100" : "scale-x-[-1]"
                        }`}
                >
                    <img src={ImagesFromRedux.homeBanner || background} alt="about-us" className="w-[1050px] h-full object-cover" style={{ objectPosition: "center", transform: "scaleX(-1)" }} />
                </span>
                <div

                    className="container mx-auto absolute top-[20%] left-0 right-0 px-4">
                    <div className={`text-left flex flex-col ${language === "en" ? "items-start" : "items-end"} ${textAlignment}`}>
                        <h1 className="mx-[80px] text-[#292E3D] text-[35px] tracking-[.2rem] leading-[2.5rem] capitalize font-semibold  mb-4 w-[450px] "
                        >
                            {currentContent?.homeBanner?.title[language]}
                        </h1>
                        <p className="mx-[80px] text-gray-800 text-[10px] font-semibold leading-[16px] mb-6 w-1/2 tracking-[2px]">
                            {currentContent?.homeBanner?.description[language]}
                        </p>
                        <button
                            className={`mx-[80px] relative items-center flex ${isEnglish ? "" : "flex-row-reverse"} gap-1 text-[12px] font-medium px-[12px] py-[8px] ${language === "en" ? "py-[10px] px-[35px]" : ""
                                } bg-blue-500 text-white rounded-md`}
                            onClick={() => { }}
                        >
                            <span>{currentContent?.homeBanner?.buttonText[language]}</span>
                            <img
                                src={Arrow}
                                width="10"
                                height="11"
                                alt=""
                                style={{ transform: isEnglish ? "rotate(180deg)" : "" }}
                            />
                        </button>
                    </div>
                </div>
            </section>
            {/* about us section */}
            <section className={`py-[120px] px-10 ${language === "en" ? "" : " direction-rtl"} items-start`}>
                <div className={`relative container mx-auto flex ${isEnglish ? "" : "flex-row-reverse"} items-center`}>
                    {/* Image section */}
                    <div className="w-[600px] h-[500px] overflow-hidden rounded-sm shadow-lg">
                        <img src={ImagesFromRedux.aboutUsSection || AboutUs} alt="about-us" className="w-full h-[500px] object-cover" />
                    </div>
                    {/* About content */}
                    <div className={`absolute ${isEnglish ? "right-0 text-left" : "left-0 text-right"} bg-[#145098] px-8 py-8 rounded-sm w-[23rem]`} >
                        <h2 className="text-white text-[24px] font-normal">
                            {currentContent?.aboutUsSection?.title[language]}
                        </h2>
                        <p className="text-white text-[12px] font-light leading-[26px] mb-4">
                            {currentContent?.aboutUsSection?.description[language]}
                        </p>
                        <p className="text-white text-[12px] font-light leading-[26px] mb-4">
                            {currentContent?.aboutUsSection?.description2[language]}
                        </p>
                        <button className="px-[28px] py-[12px] bg-[#00B9F2] text-white text-[12px] rounded-sm hover:bg-opacity-90 text-right">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-12 sm:gap-6  px-8">
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
            <section className="py-[115px] pb-[186px] px-[100px] ">
                <div className={`container mx-auto flex gap-12 ${isEnglish ? "" : "flex-row-reverse"}`}>
                    <div className=" w-10 relative flex-1">
                        <div className={`relative ${isEnglish ? "left-[-25px]" : "left-[10px]"} top-[50px]`}>
                            {currentContent?.experienceSection?.cards?.map((item, key) => {
                                // Set top position based on whether key is odd or even
                                const topValue = Math.floor(key / 2) * 140 + (key % 2 !== 0 ? -35 : 25); // Odd = move up, Even = move down
                                return (
                                    <div
                                        key={key}
                                        style={{ top: `${topValue}px`, zIndex: key + 1 }}
                                        className={`w-[180px] h-[100px] absolute rounded-md bg-white shadow-lg p-4 ${key % 2 !== 0 ? !isEnglish ? "left-[170px]" : "xl:left-[150px]" : "left-0"}`}
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
                                        <h5 className={`text-black text-xs font-light relative before:absolute ${isEnglish ? "before:left-[-10px]" : "before:right-[-10px]"} before:top-0 before:w-[5px] before:h-[25px] before:bg-orange-500`}>
                                            {item.title[language]}
                                        </h5>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="max-w-[420px] pt-12 flex-1">
                        <h2 className="text-sky-500 text-4xl font-bold leading-[50px] mb-6 ">
                            {currentContent?.experienceSection?.title[language]}
                        </h2>
                        <p className="text-black text-base text-md font-light leading-6 mb-8">
                            {currentContent?.experienceSection?.description[language]}
                        </p>
                        <button
                            className={`text-white bg-sky-500 px-[12px] py-1 text-lg rounded-md ${language === "ar" ? 'px-9 py-4' : ''}`}
                            onClick={() => setIsModal(true)}
                        >
                            {currentContent?.experienceSection?.buttonText?.[language]}
                        </button>
                    </div>
                </div>
            </section>
            {/* subProjects */}
            <section className="py-[88px] px-8 overflow-hidden">
                <div className="container mx-auto ">
                    <div className="flex justify-end">
                        {activeRecentProjectSection === 2 ? (
                            ""
                        ) : (
                            <button
                                type="button"
                                className="relative bg-transparent border-none text-[#667085] text-right text-[16px] leading-[24px] cursor-pointer flex items-center"
                                onClick={() => { }}
                            >
                                {
                                    currentContent?.recentProjectsSection?.buttons[0]?.text[language]
                                }{""}
                                &nbsp;
                                <img
                                    src="https://frequencyimage.s3.ap-south-1.amazonaws.com/5d82e78b-cb95-4768-abfe-247369079ce6-bi_arrow-up.svg"
                                    width="18"
                                    height="17"
                                    alt=""
                                    className={`w-[18px] h-[17px] ${language === "en" ? 'transform scale-x-[-1]' : ''}`}
                                />
                            </button>
                        )}
                    </div>
                    <div className="flex gap-[70px]">
                        <div className="leftDetails">
                            {currentContent.recentProjectsSection?.sections?.map((section, index) => (
                                <div
                                    key={index}
                                    className={`relative ${language === "ar" ? 'rtl' : ''}`}
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

                        <div className="w-[600px]">
                            <Swiper
                                key={language}
                                modules={[Pagination, Navigation]}
                                className="mySwiper w-[722px] pb-[65px]"

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
                                        <div className="grid grid-cols-2 gap-[12px] w-[600px]">
                                            {chunk?.map((project, cardIndex) => {
                                                console.log(project)
                                                return (
                                                    <div className=" rounded-[4px]" key={cardIndex}>
                                                        <div className="w-full h-[200px]">
                                                            <img
                                                                className={`w-full h-full object-cover object-center ${project.image
                                                                    ? ''
                                                                    : 'opacity-[0.1]'
                                                                    }`}
                                                                alt={project?.title[language]}
                                                                src={project.image
                                                                    ? ProjectSlider?.[project?.image]
                                                                    : blankImage}
                                                            />
                                                        </div>
                                                        <div className="p-[18px_12px_12px_12px] flex flex-col justify-center items-start gap-[16px] bg-sky-500">
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
                                                                {TruncateText(project?.subtitle[language], 25)}
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
                                className={`flex items-center justify-between relative ${projectChunks?.length <= 1 ? 'hidden' : ''} mt-8 font-sans`}
                            >
                                <button ref={prevRef} className="py-[12px] px-[20px] text-sky-500 text-md font-medium border-[1px] border-sky-500 rounded-[6px] flex items-center min-w-[246px] justify-center bg-white text-primary transition-all duration-200">
                                    <img
                                        src="https://frequencyimage.s3.ap-south-1.amazonaws.com/b2872383-e9d5-4dd7-ae00-8ae00cc4e87e-Vector%20%286%29.svg"
                                        width="18"
                                        height="17"
                                        alt=""
                                        className={`w-[18px] h-[17px] ${language === "en" && 'transform scale-x-[-1]'}`}
                                    />
                                    &nbsp;
                                    {
                                        currentContent?.recentProjectsSection?.buttons[1]?.text[language]
                                    }
                                </button>
                                <button ref={nextRef} className="py-[12px] px-[20px] text-sky-500 text-md font-medium border-[1px] border-sky-500 rounded-[6px] flex items-center min-w-[246px] justify-center bg-white text-primary transition-all duration-200">
                                    {
                                        currentContent?.recentProjectsSection?.buttons[2]?.text[language]
                                    }{" "}
                                    &nbsp;
                                    <img
                                        src="https://frequencyimage.s3.ap-south-1.amazonaws.com/de8581fe-4796-404c-a956-8e951ccb355a-Vector%20%287%29.svg"
                                        width="18"
                                        height="17"
                                        alt=""
                                        className={`w-[18px] h-[17px] ${language === "en" && 'transform scale-x-[-1]'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>)
}

//             {/* service section */}
//             <section className={styles.service_wrapper}>
//                 <div className={`container`}>
//                     <h2 className={`${styles.title}`}>
//                         {currentContent?.serviceSection?.title[language]}{" "}
//                         {/* Dynamic title */}
//                     </h2>

//                     <div className={styles.service_cards}>
//                         {currentContent?.serviceSection?.cards?.map((card, key) => (
//                             <div
//                                 className={styles.card}
//                                 key={key}
//                                 onClick={() => {}}
//                             >
//                                 <div className={styles.card_body}>
//                                     <img
//                                         className={styles.icon}
//                                         src={""}
//                                         width={40}
//                                         height={40}
//                                         alt=""
//                                     />

//                                     <h5 className={styles.span}></h5>
//                                     <h5 className={styles.card_title}>{card.title[language]} </h5>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>
//             {/* experience section */}
//             <section className={styles.experince_wrapper}>
//                 <div className={`container ${styles.main_container}`}>
//                     <div className={styles.experience_colums}>
//                         <div
//                             className={`${styles.experince_cards} ${language === "ar" && styles.arabicVersion
//                                 }`}
//                         >
//                             {currentContent?.experienceSection?.cards?.map((item, key) => (
//                                 <div className={styles.card} key={key}>
//                                     <div className={styles.card_body}>
//                                         {/* <Image src={item.url} width="66" height="66" alt="about-us" className={styles.icon} /> */}
//                                         <img
//                                             className={styles.icon}
//                                             src={""}
//                                             width={60}
//                                             height={key === 1 ? 47 : 60}
//                                             alt=""
//                                         />
//                                         <h3 className={styles.count}>{item.count}</h3>
//                                         <h5 className={styles.card_title}>
//                                             {item.title[language]}
//                                         </h5>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className={styles.experince_content}>
//                             {/* <AnimatedText text="32 عاما من الخبرة" Wrapper="h2" repeatDelay={0.04} className={`${styles.title}  `} /> */}

//                             <h2 className={`${styles.title}`}>
//                                 {" "}
//                                 {currentContent?.experienceSection?.title[language]}
//                             </h2>
//                             <p className={`${styles.description}  `}>
//                                 {currentContent?.experienceSection?.description[language]}
//                             </p>

//                             <button
//                                 className={`${styles.view_btn} ${language === "ar" && styles.arabicVersion
//                                     }`}
//                                 onClick={() => setIsModal(true)}
//                             >
//                                 {currentContent?.experienceSection?.button?.text[language]}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* recent project section */}

//             {/* client section */}
//             <section className={styles.Client_wrapper}>
//                 <img
//                     src="https://frequencyimage.s3.ap-south-1.amazonaws.com/98d10161-fc9a-464f-86cb-7f69a0bebbd5-Group%2061%20%281%29.svg"
//                     width="143"
//                     height="144"
//                     alt="about-us"
//                     className={styles.ellips}
//                 />
//                 <img
//                     src="https://frequencyimage.s3.ap-south-1.amazonaws.com/216c2752-9d74-4567-a5fc-b5df034eba6e-Group%2062%20%281%29.svg"
//                     width="180"
//                     height="181"
//                     alt="about-us"
//                     className={styles.ellips2}
//                 />
//                 <div className={`container ${styles.main_container}`}>
//                     <div className={styles.Client_content}>
//                         {/* <AnimatedText text="عملائنا السعداء" Wrapper="h2" repeatDelay={0.04} className={`${styles.title}  `} /> */}

//                         <h2 className={`${styles.title}`}>
//                             {currentContent?.clientSection?.title[language]}
//                         </h2>
//                         <p className={`${styles.description}  `}>
//                             {currentContent?.clientSection?.description[language]}
//                         </p>
//                     </div>
//                     <div className={styles.Client_cards}>
//                         {currentContent?.clientSection?.clients?.map((client, key) => (
//                             <div className={styles.card} key={key}>
//                                 <div className={styles.card_body}>
//                                     <img
//                                         src={""}
//                                         width={key === 3 ? 100 : 66}
//                                         height={key === 3 ? 30 : 66}
//                                         alt="about-us"
//                                         className={styles.client}
//                                     />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>
//             {/* testomonials section  */}
//             <section
//                 className={` ${styles.testimonial_wrapper} ${language !== "en" && styles.rightAlignment
//                     }`}
//             >
//                 <div className={`container ${styles.main_container}`}>
//                     <div className={styles.testimonials_content}>
//                         {/* <AnimatedText text="ماذا يقول عملاؤنا عنا؟" Wrapper="h2" repeatDelay={0.04} className={`${styles.title}  `} /> */}

//                         <h2 className={`${styles.title}`}>
//                             {currentContent?.testimonialSection?.title[language]}
//                         </h2>
//                     </div>

//                     <div className={styles.testimonials_client}>
//                         <Swiper
//                             modules={[Navigation, Autoplay, EffectCoverflow]}
//                             grabCursor={true}
//                             centeredSlides={true}
//                             slidesPerView={2} // Show 1 main slide and part of the other two
//                             loop={true}
//                             spaceBetween={10}
//                             effect="coverflow"
//                             className={styles.mySwiper_testimonial}
//                             navigation={{
//                                 prevEl: testimonialPrevRef.current,
//                                 nextEl: testimonialNextRef.current,
//                             }}
//                             onSwiper={(swiper) => {
//                                 // Override the navigation buttons
//                                 swiper.params.navigation.prevEl = testimonialPrevRef.current;
//                                 swiper.params.navigation.nextEl = testimonialNextRef.current;
//                                 swiper.navigation.init();
//                                 swiper.navigation.update();
//                             }}
//                             coverflowEffect={{
//                                 rotate: 0,
//                                 stretch: 0,
//                                 depth: 250, // Adjust this for the depth effect
//                                 modifier: 2, // Adjust the scale modifier
//                                 slideShadows: false, // Optional: Enable/disable shadows
//                             }}
//                             autoplay={{ delay: 2500 }}
//                             breakpoints={{
//                                 724: { slidesPerView: 2.2 }, // Adjust for bigger screens
//                                 500: { slidesPerView: 1 }, // For smaller screens
//                             }}
//                         // rtl={true} // Enable RTL for Arabic layout
//                         >
//                             {currentContent?.testimonialSection?.testimonials?.map(
//                                 (testimonial, index) => (
//                                     <SwiperSlide
//                                         key={index}
//                                         className={`${styles.swiperSlide} ${styles.testimonial_slide}`}
//                                     >
//                                         <div className={styles.testimonial_card}>
//                                             <div className={styles.testimonial_content}>
//                                                 <h3 className={styles.name}>
//                                                     {testimonial.name[language]}
//                                                 </h3>
//                                                 <p className={styles.position}>
//                                                     {testimonial.position[language]}
//                                                 </p>
//                                                 <p className={styles.quote}>
//                                                     {testimonial.quote[language]}
//                                                 </p>
//                                                 <div className={styles.company_wrap}>
//                                                     <p className={styles.company}>
//                                                         {testimonial.company[language]}
//                                                     </p>
//                                                     <img
//                                                         src="https://frequencyimage.s3.ap-south-1.amazonaws.com/a813959c-7b67-400b-a0b7-f806e63339e5-ph_building%20%281%29.svg"
//                                                         height={18}
//                                                         width={18}
//                                                         alt={testimonial.name}
//                                                         className={styles.company_icon}
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <img
//                                                 src={""}
//                                                 height={70}
//                                                 width={70}
//                                                 alt={testimonial.name}
//                                                 className={styles.testimonial_image}
//                                             />
//                                         </div>
//                                     </SwiperSlide>
//                                 )
//                             )}
//                         </Swiper>

//                         {/* Custom buttons */}
//                         <div className={styles.testimonial_wrapper_btn}>
//                             <button ref={testimonialPrevRef} className={styles.custom_next}>
//                                 <img
//                                     src="https://frequencyimage.s3.ap-south-1.amazonaws.com/b2872383-e9d5-4dd7-ae00-8ae00cc4e87e-Vector%20%286%29.svg"
//                                     width="22"
//                                     height="17"
//                                     alt=""
//                                     className={`${styles.arrow_btn} ${language === "en" && styles.leftAlign
//                                         }`}
//                                 />{" "}
//                             </button>
//                             <button ref={testimonialNextRef} className={styles.custom_prev}>
//                                 <img
//                                     src="https://frequencyimage.s3.ap-south-1.amazonaws.com/de8581fe-4796-404c-a956-8e951ccb355a-Vector%20%287%29.svg"
//                                     width="22"
//                                     height="17"
//                                     alt=""
//                                     className={`${styles.arrow_btn} ${language === "en" && styles.leftAlign
//                                         }`}
//                                 />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             {/* new project section */}
//             <section className={styles.new_project_wrapper}>
//                 <div className={`container ${styles.main_container}`}>
//                     <div className={styles.Client_content}>
//                         <h2 className={`${styles.title}`}>
//                             {currentContent?.newProjectSection?.title[language]}
//                         </h2>
//                         <p className={`${styles.description}  `}>
//                             {currentContent?.newProjectSection?.description1[
//                                 language
//                             ].replace(
//                                 currentContent?.newProjectSection?.highlightedText[language],
//                                 `"${currentContent?.newProjectSection?.highlightedText[language]}"`
//                             )}

//                             <i className={language === "ar" && styles.arabicVersion}>
//                                 {/* {patch()} */}
//                             </i>
//                         </p>

//                         <p className={`${styles.description}  `}>
//                             {currentContent?.newProjectSection?.description2[language]}
//                         </p>

//                         <button
//                             className={styles.view_btn}
//                             onClick={() => setIsModal(true)}
//                         >
//                             {currentContent?.newProjectSection?.button?.text[language]}
//                         </button>
//                     </div>
//                 </div>
//             </section>
//             {/* <ContactUsModal isModal={isModal} onClose={handleContactUSClose} /> */}
//         </div>
//     );
// };

export default HomePage;
