// import { useEffect, useState } from "react"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
import { useDispatch, useSelector } from "react-redux"
import { updateSubServiceDetailsPointsArray } from "../../../common/homeContentSlice"
import DynamicContentSection from "../breakUI/DynamicContentSection";


const skeletons = {
    3: {
        "description": {
            "ar": "",
            "en": ""
        }
    },
    4: {
        "title": {
            "ar": "",
            "en": ""
        },
        "description": [
            {
                "ar": "",
                "en": ""
            },
            {
                "ar": "",
                "en": ""
            },
            {
                "ar": "",
                "en": ""
            },
            {
                "ar": "",
                "en": ""
            }
        ],
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
    "4/2": {
        "ar": "",
        "en": ""
    }
}

const TemplateTwoManager = ({ content, currentPath, language, indexes }) => {
    const dispatch = useDispatch()

    const context = useSelector(state => state.homeContent?.present?.content) || {}


    const addExtraSection = (sectionIndex, structure) => {
        dispatch(updateSubServiceDetailsPointsArray(
            {
                insert: skeletons[structure],
                section: "cards",
                sectionIndex,
                operation: 'add'
            }
        ))
    }

    const addExtraSummary = (sectionIndex, structure, index) => {
        dispatch(updateSubServiceDetailsPointsArray(
            {
                insert: skeletons[structure],
                section: "cards",
                sectionIndex,
                operation: 'add',
                index
            }
        ))
    }

    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"Temp-One-ID-Reference"} label={"Rerference doc"} fileName={"Upload your file..."} />

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
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['1']?.content?.description?.[language] },
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
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['2']?.content?.description?.[language] },
                ]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
            />


            <div className="mt-4 border-b pb-3">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Descriptions</h3>
                {
                    content?.[3]?.content?.cards?.map?.((section, i) => {
                        return (
                            <DynamicContentSection
                                key={i}
                                currentPath={currentPath}
                                subHeading={`Card ${(i + 1)}`}
                                inputs={[
                                    { input: "textarea", label: "Description", updateType: "description", value: section?.description?.[language] },
                                ]}
                                // inputFiles={[{ label: "Image", id: `grid${i}`, order: 1, url: section?.images?.[0]?.url }]}
                                index={i}
                                isBorder={false}
                                section={"cards"}
                                subSection={"cards"}
                                language={language}
                                currentContent={content}
                                sectionIndex={indexes?.['3']}
                                contentIndex={i}
                                order={section.order}
                            // allowRemoval={true}
                            />
                        )
                    })
                }
            </div>

            <div className="mt-4 border-b pb-3">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Multi Grid</h3>
                {
                    content?.[4]?.content?.cards?.map?.((section, i) => {
                        return (
                            <>
                                <DynamicContentSection
                                    key={i}
                                    currentPath={currentPath}
                                    subHeading={`Grid ${(i + 1)}`}
                                    inputs={[
                                        { input: "input", label: "Heading/title", updateType: "title", value: section?.title?.[language] },
                                        ...(section?.description?.map((d, idx) => {
                                            return (
                                                { input: "textarea", label: "Description", updateType: "description", value: d?.[language], index: idx }
                                            )
                                        }))
                                    ]}
                                    inputFiles={[{ label: "Icon", id: `cards${i}`, order: 1, url: section?.images?.[0]?.url }]}
                                    index={i}
                                    isBorder={false}
                                    allowRemoval={true}
                                    section={"cards"}
                                    subSection={"cards"}
                                    language={language}
                                    currentContent={content}
                                    sectionIndex={indexes?.['4']}
                                    contentIndex={i}
                                    order={section.order}
                                />
                                <button
                                    className="text-blue-500 cursor-pointer my-3 pt-3"
                                    onClick={() => addExtraSummary(indexes?.['4'], "4/2", i)}
                                >
                                    Add More Description...
                                </button>
                            </>
                        )
                    })
                }


                <button
                    className="text-blue-500 cursor-pointer my-3 pt-3"
                    onClick={() => addExtraSection(indexes?.['4'], 4)}
                >
                    Add More Section...
                </button>
            </div>

            <ContentSection
                currentPath={currentPath}
                Heading={"Mark Down"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['1']?.content?.description?.[language] },
                ]}
                inputFiles={
                    content?.[5]?.content?.images?.map((e) => {

                        return {
                            label: "Images",
                            id: `markDown-${e.order}`,
                            order: e.order,
                            url: content?.['1']?.content?.images?.[0]?.url
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

export default TemplateTwoManager