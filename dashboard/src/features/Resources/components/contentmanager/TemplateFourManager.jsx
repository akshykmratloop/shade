// import { useEffect, useState } from "react"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
import { useDispatch, useSelector } from "react-redux"
import { updateSubServiceDetailsPointsArray } from "../../../common/homeContentSlice"
import DynamicContentSection from "../breakUI/DynamicContentSection";


const skeletons = {
    "5": {
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
    }
}

const TemplateFourManager = ({ content, currentPath, language, indexes, outOfEditing }) => {
    const dispatch = useDispatch()

    const context = useSelector(state => state.homeContent?.present?.content) || {}

    const addExtraSummary = (sectionIndex, structure, cardIndex) => {
        dispatch(updateSubServiceDetailsPointsArray(
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
            <FileUploader id={"Temp-Four-ID-Reference"} label={"Rerference doc"} fileName={"Upload your file..."} outOfEditing={outOfEditing} />

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

                />
            }

            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading", updateType: "title", value: content?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 400, value: content?.['1']?.content?.description?.[language] },
                ]}
                inputFiles={[{ label: "Backround Image", id: "Template4Banner", order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['1']}
                outOfEditing={outOfEditing}

            />

            <ContentSection
                currentPath={currentPath}
                Heading={"Gallery"}
                inputFiles={
                    content?.[2]?.content?.images?.map((e) => {
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
                sectionIndex={indexes?.['2']}
                outOfEditing={outOfEditing}

            />

            <ContentSection
                currentPath={currentPath}
                Heading={"Sub Heading"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['3']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 400, value: content?.['3']?.content?.description?.[language] },
                ]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['3']}
                outOfEditing={outOfEditing}

            />


            <ContentSection
                currentPath={currentPath}
                Heading={"Mark Down"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['4']?.content?.title?.[language] },
                    { input: "richtext", label: "Description", updateType: "description", value: content?.['4']?.content?.description?.[language] },
                ]}
                section={"MarkDown"}
                isBorder={false}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['4']}
                outOfEditing={outOfEditing}

            />

            <div className="mt-4 border-b pb-3">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Cards</h3>
                {
                    content?.[5]?.content?.cards?.map?.((section, i) => {
                        return (
                            <DynamicContentSection
                                key={i}
                                currentPath={currentPath}
                                subHeading={`Card ${(i + 1)}`}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title", maxLength: 29, value: section?.title?.[language] },
                                    { input: "textarea", label: "Description", updateType: "description", maxLength: 400, value: section?.description?.[language] },
                                ]}
                                inputFiles={[{ label: "Icon", id: `icontemp4${i}`, order: 1, url: section?.images?.[0]?.url }]}
                                index={i}
                                isBorder={false}
                                section={"cards"}
                                subSection={"cards"}
                                language={language}
                                currentContent={content}
                                sectionIndex={indexes?.['5']}
                                contentIndex={i}
                                order={section.order}
                                allowRemoval={true}
                                outOfEditing={outOfEditing}

                            />
                        )
                    })
                }
                {
                    (content?.[5]?.content?.cards?.length < 6) && (
                        !outOfEditing &&
                        <button
                            className="block text-blue-500 cursor-pointer my-3"
                            onClick={() => addExtraSummary(indexes?.['5'], 5)}
                        >
                            Add Card...
                        </button>)
                }
            </div>

        </div >
    )
}

export default TemplateFourManager