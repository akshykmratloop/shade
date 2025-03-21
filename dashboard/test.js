import React, { useState, useEffect } from "react";
// import styles from "./project.module.scss";
// import localFont from "next/font/local";
import content from "./content.json"
import Arrow from "../../../../assets/icons/right-wrrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { projectPageData } from "../../../../assets/index";
import { updateContent } from "../../../common/homeContentSlice";
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

const ProjectPage = ({ language, screen }) => {
    const isPhone = screen < 760
    const isLeftAlign = language === "en"
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState("all");
    const [filteredProject, setFilteredProject] = useState([]);
    const [visibleProjectsCount, setVisibleProjectsCount] = useState(6);
    const currentContent = useSelector((state) => state.homeContent.present.projects)
    const ImageFromRedux = useSelector((state) => state.homeContent.present.images)
    // const { language, content } = useGlobalContext();
    // const currentContent = content?.projectsPage;
    // const [isModal, setIsModal] = useState(false);
    // const handleContactUSClose = () => {
    //     setIsModal(false);
    // };

    console.log(language)
    console.log(currentContent?.bannerSection?.title[language])

    useEffect(() => {
        if (activeTab === "all") {
            setFilteredProject(currentContent?.projectsSection.projects);
        } else {
            setFilteredProject(
                currentContent?.projectsSection?.projects
                    ? currentContent?.projectsSection.projects.filter(
                        (project) => project?.status === activeTab
                    )
                    : []
            );
            setVisibleProjectsCount(6);
        }
    }, [activeTab, currentContent]); // Added currentContent as a dependency


    useEffect(() => {
        dispatch(updateContent({ currentPath: "projects", payload: content.projectsPage }))
    }, [])

    return (
        <div className="h-full border border-cyan-500">
            <section className={`relative h-full w-full bg-cover bg-center ${isLeftAlign ? 'scale-x-[-1]' : ''}  `}
                style={{
                    height: 1200 * 0.436,
                    backgroundImage: ImageFromRedux.marketBanner ? `url(${ImageFromRedux.marketBanner})` :
                        "url('https://frequencyimage.s3.ap-south-1.amazonaws.com/a4a2a992-c11e-448b-bdfe-54b14574958d-Hero%20%281%29%20%281%29.png')"
                }}>
                <div className={`container h-full relative ${isPhone ? "px-10" : "px-20"} flex items-center ${isLeftAlign ? "justify-end" : "justify-end"}   `}>
                    <div className={`flex flex-col ${isLeftAlign ? 'right-5 text-left items-start ' : 'left-5 text-right items-end'} ${isPhone ? "max-w-[70%]" : "max-w-[55%]"} w-full ${isLeftAlign ? 'scale-x-[-1]' : ''}`}>
                        <h1 className={`text-[#292E3D] ${isPhone ? "text-3xl" : "text-[50px] leading-[77px] tracking-[-3.5px]"} font-medium  mb-4`}>
                            {currentContent?.bannerSection?.title[language]}
                        </h1>
                        <p className={`text-[#0E172FB3] ${isPhone ? "" : "leading-[28px]"} text-sm font-semibold  mb-6 word-spacing-5`}>
                            {currentContent?.bannerSection?.description[language]}
                        </p>
                        <button
                            className={`relative px-5 py-2 ${isPhone ? "text-xs" : "text-sm"} font-medium bg-sky-600 text-white rounded flex items-center justify-start gap-2 ${isLeftAlign ? "flex-row-reverse" : ""}`}
                        // onClick={() => router.push("/services")}
                        >
                            <img
                                src={Arrow}
                                alt="Arrow"
                                className={` ${isLeftAlign ? 'scale-x-[-1]' : ''} ${isPhone ? "w-[12px] h-[12px]" : "w-[14px] h-[14px]"}`}
                            />
                            <p>
                                {currentContent?.bannerSection?.button?.text[language]}
                            </p>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProjectPage;