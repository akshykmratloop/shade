import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"

const ProjectDetailManager = ({ projectId, currentContent, currentPath, language }) => {

    return (
        <div>
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
                inputFiles={[{ label: "Backround Image", id: "ProjectBanner" + (projectId) }]}
                section={"introSection"}
                language={language}
                currentContent={currentContent}
                projectId={projectId}
            />


        </div>
    )
}

export default ProjectDetailManager