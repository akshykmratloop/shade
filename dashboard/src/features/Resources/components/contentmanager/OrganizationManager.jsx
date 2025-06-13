import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"

const OrganizationManager = ({ language, content, indexes, currentPath, outOfEditing }) => {

    return (
        <div>
            <FileUploader id={"organizations-Details-ID-Reference"} label={"Rerference doc"} fileName={"Upload your file..."} />

            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['1']?.content?.description?.[language] },
                ]}
                inputFiles={[{ label: "Backround Image", id: "OrganizationBanner", order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['1']}
                outOfEditing={outOfEditing}
            />

            <ContentSection
                currentPath={currentPath}
                Heading={"Chart"}
                inputFiles={[{
                    label: "Image",
                    id: "OrganizationBanner",
                    order: 1,
                    url: content?.['2']?.content?.chart?.images?.[0]?.url
                }]}
                section={"Chart"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
                outOfEditing={outOfEditing}
            />
        </div>
    )
}

export default OrganizationManager