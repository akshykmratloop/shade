import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
import MultiSelect from "../breakUI/MultiSelect"

const ServiceManager = ({ currentContent, currentPath, language, indexes }) => {

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
                    { input: "input", label: "Heading/title", updateType: "title", value: currentContent?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: currentContent?.['1']?.content?.description?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", value: currentContent?.['1']?.content?.button?.[0]?.text?.[language] },
                ]}
                inputFiles={[{ label: "Backround Image", id: "ServiceBanner", order: 1 }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                sectionIndex={indexes?.['1']}
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