import { useEffect, useState } from "react";
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
import MultiSelect from "../breakUI/MultiSelect"
import MultiSelectSM from "../breakUI/MultiSelectSM"

// import { updateMainContent } from "../../../common/homeContentSlice";
// import content from "../websiteComponent/content.json"
import { useDispatch } from "react-redux";
import { getResources } from "../../../../app/fetch";

const NewsManager = ({ language, content, currentPath, indexes }) => {
    const [newses, setNewses] = useState([])
    // const dispatch = useDispatch()

    // useEffect(() => {
    //     dispatch(updateMainContent({ currentPath: "home", payload: (content?.newsBlogs) }))
    // }, [])

    useEffect(() => {
        async function getOptionsforServices() {
            const response = await getResources({ resourceType: "SUB_PAGE", resourceTag: "NEWS", apiCallType: "INTERNAL", fetchType: "CONTENT" })

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
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 300, value: content?.['1']?.content?.description?.[language] },
                    // { input: "input", label: "Button Text", updateType: "button" }
                ]}
                inputFiles={[{ label: "Backround Image", id: "newsBanner", order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                section={"bannerSection"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['1']}
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
                listOptions={newses}
                options={content?.['2']?.items}
                sectionIndex={indexes?.['2']}
            />

            <ContentSection
                currentPath={currentPath}
                Heading={"News and Blog Lists"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "heading", value: content?.['3']?.content?.heading?.[language] },
                ]}
                section={"latestNewCards"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['3']}
                isBorder={false}
            />

            {/* select latest news */}
            <MultiSelect
                currentPath={currentPath}
                section={"latestNewCards"}
                language={language}
                label={"Select News and Blog List"}
                // heading={"News Section"}
                tabName={"Select News and Blogs"}
                listOptions={newses}
                options={content?.['3']?.items}
                referenceOriginal={{ dir: "news", index: 0 }}
                currentContent={content}
                sectionIndex={indexes?.['3']}
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
                listOptions={newses}
                options={content?.['4']?.items}
                sectionIndex={indexes?.['4']}
            />

        </div>
    )
}

export default NewsManager