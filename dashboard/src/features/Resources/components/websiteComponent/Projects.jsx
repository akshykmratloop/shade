import { useState, useEffect, useRef } from "react";
// import content from "./content.json"
import Arrow from "../../../../assets/icons/right-wrrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { projectPageData } from "../../../../assets/index";
import { TruncateText } from "../../../../app/capitalizeword";
import { Img_url } from "../../../../routes/backend";
import dynamicSize, { defineDevice, differentText, generatefontSize } from "../../../../app/fontSizes";


const ProjectPage = ({ language, screen, currentContent, highlight, liveContent, purpose }) => {
    const isComputer = screen > 900 || highlight;
    const isTablet = (screen < 900 && screen > 730) && !highlight;
    const isPhone = screen < 738 && !highlight;
    const isLeftAlign = language === "en"
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState("1");
    const [filteredProject, setFilteredProject] = useState([]);
    const [visibleProjectsCount, setVisibleProjectsCount] = useState(6);
    const [width, setWidth] = useState(0);
    const divRef = useRef(null)

    const titleLan = isLeftAlign ? "titleEn" : "titleAr";

    const checkDifference = (!purpose && highlight) ? differentText?.checkDifference?.bind(differentText) : () => ""


    const fontSize = generatefontSize(defineDevice(screen), dynamicSize, width)
    const getDynamicSize = (size) => dynamicSize(size, width)
    const fontLight = useSelector(state => state.fontStyle.light)
    const tabIndex = currentContent?.['2']?.sections.findIndex(e => e.order == activeTab)

    useEffect(() => {
        setFilteredProject(
            currentContent?.["2"]?.sections?.[tabIndex]?.items
        );
        setVisibleProjectsCount(6);
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
        <div className="h-full" ref={divRef} dir={isLeftAlign? "ltr":"rtl"}>
            <section className={`relative w-full bg-cover bg-center   `}
                style={{
                    height: isComputer ? getDynamicSize(715) : "500px",
                    padding: isTablet ? `${getDynamicSize(180)} 0px` : "",
                    backgroundImage: currentContent?.['1']?.content?.images?.[0]?.url ? `url(${Img_url + currentContent?.['1']?.content?.images?.[0]?.url})` :
                        "url('https://frequencyimage.s3.ap-south-1.amazonaws.com/a4a2a992-c11e-448b-bdfe-54b14574958d-Hero%20%281%29%20%281%29.png')"
                }}>
                <div className="absolute inset-0 pointer-events-none z-[0] flex items-center justify-start overflow-hidden">
                    <div
                        style={{ width: (isTablet || isPhone) ? "60%" : getDynamicSize(850), height: (isTablet || isPhone) ? "60%" : getDynamicSize(650) }}
                        className="rounded-full bg-white opacity-[.9] blur-[120px] mix-blend-screen"></div>
                </div>
                <div
                    style={{
                        padding: isComputer && `0px ${getDynamicSize(150)}`,
                    }}
                    className={`container h-full relative ${isPhone ? "px-10" : "px-20"} flex items-center`}>
                    <div className={`flex flex-col items-start ${isLeftAlign ? 'right-5' : 'left-5'} ${isPhone ? "max-w-[70%]" : "max-w-[55%]"} w-full`}>
                        <h1 dir={language === 'ar' ? "rtl" : "ltr"}
                            style={{ fontSize: fontSize.mainHeading, lineHeight: (isComputer || isTablet) && fontSize.headingLeading }}
                            className={`text-[#292E3D] ${isPhone ? "text-3xl" : "text-[40px] leading-[77px] tracking-[-3.5px]"} font-medium  mb-4
                            ${checkDifference(currentContent?.["1"]?.content?.title?.[language], liveContent?.["1"]?.content?.title?.[language])}
                            `}>
                            {currentContent?.["1"]?.content?.title?.[language]}
                        </h1>
                        <p
                            style={{ fontSize: fontSize.mainPara, width: isComputer ? getDynamicSize(674) : "", lineHeight: isComputer && getDynamicSize(28) }}
                            className={`text-[#0E172FB3] ${isPhone ? "" : "leading-[28px]"} text-sm font-semibold font-[300] mb-6 word-spacing-5
                            ${checkDifference(currentContent?.["1"]?.content?.description?.[language], liveContent?.["1"]?.content?.description?.[language])}
                            `}>
                            {currentContent?.["1"]?.content?.description?.[language]}
                        </p>
                        <button
                            style={{ fontSize: fontSize.mainButton, padding: isComputer && getDynamicSize(10) }}
                            className={`relative px-[12px] py-[6px] text-xs font-medium bg-[#00B9F2] text-white rounded flex items-center justify-start gap-2 ${isLeftAlign ? "flex-row-reverse" : ""}`}
                        >
                            <img
                                src={Arrow}
                                alt="Arrow"
                                className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} w-[11px] h-[11px]`}
                            />
                            <p className={`${checkDifference(currentContent?.["1"]?.content?.title?.[language], liveContent?.["1"]?.content?.title?.[language])}`}>
                                {currentContent?.["1"]?.content?.button?.[0]?.text?.[language]}
                            </p>
                        </button>
                    </div>
                </div>
            </section>

            <section
                style={{
                    padding: isComputer || isTablet ? `0px ${getDynamicSize(150)}` : "",
                }}
                className={` ${language === "en" ? "text-left" : "text-right"}`}
                dir={isLeftAlign ? "ltr" : "rtl"}
            >
                <div className={`container mx-auto`}>
                    <div>
                        {/* Tabs */}
                        <div
                            style={{ fontFamily: "arial" }}
                            className={`flex justify-center gap-8 mb-10 ${isPhone && "sticky top-0 pt-2 bg-white/90 left-1/2"}`}>
                            {currentContent?.["2"]?.sections?.map((tab, index) => (
                                <button
                                    key={index}
                                    style={{ fontSize: isComputer ? getDynamicSize(20) : "" }}
                                    className={`text-lg font-normal uppercase 
                                        relative pb-2 border-b-2 transition-all duration-300 
                                        ${activeTab == tab?.order ?
                                            "border-[#00B9F2] text-[#00B9F2]" :
                                            "border-transparent text-[292E3D]"}`}
                                    onClick={() => setActiveTab(tab?.order)}
                                >
                                    {tab?.content?.title?.[language]}
                                </button>
                            ))}
                        </div>

                        {/* Cards */}
                        <div
                            style={{
                                // width: isComputer ? getDynamicSize(362) : ""
                                // padding: isComputer ? `0px ${getDynamicSize(80)}` : "",
                                gap: isComputer ? getDynamicSize(55) : "",
                                // placeItems: "center"
                            }}
                            className={`grid grid-cols-1  ${isTablet ? "lg:grid-cols-2 gap-6" : isPhone ? "grid-cols-1" : "lg:grid-cols-3 gap-8"} 
                            ${checkDifference(currentContent?.["2"]?.sections?.[tabIndex]?.items, liveContent?.["2"]?.sections?.[tabIndex]?.items)}
                            `}>
                            {filteredProject?.slice(0, visibleProjectsCount)?.map((item, index) => (
                                <div
                                    style={{
                                        // width: isComputer ? getDynamicSize(380) : "",
                                        // height: isComputer ? getDynamicSize(357) : ""

                                    }}
                                    className="bg-white p-4 rounded-md flex flex-col gap-2" key={index}>
                                    <img
                                        src={item?.image ? Img_url + item?.image : projectPageData["nonMetallic"]}
                                        alt={item.title?.[language]}
                                        className="w-full h-[190px]"
                                        style={{
                                            height: isComputer ? getDynamicSize(190) : ""
                                        }}
                                    />
                                    <h5
                                        style={{
                                            fontSize: isComputer ? getDynamicSize(20) : "",
                                        }}
                                        className="text-lg font-bold mt-2 truncate" title={item?.title?.[language]}>
                                        {TruncateText(item?.[titleLan], 45)}
                                    </h5>
                                    <p className="text-sm text-gray-600 truncate"
                                        style={{
                                            fontSize: isComputer ? getDynamicSize(14) : "",
                                        }}
                                        title={item?.address?.[language]}>
                                        {TruncateText(item?.location?.[language], 30)}
                                    </p>
                                    <button
                                        style={{
                                            fontSize: isComputer ? getDynamicSize(16) : "",
                                        }}
                                        className="text-[#00B9F2] flex items-center gap-2 mt-2"
                                    >
                                        {currentContent?.['2']?.content?.buttons?.[0]?.text?.[language]}
                                        <img
                                            className={language === "en" ? "transform scale-x-[-1]" : ""}
                                            src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                                            // width={22}
                                            // height={22}
                                            style={{ width: getDynamicSize(22), height: getDynamicSize(22) }}
                                            alt="icon"
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {
                            visibleProjectsCount < filteredProject?.length
                            // true
                            && (
                                <div className="flex justify-center mt-10">
                                    <button
                                        className="flex items-center gap-1 border justify-center bg-[#00b9f2] text-white rounded-md "
                                        onClick={() => setVisibleProjectsCount(visibleProjectsCount + 6)}
                                        style={{
                                            fontSize: isComputer ? getDynamicSize(16) : "",
                                            padding: isComputer ? `${getDynamicSize(10)}` : ""
                                        }}
                                    >
                                        {currentContent?.['2']?.content?.buttons?.[1]?.text?.[language]}
                                        <img
                                            src="https://loopwebsite.s3.ap-south-1.amazonaws.com/weui_arrow-outlined.svg"
                                            // width={24}
                                            // height={24}
                                            style={{
                                                width: isComputer ? getDynamicSize(24) : "",
                                                height: isComputer ? getDynamicSize(24) : ""
                                            }}

                                            alt="icon"
                                        />
                                    </button>
                                </div>
                            )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProjectPage;