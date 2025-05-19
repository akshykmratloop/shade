import React, { useState, useEffect } from "react";
// import styles from "./project.module.scss";
// import localFont from "next/font/local";
import content from "./content.json"
import Arrow from "../../../../assets/icons/right-wrrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { projectPageData } from "../../../../assets/index";
import { updateMainContent, updateSelectedContent } from "../../../common/homeContentSlice";
import { TruncateText } from "../../../../app/capitalizeword";
import { updateAllProjectlisting } from "../../../common/homeContentSlice"
import { Img_url } from "../../../../routes/backend";

// Font files can be colocated inside of `app`
// const BankGothic = localFont({
//     src: "../../../public/font/BankGothicLtBTLight.ttf",
//     display: "swap",
// });
// import dynamic from "next/dynamic";
// import { useRouter } from "next/router";

// const AnimatedText = dynamic(() => import('@/common/AnimatedText'), { ssr: false });
// import { useGlobalContext } from "../../contexts/GlobalContext";
// const ContactUsModal = dynamic(() => import("../header/ContactUsModal"), {
// ssr: false,
// });

const ProjectPage = ({ language, screen, currentContent }) => {
    const isPhone = screen < 760
    const isTablet = screen > 761 && screen < 1100
    const isLeftAlign = language === "en"
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState("all");
    const [filteredProject, setFilteredProject] = useState([]);
    const [visibleProjectsCount, setVisibleProjectsCount] = useState(6);
    // const currentContent = useSelector((state) => state.homeContent.present.projects)
    const ImageFromRedux = useSelector((state) => state.homeContent.present.images)
    // const { language, content } = useGlobalContext();
    // const currentContent = content?.projectsPage;
    // const [isModal, setIsModal] = useState(false);
    // const handleContactUSClose = () => {
    //     setIsModal(false);
    // };

    useEffect(() => {
        if (activeTab === "all") {
            setFilteredProject(currentContent?.["2"]?.items || []);
        } else {
            setFilteredProject(
                currentContent?.["2"]?.items
                    ? currentContent?.["2"]?.items.filter(
                        (project) => project?.status === activeTab
                    )
                    : []
            );
            setVisibleProjectsCount(6);
        }
    }, [activeTab, currentContent]); // Added currentContent as a dependency


    // useEffect(() => {
    //     dispatch(updateMainContent({ currentPath: "projects", payload: content.projectsPage }));
    // }, [])

    // useEffect(() => {
    //     if(currentContent){
    //         dispatch(updateAllProjectlisting({data:currentContent?.projectsSection?.projects, action: "initial"}))
    //     }
    // }, [currentContent])

    return (
        <div className="h-full">
            <section className={`relative h-full w-full bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}  `}
                style={{
                    height: 1200 * 0.436,
                    backgroundImage: currentContent?.['1']?.content?.images?.[0]?.url ? `url(${Img_url + currentContent?.['1']?.content?.images?.[0]?.url})` :
                        "url('https://frequencyimage.s3.ap-south-1.amazonaws.com/a4a2a992-c11e-448b-bdfe-54b14574958d-Hero%20%281%29%20%281%29.png')"
                }}>
                <div className={`container h-full relative ${isPhone ? "px-10" : "px-20"} flex items-center ${isLeftAlign ? "justify-end" : "justify-end"}   `}>
                    <div className={`flex flex-col ${isLeftAlign ? 'right-5 text-left items-start ' : 'left-5 text-right items-end'} ${isPhone ? "max-w-[70%]" : "max-w-[55%]"} w-full ${isLeftAlign ? 'scale-x-[-1]' : ''}`}>
                        <h1 dir={language === 'ar' ? "rtl" : "ltr"} className={`text-[#292E3D] ${isPhone ? "text-3xl" : "text-[40px] leading-[77px] tracking-[-3.5px]"} font-medium  mb-4`}>
                            {currentContent?.["1"]?.content?.title?.[language]}
                        </h1>
                        <p className={`text-[#0E172FB3] ${isPhone ? "" : "leading-[28px]"} text-sm font-semibold  mb-6 word-spacing-5`}>
                            {currentContent?.["1"]?.content?.description?.[language]}
                        </p>
                        <button
                            className={`relative px-[12px] py-[6px] text-xs font-medium bg-[#00B9F2] text-white rounded flex items-center justify-start gap-2 ${isLeftAlign ? "flex-row-reverse" : ""}`}
                        // onClick={() => router.push("/services")}
                        >
                            <img
                                src={Arrow}
                                alt="Arrow"
                                className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} w-[11px] h-[11px]`}
                            />
                            <p>
                                {currentContent?.["1"]?.content?.button?.[0]?.text?.[language]}
                            </p>
                        </button>
                    </div>
                </div>
            </section>

            <section className={`py-20 ${language === "en" ? "text-left" : "text-right"}`}>
                <div className={`container mx-auto px-10`}>
                    <div>
                        {/* Tabs */}
                        <div className="flex justify-center gap-8 mb-10">
                            {currentContent?.["2"]?.content?.tabs?.map((tab, index) => (
                                <button
                                    key={index}
                                    className={`text-black text-lg font-normal uppercase relative pb-2 border-b-4 transition-all duration-300 ${activeTab === tab?.id ? "border-[#00B9F2] text-[#00B9F2]" : "border-transparent"
                                        }`}
                                    onClick={() => setActiveTab(tab?.id)}
                                >
                                    {tab.title[language]}
                                </button>
                            ))}
                        </div>

                        {/* Cards */}
                        <div className={`grid grid-cols-1  ${isTablet ? "lg:grid-cols-2 gap-6" : isPhone ? "grid-cols-1" : "lg:grid-cols-3 gap-8"} `}>
                            {filteredProject?.slice(0, visibleProjectsCount)?.map((item, index) => (
                                <div className="bg-white p-4 rounded-md flex flex-col gap-2" key={index}>
                                    <img
                                        src={projectPageData[item.url]}
                                        alt={item.title?.[language]}
                                        className="w-full h-[190px]"
                                    />
                                    <h5 className="text-lg font-bold mt-2 truncate" title={item?.title?.[language]}>
                                        {TruncateText(item.title?.[language], 45)}
                                    </h5>
                                    <p className="text-sm text-gray-600 truncate" title={item?.address?.[language]}>
                                        {TruncateText(item.address?.[language], 25)}
                                    </p>
                                    <button
                                        className="text-[#00B9F2] flex items-center gap-2 mt-2"
                                    // onClick={() => router.push(`/project/${item?.id}`)}
                                    >
                                        {item.button?.text?.[language]}
                                        <img
                                            className={language === "en" ? "transform scale-x-[-1]" : ""}
                                            src="https://frequencyimage.s3.ap-south-1.amazonaws.com/61c0f0c2-6c90-42b2-a71e-27bc4c7446c2-mingcute_arrow-up-line.svg"
                                            width={22}
                                            height={22}
                                            alt="icon"
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {visibleProjectsCount < filteredProject?.length && (
                            <div className="flex justify-center mt-10">
                                <button
                                    className="flex items-center gap-2"
                                    onClick={() => setVisibleProjectsCount(visibleProjectsCount + 6)}
                                >
                                    {currentContent?.['2']?.content?.button?.[1]?.text?.[language]}
                                    <img
                                        src="https://loopwebsite.s3.ap-south-1.amazonaws.com/weui_arrow-outlined.svg"
                                        width={24}
                                        height={24}
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