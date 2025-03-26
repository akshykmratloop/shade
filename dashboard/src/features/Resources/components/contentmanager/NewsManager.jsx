import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"
import MultiSelectSM from "../MultiSelectSM"

const NewsManager = ({ language, currentContent, currentPath }) => {

    // console.log(currentPath)

    return (
        <div className="w-full">
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

            {/* select main news */}
            <MultiSelectSM
                referenceOriginal={{ dir: "news", index: 0 }}
                currentContent={currentContent}

                currentPath={currentPath}
                section={"newListSection"}
                language={language}
                label={"Select Main News"}
                heading={"Main News Section"}
                tabName={"Select News"}
                options={currentPath?.latestNewCards?.cards}
            />


        </div>
    )
}

export default NewsManager