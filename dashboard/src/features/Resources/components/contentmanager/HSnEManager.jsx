import { useEffect, useState } from "react"
import { getResources } from "../../../../app/fetch"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
// import MultiSelect from "../breakUI/MultiSelect"
// import DynamicContentSection from "../breakUI/DynamicContentSection"
import { useDispatch } from "react-redux"
import { updateAffiliatesCardsArray } from "../../../common/homeContentSlice"
import DynamicContentSection from "../breakUI/DynamicContentSection"

const HSnEManager = ({ content, currentPath, language, indexes, outOfEditing }) => {
    const dispatch = useDispatch()
    const addExtraSummary = () => {
        dispatch(updateAffiliatesCardsArray(
            {
                src: {
                    text: {
                        ar: "",
                        en: ""
                    }
                },
                section: "sectionPointers",
                sectionIndex: indexes?.['2'],
                operation: 'add'
            }
        ))
    }

    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"SnR-Polilcy-ID-Reference"} label={"Rerference doc"} fileName={"Upload your file..."} outOfEditing={outOfEditing} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading", updateType: "title", value: content?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['1']?.content?.description?.[language] },
                ]}
                inputFiles={[{ label: "Backround Image", id: "HSE-Banner", order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['1']}
                outOfEditing={outOfEditing}
            />



            {
                content?.[2]?.content?.cards?.map?.((card, i) => {
                    return (
                        <ContentSection
                            key={i}
                            Heading={"Card " + (i + 1)}
                            currentPath={currentPath}
                            inputs={[
                                { input: "input", label: "Title", updateType: "title", value: card?.title?.[language] },
                                { input: "textarea", label: "Description", updateType: "description", value: card?.description?.[language] },
                            ]}
                            inputFiles={[{ label: "Icon", id: `HSEIcons${i}`, order: 1, url: card?.images?.[0]?.url }]}
                            section={"cards"}
                            subSection={"cards"}
                            index={i}
                            language={language}
                            currentContent={content}
                            sectionIndex={indexes?.['2']}
                            outOfEditing={outOfEditing}
                        />
                    )
                })
            }

            <ContentSection
                Heading={"Feature Image"}
                currentPath={currentPath}
                inputFiles={[{ label: "Feature Image", id: `Feature-HSE`, order: 1, url: content?.['2']?.content?.images?.[0]?.url }]}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
                outOfEditing={outOfEditing}
            />

            <ContentSection
                Heading={"Section 2"}
                currentPath={currentPath}
                inputs={[
                    { input: "input", label: "Title", updateType: "title", value: content?.['2']?.content?.title?.[language] },
                    { input: "richtext", label: "Description", updateType: "description", value: content?.['2']?.content?.description?.[language] },
                ]}
                // section={"procedures"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
                outOfEditing={outOfEditing}
            />

            <div className="mt-4 border-b">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Multi Description</h3>
                {
                    content?.['2']?.content?.sectionPointers?.map((section, i) => {
                        return (
                            <DynamicContentSection
                                key={i}
                                currentPath={currentPath}
                                inputs={[{
                                    input: "textarea", label: "Text " + (i + 1), updateType: "text", value: section?.text?.[language], index: i
                                }]}
                                index={i}
                                isBorder={false}
                                allowRemoval={true}
                                section={"sectionPointers"}
                                language={language}
                                currentContent={content}
                                sectionIndex={indexes?.['2']}
                                order={section.order}
                                outOfEditing={outOfEditing}
                            />)
                    })
                }
                <button className="text-blue-500 cursor-pointer mb-3" onClick={() => addExtraSummary('whatWeDo')}>Add Section...</button>
            </div>


        </div>
    )
}

export default HSnEManager