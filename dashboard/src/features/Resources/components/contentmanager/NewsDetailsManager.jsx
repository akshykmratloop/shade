import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"

const NewsDetailManager = ({ newsId, currentContent, currentPath, language }) => {
    const careerIndex = currentContent?.findIndex(e => e.id == newsId)

    console.log(currentContent)
    return (
        <div>
            <FileUploader id={"NewsDetailsIDReference" + newsId} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "input", label: "Description", updateType: "subTitle" },
                    { input: "input", label: "Button Text", updateType: "button" },
                    // { input: "input", label: "Url", updateType: "url" },
                ]}
                inputFiles={[{ label: "Backround Image", id: "newsBanner/" + (newsId) }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                projectId={careerIndex + 1}
            />

        </div>
    )
}

export default NewsDetailManager