import { useEffect, useRef, useState } from "react";
import {
    useDispatch,
    useSelector,
} from "react-redux";
import Arrow from "../../../../assets/icons/right-wrrow.svg";
// import AboutUs from "../../../../assets/images/aboutus.png";
// import background from "../../../../assets/images/Hero.png";
import highlightsvg from "../../../../assets/highlight.svg"
import {
    recentProjects,
    markets,
    safety,
    testimonials,
} from "../../../../assets/index";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Pagination,
    Navigation,
    Autoplay,
    EffectCoverflow,
} from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/pagination";
import blankImage from "../../../../assets/images/blankImage.webp";
import { TruncateText } from "../../../../app/capitalizeword";
import dynamicSize, { generatefontSize } from "../../../../app/fontSizes";
import { differentText } from "../../../../app/fontSizes";
// import contentJSON from './content.json'
import { Img_url } from "../../../../routes/backend";


const HomePage = ({ language, screen, fullScreen, highlight, content, currentContent, liveContent }) => {
    const dispatch = useDispatch()
    const checkDifference = differentText?.checkDifference?.bind(differentText);
    const isComputer = screen > 900;
    const isTablet = screen < 900 && screen > 730;
    const isPhone = screen < 738;
    const ImagesFromRedux = useSelector((state) => {
        return state?.homeContent?.present?.images
    })
    const platform = useSelector(state => state.platform.platform)
    const [swiperInstance, setSwiperInstance] = useState(null);
    let isLeftAlign = language === "en";
    let textAlignment = isLeftAlign ? "text-left" : "text-right"
    const titleLan = isLeftAlign ? "titleEn" : "titleAr"
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [activeRecentProjectSection, setActiveRecentProjectSection] = useState(0);
    let chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array?.length; i += chunkSize) {
            chunks?.push(array?.slice(i, i + chunkSize));
        }
        return chunks;
    };
    const projectsPerSlide = 4;

    let projectChunks = chunkArray(
        content?.["5"]?.sections?.[activeRecentProjectSection]?.items || [],
        projectsPerSlide
    );
    const ProjectSlider = { ...recentProjects, ...markets, ...safety };


    const divRef = useRef(null);
    const [width, setWidth] = useState(0);
    const fontSize = generatefontSize(isComputer, dynamicSize, width)

    const scrollRef = useRef(null);

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


    useEffect(() => {
        if (swiperInstance) {
            swiperInstance?.update();
        }
    }, [language]);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const children = container.firstChild?.children;
        if (!children || children.length === 0) return;

        let index = 0;
        const interval = setInterval(() => {
            if (index >= children.length) index = 0;

            const child = children[index];
            if (child) {
                container.scrollTo({
                    left: child.offsetLeft - 64, // Adjust for padding (`px-16`)
                    behavior: "smooth"
                });
            }

            index++;
        }, 3000); // every 3 seconds

        return () => clearInterval(interval);
    }, []);



    const testimonialPrevRef = useRef(null);
    const testimonialNextRef = useRef(null);
    return (
        <div className={`w-full relative ${textAlignment} bankgothic-medium-dt bg-[white]`} ref={divRef}>
            {/* banner 1  */}
            <section className="w-full relative">
                <div
                    className={`w-full overflow-y-hidden min-h-[400px] block ${language === "en" ? "scale-x-100" : "scale-x-[-1]"
                        }`}
                    style={{ height: dynamicSize(715, width) }}
                >
                    <img
                        dir={isLeftAlign ? "ltr" : "rtl"}
                        src={`${Img_url}${content?.["1"]?.content?.images[0]?.url}`}
                        alt={content?.["1"]?.content?.images?.[0]?.url}
                        className="w-full object-cover"
                        style={{ objectPosition: "center", transform: "scaleX(-1)", height: isTablet ? "500px" : isPhone && "500px" }} />
                </div>
                <div
                    className={`container mx-auto absolute ${isComputer ? "top-[20%]" : "top-16"}  left-0 right-0 px-4`}>
                    <div className={`text-left flex flex-col ${language === "en" ? "items-start" : "items-end"} ${textAlignment} ${isPhone ? "px-[0px] py-10" : "px-[80px]"}`}
                        style={{ paddingLeft: isComputer && dynamicSize(140, width) }}>
                        <h1 className={`${(highlight && checkDifference(content?.["1"]?.content?.title[language], liveContent?.["1"]?.content?.title[language]))} text-[#292E3D] text-[45px] tracking-[0px]  leading-[2.5rem] capitalize font-[500] mb-4 ${isPhone ? "w-full" : fullScreen ? "w-3/5" : "w-3/5"}  `}
                            style={{ fontSize: fontSize?.mainHeading, lineHeight: isComputer && `${(width / 1526) * 4.5}rem`, }}
                        >
                            {content?.["1"]?.content?.title[language]}
                        </h1>
                        <p className={`${(highlight && checkDifference(content?.["1"]?.content?.description[language], liveContent?.["1"]?.content?.description[language]))} text-[#0e172fb3] font-[500] leading-[16px] mb-6 ${isPhone ? "w-full text-[12px]" : "w-1/2 text-[10px]"} tracking-[0px]`}
                            style={{ fontSize: fontSize?.mainPara, lineHeight: isComputer && `${width / 1526 * 24}px` }}
                        >
                            {content?.["1"]?.content?.description?.[language]}
                        </p>
                        <button
                            className={`relative items-center flex ${isLeftAlign ? "" : "flex-row-reverse"} gap-2 text-[12px] font-medium px-[12px] py-[6px] px-[12px] bg-[#00b9f2] text-white rounded-md`}
                            style={{ fontSize: fontSize?.mainButton }}
                            onClick={() => { }}
                        >
                            <span className={`${(highlight && checkDifference(content?.["1"]?.content?.button?.[0]?.text?.[language], content?.["1"]?.content?.button?.[0]?.text?.[language]))}`}>
                                {content?.["1"]?.content?.button?.[0]?.text?.[language]}</span>
                            <img
                                src={Arrow}
                                width="10"
                                height="11"
                                alt=""
                                style={{ transform: isLeftAlign ? "rotate(180deg)" : "", width: isComputer && dynamicSize(16, width) }}
                            />
                        </button>
                    </div>
                </div>
            </section>
            {/* about us section 2 */}
            <section className={` ${isPhone ? "px-2 py-[60px]" : isTablet ? "px-[80px] py-[120px]" : "px-[150px] py-[120px]"} ${language === "en" ? "" : " direction-rtl"} items-start`}>
                <div className={`relative container mx-auto flex ${isPhone ? "flex-col" : ""} ${isLeftAlign ? "" : "flex-row-reverse"} items-center`}>
                    {/* Image section */}
                    <div className={`${isPhone ? "w-[90%]" : "w-[70%]"} h-[500px] overflow-hidden rounded-sm shadow-lg `}
                        style={{ height: isComputer && dynamicSize(629, width), width: isComputer && dynamicSize(877, width) }}>
                        <img src={`${Img_url}${content?.["2"]?.content?.images[0]?.url}`} alt="about-us" className="w-full h-[500px] object-cover"
                            style={{ width: isComputer && dynamicSize(877, width), height: isComputer && '100%' }}
                        />
                    </div>
                    {/* About content */}
                    <div className={`flex flex-col items-start ${isPhone ? " " : "absolute "} ${isLeftAlign ? "right-0 text-left" : "left-0 text-right"} bg-[#145098] ${isTablet ? "p-10 py-14" : "p-14 py-20"} rounded-sm w-[23rem]`}
                        style={{ gap: isComputer ? dynamicSize(26, width) : "16px", width: isComputer && dynamicSize(488, width), padding: isComputer && `${dynamicSize(98, width)} ${dynamicSize(65, width)}` }}
                    >
                        <h2 className={`text-white text-[28px] leading-[1.8rem]  font-normal ${highlight && checkDifference(content?.["2"]?.content?.title?.[language], liveContent?.["2"]?.content?.title?.[language])}`}
                            style={{ fontSize: isComputer && dynamicSize(36, width), lineHeight: isComputer && dynamicSize(32, width) }}>
                            {content?.["2"]?.content?.title?.[language]}
                        </h2>
                        <div className={`text-white font-[100] text-[12px] leading-[16px] ${highlight && checkDifference(content?.["2"]?.content?.description?.[language], liveContent?.["2"]?.content?.description?.[language])}`}
                            style={{ fontSize: isComputer && dynamicSize(15, width), lineHeight: isComputer && dynamicSize(26, width) }}
                            dangerouslySetInnerHTML={{ __html: content?.["2"]?.content?.description?.[language] }}
                        />
                        <button className={`px-[6px] py-[2px] bg-[#00B9F2] text-white text-[12px] ${highlight && checkDifference(content?.["2"]?.content?.description?.[language], liveContent?.["2"]?.content?.description?.[language])} rounded-md hover:bg-opacity-90 text-right`}
                            style={{ fontSize: isComputer && dynamicSize(18, width) }}
                        >
                            {content?.["2"]?.content?.button?.[0]?.text?.[language]}
                        </button>
                    </div>

                </div>
            </section >
            {/* service section 3 */}
            < section className="py-10 bg-gray-100" style={{ wordBreak: "normal" }}>
                <div className="container mx-auto px-6"
                    style={{ padding: isComputer && `${dynamicSize(44, width)} ${dynamicSize(220, width)}` }}>
                    <h2 className={`text-center text-3xl font-light text-[#292E3D] mb-9 ${isPhone ? "text-[30px]" : "text-[40px]"}
                    ${highlight && checkDifference(content?.["3"]?.content?.title[language], liveContent?.["3"]?.content?.title?.[language])}
                    `}
                        style={{ fontSize: isComputer && dynamicSize(36, width) }}>
                        {content?.["3"]?.content?.title?.[language]}
                    </h2>

                    <div className={`${isPhone ? "flex gap-4 flex-col" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-12 sm:gap-6"}
                    ${highlight && checkDifference(content?.["3"]?.items, liveContent?.["3"]?.items)}
                    `}
                        style={{ columnGap: isComputer && dynamicSize(96, width), rowGap: isComputer && dynamicSize(48, width) }}>
                        {content?.['3']?.items?.map((card, key) => {
                            return (
                                <div key={key} className={`w-full h-44 flex items-center justify-center p-6 rounded-md transition-transform duration-300 hover:scale-105 cursor-pointer ${key % 2 !== 0 ? "bg-blue-900 text-[white]" : " bg-stone-200"} `}>
                                    <div className="flex flex-col items-center gap-4">
                                        <img src={Img_url + card?.liveModeVersionData?.icon} width={40} height={40} alt="Icon" className="h-10 w-10" />
                                        <h5 className={`relative text-lg font-light text-center `}
                                            style={{ fontSize: isComputer && dynamicSize(20, width) }}>
                                            {card?.[titleLan]}
                                            <span className="block h-[2px] w-16 bg-gray-300 mt-2 mx-auto"></span>
                                        </h5>
                                    </div>
                                </div>)
                        })}
                    </div>
                </div>
            </section >
            {/* experience section 4 */}
            < section className={`py-[115px] overflow-hidden ${isComputer ? fullScreen ? "px-20 pt-40 pb-60" : "px-20 pb-60" : !isLeftAlign ? "px-8" : "px-10"}`} dir={isLeftAlign ? 'ltr' : "rtl"} >
                <div
                    className={`container mx-auto flex ${isPhone ? "flex-col gap-[350px]" : "gap-10"} `}>
                    <div className={`w-[100%]  flex-[4]`}
                    >
                        <div className={`relative 
                        ${highlight && checkDifference()}
                        ${isTablet ?
                                (!isLeftAlign ? "left-[-70px]" : "left-[15px]") :
                                isComputer && fullScreen ? "left-[450px] scale-[1.7]" :
                                    isPhone ? screen < 370 ? "left-[-10px] scale-[.6]" :
                                        "left-[0px] scale-[1]" : "left-[50px] scale-[1.2]"} 
                            ${!isLeftAlign && isPhone && "left-[-310px]"}`}
                        // style={{ width: isComputer && dynamicSize(200, width) }}
                        >
                            {content?.["4"]?.content?.cards?.map((item, key) => {
                                // Set top position based on whether key is odd or even
                                const topValue = Math.floor(key / 2) * 140 + (key % 2 !== 0 ? -35 : 25); // Odd = move up, Even = move down
                                return (
                                    <div
                                        key={key}
                                        style={{ top: `${topValue}px`, zIndex: key + 1 }}
                                        className={`w-[180px] absolute rounded-md bg-white shadow-lg p-4 ${key % 2 !== 0 ? !isLeftAlign ? "left-[170px]" : "xl:left-[150px]" : "left-0"}`}
                                    >
                                        <div className="relative">
                                            <img
                                                className={`absolute ${key % 2 === 1 ? "top-[-22px] right-[-32px]" : "left-[-36px] top-[-27px]"}`}
                                                src={Img_url + item?.icon}
                                                width={40}
                                                height={key === 1 ? 47 : 60}
                                                alt=""
                                            />
                                        </div>
                                        <h3 className="text-[#292E3D] text-2xl font-semibold pl-2 font-sans"
                                            style={{
                                                fontSize: isComputer && dynamicSize(40, width)
                                            }}
                                        >{item?.count}</h3>
                                        <h5 className={`text-[#292E3D] text-xs font-light relative before:absolute ${isLeftAlign ? "before:left-[-10px]" : "before:right-[-10px]"} before:top-0 before:w-[3px] before:h-[18px] before:bg-[#F9995D]`}
                                            style={{
                                                fontSize: isComputer && dynamicSize(12, width)
                                            }}
                                        >
                                            {item?.title[language]}
                                        </h5>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={`max-w-[450xp] ${isTablet ? !isLeftAlign ? "pr-[64px]" : "pl-[40px]" : "pl-[40px]"}  ${fullScreen ? "flex-[2]" : "flex-[3]"}`}
                        style={{
                            // maxWidth: isComputer && dynamicSize(420, width)
                            // width: isComputer && dynamicSize(420, width),
                        }}
                    >
                        <h2 className="text-[#00B9F2] text-4xl font-bold leading-[50px] mb-6"
                            style={{
                                fontSize: isComputer && dynamicSize(60, width),
                                lineHeight: isComputer && dynamicSize(70, width)
                            }}>
                            {content?.['4']?.content?.title?.[language]}
                        </h2>
                        <p className="text-[#292E3D] text-sm font-[200] leading-4 mb-8"
                            style={{
                                fontWeight: "100",
                                fontSize: isComputer && dynamicSize(16, width)
                            }}
                        >
                            {content?.['4']?.content?.description?.[language]}
                        </p>
                        <button
                            className={`text-white bg-[#00B9F2] px-[12px] py-1 text-sm text-lg rounded-md ${!isLeftAlign ? '!px-4' : ''}`}
                        >
                            {content?.['4']?.content?.button?.[0]?.text?.[language]}
                        </button>
                    </div>
                </div>
            </section >

            {/* subProjects 5 */}
            < section className={`py-[58px] ${isPhone ? "px-2" : "px-8"}  relative`} dir={isLeftAlign ? 'ltr' : 'rtl'}
                style={{ padding: isComputer && `50px ${dynamicSize(150, width)}`, }}>
                <div className={`container mx-auto flex relative  ${!isLeftAlign && 'flex-row-reverse'} ${!isLeftAlign && isTablet && "pl-[200px]"}`}>
                    <div className={`flex justify-end absolute top-[-30px] ${isLeftAlign ? "right-1" : "left-1"}`}>
                        {activeRecentProjectSection === 2 ? ("") : (
                            <button
                                type="button"
                                className={`relative bg-transparent border-none text-[#667085] text-right text-[16px] leading-[24px] cursor-pointer flex gap-2 items-center `}
                                style={{ fontSize: isComputer && dynamicSize(16, width) }}
                                onClick={() => { }}>
                                {currentContent?.["5"]?.button?.[0]?.text?.[language]}
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

                    <div className={`flex ${isTablet ? isPhone ? "gap-[20px]" : "gap-[30px]" : "gap-[30px]"} ${isLeftAlign && !isComputer && "pr-20"}`}
                        style={{ gap: isComputer && dynamicSize(70, width), width: isComputer || fullScreen ? dynamicSize(1230, width) : "100%" }}>
                        <div className={`leftDetails min-w-[150px] ${isTablet ? isPhone ? "w-[150px]" : "w-[240px]" : ""}`}
                            style={{ width: isComputer || fullScreen ? dynamicSize(424, width) : "" }}>
                            {content?.["5"]?.sections?.map((section, index) => (
                                <div
                                    key={index}
                                    className={`relative `}
                                >
                                    <span className={activeRecentProjectSection === index
                                        ? 'font-bold leading-[36px] mb-[16px] cursor-pointer relative'
                                        : 'font-bold leading-[36px] mb-[16px] cursor-pointer'}
                                        onClick={() => setActiveRecentProjectSection(index)}
                                    >
                                        <h2 className={`${activeRecentProjectSection === index ? 'text-[#292e3d]' : 'text-[#292e3d]'} text-md cursor-pointer`}
                                            onClick={() => setActiveRecentProjectSection(index)}
                                            style={{ fontSize: isComputer && dynamicSize(32, width) }}
                                        >
                                            {section?.content?.title?.[language]}
                                        </h2>
                                    </span>

                                    <p className={`${activeRecentProjectSection === index
                                        ? 'text-[#292e3d] text-xs leading-[25px] mb-[24px] opacity-100 transform translate-y-0 transition-opacity duration-300'
                                        : 'text-[#292e3d] text-xs leading-[25px] mb-[24px] opacity-0 h-0 transform translate-y-[-20px] transition-opacity duration-300'
                                        }`}
                                        style={{ fontSize: isComputer && dynamicSize(16, width) }}
                                    >
                                        {section?.content?.description?.[language]}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className={`${isPhone ? "w-[220px]" : isTablet ? "w-[500px]" : ""}`}
                            style={{ width: isComputer || fullScreen ? dynamicSize(800, width) : "" }}
                        >
                            <Swiper
                                key={language}
                                modules={[Pagination, Navigation]}
                                className={`mySwiper pl-1`}
                                style={{ width: '100%' }}
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
                                {projectChunks?.map((chunk, slideIndex) => {
                                    return (
                                        <SwiperSlide key={slideIndex}>
                                            <div className={`${isPhone ? "flex flex-col" : `grid grid-cols-2 gap-[12px] auto-rows-auto ${isTablet ? "w-[350px]" : "w-[600px]"}`}`}
                                                style={{
                                                    width: isComputer ? dynamicSize(798, width) : isPhone ? `${(600 / 1180) * screen}px` : `${(750 / 1180) * screen}px`,
                                                    gap: isComputer ? "" : `${(40 / 1180) * screen}px`,
                                                    placeItems: ""
                                                }}
                                            >
                                                {chunk?.map((project, cardIndex) => {
                                                    return (
                                                        <div className="flex flex-col rounded-[4px]" key={cardIndex}>
                                                            <div className={`w-full aspect-[1.4/1] `} >
                                                                <img
                                                                    className={`w-full aspect-[1.4/1] object-cover object-center`}
                                                                    alt={project?.[language]}
                                                                    src={ImagesFromRedux?.[project?.image] ? ImagesFromRedux?.[project?.image] : project?.image
                                                                        ? ProjectSlider?.[project?.image]
                                                                        : recentProjects.itLab}
                                                                />
                                                            </div>
                                                            <div className="p-[18px_12px_12px_12px] flex flex-col justify-center items-start gap-[16px] bg-[#00B9F2] flex-1">

                                                                <h5
                                                                    title={project?.[titleLan]}
                                                                    className={`text-white text-[20px] font-semibold  h-[40px] ${!isComputer && "mb-2"}`}
                                                                    style={{ fontSize: isComputer && dynamicSize(20, width) }}
                                                                >
                                                                    {TruncateText(project?.[titleLan], !isComputer ? 20 : 35)}
                                                                </h5>
                                                                <p
                                                                    title={project?.[titleLan]}
                                                                    className="text-white text-[16px] font-light leading-[normal]"
                                                                    style={{ fontSize: isComputer && dynamicSize(16, width) }}
                                                                >
                                                                    {TruncateText(project?.[titleLan], (isTablet ? 16 : 25))}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>

                            {/* Custom buttons */}
                            <div
                                className={`flex items-center justify-between relative mt-8 font-sans`}
                                style={{ width: isComputer ? "" : isPhone ? "220px" : `${(400 / 1180) * screen}px` }}
                            // ${projectChunks?.length <= 1 ? 'hidden' : ''}
                            >
                                <button ref={prevRef} className={`py-[12px] px-[20px] text-[#00B9F2] text-md font-medium border-[1px] border-[#00B9F2] rounded-[6px] flex gap-2 items-center ${isPhone ? "w-[120px]" : "min-w-[246px]"} justify-center  bg-white transition-all duration-200`}
                                    style={{ fontSize: isComputer && dynamicSize(18, width) }}>
                                    <img
                                        src="https://frequencyimage.s3.ap-south-1.amazonaws.com/b2872383-e9d5-4dd7-ae00-8ae00cc4e87e-Vector%20%286%29.svg"
                                        width="18"
                                        height="17"
                                        alt=""
                                        className={`w-[18px] h-[17px] ${language === "en" && 'transform scale-x-[-1]'}`}
                                    />

                                    {!isPhone &&
                                        currentContent?.["5"]?.buttons?.[1]?.text?.[language]
                                    }
                                </button>
                                <button ref={nextRef} className={`py-[12px] px-[20px] text-[#00B9F2] text-md font-medium border-[1px] border-[#00B9F2] rounded-[6px] flex gap-2 items-center ${isPhone ? "w-[120px]" : "min-w-[246px]"} justify-center bg-white transition-all duration-200`}
                                    style={{ fontSize: isComputer && dynamicSize(18, width) }}>
                                    {!isPhone &&
                                        currentContent?.["5"]?.buttons?.[2]?.text?.[language]
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
            </section >

            {/* client section 6 */}
            <section className="bg-[#00B9F2] py-12 relative" >
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
                <div className="container mx-auto">
                    <div className="text-center mb-8 px-4">
                        <h2 className="text-white text-3xl font-bold mb-4"
                            style={{ fontSize: isComputer && dynamicSize(36, width) }}
                        >
                            {content?.["6"]?.content?.title?.[language]}
                        </h2>
                        <p className="text-white text-base font-light leading-6"
                            style={{ fontSize: isComputer && dynamicSize(16, width) }}
                        >
                            {content?.["6"]?.content?.description?.[language]}
                        </p>
                    </div>
                    <div ref={scrollRef} className="w-full overflow-x-auto rm-scroll px-16 pb-4"
                        style={{ padding: isComputer ? `${dynamicSize(40, width)} ${dynamicSize(68, width)}` : "" }}
                    >
                        <div className={`flex min-w-100% items-center ${isPhone ? "flex-col gap-4 justify-center" : "w-[fit-content]  justify-between"}`}
                            style={{ gap: !isPhone ? (isTablet ? dynamicSize(264, width) : dynamicSize(194, width)) : dynamicSize(354, width) }}
                        >
                            {content?.["6"]?.content?.clientsImages?.map((client, key) => (
                                <div
                                    key={key}
                                    className="w-[120px] h-[120px] bg-white rounded-full flex items-center justify-center p-5"
                                    style={{
                                        width: isComputer && dynamicSize(200, width),
                                        height: isComputer && dynamicSize(200, width)
                                    }}
                                >
                                    <img
                                        src={Img_url + client?.url}
                                        width={key === 3 ? 100 : 66}
                                        height={key === 3 ? 30 : 66}
                                        alt="about-us"
                                        className="object-contain"
                                    />
                                </div>
                            ))}
                        </div>
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
                            {content?.["7"]?.content?.title?.[language]}
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
                        {content?.["7"]?.items?.length > 1 &&
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
                                {content?.["7"]?.items?.map(
                                    (testimonial, index) => (
                                        <SwiperSlide key={index}
                                            dir={isLeftAlign ? "ltr" : "rtl"}
                                        >
                                            <div className={`border bg-white p-3 rounded-xl flex justify-center  shadow-md`}>

                                                <div className="flex 1">
                                                    <img
                                                        src={["7"]?.[testimonial?.liveModeVersionData?.image]}
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

            {/* new project section 8 */}
            < section className={`py-16 w-[100%] ${isPhone ? "px-[0px] text-justify" : "px-[80px]"} bg-transparent`}
                style={{ padding: `64px ${isComputer ? dynamicSize(143, width) : "35px"}` }}
            >
                <div className="container mx-auto">
                    <div className="text-center bg-transparent">
                        <h2 className="text-3xl font-medium text-black mb-5"
                            style={{ fontSize: isComputer && dynamicSize(36, width) }}
                        >
                            {content?.['8']?.content?.title?.[language]}
                        </h2>
                        <div className="relative">
                            <div className={`font-light text-black leading-7 mb-2 relative bg-transparent`}
                                style={{ fontSize: isComputer && dynamicSize(16, width) }}
                                dangerouslySetInnerHTML={{ __html: content?.['8']?.content?.description?.[language] }}
                            />
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
                        </div>
                        <button
                            className="bg-[#00B9F2] text-xs text-white px-4 py-2 text-lg mt-11 mx-auto block rounded"
                            style={{ fontSize: isComputer && dynamicSize(18, width) }}
                        >
                            {content?.['8']?.content?.button?.[0]?.text?.[language]}
                        </button>
                    </div>
                </div>
            </section >
        </div >)
};

export default HomePage;