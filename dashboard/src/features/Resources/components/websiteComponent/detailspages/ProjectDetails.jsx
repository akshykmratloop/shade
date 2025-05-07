import React, { useEffect, useRef } from "react";
// import styles from "./ProjectDetail.module.scss";
import { Link } from "react-router-dom";
// import { useTruncate } from "@/common/useTruncate";
import { projectPageData } from "../../../../../assets/index";
import { useDispatch, useSelector } from "react-redux";
import { updateMainContent } from "../../../../common/homeContentSlice";
import content from '../content.json'
import { Swiper, SwiperSlide } from "swiper/react";
import structureOfPageDetails from "../structures/structureOFPageDetails.json"
import {
    Navigation,
    Autoplay,
    EffectCoverflow,
} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import NotFound from "../../pages/404";
// Import local font
// const BankGothic = localFont({
//   src: "../../../public/font/BankGothicLtBTLight.ttf",
//   display: "swap",
// });
// import { useGlobalContext } from "../../contexts/GlobalContext";

const ProjectDetailPage = ({ contentOn, language, projectId, screen }) => {
    const isComputer = screen > 1100
    const isTablet = 1100 > screen && screen > 767
    const isPhone = screen < 767
    const isLeftAlign = language === 'en'
    const dispatch = useDispatch()
    const ImageFromRedux = useSelector((state) => state.homeContent.present.images)
    let currentContent = contentOn?.[projectId - 1] ?? structureOfPageDetails

    const testimonialPrevRef = useRef(null);
    const testimonialNextRef = useRef(null);


    useEffect(() => {
        if (!currentContent[projectId - 1]) {
            dispatch(updateMainContent({ currentPath: "projectDetail", payload: [...content.projectDetail, { ...structureOfPageDetails, id: content.projectDetail.length + 1 }] }))
        } else {
            dispatch(updateMainContent({ currentPath: "projectDetail", payload: content.projectDetail }))
        }
    }, [])


    const { introSection, descriptionSection, gallerySection, moreProjects } = currentContent ?? {};

    // const TruncateText = (text, length) => useTruncate(text, length || 200);

    const TruncateText = (text, length) => {
        if (text.length > (length || 50)) {
            return `${text.slice(0, length || 50)}...`;
        }
        return text;
    };


    return (
        <div className="w-full " dir={isLeftAlign ? "ltr" : "rtl"}>
            {/* Intro Section */}
            <section className="mt-10 mb-10">
                <div className={`container mx-auto ${isPhone?"px-2" :"px-16"}`}>
                    <div className={`${isPhone ? "flex flex-col gap-[40px]" : "grid grid-cols-2 gap-[52px] mb-16 items-center"}`}>
                        <div>
                            <div className="relative">
                                <Link href="/project" className={`flex items-center gap-2 text-gray-700 font-bold text-lg ${isPhone ? isLeftAlign ? "absolute -top-[100px] -left-12 " : "absolute -top-[100px] -right-12" : ""}`}>
                                    <img
                                        src={"https://loopwebsite.s3.ap-south-1.amazonaws.com/bx_arrow-back+(1).svg"}
                                        alt="Back Icon"
                                        width={20}
                                        height={20}
                                        className={`${language === "en" ? 'scale-x-[-1]' : ''}`}
                                    />
                                    {introSection?.backButton[language] || "Button"}
                                </Link>
                                <h1 className={`text-[#062233] font-bold text-xl mt-7 mb-6 ${isPhone&& "px-4"}`}>
                                    {introSection?.title[language] || "Heading/title"}
                                </h1>
                                <p className={`text-gray-700 font-bold text-lg mb-2 ${isPhone&& "px-4"}`}>
                                    {introSection?.subtitle[language] || "Description"}
                                </p>
                                <a href={introSection?.url || ""} className={`text-[#00b9f2] underline font-medium text-md ${isPhone&& "px-4"}`}>
                                    {introSection?.url || "URL"}
                                </a>
                            </div>
                        </div>
                        <div>
                            <img
                                src={ImageFromRedux?.[`ProjectBanner/${projectId}`] ? ImageFromRedux?.[`ProjectBanner/${projectId}`] : "https://loopwebsite.s3.ap-south-1.amazonaws.com/Project+hero.jpg"}
                                alt="Project Hero"
                                className="w-full h-[250px]"
                            />
                        </div>
                    </div>

                    {/* Project Info List */}
                    <div className={`flex ${isPhone && "flex-col"} items-stretch justify-between gap-4 mt-10 ${isPhone&& "px-12"}`}>
                        {introSection?.projectInforCard?.map((card, index) => {

                            return (
                                <div key={index} className="p-3 flex flex-col bg-blue-100 rounded-md flex-1">
                                    <img src={ImageFromRedux?.[`ProjectIcon/${index}/${projectId}`] ? ImageFromRedux?.[`ProjectIcon/${index}/${projectId}`] : card?.icon} alt="" width={28} height={28} className="w-7 h-7" />
                                    <h5 className={`text-[#292E3D] font-bold text-lg mt-4`}>
                                        {card?.key[language] || "title"}
                                    </h5>
                                    <p
                                        title={card?.value[language]}
                                        className={`text-gray-700 font-light text-xs leading-2`}
                                    >
                                        {TruncateText(card?.value[language], 25) || "description"}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Description Section */}
            <section
                className={`py-[88px] pb-[120px] px-10 ${language === "en" ? "text-left" : "text-right"
                    }`}
            >
                <div className="container flex flex-col gap-10">
                    {/* Project Description */}
                    {descriptionSection?.map((item, index) => (
                        <div className="container bankgothic-regular-db-mt text-[#1F2937]" key={index}>
                            <div className={`${isPhone ? "flex flex-col" : "grid grid-cols-[170px_1fr] gap-[90px]"} `}>
                                <div className={`flex  w-[250px]`}>
                                    <span className="relative w-[10px] h-[20px]">
                                        <span className="absolute top-[1px] w-[4px] h-[20px] bg-red-500 rotate-[15deg]"></span>
                                    </span>
                                    <h1 className={`text-[18px] font-bold leading-[20px] pr-[20px] ${isPhone&&"mb-3"}`}>
                                        {item?.title[language] || "Description title"}
                                    </h1>
                                </div>
                                <div>
                                    <div className="font-[200] text-sm"
                                        // className={`text-[#707684] font-[200] ${isPhone ? "leading-[20px] text-sm" : "leading-[20px]"} tracking-[-1.2px] mb-[32px] `}
                                        dangerouslySetInnerHTML={{ __html: item?.description[language] || "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel tempore a odit voluptatibus hic accusamus expedita libero sunt, quasi minus." }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* gallery */}
            <div className={`relative ${isPhone || isTablet ? "w-full " : "w-[800px]"} mx-auto`}>
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
                    className=""
                    modules={[Navigation, Autoplay, EffectCoverflow]}
                    grabCursor={false}
                    centeredSlides={true}
                    slidesPerView={3} // Adjust dynamically
                    loop={gallerySection?.images?.length > 3} // Enable loop only if enough slides exist
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
                        724: { slidesPerView: isPhone ? 1 : 2.2 },
                        500: { slidesPerView: 2 },
                    }}
                >
                    {(gallerySection?.images?.length ? gallerySection.images : []).map((image, index) => (
                        <SwiperSlide key={`slide-${index}`}>
                            <div className="flex justify-center">
                                <img
                                    src={ImageFromRedux?.[`ProjectBanner/${projectId}/gallery/${index}`] || image.url || "https://loopwebsite.s3.ap-south-1.amazonaws.com/Project+hero.jpg"}
                                    alt={image.name}
                                    className={`rounded-lg ${isPhone ? "h-[200px]" : "h-[320px]"} w-[400px] object-cover`}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>


                {/* <div className={`flex justify-center items-center gap-7 mt-5 ${!isLeftAlign && "flex-row-reverse"}`}>
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
                </div> */}
            </div>


            {/* More Projects */}
            <section className="pt-[70px] pb-[88px] px-[26px]">
                <div className="container">
                    <h2 className={`text-gray-700 text-2xl font-normal mb-6 `}>{moreProjects?.title[language]}</h2>
                    <div className={`${isPhone ? "flex flex-col gap-10 " : `grid ${isTablet ? "grid-cols-2" : "grid-cols-3"} gap-x-8 gap-y-6 mt-12`}`}>
                        {moreProjects?.projects?.slice(0, 3).map((project, key) => {
                            if (!project.display) return null
                            return (
                                <div key={key} className="rounded-md p-3 flex flex-col items-start gap-2 ">
                                    <img
                                        src={projectPageData[project?.url] || "https://loopwebsite.s3.ap-south-1.amazonaws.com/Project+hero.jpg"}
                                        // width={339}
                                        // height={0}
                                        alt="icon"
                                        className="w-full aspect-[12/8]"
                                    />
                                    <h5 className={`text-[#292E23D] text-lg font-bold mt-4 h-11  ${language === 'ar' ? 'text-right' : ''}`}>{TruncateText(project?.title[language], 25) || "Project Name"}</h5>
                                    <p className={`text-gray-700 text-sm font-light mt-2 ${!isLeftAlign && "text-right"}`}>{project?.address[language] || "Project Description"}</p>
                                    <button
                                        className="text-[#00b9f2] text-base font-normal flex items-center gap-2 mt-2 cursor-pointer bg-transparent border-none"
                                    // onClick={() => router.push("/project/56756757656")}
                                    >
                                        {project?.button?.text[language]}
                                        <img
                                            src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                                            width={18}
                                            height={18}
                                            alt="icon"
                                            className={`${language === 'en' ? 'scale-x-[-1]' : ''} `}
                                        />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>

    );
};

export default ProjectDetailPage;

{/* <section className="pb-[50px] ">
                <div className="container">
                    <div className={`flex justify-between items-center  relative ${isPhone ? "px-1 gap-4" : "px-20 gap-16"}`}>
                        {gallerySection?.images?.map((image, index) => {
                            const spanBordersSize = isPhone ? "w-12 h-12" : "w-20 h-20"

                            return (
                                <div key={index} className={` ${index === 1 ? 'absolute left-1/2 -translate-x-1/2 custom-position z-20 shadow-lg border border-lime-500' : 'relative'}`}>
                                    <img
                                        src={image.url}
                                        width={index === 1 ? isPhone ? 200 : 302 : 488}
                                        // height={index === 1 ? 132 : 296}
                                        alt={image.alt[language]}
                                        className={`${index === 1 ? "aspect-[16/9]" : "aspect-[13/12]"}`}
                                    />
                                    {index === 0 && (
                                        <>
                                            <span className={`absolute  ${isPhone ? "-right-1 -top-1" : "-right-4 -top-6"} ${spanBordersSize} border-t border-r border-blue-400`} />
                                            <span className={`absolute  ${isPhone ? "-right-1 -bottom-1" : "-right-4 -bottom-6"} ${spanBordersSize} border-b border-r border-blue-400`} />
                                        </>
                                    )}
                                    {index === gallerySection?.images?.length - 1 && (
                                        <>
                                            <span className={`absolute  ${isPhone ? "-left-1 -top-1" : "-left-4 -top-6"} ${spanBordersSize} border-t border-l border-blue-400`} />
                                            <span className={`absolute  ${isPhone ? "-left-1 -bottom-1" : "-left-4 -bottom-6"} ${spanBordersSize} border-b border-l border-blue-400`} />
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section> */}