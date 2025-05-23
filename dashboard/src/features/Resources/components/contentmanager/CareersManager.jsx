import FileUploader from "../../../../components/Input/InputFileUploader";
import { useEffect } from "react";
import ContentSection from "../breakUI/ContentSections";
import MultiSelect from "../breakUI/MultiSelect";
import { updateMainContent } from "../../../common/homeContentSlice";
import content from "../websiteComponent/content.json"
import { useDispatch } from "react-redux";

const CareersManager = ({ language, currentContent, currentPath }) => {
    const jobs = currentContent?.jobListSection?.jobs.map(e => e)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(updateMainContent({ currentPath: "home", payload: (content?.careers) }))
    }, [])
    return (
        <div className="w-full">
            <FileUploader id={"careersReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/* homeBanner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Careers Hero Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 300 },
                    // { input: "input", label: "Button Text", updateType: "button" }
                ]}
                inputFiles={[{ label: "Backround Image", id: "careersBanner" }]}
                section={"bannerSection"}
                language={language}
                currentContent={currentContent}
            />

            {/* Jobs  */}
            <MultiSelect
                currentPath={currentPath}
                section={"jobListSection"}
                language={language}
                label={"Select Jobs List"}
                heading={"Jobs Section"}
                tabName={"Select Jobs"}
                options={jobs}
                referenceOriginal={{ dir: "jobs", index: 0 }}
                currentContent={currentContent}
            />
        </div>
    )
}

export default CareersManager