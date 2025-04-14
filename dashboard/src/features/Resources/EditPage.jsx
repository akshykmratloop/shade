import { useSelector, useDispatch } from "react-redux";
import { setSidebarState } from "../common/SbStateSlice";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import for pages
import ContentTopBar from "./components/ContentTopBar";
import HomePage from "./components/websiteComponent/Home";
import SolutionPage from "./components/websiteComponent/Solutions";
// import for content manager
import LanguageSwitch from "./components/SwitchLang";
import HomeManager from "./components/contentmanager/HomeManager";
import SolutionManager from "./components/contentmanager/SolutionManager";
import AboutUs from "./components/websiteComponent/About";
import AboutManager from "./components/contentmanager/AboutManager";
// import Services from "./components/websiteComponent/Service";
import MarketPage from "./components/websiteComponent/Market";
import MarketManager from "./components/contentmanager/MarketManager";
import ProjectPage from "./components/websiteComponent/Projects";
import Popups from "./components/Popups";
import ProjectContentManager from "./components/contentmanager/ProjectContentManager";
import CareerPage from "./components/websiteComponent/CareersPage";
import InputText from "../../components/Input/InputText";
import TextAreaInput from "../../components/Input/TextAreaInput";
import CareersManager from "./components/contentmanager/CareersManager";
import NewsPage from "./components/websiteComponent/NewsPage";
import NewsManager from "./components/contentmanager/NewsManager";
import Footer from "./components/websiteComponent/Footerweb";
import FooterManager from "./components/contentmanager/FooterManager";
import Header from "./components/websiteComponent/Headerweb";
import HeaderManager from "./components/contentmanager/HeaderManager";
import ProjectDetailPage from "./components/websiteComponent/ProjectDetails";
import ProjectDetailManager from "./components/contentmanager/ProjectDetailManager";
import { ToastContainer } from "react-toastify";
import CareerDetailPage from "./components/websiteComponent/CareersDetails";
import CareerDetailManager from "./components/contentmanager/CareerDetailManager";
import NewsBlogDetailPage from "./components/websiteComponent/NewsDetails";
import NewsDetailManager from "./components/contentmanager/NewsDetailsManager";
import Testimonials from "./components/websiteComponent/Testimonials";
import TestimonyManager from "./components/contentmanager/TestimonyManager";
import ContactUsModal from "./components/websiteComponent/ContactUsModal";
import CloseModalButton from "../../components/Button/CloseButton";
import AllForOne from "./components/AllForOne";
import ServiceManager from "./components/contentmanager/ServiceManager";

const EditPage = () => {
    const dispatch = useDispatch();
    const [language, setLanguage] = useState('en')
    const [screen, setScreen] = useState(1180)
    const location = useLocation();
    const [PopupReject, setPopupReject] = useState(false)
    const [PopupSubmit, setPopupSubmit] = useState(false)
    const [fullScreen, setFullScreen] = useState(false)

    const currentPath = location.pathname.split('/')[4]
    const subPath = location.pathname.split('/')[5]

    const content = useSelector((state) => state.homeContent.present)

    useEffect(() => {
        dispatch(setSidebarState(true))
    }, [])

    return (
        <div>

            <div className="flex gap-[1.5rem] pr-1 h-[83.5vh] w-full relative">
                {/* content manager */}
                <div
                    className={`pt-8 bg-[#fafaff]  dark:bg-[#242933] p-8 lg:w-[23rem] sm:w-[30vw] min-w-23rem flex flex-col gap-4 items-center overflow-y-scroll customscroller`}
                >
                    <div className="w-full sticky top-[-30px] rounded-md p-5 bg-gray-100 dark:bg-cyan-800 z-30">
                        <LanguageSwitch language={language} setLanguage={setLanguage} />
                    </div>
                    {
                        currentPath === "home" &&
                        <HomeManager language={language} currentContent={content.home} currentPath={currentPath} />
                    }
                    {
                        currentPath === "solution" &&
                        <SolutionManager language={language} currentContent={content.solution} currentPath={currentPath} />
                    }
                    {
                        currentPath === "about" &&
                        <AboutManager language={language} currentContent={content.about} currentPath={currentPath} />
                    }
                    {
                        currentPath === "services" &&
                        <ServiceManager language={language} currentContent={content.services} currentPath={currentPath} />
                    }
                    {
                        currentPath === 'markets' &&
                        <MarketManager language={language} currentContent={content.markets} currentPath={currentPath} />
                    }
                    {
                        currentPath === 'projects' ? subPath ?
                            <ProjectDetailManager projectId={subPath} language={language} currentContent={content.projectDetail} currentPath={"projectDetail"} /> :
                            <ProjectContentManager language={language} currentContent={content.projects} currentPath={currentPath} /> : ""
                    }
                    {
                        currentPath === 'careers' ? subPath ?
                            <CareerDetailManager careerId={subPath} language={language} currentContent={content.careerDetails} currentPath={"careerDetails"} /> :
                            <CareersManager language={language} currentContent={content.careers} currentPath={currentPath} /> : ""
                    }
                    {
                        currentPath === 'news' ? subPath ?
                            <NewsDetailManager newsId={subPath} language={language} currentContent={content.newsBlogsDetails} currentPath={"newsBlogsDetails"} /> :
                            <NewsManager language={language} currentContent={content.newsBlogs} currentPath={"newsBlogs"} /> : ""
                    }
                    {
                        currentPath === 'footer' &&
                        <FooterManager language={language} currentContent={content.footer} currentPath={currentPath} />
                    }
                    {
                        currentPath === 'header' &&
                        <HeaderManager language={language} currentContent={content.header} currentPath={currentPath} />
                    }
                    {
                        currentPath === 'testimonials' &&
                        <TestimonyManager language={language} currentContent={content.testimonialSection} testimonyId={subPath} currentPath={"testimonialSection"} />
                    }
                </div>
                {/* Content view */}
                <div
                    className={`flex-[4] h-[83.5vh] flex flex-col`}
                >
                    <ContentTopBar setWidth={setScreen} setFullScreen={setFullScreen} raisePopup={{ reject: () => setPopupReject(true), submit: () => setPopupSubmit(true) }} />
                    <h4 className="text-[#6B7888] text-[14px] mt-1 mb-[2px]">Commented by {"Anukool (Super Admin)"}</h4>
                    <TextAreaInput
                        updateFormValue={() => { }}
                        placeholder={"Comments..."}
                        required={false}
                        textAreaStyle={""}
                        containerStyle={"mb-4"}
                        minHeight={"3.2rem"}
                    />
                    <AllForOne language={language} screen={screen} content={content} subPath={subPath} setLanguage={setLanguage} fullScreen={fullScreen} currentPath={currentPath} />

                    <div className={`border border-cyan-500 pt-0 px-60 ${fullScreen ? "fixed bg-stone-800/70 top-0 left-0 z-50 h-screen w-screen" : "hidden"} overflow-y-scroll customscroller`}>
                        <div className={`fixed z-50 top-2 right-2 ${!fullScreen && "hidden"} bg-stone-200`}>
                            <CloseModalButton className={"absolute z-40 right-4 top-4 bg-stone-200 hover:bg-stone-300 dark:hover:bg-stone-800 rounded-full border-none p-2 py-2"} onClickClose={() => setFullScreen(false)} />
                        </div>
                        <AllForOne language={language} screen={screen} content={content} subPath={subPath} setLanguage={setLanguage} fullScreen={fullScreen} currentPath={currentPath} />
                    </div>
                </div>

                <Popups display={PopupReject} setClose={() => setPopupReject(false)} confirmationText={"Are you sure you want to reject"} />
                <Popups display={PopupSubmit} setClose={() => setPopupSubmit(false)} confirmationText={"Are you sure you want to submit"} />
            </div>
            <ToastContainer />
        </div>

    )
}

export default EditPage