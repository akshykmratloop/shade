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

const TemplateOneManager = ({ content, currentPath, language, indexes }) => {
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
                            />
                        )
                    })
                }
                <button
                    className="text-blue-500 cursor-pointer my-3 pt-3"
                    onClick={() => addExtraSummary(indexes?.['3'], 3)}
                >
                    Add More Section...
                </button>
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
                                    { input: "input", label: "Title", updateType: "title", value: section?.text?.[language] },
                                    { input: "textarea", label: "Description", updateType: "description", value: section?.text?.[language] }
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
                            />
                        )
                    })
                }
                <button
                    className="text-blue-500 cursor-pointer my-3 pt-3"
                    onClick={() => addExtraSummary(indexes?.['4'], 4)}
                >
                    Add More Section...
                </button>
            </div>


        </div>
    )
}

export default TemplateOneManager