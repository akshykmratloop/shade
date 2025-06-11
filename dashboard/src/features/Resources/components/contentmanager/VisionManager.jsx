import { useEffect, useState } from "react"
import { getResources } from "../../../../app/fetch"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
// import MultiSelect from "../breakUI/MultiSelect"
import DynamicContentSection from "../breakUI/DynamicContentSection"
import { useDispatch } from "react-redux"
import { updateSubServiceDetailsPointsArray } from "../../../common/homeContentSlice"

const VisionManager = ({ content, currentPath, language, indexes, outOfEditing }) => {
    const dispatch = useDispatch()

    const addExtraSummary = () => {
        dispatch(updateSubServiceDetailsPointsArray(
            {
                insert: {
                    title: {
                        ar: "",
                        en: ""
                    },
                    description: {
                        ar: "",
                        en: ""
                    }
                },
                section: "cards",
                operation: 'add',
                sectionIndex: indexes?.['3'],
            }
        ))
    }
    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"SnR-Polilcy-ID-Reference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['1']?.content?.description?.[language] },
                ]}
                inputFiles={[{ label: "Backround Image", id: "ServiceBanner", order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['1']}
                outOfEditing={outOfEditing}
            />

            <ContentSection
                Heading={"Sub Heading"}
                currentPath={currentPath}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['2']?.content?.title?.[language] },
                    { input: "richtext", label: "Description", updateType: "description", value: content?.['2']?.content?.description?.[language] },
                ]}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
                outOfEditing={outOfEditing}
            />

            <ContentSection
                Heading={"Section 1"}
                currentPath={currentPath}
                inputs={[
                    ...(
                        content?.[2]?.content?.cards?.map((e, i) => [
                            { input: "input", label: `Card ${i + 1} - Title`, updateType: "title", value: e?.title?.[language], index: i },
                            { input: "textarea", label: `Card ${i + 1} - Description`, updateType: "description", value: e?.description?.[language], index: i },
                        ]) || []
                    ).flat()
                ]}
                subSection={"content/procedures"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
                outOfEditing={outOfEditing}
            />


            <div className="mt-4 border-b">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Details Sections</h3>
                {
                    content?.['3']?.content?.cards?.map((element, index, a) => {
                        return (
                            <DynamicContentSection key={index}
                                currentPath={currentPath}
                                subHeading={"Section " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title", maxLength: 100, value: element?.title?.[language] },
                                    { input: "textarea", label: "Description", updateType: "description", value: element?.description?.[language] },
                                ]}
                                section={"cards"}
                                subSection={"content/procedures"}
                                isBorder={false}
                                index={index}
                                language={language}
                                currentContent={content}
                                allowRemoval={true}
                                sectionIndex={indexes?.['3']}
                                outOfEditing={outOfEditing}
                            />
                        )
                    })
                }
                {
                    !outOfEditing &&
                    <button className="text-blue-500 cursor-pointer mb-3"
                        onClick={() => addExtraSummary()}
                    >Add More Section...</button>
                }
            </div>
        </div>
    )
}

export default VisionManager