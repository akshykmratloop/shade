// import { useEffect, useState } from "react"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
import { useDispatch, useSelector } from "react-redux"
import { updateSubServiceDetailsPointsArray } from "../../../common/homeContentSlice"
import DynamicContentSection from "../breakUI/DynamicContentSection";


const skeletons = {
    2: {
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
    4: {
        "title": {
            "ar": "",
            "en": ""
        },
        "description": {
            "ar": "",
            "en": ""
        }
    }
}

const TemplateOneManager = ({ content, currentPath, language, indexes, outOfEditing }) => {
    const dispatch = useDispatch()

    const context = useSelector(state => state.homeContent?.present?.content) || {}


    const addExtraSummary = (sectionIndex, structure) => {
        dispatch(updateSubServiceDetailsPointsArray(
            {
                insert: skeletons[structure],
                section: "cards",
                sectionIndex,
                operation: 'add'
            }
        ))
    }

    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"Temp-One-ID-Reference"} label={"Rerference doc"} fileName={"Upload your file..."} outOfEditing={outOfEditing} />

            {
                // context?.id === "N" &&
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Page - Details"}
                    inputs={[
                        { input: "input", label: "Title English", updateType: "titleEn", value: context?.titleEn, dir: "ltr" },
                        { input: "input", label: "Title Arabic", updateType: "titleAr", value: context?.titleAr, dir: "rtl" },
                        ...([{ input: "input", label: "Slug", updateType: "slug", value: context?.slug, disable: context?.id === "N" ? false : true, dir: "ltr" }]),
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
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 350, value: content?.['1']?.content?.description?.[language] },
                ]}
                inputFiles={[{ label: "Backround Image", id: "Temp1Banner", order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['1']}
                outOfEditing={outOfEditing}

            />


            <div className="mt-4 border-b pb-3">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Multi Grid Section</h3>
                {
                    content?.[2]?.content?.cards?.map?.((section, i) => {
                        return (
                            <DynamicContentSection
                                key={i}
                                currentPath={currentPath}
                                subHeading={`Grid ${(i + 1)}`}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title", value: section?.title?.[language] },
                                    { input: "textarea", label: "Description", maxLength: 500, updateType: "description", value: section?.description?.[language] },
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
                                outOfEditing={outOfEditing}

                            />
                        )
                    })
                }
                <button
                    className="text-blue-500 cursor-pointer my-3 pt-3"
                    onClick={() => addExtraSummary(indexes?.['2'], 2)}
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
                                subHeading={`Cards ${(i + 1)}`}
                                inputs={[
                                    { input: "input", label: "Heading/title", updateType: "title", value: section?.title?.[language] },
                                    { input: "textarea", label: "Description", updateType: "description", value: section?.description?.[language] },
                                ]}
                                inputFiles={[{ label: "Icon", id: `cards${i}`, order: 1, url: section?.images?.[0]?.url }]}
                                index={i}
                                isBorder={false}
                                allowRemoval={true}
                                section={"cards"}
                                subSection={"cards"}
                                language={language}
                                currentContent={content}
                                sectionIndex={indexes?.['3']}
                                order={section.order}
                                outOfEditing={outOfEditing}

                            />
                        )
                    })
                }
                {
                    !outOfEditing &&
                    <button
                        className="text-blue-500 cursor-pointer my-3 pt-3"
                        onClick={() => addExtraSummary(indexes?.['3'], 3)}
                        disabled={outOfEditing}
                    >
                        Add Section...
                    </button>}
            </div>

            <div className="mt-4 border-b pb-3">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>
                    Multi Description
                </h3>
                {
                    content?.['4']?.content?.cards?.map((section, i) => {
                        return (
                            <DynamicContentSection
                                key={i}
                                subHeading={`Description ${(i + 1)}`}
                                currentPath={currentPath}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title", value: section?.title?.[language] },
                                    { input: "textarea", label: "Description", updateType: "description", value: section?.description?.[language] }
                                ]}
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
                        )
                    })
                }
                {
                    !outOfEditing &&
                    <button
                        className="text-blue-500 cursor-pointer my-3 pt-3"
                        onClick={() => addExtraSummary(indexes?.['4'], 4)}
                    >
                        Add Section...
                    </button>}
            </div>


        </div>
    )
}

export default TemplateOneManager