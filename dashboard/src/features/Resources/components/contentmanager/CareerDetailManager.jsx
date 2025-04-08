import { useEffect } from "react"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"
import { useDispatch } from "react-redux"
import { updateContent, updateTheProjectSummaryList } from "../../../common/homeContentSlice"
import content from "../websiteComponent/content.json"
import DynamicContentSection from "../DynamicContentSection"

const CareerDetailManager = ({ careerId, currentContent, currentPath, language }) => {
    const dispatch = useDispatch();
    console.log(careerId)
    const careerIndex = currentContent?.findIndex(e => {
        console.log(e.id, careerId, e.id === careerId)
        return e.id == careerId}) 

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
                careerIndex,
                context: "careerDetails",
                operation: 'add'
            }
        ))
    }

    console.log(careerIndex)

    useEffect(() => {

        dispatch(updateContent({ currentPath: "careerDetails", payload: (content?.careerDetails) }))
    }, [])
    return (
        <div>
            <FileUploader id={"CareerIDReference" + careerId} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "input", label: "Description", updateType: "subTitle" },
                    { input: "input", label: "Button Text", updateType: "button" },
                    // { input: "input", label: "Url", updateType: "url" },
                ]}
                inputFiles={[{ label: "Backround Image", id: "careerBanner/" + (careerId) }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                projectId={careerIndex + 1}
            />

            <div className="mt-4 border-b">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Job Details Left Panel</h3>
                {
                    currentContent?.[careerIndex]?.jobDetails?.leftPanel?.sections?.map((element, index, a) => {
                        const isLast = index === a.length - 1
                        return (
                            <DynamicContentSection key={index}
                                currentPath={currentPath}
                                subHeading={"Section " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title" },
                                    { input: "richtext", label: "Description", updateType: "content" },
                                ]}
                                section={"jobDetails"}
                                subSection={"leftPanel"}
                                subSectionsProMax={"sections"}
                                index={index}
                                language={language}
                                currentContent={currentContent}
                                projectId={careerIndex + 1}
                                careerIndex={careerIndex}
                                careerId={careerId}
                                allowRemoval={true}
                                isBorder={false}
                            />
                        )
                    })
                }
                <button className="text-blue-500 cursor-pointer mb-3"
                    onClick={addExtraSummary}
                >Add More Section...</button>
            </div>

            <div className="mt-4 border-b">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Job Details Right Panel</h3>

                <div className="mb-6">

                    <ContentSection
                        currentPath={currentPath}
                        subHeading={"Top Section"}
                        inputs={[
                            { input: "input", label: "Heading/title", updateType: "title" },
                            { input: "input", label: "Button Text", updateType: "button" },
                            // { input: "input", label: "Url", updateType: "url" },
                        ]}
                        section={"jobDetails"}
                        subSection={"rightPanel"}
                        language={language}
                        currentContent={currentContent}
                        projectId={careerIndex + 1}
                        careerId={careerId}
                    />
                </div>
                {
                    currentContent?.[careerIndex]?.jobDetails?.rightPanel?.tailwraps?.map((element, index, a) => {
                        const isLast = index === a.length - 1
                        return (
                            <DynamicContentSection key={index}
                                currentPath={currentPath}
                                subHeading={"Section " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title" },
                                    { input: "input", label: "Description", updateType: "description" },
                                ]}
                                inputFiles={[{ label: "icon", id: `careerRightPanel/${careerId}/${index}` }]}
                                section={"jobDetails"}
                                subSection={"rightPanel"}
                                subSectionsProMax={"tailwraps"}
                                index={index}
                                language={language}
                                currentContent={currentContent}
                                projectId={careerIndex + 1}
                                careerIndex={careerIndex}
                                careerId={careerId}
                                isBorder={false}
                            />
                        )
                    })
                }

                <div>
                    <ContentSection
                        currentPath={currentPath}
                        subHeading={"Right panel redirection"}
                        inputs={[
                            { input: "input", label: "Heading/title", updateType: "text" },
                            { input: "input", label: "Link", updateType: "link" },
                            // { input: "input", label: "Url", updateType: "url" },
                        ]}
                        section={"jobDetails"}
                        subSection={"rightPanel"}
                        subSectionsProMax={"viewAllButton"}
                        language={language}
                        currentContent={currentContent}
                        projectId={careerIndex + 1}
                        careerId={careerId}
                    />
                </div>
            </div>

            <ContentSection
                currentPath={currentPath}
                subHeading={"Bottom Button"}
                inputs={[
                    { input: "input", label: "Button", updateType: "button" },
                ]}
                section={"jobDetails"}
                language={language}
                currentContent={currentContent}
                projectId={careerIndex + 1}
                careerId={careerId}
            />

        </div>
    )
}

export default CareerDetailManager