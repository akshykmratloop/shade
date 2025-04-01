import { useSelector, useDispatch } from "react-redux";
import { setSidebarState } from "../common/SbStateSlice";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TextAreaInput from "../../components/Input/TextAreaInput";
import InputText from "../../components/Input/InputText";
import SuspenseContent from "../../containers/SuspenseContent";
// import for pages
import ContentTopBar from "./components/ContentTopBar";
// import HomePage from "./components/websiteComponent/Home";
import SolutionPage from "./components/websiteComponent/Solutions";
import AboutUs from "./components/websiteComponent/About";
import Footer from "./components/websiteComponent/Footerweb";
import Header from "./components/websiteComponent/Headerweb";
import ProjectPage from "./components/websiteComponent/Projects";
import Popups from "./components/Popups";
import CareerPage from "./components/websiteComponent/CareersPage";
import MarketPage from "./components/websiteComponent/Market";
import NewsPage from "./components/websiteComponent/NewsPage";
// import Services from "./components/websiteComponent/Service";
// import for content manager
import LanguageSwitch from "./components/SwitchLang";
import HomeManager from "./components/contentmanager/HomeManager";
import SolutionManager from "./components/contentmanager/SolutionManager";
import AboutManager from "./components/contentmanager/AboutManager";
import MarketManager from "./components/contentmanager/MarketManager";
import ProjectContentManager from "./components/contentmanager/ProjectContentManager";
import CareersManager from "./components/contentmanager/CareersManager";
import NewsManager from "./components/contentmanager/NewsManager";
import FooterManager from "./components/contentmanager/FooterManager";
import HeaderManager from "./components/contentmanager/HeaderManager";

const EditPage = () => {
    const dispatch = useDispatch();
    const [language, setLanguage] = useState('en')
    const [screen, setScreen] = useState(1180)
    const location = useLocation();
    const [PopupReject, setPopupReject] = useState(false)
    const [PopupSubmit, setPopupSubmit] = useState(false)

    const HomePage = lazy(() => import('./components/websiteComponent/Home'))
    const SolutionPage = lazy(() => import('./components/websiteComponent/Solutions'))
    const AboutUs = lazy(() => import('./components/websiteComponent/About'))
    const Footer = lazy(() => import('./components/websiteComponent/Footerweb'))
    const Header = lazy(() => import('./components/websiteComponent/Headerweb'))
    const ProjectPage = lazy(() => import('./components/websiteComponent/Projects'))
    const CareerPage = lazy(() => import('./components/websiteComponent/CareersPage'))
    const MarketPage = lazy(() => import('./components/websiteComponent/Market'))


    const currentPath = location.pathname.split('/')[4]
    const subPath = location.pathname.split('/')[5]

    const content = useSelector((state) => state.homeContent.present)

    let Management = null
    let ShowContent = null

    switch (currentPath) {
        case "home":
            Management = <HomeManager language={language} currentContent={content.home} currentPath={currentPath} />
            ShowContent = <HomePage language={language} screen={screen} />
            break;
        case "solution":
            Management = <SolutionManager language={language} currentContent={content.solution} currentPath={currentPath} />
            ShowContent = <SolutionPage language={language} currentContent={content.solution} screen={screen} />
            break;
        case "about":
            Management = <AboutManager language={language} currentContent={content.about} currentPath={currentPath} />
            ShowContent = <AboutUs language={language} currentContent={content.about} screen={screen} />
            break;
        case "markets":
            Management = <MarketManager language={language} currentContent={content.markets} currentPath={currentPath} />
            ShowContent = <MarketPage language={language} currentContent={content.markets} screen={screen} />
            break;
        case "projects":
            Management = <ProjectContentManager language={language} currentContent={content.projects} currentPath={currentPath} />
            ShowContent = <ProjectPage language={language} currentContent={content.projects} screen={screen} />
            break;
        case "careers":
            Management = <CareersManager language={language} currentContent={content.career} currentPath={currentPath} />
            ShowContent = <CareerPage language={language} currentContent={content.career} screen={screen} />
            break;
        case "news":
            Management = <NewsManager language={language} currentContent={content.newsBlogs} currentPath={currentPath} />
            ShowContent = <NewsPage language={language} currentContent={content.newsBlogs} screen={screen} />
            break;
        case "footer":
            Management = <FooterManager language={language} currentContent={content.footer} currentPath={currentPath} />
            ShowContent = <Footer language={language} currentContent={content.footer} screen={screen} />
            break;
        case "header":
            Management = <HeaderManager language={language} currentContent={content.header} currentPath={currentPath} />
            ShowContent = <Header language={language} currentContent={content.header} screen={screen} setLanguage={setLanguage} />
            break;
    }

    useEffect(() => {
        dispatch(setSidebarState(true))
    }, [])

    return (
        <Suspense fallback={<SuspenseContent />}>

            <div className="flex gap-[1.5rem] pr-1 h-[83.5vh] w-full relative">
                {/* content manager */}
                <div
                    className={`pt-8 bg-[#fafaff] dark:bg-[#242933] p-8 lg:w-[23rem] sm:w-[30vw] min-w-23rem flex flex-col gap-4 items-center overflow-y-scroll customscroller`}
                >
                    <div className="w-full sticky top-[-30px] rounded-md p-5 bg-gray-100 dark:bg-cyan-800 z-30">
                        <LanguageSwitch setLanguage={setLanguage} />
                    </div>
                    {
                        Management
                    }

                </div> {/* Content manager ends here */}
                {/* Content view */}
                <div
                    className={`flex-[4] h-[83.5vh] flex flex-col`}
                >
                    <ContentTopBar setWidth={setScreen} raisePopup={{ reject: () => setPopupReject(true), submit: () => setPopupSubmit(true) }} />
                    <h4 className="text-[#6B7888] text-[14px] mt-1 mb-[2px]">Commented by {"Anukool (Super Admin)"}</h4>
                    <TextAreaInput
                        updateFormValue={() => { }}
                        placeholder={"Comments..."}
                        required={false}
                        textAreaStyle={""}
                        containerStyle={"mb-4"}
                        minHeight={"3.2rem"}
                    />
                    <div className={`overflow-y-scroll customscroller transition-custom border-stone-200 border mx-auto w-full bankgothic-medium-dt bg-[white]`}
                        style={{ width: screen > 1000 ? "" : screen }}
                    >
                        {
                            ShowContent
                        }

                    </div>
                </div>
                <Popups display={PopupReject} setClose={() => setPopupReject(false)} confirmationText={"Are you sure you want to reject"} />
                <Popups display={PopupSubmit} setClose={() => setPopupSubmit(false)} confirmationText={"Are you sure you want to submit"} />
            </div>
        </Suspense>
    )
}

export default EditPage