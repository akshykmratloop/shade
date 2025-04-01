import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"

const ProjectDetailManager = ({ projectId, currentContent, currentPath, language }) => {
    console.log(currentContent)

    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"ProjectIDReference" + projectId} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description" },
                    { input: "input", label: "Button Text", updateType: "button" }
                ]}
                inputFiles={[{ label: "Backround Image", id: "ProjectBanner" + projectId }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                projectId={projectId}
            />


        </div>
    )
}

export default ProjectDetailManager