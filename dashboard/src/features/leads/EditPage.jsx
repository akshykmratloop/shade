import LanguageSwitch from "./components/SwitchLang";
import ContentSection from "./components/ContentSections";
import MultiSelect from "./components/MultiSelect";
import { useSelector, useDispatch } from "react-redux";
import { setSidebarState } from "../common/SbStateSlice";
import { useEffect, useState } from "react";
import ContentTopBar from "./components/ContentTopBar";
import HomePage from "./components/websiteComponent/Home";

const EditPage = () => {
    const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
    const dispatch = useDispatch();
    const [language, setLanguage] = useState('en')
    const homeContent = useSelector((state) => state.homeContent.home)



    useEffect(() => {
        dispatch(setSidebarState(true))
    }, [])

    return (
        <div className="flex gap-[1.5rem] pr-1 h-[85.5vh] w-full">

            {/* content manager */}
            <div className=" pt-8 bg-[#fafaff] dark:bg-[#242933] p-8 xl:w-[23rem] sm:w-[30vw] flex flex-col gap-4 items-center overflow-y-scroll customscroller">
                <LanguageSwitch setLanguage={setLanguage} />
                <ContentSection
                    Heading={"Hero Banner"}
                    inputs={[{ input: "input", label: "Heading/title", updateType: "title" }, { input: "textarea", label: "Description", updateType: "description" }, { input: "input", label: "Button Text", updateType: "buttonText" }]}
                    inputFiles={["Backround Image"]}
                    fileId={"heroBanner"}
                    section={"homeBanner"}
                    language={language}
                />
                <ContentSection
                    Heading={"About Section"}
                    inputs={[{ input: "input", label: "Heading/title", updateType: "title" }, { input: "textarea", label: "About section", updateType: "description" }, { input: "textarea", label: "Description 2", updateType: "description2" }, , { input: "input", label: "Button Text", updateType: "buttonText" }]}
                    inputFiles={["Backround Image"]}
                    fileId={"aboutUsSection"}
                    section={"aboutUsSection"}
                    language={language}
                />

                <MultiSelect section={"serviceSection"} language={language} label={"Select Service List"} heading={"Serivces Section"} tabName={"Select Services"} options={homeContent?.serviceSection?.cards} />
                <div className="w-full">
                    <ContentSection
                        Heading={"Experience Section"}
                        inputs={[{ input: "input", label: "Heading/title", updateType: "title" }, { input: "textarea", label: "Description", updateType: "description" }, { input: "input", label: "button Text", updateType: "buttonText" }]}
                        isBorder={false}
                        fileId={"experienceSection"}
                        section={"experienceSection"}
                        language={language}
                    />
                    {["Item 1", "Item 2", "Item 3", "Item 4"].map((item, index, array) => {
                        const isLast = index === array.length - 1;
                        return (
                            <ContentSection key={item + index}
                                subHeading={item}
                                inputs={[
                                    { input: "input", label: "Item text 1" },
                                    { input: "input", label: "Item text 2" }]}
                                inputFiles={["Item Icon"]}
                                language={language}
                                isBorder={isLast}
                            />
                        )
                    })}
                </div>
                <div>
                    <ContentSection
                        Heading={"Project Section"}
                        inputs={[{ input: "input", label: "Heading/title" }, { input: "textarea", label: "Description" }, { input: "input", label: "button Text" }]}
                        isBorder={false}
                        language={language}
                    />
                    <MultiSelect language={language} label={"Select Project List (Page 1)"} tabName={"Select Projects"} options={[]} />

                </div>
            </div>
            {/* Content view */}
            <div className="flex-[4] h-[85.5vh] flex flex-col">
                <ContentTopBar />
                <div className=" overflow-y-scroll customscroller border-indigo-500 border">
                    <h4>Commented by {"Anukool (Super Admin)"}</h4>
                    <HomePage language={language} />
                </div>
            </div>
        </div>
    )
}

export default EditPage