import FileUploader from "../../../../components/Input/InputFileUploader";
import ContentSection from "../ContentSections";
import MultiSelect from "../MultiSelect";

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
                    // { input: "input", label: "Button Text", updateType: "button" }
                ]}
                inputFiles={[{ label: "Backround Image", id: "careersBanner" }]}
                section={"bannerSection"}
                language={language}
                currentContent={currentContent}
            />

            {/* services  */}
            <MultiSelect
                currentPath={currentPath}
                section={"jobListSection"}
                language={language}
                label={"Select Jobs List"}
                heading={"Jobs Section"}
                tabName={"Select Jobs"}
                options={currentContent?.jobListSection?.jobs}
                referenceOriginal={{ dir: "jobs", index: 0 }}
                currentContent={currentContent}
            />
        </div>
    )
}

export default CareersManager