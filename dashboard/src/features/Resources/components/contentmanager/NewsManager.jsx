import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"

const NewsManager = ({ language, currentContent, currentPath }) => {

    return (
        <div>
            <FileUploader id={"newsReference"} label={"Rerference doc"} fileName={"Upload your file..."} />

            {/* Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"News Hero Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description" },
                    // { input: "input", label: "Button Text", updateType: "button" }
                ]}
                inputFiles={[{ label: "Backround Image", id: "newsBanner" }]}
                section={"bannerSection"}
                language={language}
                currentContent={currentContent}
            />



        </div>
    )
}

export default NewsManager