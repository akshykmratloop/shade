import { useEffect, useState } from "react"
import { getResources } from "../../../../app/fetch"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
// import MultiSelect from "../breakUI/MultiSelect"
// import DynamicContentSection from "../breakUI/DynamicContentSection"
import { useDispatch } from "react-redux"
import { updateCardAndItemsArray, updatePoliciesItems } from "../../../common/homeContentSlice"

const HSnEManager = ({ content, currentPath, language, indexes }) => {
    // const dispatch = useDispatch()


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
            />



            {
                content?.[2]?.content?.cards?.map?.((card, i) => {
                    return (
                        <ContentSection
                            key={i}
                            Heading={"Card " + (i + 1)}
                            currentPath={currentPath}
                            inputs={[
                                { input: "input", label: "Heading/title", updateType: "title", value: card?.title?.[language] },
                                { input: "textarea", label: "Description", updateType: "description", value: card?.description?.[language] },
                            ]}
                            inputFiles={[{ label: "Icon", id: "ServiceBanner", order: 1, url: card?.images?.[0]?.url }]}
                            section={"cards"}
                            subSection={"cards"}
                            index={i}
                            language={language}
                            currentContent={content}
                            sectionIndex={indexes?.['2']}
                        />
                    )
                })
            }

            <ContentSection
                Heading={"Feature Image"}
                currentPath={currentPath}
                inputFiles={[{ label: "Feature Image", id: "ServiceBanner", order: 1, url: content?.['2']?.content?.images?.[0]?.url }]}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
            />

            <ContentSection
                Heading={"Section 2"}
                currentPath={currentPath}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['2']?.content?.title?.[language] },
                    { input: "richtext", label: "Description", updateType: "description", value: content?.['2']?.content?.description?.[language] },
                ]}
                // section={"procedures"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
            />

            <ContentSection
                Heading={"Section 3"}
                currentPath={currentPath}
                inputs={
                    content?.['2']?.content?.sectionPointers?.map((section, i) => {

                        return { input: "textarea", label: "Text" + (i + 1), updateType: "text", value: section?.text?.[language], index: i }
                    })
                }
                section={"sectionPointers"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
            />

        </div>
    )
}

export default HSnEManager