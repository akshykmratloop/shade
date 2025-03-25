import FileUploader from "../../../../components/Input/InputFileUploader";
import ContentSection from "../ContentSections";

const CareersManager = ({ language, currentContent, currentPath }) => {

    return (
        <div>
            <FileUploader id={"careersReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/* homeBanner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Careers Hero Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description" },
                    { input: "input", label: "Button Text", updateType: "buttonText" }]}
                inputFiles={[{ label: "Backround Image", id: "homeBanner" }]}
                section={"bannerSection"}
                language={language}
                currentContent={currentContent}
            />
        </div>
    )
}

export default CareersManager