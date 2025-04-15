import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"
import MultiSelect from "../MultiSelect"
import MultiSelectSM from "../MultiSelectSM"

import { useEffect } from "react";
import { updateContent } from "../../../common/homeContentSlice";
import content from "../websiteComponent/content.json"
import { useDispatch } from "react-redux";

const NewsManager = ({ language, currentContent, currentPath }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(updateContent({ currentPath: "home", payload: (content?.newsBlogs) }))
    }, [])

    return (
        <div className="w-full">
            <FileUploader id={"newsReference"} label={"Rerference doc"} fileName={"Upload your file..."} />

            {/* Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"News Hero Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 300 },
                    // { input: "input", label: "Button Text", updateType: "button" }
                ]}
                inputFiles={[{ label: "Backround Image", id: "newsBanner" }]}
                section={"bannerSection"}
                language={language}
                currentContent={currentContent}
            />

            {/* select main news */}
            <MultiSelectSM
                referenceOriginal={{ dir: "MainNews", index: 0 }}
                currentContent={currentContent}
                currentPath={currentPath}
                // section={"latestNewCards"}
                language={language}
                label={"Select Main News"}
                heading={"Main News Section"}
                tabName={"Select News"}
                options={currentPath?.latestNewCards?.cards}
            />

            <ContentSection
                currentPath={currentPath}
                Heading={currentContent?.latestNewCards?.heading?.en}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "heading" },
                ]}
                section={"latestNewCards"}
                language={language}
                currentContent={currentContent}
            />

            {/* select latest news */}
            <MultiSelect
                currentPath={currentPath}
                section={"latestNewCards"}
                language={language}
                label={"Select News and Blog List"}
                heading={"News Section"}
                tabName={"Select News and Blogs"}
                options={currentContent?.latestNewCards?.cards}
                referenceOriginal={{ dir: "news", index: 0 }}
                currentContent={currentContent}
            />

            {/* select trending news */}
            <MultiSelectSM
                referenceOriginal={{ dir: "TrendingNews", index: 0 }}
                currentContent={currentContent}
                currentPath={currentPath}
                // section={"latestNewCards"}
                language={language}
                label={"Select Trend News"}
                heading={"Trend News Section"}
                tabName={"Select News"}
                options={currentPath?.latestNewCards?.cards}
            />

        </div>
    )
}

export default NewsManager