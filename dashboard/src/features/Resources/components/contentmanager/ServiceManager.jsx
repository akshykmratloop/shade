import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"

const ServiceManager = ({ currentContent, currentPath, language }) => {

    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"ServiceIDReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description" },
                    { input: "input", label: "Button Text", updateType: "button" },
                ]}
                inputFiles={[{ label: "Backround Image", id: "ServiceBanner" }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
            />
        </div>
    )
}

export default ServiceManager