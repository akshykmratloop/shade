import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"
import DynamicContentSection from "../DynamicContentSection"
import MultiSelect from "../MultiSelect"

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
                    currentContent?.[projectId - 1]?.introSection?.projectInforCard?.map((element, index, a) => {
                        const lastIndex = index === (a.length - 1)
                        return (
                            <DynamicContentSection key={index}
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
                    currentContent?.[projectId - 1]?.descriptionSection?.map((element, index) => {
                        return (
                            <ContentSection key={index}
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

            <MultiSelect
                currentPath={currentPath}
                section={"moreProjects"}
                language={language}
                // label={"Select More Project List"}
                heading={"Projects Section"}
                tabName={"Select Project"}
                options={currentContent?.[projectId - 1]?.moreProjects?.projects}
                referenceOriginal={{ dir: "projectDetail", index: 0 }}
                currentContent={currentContent}
                projectId={projectId}
            />

        </div>
    )
}

export default ProjectDetailManager