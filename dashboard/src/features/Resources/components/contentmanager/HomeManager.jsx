// import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import FileUploader from "../../../../components/Input/InputFileUploader";
import ContentSection from "../breakUI/ContentSections";
import MultiSelect from "../breakUI/MultiSelect";
import { updateContent } from "../../../common/homeContentSlice";
import content from "../websiteComponent/content.json"
import { useDispatch } from "react-redux";
import { getContent } from "../../../../app/fetch";

const HomeManager = ({ language, content, currentPath }) => {
    const dispatch = useDispatch()
    const [currentId, setCurrentId] = useState("")

    console.log(content)

    useEffect(() => {
        const currentId = localStorage.getItem("contextId");
        if (currentId) {
            setCurrentId(currentId)
        }
    }, [])

    useEffect(() => {
        // dispatch(updateContent({ currentPath: "home", payload: (content?.home) }))
        if (currentId) {
            async function context() {
                try {
                    const response = await getContent({ resourceId: currentId })
                    if (response.message === "Success") {
                        const payload = {
                            id: response.content.id,
                            titleEn: response.content.titleEn,
                            titleAr: response.content.titleAr,
                            slug: response.content.slug,
                            resourceType: response.content.resourceType,
                            resourceTag: response.content.resourceTag,
                            relationType: response.content.relationType,
                            editVersion: response.content.editVersion ?? response.content.liveVersion
                        }

                        dispatch(updateContent({ currentPath: "home", payload }))
                    }
                } catch (err) {

                }
            }
            context()
        }
    }, [currentId])

    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"homeReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/* homeBanner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Hero Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.homeBanner?.content?.title[language] },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 500, value: content?.homeBanner?.content?.description[language] },
                    { input: "input", label: "Button Text", updateType: "buttonText", maxLength: 20, value: content?.homeBanner?.content?.buttonText[language] }]}
                inputFiles={[{ label: "Backround Image", id: "homeBanner" }]}
                section={"homeBanner"}
                language={language}
                currentContent={content}
            />

            {/* about section */}
            <ContentSection
                currentPath={currentPath}
                Heading={"About Section"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.markDown?.content?.title[language] },
                    { input: "richtext", label: "About section", updateType: "description", maxLength: 800, value: content?.markDown?.content?.description[language] },
                    { input: "input", label: "Button Text", updateType: "buttonText", value: content?.markDown?.content?.buttonText[language] }]}
                inputFiles={[{ label: "Backround Image", id: "aboutUsSection" }]}
                section={"aboutUsSection"}
                language={language}
                currentContent={content}
            />

            {/* services  */}
            <MultiSelect
                currentPath={currentPath}
                section={"serviceSection"}
                language={language}
                label={"Select Service List"}
                heading={"Services Section"}
                tabName={"Select Services"}
                options={content?.serviceCards?.items}
                referenceOriginal={{ dir: "home", index: 0 }}
                currentContent={content}
            />

            {/* exprerince */}
            <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Experience Section"}
                    inputs={[
                        { input: "input", label: "Heading/title", updateType: "title", value: content?.statistics?.content?.title[language] },
                        { input: "textarea", label: "Description", updateType: "description", value: content?.statistics?.content?.description[language] },
                        { input: "input", label: "Button Text", updateType: "buttonText", value: content?.statistics?.content?.button?.text?.[language] }]}
                    isBorder={false}
                    fileId={"experienceSection"}
                    section={"experienceSection"}
                    language={language}
                    currentContent={content}
                />
                {["Item 1", "Item 2", "Item 3", "Item 4"].map((item, index, array) => {
                    const isLast = index === array.length - 1;
                    return (
                        <ContentSection key={item + index}
                            currentPath={currentPath}
                            subHeading={item}
                            inputs={[
                                { input: "input", label: "Item text 1", updateType: "count", value: content?.statistics?.content?.cards?.[index]?.count },
                                { input: "input", label: "Item text 2", updateType: "title", value: content?.statistics?.content?.cards?.[index]?.title?.[language] }]}
                            inputFiles={[{ label: "Item Icon", id: item }]}
                            // fileId={item}
                            language={language}
                            section={"experienceSection"}
                            subSection={"cards"}
                            index={+index}
                            isBorder={isLast}
                            currentContent={content}
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
                        content?.projectGrid?.sections?.map((section, index, array) => {
                            const isLast = index === array.length - 1;
                            return (
                                <div key={index} className="mt-3 ">
                                    <ContentSection
                                        currentPath={currentPath}
                                        subHeading={section.title.en}
                                        inputs={[
                                            { input: "input", label: (section?.title?.en)?.toUpperCase(), updateType: "title", value: section?.content?.title?.[language] },
                                            { input: "textarea", label: "Description", updateType: "description", maxLength: 500, value: section?.content?.description?.[language] }
                                        ]}
                                        language={language}
                                        section={"recentProjectsSection"}
                                        subSection={"sections"}
                                        index={+index}
                                        isBorder={isLast}
                                        currentContent={content}
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
                                        currentContent={content}
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
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.clientLogo?.content?.title[language] },
                    { input: "input", label: "Description", updateType: "description", value: content?.clientLogo?.content?.description[language] },
                ]}
                inputFiles={content?.clientLogo?.content?.clients?.map(e => ({ label: e.image, id: e.image }))}
                section={"clientSection"}
                language={language}
                currentContent={content}
            />

            <ContentSection
                currentPath={currentPath}
                Heading={"Testimonials"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.testimonials?.content?.title[language] },
                ]}
                section={"Testimonials heading"}
                language={language}
                currentContent={content}
            />

            {/* New Project */}
            <ContentSection
                currentPath={currentPath}
                Heading={"New Project"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.normalContent?.content?.title?.[language] },
                    { input: "textarea", label: "Description 1", updateType: "description1", value: content?.normalContent?.content?.description?.[language] },
                    { input: "textarea", label: "Description 2", updateType: "description2", value: content?.normalContent?.content?.description2?.[language] },
                    { input: "intpu", label: "Highlight Text", updateType: "highlightedText", value: content?.normalContent?.content?.highlightedText?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", value: content?.normalContent?.content?.button?.text?.[language] },
                ]}
                section={"newProjectSection"}
                language={language}
                currentContent={content}
            />

        </div>
    )
}

export default HomeManager