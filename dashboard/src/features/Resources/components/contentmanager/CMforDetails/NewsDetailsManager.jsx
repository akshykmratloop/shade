import { useDispatch } from "react-redux"
import FileUploader from "../../../../../components/Input/InputFileUploader"
import ContentSection from "../../breakUI/ContentSections"
import DynamicContentSection from "../../breakUI/DynamicContentSection"
import { updateTheProjectSummaryList } from "../../../../common/homeContentSlice"
import MultiSelect from "../../breakUI/MultiSelect"

const NewsDetailManager = ({ newsId, currentContent, currentPath, language }) => {
    const dispatch = useDispatch();
    const newsIndex = 0

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

    return (
        <div>
            <FileUploader id={"NewsDetailsIDReference" + newsId} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "input", label: "Description", updateType: "subTitle", maxLength: 15 },
                    { input: "input", label: "Button Text", updateType: "button", maxLength: 6 },
                    // { input: "input", label: "Url", updateType: "url" },
                ]}
                inputFiles={[{ label: "Backround Image", id: "newsBanner/" + (newsId) }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                projectId={newsIndex + 1}
            />

            <div className="mt-4 border-b">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>News Details</h3>
                {
                    currentContent?.[newsIndex]?.newsPoints?.map((element, index, a) => {
                        return (
                            <DynamicContentSection key={index}
                                currentPath={currentPath}
                                subHeading={"Section " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title", maxLength: 100 },
                                    { input: "richtext", label: "Description", updateType: "content" },
                                ]}
                                section={"newsPoints"}
                                isBorder={false}
                                index={index}
                                language={language}
                                currentContent={currentContent}
                                projectId={newsIndex + 1}
                                careerIndex={newsIndex}
                                careerId={newsId}
                                newsId={newsId}
                                allowRemoval={true}
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
                options={currentContent?.[newsIndex]?.latestNews || []}
                referenceOriginal={{ dir: "newsBlogsDetails", index: 0 }}
                currentContent={currentContent}
                projectId={newsIndex + 1}
            />
        </div>
    )
}

export default NewsDetailManager