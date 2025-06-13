import { useDispatch, useSelector } from "react-redux"
import FileUploader from "../../../../../components/Input/InputFileUploader"
import ContentSection from "../../breakUI/ContentSections"
import DynamicContentSection from "../../breakUI/DynamicContentSection"
import { updateTheProjectSummaryList } from "../../../../common/homeContentSlice"
import MultiSelect from "../../breakUI/MultiSelect"
import { useEffect, useState } from "react"
import { getResources } from "../../../../../app/fetch"

const NewsDetailManager = ({ newsId, content, currentPath, language, indexes }) => {
    const dispatch = useDispatch();
    const [newsList, setNewsList] = useState([])
    const newsIndex = 0
    const slug = useSelector(state => state?.homeContent?.present?.content?.slug)

    const banner = content?.[1]?.content;
    const newsPoints = content?.[2]?.content;
    const latestNewCards = content?.[3];

    const addExtraSummary = () => {
        dispatch(updateTheProjectSummaryList(
            {
                insert: {
                    title: {
                        ar: "",
                        en: ""
                    },
                    content: {
                        ar: "",
                        en: ""
                    }
                },
                newsId,
                newsIndex,
                context: "newsBlogsDetails",
                operation: 'add'
            }
        ))
    }

    const latestNews = content?.[3]?.items

    useEffect(() => {
        async function getListResources() {
            const response = await getResources({ resourceType: "SUB_PAGE", resourceTag: "NEWS", apiCallType: "INTERNAL", fetchType: "CONTENT" })
            if (response.message === "Success") {
                let options = response?.resources?.resources?.map((e, i) => {
                    if (e.slug === slug) { return null }
                    return ({
                        id: e.id,
                        order: i + 1,
                        slug: e.slug,
                        titleEn: e.titleEn,
                        titleAr: e.titleAr,
                        // icon: e.icon,
                        image: e?.liveModeVersionData?.sections?.image,
                        description: e?.liveModeVersionData?.sections?.[1]?.content?.[0].description,
                        date: e?.liveModeVersionData?.sections?.[0]?.content?.date
                    })
                })
                setNewsList(options.filter(Boolean))
            }
        }

        getListResources()
    }, [])

    return (
        <div>
            <FileUploader id={"NewsDetailsIDReference" + newsId} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: banner?.title?.[language] },
                    { input: "input", label: "Description", updateType: "date", maxLength: 15, value: banner?.date?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", maxLength: 6, value: banner?.button?.[0]?.text?.[language] },
                ]}
                inputFiles={[{ label: "Backround Image", id: "newsBanner/" + (newsId), order: 1, url: banner?.images?.[0]?.url }]}
                section={"banner"}
                language={language}
                currentContent={content}
                projectId={newsIndex + 1}
                sectionIndex={indexes?.['1']}
            />

            <div className="mt-4 border-b">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>News Details</h3>
                {
                    newsPoints?.map((element, index, a) => {
                        return (
                            <DynamicContentSection key={index}
                                currentPath={currentPath}
                                subHeading={"Section " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title", maxLength: 100, value: element?.title?.[language] },
                                    { input: "richtext", label: "Description", updateType: "description", value: element?.description?.[language] },
                                ]}
                                section={"newsPoints"}
                                isBorder={false}
                                index={index}
                                language={language}
                                currentContent={content}
                                projectId={newsIndex + 1}
                                careerIndex={newsIndex}
                                careerId={newsId}
                                contentIndex={index}
                                type={"content[index]"}
                                newsId={newsId}
                                allowRemoval={true}
                                sectionIndex={indexes?.['2']}
                            />
                        )
                    })
                }
                <button className="text-blue-500 cursor-pointer mb-3"
                    onClick={addExtraSummary}
                >Add More Section...</button>
            </div>

            <MultiSelect
                currentPath={currentPath}
                section={"newsPoints"}
                language={language}
                // label={"Select More Project List"}
                heading={"More Projects"}
                tabName={"Select Project"}
                listOptions={newsList}
                options={latestNewCards?.items || []}
                referenceOriginal={{ dir: "home", index: 0 }}
                currentContent={content}
                projectId={newsIndex + 1}
                sectionIndex={indexes?.['3']}
            />
        </div>
    )
}

export default NewsDetailManager