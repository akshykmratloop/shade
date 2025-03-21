import ContentSection from "../ContentSections"
import MultiSelectPro from "../MultiSelectPro"

const ProjectContentManager = ({ currentPath, currentContent, language }) => {

    return (
        <div>
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description" },
                    { input: "input", label: "Button Text", updateType: "button" }
                ]}
                inputFiles={[{ label: "Backround Image", id: "marketBanner" }]}
                section={"bannerSection"}
                language={language}
                currentContent={currentContent}
            />

            <div>
                <h1>Projects</h1>
                {console.log(currentContent)}
                {
                    currentContent?.projectsSection?.tabs?.map((element, index) => {

                        return (
                            <div key={index}>
                                <MultiSelectPro
                                    options={currentContent?.projectsSection?.projects}
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