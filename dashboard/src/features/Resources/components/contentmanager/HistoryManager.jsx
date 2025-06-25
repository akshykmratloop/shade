// import { useEffect, useState } from "react"
// import { getResources } from "../../../../app/fetch"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
// import MultiSelect from "../breakUI/MultiSelect"
// import { useDispatch } from "react-redux"
// import { updateCardAndItemsArray, updatePoliciesItems } from "../../../common/homeContentSlice"

const HistoryManager = ({ content, currentPath, language, indexes }) => {


    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"History-ID-Reference"} label={"Rerference doc"} fileName={"Upload your file..."} />

            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading", updateType: "title", value: content?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['1']?.content?.description?.[language] },
                ]}
                inputFiles={[{ label: "Backround Image", id: "HistoryBanner", order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['1']}
            />

            <ContentSection
                Heading={"History Descriptions"}
                currentPath={currentPath}
                inputs={[
                    { input: "input", label: "Title", updateType: "title", value: content?.['2']?.content?.title?.[language] },
                    { input: "richtext", label: "Description", updateType: "description", value: content?.['2']?.content?.description?.[language] },
                ]}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
            />

            <ContentSection
                Heading={"Gallery Images"}
                currentPath={currentPath}
                inputFiles={[
                    { label: "Image 1", id: "ServiceBanner1", order: 1, url: content?.['2']?.content?.images?.[0]?.url },
                    { label: "Image 2", id: "ServiceBanner2", order: 2, url: content?.['2']?.content?.images?.[1]?.url },
                    { label: "Image 3", id: "ServiceBanner3", order: 3, url: content?.['2']?.content?.images?.[2]?.url },
                    { label: "Image 4", id: "ServiceBanner4", order: 4, url: content?.['2']?.content?.images?.[3]?.url },
                ]}
                section={"procedures"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
            />

        </div>
    )
}

export default HistoryManager