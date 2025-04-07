import { useDispatch } from "react-redux"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"
import DynamicContentSection from "../DynamicContentSection"
import MultiSelect from "../MultiSelect"
import { updateContent, updateTheProjectSummaryList } from "../../../common/homeContentSlice"
import { useEffect } from "react"
import content from "../websiteComponent/content.json"


const ProjectDetailManager = ({ projectId, currentContent, currentPath, language }) => {
    const dispatch = useDispatch()
    const addExtraSummary = () => {
        dispatch(updateTheProjectSummaryList(
            {
                insert: {
                    title: {
                        ar: "",
                        en: ""
                    },
                    description: {
                        ar: "",
                        en: ""
                    }
                },
                projectId,
                context: "projectDetail",
                operation: 'add'
            }
        ))
    }

    useEffect(() => {
        dispatch(updateContent({ currentPath: "projectDetail", payload: (content?.projectDetail) }))
    }, [])

    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"ProjectIDReference" + projectId} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "input", label: "Description", updateType: "subtitle" },
                    { input: "input", label: "Button Text", updateType: "backButton" },
                    { input: "input", label: "Url", updateType: "url" },
                ]}
                inputFiles={[{ label: "Backround Image", id: "ProjectBanner/" + (projectId) }]}
                section={"introSection"}
                language={language}
                currentContent={currentContent}
                projectId={projectId}
            />
            <div className="mt-4">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Cards</h3>
                {
                    currentContent?.[projectId - 1]?.introSection?.projectInforCard?.map((element, index, a) => {
                        const lastIndex = index === (a.length - 1)
                        return (
                            <ContentSection key={index}
                                currentPath={currentPath}
                                subHeading={"Card " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "key" },
                                    { input: "input", label: "Description", updateType: "value" },
                                ]}
                                inputFiles={[{ label: "Icon Image", id: `ProjectIcon/${index}/${projectId}` }]}
                                section={"introSection"}
                                subSection={"projectInforCard"}
                                index={index}
                                language={language}
                                currentContent={currentContent}
                                projectId={projectId}
                                isBorder={lastIndex}
                            />
                        )
                    })
                }
            </div>

            <div className="mt-4 border-b">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Project Summaries</h3>
                {
                    currentContent?.[projectId - 1]?.descriptionSection?.map((element, index, a) => {
                        const isLast = index === a.length - 1
                        return (
                            <DynamicContentSection key={index}
                                currentPath={currentPath}
                                subHeading={"Section " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title" },
                                    { input: "richtext", label: "Description", updateType: "description" },
                                ]}
                                section={"descriptionSection"}
                                index={index}
                                language={language}
                                currentContent={currentContent}
                                projectId={projectId}
                                isBorder={false}
                            />
                        )
                    })
                }
                <button className="text-blue-500 cursor-pointer mb-3" onClick={addExtraSummary}>Add More Section...</button>
            </div>

            <ContentSection
                currentPath={currentPath}
                Heading={"Gallery"}
                inputFiles={
                    currentContent?.[projectId - 1]?.gallerySection?.images?.map((e, i) => {
                        return { label: "Image " + (i + 1), id: `ProjectBanner/${projectId}/gallery/${i}` }
                    })}
                section={"gallerySection"}
                language={language}
                currentContent={currentContent}
                projectId={projectId}
                allowExtraInput={true}
            />

            <MultiSelect
                currentPath={currentPath}
                section={"moreProjects"}
                language={language}
                // label={"Select More Project List"}
                heading={"More Projects"}
                tabName={"Select Project"}
                options={currentContent?.[projectId - 1]?.moreProjects?.projects || []}
                referenceOriginal={{ dir: "projectDetail", index: 0 }}
                currentContent={currentContent}
                projectId={projectId}
            />

        </div>
    )
}

export default ProjectDetailManager