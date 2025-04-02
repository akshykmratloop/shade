import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"

const ProjectDetailManager = ({ projectId, currentContent, currentPath, language }) => {

    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"ProjectIDReference" + projectId} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Button Text", updateType: "backButton" },
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "input", label: "Description", updateType: "subtitle" },
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
                    currentContent?.[projectId - 1].introSection?.projectInforCard?.map((element, index, a) => {
                        const lastIndex = index === (a.length - 1)
                        return (
                            <ContentSection
                                currentPath={currentPath}
                                subHeading={"Card " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "key" },
                                    { input: "input", label: "Description", updateType: "value" },
                                ]}
                                // inputFiles={[{ label: "Backround Image", id: "ProjectBanner" + (projectId) }]}
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

            <div className="mt-4">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Project Summaries</h3>
                {
                    currentContent?.[projectId - 1].descriptionSection?.map((element, index) => {
                        console.log(element)
                        return (
                            <ContentSection
                                currentPath={currentPath}
                                subHeading={"Summary " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title" },
                                    { input: "textarea", label: "Description", updateType: "description" },
                                ]}
                                section={"descriptionSection"}
                                index={index}
                                language={language}
                                currentContent={currentContent}
                                projectId={projectId}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ProjectDetailManager