// library
import React, { Suspense, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSidebarState } from "../common/SbStateSlice";
import { lazy } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import for UI
import ContentTopBar from "./components/breakUI/ContentTopBar";
import LanguageSwitch from "./components/breakUI/SwitchLang";
import Popups from "./components/breakUI/Popups";
import CloseModalButton from "../../components/Button/CloseButton";
import TextAreaInput from "../../components/Input/TextAreaInput";
// import for content manager
// import AllForOne from "./components/AllForOne";
import AllForOneManager from "./components/AllForOneManager";
import createContent from "./defineContent";
import FallBackLoader from "../../components/fallbackLoader/FallbackLoader";

const Page404 = lazy(() => import('../../pages/protected/404'))
const AllForOne = lazy(() => import("./components/AllForOne"));


const EditPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const [language, setLanguage] = useState('en')
    const [screen, setScreen] = useState(1180)

    const [fullScreen, setFullScreen] = useState(false)
    const [subRoutesList, setSubRouteList] = useState([])

    const currentPath = location.pathname.split('/')[4]
    const subPath = location.pathname.split('/')[5]
    const deepPath = location.pathname.split('/')[6]

    const contentFromRedux = useSelector((state) => state.homeContent.present)

    const content = createContent(contentFromRedux, "edit", currentPath)

    const Routes = ['home', 'solutions', 'about', "services", "service", 'markets', 'projects', "project", 'careers', "career", 'news', 'footer', 'header', 'testimonials', 'testimonial']

    useEffect(() => {
        dispatch(setSidebarState(true))
        setSubRouteList(JSON.parse(localStorage.getItem("subRoutes")))
    }, [])

    return (
        <div>
            <Suspense
                fallback={<FallBackLoader />}
            >
                {
                    !Routes.includes(currentPath) || (subPath && !subRoutesList.includes(subPath)) ?
                        <Page404 /> :
                        <div className="flex gap-[1.5rem] pr-1 h-[83.5vh] w-full relative">

                            {/* content manager */}
                            <div
                                className={`pt-8 bg-[#fafaff]  dark:bg-[#242933] p-8 lg:w-[23rem] sm:w-[30vw] min-w-23rem flex flex-col gap-4 items-center overflow-y-scroll customscroller`}
                            >
                                <div className="w-full sticky top-[-30px] rounded-md p-5 bg-gray-100 dark:bg-cyan-800 z-30">
                                    <LanguageSwitch language={language} setLanguage={setLanguage} />
                                </div>
                                <AllForOneManager currentPath={currentPath} subPath={subPath} deepPath={deepPath} language={language} content={content.content} contentIndex={content.index} />
                            </div>

                            {/* Content view */}
                            <div
                                className={`flex-[4] h-[83.5vh] flex flex-col`}
                                style={{ width: screen > 900 ? "60%" : "" }}
                            >
                                <ContentTopBar setWidth={setScreen} setFullScreen={setFullScreen} currentPath={currentPath} />
                                <h4 className="text-[#6B7888] text-[14px] mt-2 mb-[1px]">Add Note</h4>
                                <TextAreaInput
                                    updateFormValue={() => { }}
                                    placeholder={"Comments..."}
                                    required={false}
                                    textAreaStyle={""}
                                    containerStyle={"mb-4"}
                                    minHeight={"3.2rem"}
                                    style={{ marginTop: "4px" }}
                                />
                                <AllForOne language={language} screen={screen} content={content.content} subPath={subPath} deepPath={deepPath} setLanguage={setLanguage} fullScreen={fullScreen} currentPath={currentPath} />

                                <div className={`border border-cyan-500 pt-0 ${fullScreen ? "fixed bg-stone-800/70 top-0 left-0 z-50 h-screen w-screen" : "hidden"} overflow-y-scroll customscroller`}>
                                    <div className={`fixed z-50 top-2 right-2 ${!fullScreen && "hidden"} bg-stone-200`}>
                                        <CloseModalButton className={"absolute z-40 right-4 top-4 bg-stone-200 hover:bg-stone-300 dark:hover:bg-stone-800 rounded-full border-none p-2 py-2"} onClickClose={() => setFullScreen(false)} />
                                    </div>
                                    {
                                        fullScreen &&
                                        <AllForOne
                                            language={language}
                                            screen={screen}
                                            content={content.content} contentIndex={content.index} subPath={subPath} deepPath={deepPath} setLanguage={setLanguage} fullScreen={fullScreen} currentPath={currentPath}
                                        />
                                    }
                                </div>
                            </div>

                        </div>
                }

            </Suspense>
            <ToastContainer />
        </div >

    )
}

export default EditPage