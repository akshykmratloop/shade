import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
import MultiSelect from "../breakUI/MultiSelect"

const ServiceManager = ({ currentContent, currentPath, language }) => {

    console.log(currentContent)

    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"ServiceIDReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title",  },
                    { input: "textarea", label: "Description", updateType: "description" },
                    { input: "input", label: "Button Text", updateType: "button" },
                ]}
                inputFiles={[{ label: "Backround Image", id: "ServiceBanner" }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
            />
            <MultiSelect
                currentPath={currentPath}
                language={language}
                label={"Select Services List"}
                tabName={"Select Services"}
                options={currentContent?.serviceCards}
                referenceOriginal={{ dir: "serviceCards" }}
                currentContent={currentContent}
            />
        </div>
    )
}

export default ServiceManager