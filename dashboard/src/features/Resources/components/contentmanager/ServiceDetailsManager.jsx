import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"
import DynamicContentSection from "../DynamicContentSection"
import MultiSelect from "../MultiSelect"

const ServiceDetailsManager = ({ serviceId, currentContent, currentPath, language }) => {
    const serviceIndex = currentContent?.findIndex(e => {
        return e.id == serviceId
    })


    console.log(serviceIndex)

    return (
        <div>
            <FileUploader id={"ServiceDetailsIDReference" + serviceId} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description" },
                ]}
                inputFiles={[{ label: "Backround Image", id: "serviceBanner/" + (serviceId) }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                projectId={serviceIndex + 1}
            />
        </div>
    )
}

export default ServiceDetailsManager