import { useEffect, useState } from "react"
import { getResources } from "../../../../app/fetch"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
// import MultiSelect from "../breakUI/MultiSelect"
import DynamicContentSection from "../breakUI/DynamicContentSection"
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

            <ContentSection
                Heading={"Section 1"}
                currentPath={currentPath}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['2']?.content?.procedures?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['2']?.content?.procedures?.description?.[language] },
                ]}
                section={"procedures"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
            />

            <ContentSection
                Heading={"Sub Heading"}
                currentPath={currentPath}
                inputFiles={[{ label: "Backround Image", id: "ServiceBanner", order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
            />

            <ContentSection
                Heading={"Section 2"}
                currentPath={currentPath}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['2']?.content?.procedures?.title?.[language] },
                    { input: "richtext", label: "Description", updateType: "description", value: content?.['2']?.content?.procedures?.description?.[language] },
                ]}
                section={"procedures"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
            />

            <ContentSection
                Heading={"Section 3"}
                currentPath={currentPath}
                inputs={[
                    // { input: "input", label: "Heading/title", updateType: "title", value: content?.['2']?.content?.procedures?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['2']?.content?.procedures?.description?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['2']?.content?.procedures?.description?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['2']?.content?.procedures?.description?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['2']?.content?.procedures?.description?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['2']?.content?.procedures?.description?.[language] },
                ]}
                section={"procedures"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
            />

        </div>
    )
}

export default HSnEManager