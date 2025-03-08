import LanguageSwitch from "./components/SwitchLang";
import ContentSection from "./components/ContentSections";
import MultiSelect from "./components/MultiSelect";
import { useSelector, useDispatch } from "react-redux";
import { setSidebarState } from "../common/SbStateSlice";
import React, { useEffect, useState } from "react";
import ContentTopBar from "./components/ContentTopBar";
import HomePage from "./components/websiteComponent/Home";

const EditPage = () => {
    // const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
    const dispatch = useDispatch();
    const [language, setLanguage] = useState('en')
    const homeContent = useSelector((state) => state.homeContent.present.home)


    useEffect(() => {
        dispatch(setSidebarState(true))
    }, [])

    return (
        <div className="flex gap-[1.5rem] pr-1 h-[85.5vh] w-full">

            {/* content manager */}
            <div className=" pt-8 bg-[#fafaff] dark:bg-[#242933] p-8 xl:w-[23rem] sm:w-[30vw] flex flex-col gap-4 items-center overflow-y-scroll customscroller">
                <div className="w-full sticky top-[-30px] rounded-md p-5 bg-gray-100 z-30">
                    <LanguageSwitch setLanguage={setLanguage} />
                </div>

                {/* homeBanner */}
                <ContentSection
                    Heading={"Hero Banner"}
                    inputs={[{ input: "input", label: "Heading/title", updateType: "title" }, { input: "textarea", label: "Description", updateType: "description" }, { input: "input", label: "Button Text", updateType: "buttonText" }]}
                    inputFiles={["Backround Image"]}
                    fileId={"homeBanner"}
                    section={"homeBanner"}
                    language={language}
                />

                {/* about section */}
                <ContentSection
                    Heading={"About Section"}
                    inputs={[{ input: "input", label: "Heading/title", updateType: "title" }, { input: "textarea", label: "About section", updateType: "description" }, { input: "textarea", label: "Description 2", updateType: "description2" }, , { input: "input", label: "Button Text", updateType: "buttonText" }]}
                    inputFiles={["Backround Image"]}
                    fileId={"aboutUsSection"}
                    section={"aboutUsSection"}
                    language={language}
                />

                {/* services  */}
                <MultiSelect
                    section={"serviceSection"}
                    language={language}
                    label={"Select Service List"}
                    heading={"Serivces Section"}
                    tabName={"Select Services"}
                    options={homeContent?.serviceSection?.cards}
                    referenceExpression={"serviceSection.cards"}
                />

                {/* exprerince */}
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
                                    { input: "input", label: "Item text 1", updateType: "count" },
                                    { input: "input", label: "Item text 2", updateType: "title" }]}
                                inputFiles={["Item Icon"]}
                                fileId={item}
                                language={language}
                                section={"experienceSection"}
                                subSection={"cards"}
                                index={+index}
                                isBorder={isLast}
                            />
                        )
                    })}
                </div>

                {/* project selection */}
                <div className="w-full">
                    <h3 className={`font-semibold text-[1.25rem] mb-4`} >
                        Project Section
                    </h3>
                    <div>
                        {
                            homeContent?.recentProjectsSection?.sections?.map((section, index, array) => {
                                const isLast = index === array.length - 1;
                                return (
                                    <div key={index}>
                                        <ContentSection
                                            subHeading={section.title.en}
                                            inputs={[
                                                { input: "input", label: section.title.en, updateType: "title" },
                                                { input: "textarea", label: "description", updateType: "description" }
                                            ]}
                                            language={language}
                                            section={"recentProjectsSection"}
                                            subSection={"sections"}
                                            index={+index}
                                            isBorder={isLast}
                                        />
                                        {
                                            section.projects.map((project, subSecIndex) => {
                                                return (
                                                    <div key={index}>
                                                        <ContentSection
                                                            inputs={[
                                                                { input: "input", label: "Project title", updateType: "title" },
                                                                { input: "input", label: "Project Location", updateType: "subtitle" }
                                                            ]}
                                                            inputFiles={["Image"]}
                                                            fileId={project.image}
                                                            language={language}
                                                            section={"recentProjectsSection"}
                                                            subSection={"sections"}
                                                            subSectionsProMax={"projects"}
                                                            index={+index}
                                                            subSecIndex={+subSecIndex}
                                                        />
                                                        <MultiSelect
                                                            language={language}
                                                            label={"Select Project List" + (subSecIndex + 1)}
                                                            tabName={"Select Projects"}
                                                            options={section.projects}
                                                            referenceExpression={"recentProjectsSection.sections.projects"}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })}
                    </div>

                    {/* <ContentSection
                        Heading={"Project Section"}
                        inputs={[{ input: "input", label: "Heading/title" }, { input: "textarea", label: "Description" }, { input: "input", label: "button Text" }]}
                        isBorder={false}
                        language={language}
                    />
                    <MultiSelect language={language} label={"Select Project List (Page 1)"} tabName={"Select Projects"} options={[]} /> */}
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