import { useRef } from "react";
import { Link } from "react-router-dom";
import { projectPageData } from "../../../../../assets/index";
import { useDispatch, useSelector } from "react-redux";
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
import { TruncateText } from "../../../../../app/capitalizeword";
import { Img_url } from "../../../../../routes/backend";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../../app/fontSizes";

const ProjectDetailPage = ({ content, language, projectId, screen, highlight, liveContent, width }) => {
    const isComputer = screen > 1100
    const isTablet = 1100 > screen && screen > 767
    const isPhone = screen < 767
    const isLeftAlign = language === 'en'
    const titleLan = isLeftAlign ? "titleEn" : "titleAr";
    const dispatch = useDispatch()
    const slug = useSelector(state => state?.homeContent?.present?.content?.slug)
    let currentContent = content ?? structureOfPageDetails

    const testimonialPrevRef = useRef(null);
    const testimonialNextRef = useRef(null);

    const introSection = currentContent?.[1]?.content
    const urlSection = currentContent?.[2]?.content
    const projectInforCard = currentContent?.[2]?.content
    const descriptionSection = currentContent?.[3]?.content
    const gallerySection = currentContent?.[4]?.content
    const moreProjects = currentContent?.[5]

    const liveIntroSection = liveContent?.[1]?.content
    const liveUrlSection = liveContent?.[2]?.content
    const liveProjectInforCard = liveContent?.[2]?.content
    const liveDescriptionSection = liveContent?.[3]?.content
    const liveGallerySection = liveContent?.[4]?.content
    const liveMoreProjects = liveContent?.[5]

    const checkDifference = highlight ? differentText?.checkDifference?.bind(differentText) : () => ""


    // Font and Size
    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)
    const fontLight = useSelector(state => state.fontStyle.light)

    return (
        <div className="w-full " dir={isLeftAlign ? "ltr" : "rtl"}>
            {/* Intro Section */}
            <section className="mt-10 mb-10"
                style={{ padding: `${getDynamicSize(88)} ${getDynamicSize(150)}` }}
            >
                <div className={`container mx-auto ${isPhone ? "px-2" : ""}`}>
                    <div className={`${isPhone ? "flex flex-col gap-[40px]" : "grid grid-cols-2 gap-[52px] items-center"}`}>
                        <div>
                            <div className="relative">
                                <Link href="/project" className={`flex items-center gap-2 text-gray-700 font-bold text-lg ${isPhone ? isLeftAlign ? "absolute -top-[80px] -left-12 " : "absolute -top-[80px] -right-12" : ""}`}>
                                    <img
                                        src={"https://loopwebsite.s3.ap-south-1.amazonaws.com/bx_arrow-back+(1).svg"}
                                        alt="Back Icon"
                                        width={20}
                                        height={20}
                                        className={`${language === "en" ? 'scale-x-[-1]' : ''}`}
                                    />
                                    {introSection?.button?.[0]?.text?.[language] || "Button"}
                                </Link>
                                <h1 className={`text-[#062233] mt-7 mb-6 ${isPhone && "px-4"}
                                ${checkDifference(introSection?.title?.[language], liveIntroSection?.title?.[language])}
                                `}
                                    style={{ fontSize: fontSize.serviceHeading }}
                                >
                                    {introSection?.title?.[language] || "Heading/title"}
                                </h1>
                                <p className={`text-gray-700 text-lg mb-2 ${isPhone && "px-4"}
                                ${checkDifference(introSection?.subtitle?.[language], liveIntroSection?.subtitle?.[language])}
                                `}
                                    style={{ fontSize: fontSize.aboutMainPara }}
                                >
                                    {introSection?.subtitle?.[language] || "Description"}
                                </p>
                                <a href={introSection?.link?.url || ""}
                                    style={{ fontSize: fontSize.aboutMainPara }}
                                    className={`text-[#00b9f2] underline font-medium text-md ${isPhone && "px-4"}
                                ${checkDifference(introSection?.link?.text, liveIntroSection?.link?.text)}
                                    `}>
                                    {introSection?.link?.text || "URL"}
                                </a>
                            </div>
                        </div>
                        <div
                            className={`
                                ${checkDifference(introSection?.images?.[0]?.url, liveIntroSection?.images?.[0]?.url)}
                            `}
                        >
                            <img
                                src={Img_url + introSection?.images?.[0]?.url}
                                alt="Project Hero"
                                className="w-full h-[250px]"
                            />
                        </div>
                    </div>

                    {/* Project Info List */}
                    <div className={`grid ${isPhone ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-4"} items-stretch justify-between gap-4 mt-20 ${isPhone && "px-12"}`}>
                        {projectInforCard?.map((card, index) => {
                            return (
                                <div key={index} className="p-3 flex flex-col bg-blue-100 rounded-md flex-1">
                                    <img src={Img_url + card?.icon} alt="" width={28} height={28} className="w-7 h-7" />
                                    <h5 className={`text-[#292E3D] font-bold text-lg mt-4
                                                ${checkDifference(card?.key?.[language], liveProjectInforCard?.[index]?.key?.[language])}
                                    `}
                                        style={{ fontSize: fontSize.testimonialsHeading }}
                                    >
                                        {card?.key?.[language] || "title"}
                                    </h5>
                                    <p
                                        title={card?.value?.[language]}
                                        style={{ fontSize: fontSize.mainPara }}
                                        className={`text-gray-700 ${fontLight} text-xs leading-2
                                             ${checkDifference(card?.value?.[language], liveProjectInforCard?.[index]?.value?.[language])}
                                        `}
                                    >
                                        {TruncateText(card?.value?.[language], 25) || "description"}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section >

            {/* Description Section */}
            < section
                style={{ padding: `${getDynamicSize(88)} ${getDynamicSize(150)}` }}
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
                                    <h1 className={`text-[18px] font-bold leading-[20px] pr-[20px] ${isPhone && "mb-3"}
                                    ${checkDifference(item?.title?.[language], descriptionSection?.[index]?.title?.[language])}
                                    `}
                                        style={{ fontSize: isComputer && `${getDynamicSize(20)}` }}
                                    >
                                        {item?.title?.[language] || "Description title"}
                                    </h1>
                                </div>
                                <div>
                                    <div className={`${fontLight}
                                    ${checkDifference(item?.description?.[language], descriptionSection?.[index]?.description?.[language])}
                                    `}
                                        style={{ fontSize: isComputer && `${getDynamicSize(24)}` }}
                                        dangerouslySetInnerHTML={{ __html: item?.description?.[language] || "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel tempore a odit voluptatibus hic accusamus expedita libero sunt, quasi minus." }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section >

            {/* gallery */}
            < div className={`relative ${isPhone || isTablet ? "w-full " : ""} mx-auto`}
                style={{ padding: (isComputer || isTablet) && `${getDynamicSize(88)} ${getDynamicSize(150)}` }}
            >
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
                    grabCursor={false}
                    centeredSlides={true}
                    slidesPerView={isPhone ? 1 : 2.2} // Adjust dynamically
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
                        // 724: { slidesPerView: isPhone ? 1 : 2.2 },
                        // 500: { slidesPerView: 2 },
                    }}
                    className={`
                        ${checkDifference(gallerySection?.images, liveGallerySection?.images)}
                        `}
                >
                    {(gallerySection?.images || []).map((image, index) => (
                        <SwiperSlide key={`slide-${index}`}>
                            <div className="flex justify-center ">
                                <img
                                    src={Img_url + image?.url}
                                    alt={image.name}
                                    className={`rounded-lg ${isPhone ? "w-[98%] aspect-[1/.75]" : "aspect-[1/1]"} object-cover
                                        ${checkDifference(image?.url, liveGallerySection?.images?.[index]?.url)}
                                    `}
                                    style={{ width: (isComputer || isTablet) && getDynamicSize(500) }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div >


            {/* More Projects */}
            <section className="pt-[70px] pb-[88px] px-[26px]"
                style={{ padding: `${getDynamicSize(88)} ${getDynamicSize(150)}` }}
            >
                <div className="container">
                    <h2 className={`text-gray-700 text-2xl ${fontLight} mb-6 
                                    ${checkDifference(moreProjects?.content?.title?.[language], liveMoreProjects?.content?.title?.[language])}
                                `}>{moreProjects?.content?.title?.[language]}</h2>
                    <div className={`${isPhone ? "flex flex-col gap-10 " : `grid ${isTablet ? "grid-cols-2" : "grid-cols-3"} mt-12`}
                                    ${checkDifference(moreProjects?.items, liveMoreProjects?.items)}
                                  `}
                        style={{
                            gap: `${getDynamicSize(8)} ${getDynamicSize(6)}`
                        }}
                    >
                        {moreProjects?.items?.map((project, key) => {
                            if (project.slug === slug) return null
                            return (
                                <div key={key} className="rounded-md p-3 flex flex-col items-start gap-2 ">
                                    <img
                                        src={projectPageData?.[project?.url] || "https://loopwebsite.s3.ap-south-1.amazonaws.com/Project+hero.jpg"}
                                        // width={339}
                                        // height={0}
                                        alt="icon"
                                        className="w-full aspect-[12/8]"
                                    />
                                    <h5 className={`text-[#292E23D] text-lg font-bold mt-4 h-11  ${language === 'ar' ? 'text-right' : ''}`}
                                        style={{ fontSize: fontSize.subProjectBoxHeading }}
                                    >{TruncateText(project?.[titleLan], 25) || "Project Name"}</h5>
                                    <p className={`text-gray-700 text-sm font-light mt-2 ${!isLeftAlign && "text-right"}`}
                                        style={{ fontSize: fontSize.mainPara }}
                                    >{project?.location?.[language] || "Project Description"}</p>
                                    <button
                                        className="text-[#00b9f2] text-base font-normal flex items-center gap-2 mt-2 cursor-pointer bg-transparent border-none"
                                    // onClick={() => router.push("/project/56756757656")}
                                    >
                                        {moreProjects?.content?.button?.text?.[language]}
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
            </section >
        </div >

    );
};

export default ProjectDetailPage;