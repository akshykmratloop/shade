// import { useEffect, useState } from "react"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
import { useDispatch, useSelector } from "react-redux"
import { updateNumberOfDescription, updateSubServiceDetailsPointsArray } from "../../../common/homeContentSlice"
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

const TemplateTwoManager = ({ content, currentPath, language, indexes, outOfEditing }) => {
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
                // context?.id === "N" &&
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Page - Details"}
                    inputs={[
                        { input: "input", label: "Title English", updateType: "titleEn", value: context?.titleEn, dir: "ltr" },
                        { input: "input", label: "Title Arabic", updateType: "titleAr", value: context?.titleAr, dir: "rtl" },
                        ...([{ input: "input", label: "Slug", updateType: "slug", value: context?.slug, disable: context?.id === "N" ? false : true, dir:"ltr" }]),
                    ]}
                    section={"page-details"}
                    language={language}
                    outOfEditing={outOfEditing}
                />
            }

            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading", updateType: "title", value: content?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['1']?.content?.description?.[language] },
                ]}
                inputFiles={[{ label: "Backround Image", id: "Temp2Banner", order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['1']}
                outOfEditing={outOfEditing}

            />

            <ContentSection
                currentPath={currentPath}
                Heading={"Sub Heading"}
                inputs={[
                    { input: "input", label: "Title", updateType: "title", value: content?.['2']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['2']?.content?.description?.[language] },
                ]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
                outOfEditing={outOfEditing}

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
                                index={i}
                                isBorder={false}
                                section={"cards"}
                                subSection={"cards"}
                                language={language}
                                currentContent={content}
                                sectionIndex={indexes?.['3']}
                                contentIndex={i}
                                order={section.order}
                                outOfEditing={outOfEditing}
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
                                    Heading={`Grid ${(i + 1)}`}
                                    inputs={[
                                        { input: "input", label: "Title", updateType: "title", value: section?.title?.[language] },
                                        ...(section?.description?.map((d, idx) => {
                                            return (
                                                { input: "textarea/dynamic", label: "Description", updateType: "description", value: d?.[language], index: idx }
                                            )
                                        }))
                                    ]}
                                    inputFiles={[{ label: "Image", id: `cards${i}`, order: 1, url: section?.images?.[0]?.url }]}
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
                                    outOfEditing={outOfEditing}

                                />
                                {
                                    (section?.description?.length < 6) &&
                                    <button
                                        className="text-blue-500 cursor-pointer mb-6"
                                        onClick={() => {
                                            addExtraSummary(indexes?.['4'], "4/2", i)
                                        }}
                                    >
                                        Add Description...
                                    </button>

                                }
                            </>
                        )
                    })
                }


                <button
                    className="block text-blue-500 cursor-pointer my-3 pt-3"
                    onClick={() => addExtraSection(indexes?.['4'], 4)}
                >
                    Add Section...
                </button>
            </div>

            <ContentSection
                currentPath={currentPath}
                Heading={"Mark Down"}
                inputs={[
                    { input: "input", label: "Title", updateType: "title", value: content?.['5']?.content?.title?.[language] },
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
                outOfEditing={outOfEditing}

            />

        </div>
    )
}

export default TemplateTwoManager