// import { useSelector } from "react-redux";
import { useEffect } from "react";
import FileUploader from "../../../../components/Input/InputFileUploader";
import ContentSection from "../breakUI/ContentSections";
import MultiSelect from "../breakUI/MultiSelect";
import { updateContent } from "../../../common/homeContentSlice";
import content from "../websiteComponent/content.json"
import { useDispatch } from "react-redux";

const HomeManager = ({ language, currentContent, currentPath }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(updateContent({ currentPath: "home", payload: (content?.home) }))
    }, [])
    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"homeReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/* homeBanner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Hero Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 500 },
                    { input: "input", label: "Button Text", updateType: "buttonText", maxLength: 20 }]}
                inputFiles={[{ label: "Backround Image", id: "homeBanner" }]}
                section={"homeBanner"}
                language={language}
                currentContent={currentContent}
            />

            {/* about section */}
            <ContentSection
                currentPath={currentPath}
                Heading={"About Section"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "About section", updateType: "description", maxLength: 400 },
                    { input: "textarea", label: "Description 2", updateType: "description2", maxLength: 400 },
                    { input: "input", label: "Button Text", updateType: "buttonText" }]}
                inputFiles={[{ label: "Backround Image", id: "aboutUsSection" }]}
                section={"aboutUsSection"}
                language={language}
                currentContent={currentContent}
            />

            {/* services  */}
            <MultiSelect
                currentPath={currentPath}
                section={"serviceSection"}
                language={language}
                label={"Select Service List"}
                heading={"Services Section"}
                tabName={"Select Services"}
                options={currentContent?.serviceSection?.cards}
                referenceOriginal={{ dir: "home", index: 0 }}
                currentContent={currentContent}
            />

            {/* exprerince */}
            <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Experience Section"}
                    inputs={[
                        { input: "input", label: "Heading/title", updateType: "title" },
                        { input: "textarea", label: "Description", updateType: "description" },
                        { input: "input", label: "Button Text", updateType: "buttonText" }]}
                    isBorder={false}
                    fileId={"experienceSection"}
                    section={"experienceSection"}
                    language={language}
                    currentContent={currentContent}
                />
                {["Item 1", "Item 2", "Item 3", "Item 4"].map((item, index, array) => {
                    const isLast = index === array.length - 1;
                    return (
                        <ContentSection key={item + index}
                            currentPath={currentPath}
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
                            currentContent={currentContent}
                        />
                    )
                })}
            </div>

            {/* project selection */}
            <div className="w-full">
                <h3 className={`font-semibold text-[1.25rem] mb-4 mt-4`} >
                    Project Section
                </h3>
                <div>
                    {
                        currentContent?.recentProjectsSection?.sections?.map((section, index, array) => {
                            const isLast = index === array.length - 1;
                            return (
                                <div key={index} className="mt-3 ">
                                    <ContentSection
                                        currentPath={currentPath}
                                        subHeading={section.title.en}
                                        inputs={[
                                            { input: "input", label: (section.title.en).toUpperCase(), updateType: "title" },
                                            { input: "textarea", label: "Description", updateType: "description", maxLength: 500 }
                                        ]}
                                        language={language}
                                        section={"recentProjectsSection"}
                                        subSection={"sections"}
                                        index={+index}
                                        isBorder={isLast}
                                        currentContent={currentContent}
                                    />
                                    {/* {
                                        section.projects.map((project, subSecIndex) => {
                                            return (
                                                <div key={subSecIndex + 1} className="mt-3">
                                                    <ContentSection
                                                        currentPath={currentPath}
                                                        subHeading={"Project " + (subSecIndex + 1)}
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
                                                        currentContent={currentContent}
                                                        isBorder={false}
                                                    />
                                                </div>
                                            )
                                        })
                                    } */}
                                    <MultiSelect
                                        currentPath={currentPath}
                                        language={language}
                                        label={"Select Project List" + (index + 1)}
                                        tabName={"Select Projects"}
                                        options={section.projects}
                                        referenceOriginal={{ dir: "recentproject", index }}
                                        currentContent={currentContent}
                                    />
                                </div>
                            )
                        })}
                </div>
            </div>

            {/* client section */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Client Section"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "input", label: "Description", updateType: "description" },
                ]}
                inputFiles={currentContent?.clientSection?.clients?.map(e => ({ label: e.image, id: e.image }))}
                section={"clientSection"}
                language={language}
                currentContent={currentContent}
            />

            {/* New Project */}
            <ContentSection
                currentPath={currentPath}
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
                currentContent={currentContent}
            />

        </div>
    )
}

export default HomeManager