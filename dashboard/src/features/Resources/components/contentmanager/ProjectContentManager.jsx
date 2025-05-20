import { useDispatch } from "react-redux"
import ContentSection from "../breakUI/ContentSections"
import MultiSelectPro from "../breakUI/MultiSelectPro"
import { updateAllProjectlisting } from "../../../common/homeContentSlice"
import FileUploader from "../../../../components/Input/InputFileUploader"

import { useEffect } from "react";
import MultiSelect from "../breakUI/MultiSelect";
import { updateMainContent } from "../../../common/homeContentSlice";
import content from "../websiteComponent/content.json"


const ProjectContentManager = ({ currentPath, currentContent, language, indexes }) => {
    // const dispatch = useDispatch()

    // useEffect(() => {
    //     dispatch(updateMainContent({ currentPath: "home", payload: (content?.home) }))
    // }, [])
    return (
        <div className="w-full">
            hfhjgf
            {/* reference doc */}
            <FileUploader id={"projectReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: currentContent?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 300, value: currentContent?.['1']?.content?.description?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", value: currentContent?.['1']?.content?.button?.[0]?.text?.[language] }
                ]}
                inputFiles={[{ label: "Backround Image", id: "projectsBanner", order: 1 }]}
                section={"bannerSection"}
                language={language}
                currentContent={currentContent}
                sectionIndex={indexes?.["1"]}

            />

            <div>
                <h1>Projects</h1>
                {
                    currentContent?.projectsSection?.tabs?.map((element, index) => {

                        return (
                            <div key={index}>
                                <MultiSelectPro
                                    options={element.id === "all" ? currentContent?.projectsSection?.allProjectsList : currentContent?.projectsSection?.projects}
                                    currentPath={currentPath}
                                    section={"projects"}
                                    language={language}
                                    label={element.title.en}
                                    id={element.id}
                                    tabName={"Select Projects"}
                                    referenceOriginal={{ dir: "projects", index: 0 }}
                                    currentContent={currentContent}
                                    sectionIndex={indexes?.["2"]}
                                />
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default ProjectContentManager