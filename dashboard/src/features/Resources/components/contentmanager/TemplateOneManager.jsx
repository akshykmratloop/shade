import { useEffect, useState } from "react"
import { getResources } from "../../../../app/fetch"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
// import MultiSelect from "../breakUI/MultiSelect"
// import DynamicContentSection from "../breakUI/DynamicContentSection"
import { useDispatch } from "react-redux"
import { updateAffiliatesCardsArray } from "../../../common/homeContentSlice"
import DynamicContentSection from "../breakUI/DynamicContentSection"

const TemplateOneManager = ({ content, currentPath, language, indexes }) => {
    const dispatch = useDispatch()

    const addExtraSummary = (sectionIndex) => {
        dispatch(updateAffiliatesCardsArray(
            {
                src: {
                    text: {
                        ar: "",
                        en: ""
                    }
                },
                section: "sectionPointers",
                sectionIndex,
                operation: 'add'
            }
        ))
    }

    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"Temp-One-ID-Reference"} label={"Rerference doc"} fileName={"Upload your file..."} />
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
            />


            <div className="mt-4 border-b pb-3">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Multi Grid Section</h3>
                {
                    content?.[2]?.content?.cards?.map?.((section, i) => {
                        return (
                            <DynamicContentSection
                                key={i}
                                currentPath={currentPath}
                                inputs={[
                                    { input: "input", label: "Heading/title", updateType: "title", value: section?.title?.[language] },
                                    { input: "textarea", label: "Description", updateType: "description", value: section?.description?.[language] },
                                ]}
                                inputFiles={[{ label: "Image", id: `grid${i}`, order: 1, url: section?.images?.[0]?.url }]}
                                index={i}
                                isBorder={false}
                                allowRemoval={true}
                                section={"cards"}
                                subSection={"cards"}
                                language={language}
                                currentContent={content}
                                sectionIndex={indexes?.['2']}
                                contentIndex={i}
                                order={section.order}
                            />
                        )
                    })
                }
                <button
                    className="text-blue-500 cursor-pointer my-3 pt-3"
                    onClick={() => addExtraSummary(indexes?.['2'])}
                >
                    Add More Section...
                </button>
            </div>

            <div className="mt-4 border-b pb-3">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Multi Cards</h3>
                {
                    content?.[3]?.content?.cards?.map?.((section, i) => {
                        return (
                            <DynamicContentSection
                                key={i}
                                currentPath={currentPath}
                                inputs={[
                                    { input: "input", label: "Heading/title", updateType: "title", value: section?.title?.[language] },
                                    { input: "textarea", label: "Description", updateType: "description", value: section?.description?.[language] },
                                ]}
                                inputFiles={[{ label: "Icon", id: "ServiceBanner", order: 1, url: section?.images?.[0]?.url }]}
                                index={i}
                                isBorder={false}
                                allowRemoval={true}
                                section={"cards"}
                                subSection={"cards"}
                                language={language}
                                currentContent={content}
                                sectionIndex={indexes?.['3']}
                                order={section.order}
                            />
                        )
                    })
                }
                <button
                    className="text-blue-500 cursor-pointer mb-3"
                    onClick={() => addExtraSummary(indexes?.['3'])}
                >
                    Add More Section...
                </button>
            </div>

            <div className="mt-4 border-b pb-3">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>
                    Multi Description
                </h3>
                {
                    content?.['4']?.content?.map((section, i) => {
                        return (
                            <DynamicContentSection
                                key={i}
                                currentPath={currentPath}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title", value: section?.text?.[language]},
                                    { input: "textarea", label: "Description", updateType: "description", value: section?.text?.[language]}
                                ]}
                                index={i}
                                isBorder={false}
                                allowRemoval={true}
                                section={"Footer"}
                                language={language}
                                currentContent={content}
                                sectionIndex={indexes?.['4']}
                                contentIndex={i}
                                order={section.order}
                            />
                        )
                    })
                }
                <button
                    className="text-blue-500 cursor-pointer mb-3"
                    onClick={() => addExtraSummary(indexes?.['4'])}
                >
                    Add More Section...
                </button>
            </div>


        </div>
    )
}

export default TemplateOneManager