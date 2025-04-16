import FileUploader from "../../../../../components/Input/InputFileUploader"
import ContentSection from "../../breakUI/ContentSections"

const SubServiceDetailManager = ({ serviceId, currentContent, currentPath, language, deepPath }) => {

    return (
        <div>
            {/* file doc */}
            <FileUploader id={"SubServiceDetailsIDReference" + serviceId + deepPath} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}

            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", maxLength: 18 },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 350 },
                ]}
                inputFiles={[{ label: "Backround Image", id: `subServiceBanner/${serviceId}/${deepPath}` }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                projectId={serviceId}
                deepPath={deepPath}
            />

            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", maxLength: 34 },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 350 },
                ]}
                section={"subBanner"}
                language={language}
                currentContent={currentContent}
                projectId={serviceId}
                deepPath={deepPath}
            />
        </div>
    )
}

export default SubServiceDetailManager