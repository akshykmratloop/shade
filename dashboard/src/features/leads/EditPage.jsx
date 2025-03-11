import LanguageSwitch from "./components/SwitchLang";
import ContentSection from "./components/ContentSections";
import MultiSelect from "./components/MultiSelect";
import { useSelector, useDispatch } from "react-redux";
import { setSidebarState } from "../common/SbStateSlice";
import React, { useEffect, useState } from "react";
import ContentTopBar from "./components/ContentTopBar";
import HomePage from "./components/websiteComponent/Home";

const EditPage = () => {
    const dispatch = useDispatch();
    const [language, setLanguage] = useState('en')
    const [screen, setScreen] = useState(1180)
    const homeContent = useSelector((state) => state.homeContent.present.home)


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

                {/* homeBanner */}
                <ContentSection
                    Heading={"Hero Banner"}
                    inputs={[{ input: "input", label: "Heading/title", updateType: "title" }, { input: "textarea", label: "Description", updateType: "description" }, { input: "input", label: "Button Text", updateType: "buttonText" }]}
                    inputFiles={[{ label: "Backround Image", id: "homeBanner" }]}
                    // fileId={"homeBanner"}
                    section={"homeBanner"}
                    language={language}
                />

                {/* about section */}
                <ContentSection
                    Heading={"About Section"}
                    inputs={[{ input: "input", label: "Heading/title", updateType: "title" }, { input: "textarea", label: "About section", updateType: "description" }, { input: "textarea", label: "Description 2", updateType: "description2" }, , { input: "input", label: "Button Text", updateType: "buttonText" }]}
                    inputFiles={[{ label: "Backround Image", id: "aboutUsSection" }]}
                    // fileId={"aboutUsSection"}
                    section={"aboutUsSection"}
                    language={language}
                />

                {/* services  */}
                {
                    <MultiSelect
                        section={"serviceSection"}
                        language={language}
                        label={"Select Service List"}
                        heading={"Services Section"}
                        tabName={"Select Services"}
                        options={homeContent?.serviceSection?.cards}
                        referenceOriginal={{ dir: "home", index: 0 }}
                    />
                }


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
                                inputFiles={[{ label: "Item Icon", id: item }]}
                                // fileId={item}
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
                                                    <div key={subSecIndex + 1}>
                                                        <ContentSection
                                                            inputs={[
                                                                { input: "input", label: "Project title", updateType: "title" },
                                                                { input: "input", label: "Project Location", updateType: "subtitle" }
                                                            ]}
                                                            inputFiles={[{ label: "Image", id: project.image }]}
                                                            // fileId={project.image}
                                                            language={language}
                                                            section={"recentProjectsSection"}
                                                            subSection={"sections"}
                                                            subSectionsProMax={"projects"}
                                                            index={+index}
                                                            subSecIndex={+subSecIndex}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                        <MultiSelect
                                            language={language}
                                            label={"Select Project List" + (index + 1)}
                                            tabName={"Select Projects"}
                                            options={section.projects}
                                            referenceOriginal={{ dir: "recentproject", index }}
                                        />
                                    </div>
                                )
                            })}
                    </div>
                </div>

                {/* client section */}
                <ContentSection
                    Heading={"Client Section"}
                    inputs={[
                        { input: "input", label: "Heading/title", updateType: "title" },
                        { input: "input", label: "Description", updateType: "description" },
                    ]}
                    inputFiles={homeContent?.clientSection?.clients?.map(e => ({ label: e.image, id: e.image }))}
                    section={"clientSection"}
                    language={language}
                />

                {/* New Project */}
                <ContentSection
                    Heading={"New Project"}
                    inputs={[
                        { input: "input", label: "Heading/title", updateType: "title" },
                        { input: "textarea", label: "Description 1", updateType: "description1" },
                        { input: "textarea", label: "Description 2", updateType: "description2" },
                        { input: "intpu", label: "Highlight Text", updateType: "highlightedText" },
                        { input: "input", label: "Button Text", updateType: "button" },
                    ]}
                    section={"newProjectSection"}
                    language={language}
                />

            </div> {/* Content manager ends here */}
            {/* Content view */}
            <div
                className={`flex-[4] h-[85.5vh] flex flex-col `}
                style={{ width: screen > 1000 ? "" : screen }}
            >
                <ContentTopBar setWidth={setScreen} />
                <h4>Commented by {"Anukool (Super Admin)"}</h4>
                <div className={`overflow-y-scroll customscroller border-black-500 border mx-auto`}
                style={{ width: screen > 1000 ? "" : screen }}
                >
                    <HomePage language={language} screen={screen} />
                </div>
            </div>
        </div>
    )
}

export default EditPage