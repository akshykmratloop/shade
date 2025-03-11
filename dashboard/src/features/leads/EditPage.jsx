import LanguageSwitch from "./components/SwitchLang";
import ContentSection from "./components/ContentSections";
import MultiSelect from "./components/MultiSelect";
import { useSelector, useDispatch } from "react-redux";
import { setSidebarState } from "../common/SbStateSlice";
import React, { useEffect, useState } from "react";
import ContentTopBar from "./components/ContentTopBar";
// import for pages
import HomePage from "./components/websiteComponent/Home";
import SolutionPage from "./components/websiteComponent/Solutions";
// import for content manager
import HomeManager from "./components/contentmanager/HomeManager";
import { useLocation } from "react-router-dom";
import SolutionManager from "./components/contentmanager/SolutionManager";

const EditPage = () => {
    const dispatch = useDispatch();
    const [language, setLanguage] = useState('en')
    const [screen, setScreen] = useState(1180)
    const location = useLocation();

    const currentPath = location.pathname.split('/')[4]
    const content = useSelector((state) => state.homeContent.present)

    console.log(content.solution)


    useEffect(() => {
        dispatch(setSidebarState(true))
    }, [])

    return (
        <div className="flex gap-[1.5rem] pr-1 h-[85.5vh] w-full">

            {/* content manager */}
            <div
                className={`pt-8 bg-[#fafaff] dark:bg-[#242933] p-8 lg:w-[23rem] sm:w-[30vw] min-w-23rem flex flex-col gap-4 items-center overflow-y-scroll customscroller`}
            >

                <div className="w-full sticky top-[-30px] rounded-md p-5 bg-gray-100 dark:bg-cyan-800 z-30">
                    <LanguageSwitch setLanguage={setLanguage} />
                </div>

                {
                    currentPath === "home" &&
                    <HomeManager language={language} currentContent={content.home} currentPath={currentPath} />
                }
                {
                    currentPath === "solution" &&
                    <SolutionManager language={language} currentContent={content.solution} currentPath={currentPath} />
                }


            </div> {/* Content manager ends here */}
            {/* Content view */}
            <div
                className={`flex-[4] h-[85.5vh] flex flex-col `}
                style={{ width: screen > 1000 ? "" : screen }}
            >
                <ContentTopBar setWidth={setScreen} />
                <h4>Commented by {"Anukool (Super Admin)"}</h4>
                <div className={`overflow-y-scroll customscroller border-black-500 border mx-auto w-full`}
                    style={{ width: screen > 1000 ? "" : screen }}
                >
                    {
                        currentPath === "home" &&
                        <HomePage language={language} screen={screen} />
                    }
                    {
                        currentPath === "solution" &&
                        <SolutionPage language={language} currentContent={content.solution} screen={screen} />
                    }
                </div>
            </div>
        </div>
    )
}

export default EditPage