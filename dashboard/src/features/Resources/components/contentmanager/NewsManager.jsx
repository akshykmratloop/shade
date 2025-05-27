import { useEffect, useState } from "react";
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
import MultiSelect from "../breakUI/MultiSelect"
import MultiSelectSM from "../breakUI/MultiSelectSM"

// import { updateMainContent } from "../../../common/homeContentSlice";
// import content from "../websiteComponent/content.json"
import { useDispatch } from "react-redux";
import { getResources } from "../../../../app/fetch";

const NewsManager = ({ language, content, currentPath }) => {
    const [newses, setNewses] = useState([])
    // const dispatch = useDispatch()

    // useEffect(() => {
    //     dispatch(updateMainContent({ currentPath: "home", payload: (content?.newsBlogs) }))
    // }, [])

    useEffect(() => {
        async function getOptionsforServices() {
            const response = await getResources({ resourceType: "SUB_PAGE", resourceTag: "SERVICE", apiCallType: "INTERNAL" })

            if (response.ok) {
                let options = response?.resources?.resources?.map((e, i) => ({
                    id: e.id,
                    order: i + 1,
                    slug: e.slug,
                    titleEn: e.titleEn,
                    titleAr: e.titleAr,
                    icon: e.icon,
                    image: e.image,
                    description: e.liveModeVersionData?.sections?.[1]?.content?.[0]?.description,
                    date: e.liveModeVersionData?.sections?.[0]?.content?.date
                }))
                setNewses(options)
            }
        }

        getOptionsforServices()
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
                currentContent={content}
            />

            {/* select main news */}
            <MultiSelectSM
                referenceOriginal={{ dir: "MainNews", index: 0 }}
                
                currentContent={content}
                currentPath={currentPath}
                language={language}
                label={"Select Main News"}
                heading={"Main News Section"}
                tabName={"Select News"}
                options={currentPath?.latestNewCards?.cards}
            />

            <ContentSection
                currentPath={currentPath}
                Heading={content?.latestNewCards?.heading?.en}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "heading" },
                ]}
                section={"latestNewCards"}
                language={language}
                currentContent={content}
            />

            {/* select latest news */}
            <MultiSelect
                currentPath={currentPath}
                section={"latestNewCards"}
                language={language}
                label={"Select News and Blog List"}
                heading={"News Section"}
                tabName={"Select News and Blogs"}
                options={content?.latestNewCards?.cards}
                referenceOriginal={{ dir: "news", index: 0 }}
                currentContent={content}
            />

            {/* select trending news */}
            <MultiSelectSM
                referenceOriginal={{ dir: "TrendingNews", index: 0 }}
                currentContent={content}
                currentPath={currentPath}
                // section={"latestNewCards"}
                language={language}
                label={"Select Trend News"}
                heading={"Trend News Section"}
                tabName={"Select News"}
                options={content?.latestNewCards?.cards}
            />

        </div>
    )
}

export default NewsManager