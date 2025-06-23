// import { useEffect, useState } from "react"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
import { useDispatch, useSelector } from "react-redux"
import { updateNumberOfDescription, updateSubServiceDetailsPointsArray } from "../../../common/homeContentSlice"
import DynamicContentSection from "../breakUI/DynamicContentSection";


const skeletons = {
    3: {
        "title": {
            "ar": "",
            "en": ""
        },
        "description": {
            "ar": "",
            "en": ""
        },
        "images": [
            {
                "url": "",
                "order": 1,
                "altText": {
                    "ar": "",
                    "en": ""
                }
            }
        ]
    },
    "4": {
        "ar": "",
        "en": ""
    }
}

const TemplateThreeManager = ({ content, currentPath, language, indexes }) => {
    const dispatch = useDispatch()

    const context = useSelector(state => state.homeContent?.present?.content) || {}

    const addExtraSummary = (sectionIndex, structure, cardIndex) => {
        dispatch(updateNumberOfDescription(
            {
                insert: skeletons[structure],
                section: "cards",
                sectionIndex,
                operation: 'add',
                cardIndex
            }
        ))
    }

    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"Temp-Two-ID-Reference"} label={"Rerference doc"} fileName={"Upload your file..."} />

            {
                context?.id === "N" &&
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Page - Details"}
                    inputs={[
                        { input: "input", label: "Title English", updateType: "titleEn", value: context?.titleEn, dir: "ltr" },
                        { input: "input", label: "Title Arabic", updateType: "titleAr", value: context?.titleAr, dir: "rtl" },
                        ...(context?.id === "N" ? [{ input: "input", label: "Slug", updateType: "slug", value: context?.slug }] : []),
                    ]}
                    section={"page-details"}
                    language={language}
                />
            }

            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 400, value: content?.['1']?.content?.description?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", maxLength: 20, value: content?.["1"]?.content?.button?.[0]?.text?.[language], index: 0 }
                ]}
                inputFiles={[{ label: "Backround Image", id: "ServiceBanner", order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['1']}
            />

            <ContentSection
                currentPath={currentPath}
                Heading={"Sub Heading"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['2']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 400, value: content?.['2']?.content?.description?.[language] },
                ]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
            />

            <ContentSection
                currentPath={currentPath}
                Heading={"Cards"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['3']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 200, value: content?.['3']?.content?.description?.[language] },
                ]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['3']}
            />


            <div className="mt-4 border-b pb-3">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Cards</h3>
                {
                    content?.[3]?.content?.cards?.map?.((section, i) => {
                        return (
                            <DynamicContentSection
                                key={i}
                                currentPath={currentPath}
                                subHeading={`Card ${(i + 1)}`}
                                inputs={[
                                    { input: "input", label: "Heading/title", updateType: "title", value: section?.title?.[language] },
                                    { input: "textarea", label: "Description", updateType: "description", maxLength: 150, value: section?.description?.[language] },
                                ]}
                                inputFiles={[{ label: "Image", id: `grid${i}`, order: 1, url: section?.images?.[0]?.url }]}
                                index={i}
                                isBorder={false}
                                section={"cards"}
                                subSection={"cards"}
                                language={language}
                                currentContent={content}
                                sectionIndex={indexes?.['3']}
                                contentIndex={i}
                                order={section.order}
                                allowRemoval={true}
                            />
                        )
                    })
                }
                <button
                    className="block text-blue-500 cursor-pointer my-3"
                    onClick={() => addExtraSummary(indexes?.['3'], 3)}
                >
                    Add Section...
                </button>
            </div>


            <ContentSection
                currentPath={currentPath}
                Heading={"Mark Down"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['5']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['5']?.content?.description?.[language] },
                ]}
                inputFiles={
                    content?.[5]?.content?.images?.map((e) => {

                        return {
                            label: "Images",
                            id: `markDown-${e.order}`,
                            order: e.order,
                            url: e?.url
                        }
                    })
                }
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['5']}
            />

        </div>
    )
}

export default TemplateThreeManager