import { useDispatch } from "react-redux"
import ContentSection from "../ContentSections"
import MultiSelectPro from "../MultiSelectPro"
import { updateAllProjectlisting } from "../../../common/homeContentSlice"
import { useEffect } from "react"
import FileUploader from "../../../../components/Input/InputFileUploader"

const ProjectContentManager = ({ currentPath, currentContent, language }) => {
    const dispatch = useDispatch()



    // useEffect(() => {

    //     if(!currentContent?.projectsSection?.allProjectsList){   
    //         dispatch(updateAllProjectlisting({ action: 'initial', data: currentContent?.projectsSection?.projects }))
    //     }

    // }, [])
    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"projectReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description" },
                    { input: "input", label: "Button Text", updateType: "button" }
                ]}
                inputFiles={[{ label: "Backround Image", id: "projectsBanner" }]}
                section={"bannerSection"}
                language={language}
                currentContent={currentContent}
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