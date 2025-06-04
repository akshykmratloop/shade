import { useEffect, useState } from "react"
import { getResources } from "../../../../app/fetch"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
// import MultiSelect from "../breakUI/MultiSelect"
import DynamicContentSection from "../breakUI/DynamicContentSection"
import { useDispatch } from "react-redux"
import { updateCardAndItemsArray, updatePoliciesItems } from "../../../common/homeContentSlice"

const HistoryManager = ({ content, currentPath, language, indexes }) => {
    // const dispatch = useDispatch()

    // const addExtraSummary = () => {
    //     dispatch(updatePoliciesItems(
    //         {
    //             insert: {
    //                 title: {
    //                     ar: "",
    //                     en: ""
    //                 },
    //                 description: {
    //                     ar: "",
    //                     en: ""
    //                 },
    //                 images: [
    //                     {
    //                         url: "",
    //                         order: 1,
    //                         altText: {
    //                             ar: "",
    //                             en: ""
    //                         }
    //                     }
    //                 ]
    //             },
    //             sectionIndex: indexes?.['2'],
    //             operation: 'add'
    //         }
    //     ))
    // }


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
                Heading={"History Descriptions"}
                currentPath={currentPath}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['2']?.content?.title?.[language] },
                    { input: "richtext", label: "Description", updateType: "description", value: content?.['2']?.content?.description?.[language] },
                ]}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
            />

            <ContentSection
                Heading={"Gallery Images"}
                currentPath={currentPath}
                // inputs={[
                //     { input: "input", label: "Heading/title", updateType: "title", value: content?.['2']?.content?.procedures?.title?.[language] },
                //     { input: "textarea", label: "Description", updateType: "description", value: content?.['2']?.content?.procedures?.description?.[language] },
                // ]}
                inputFiles={[
                    { label: "Image 1", id: "ServiceBanner", order: 1, url: content?.['1']?.content?.images?.[0]?.url },
                    { label: "Image 2", id: "ServiceBanner", order: 2, url: content?.['1']?.content?.images?.[0]?.url },
                    { label: "Image 3", id: "ServiceBanner", order: 3, url: content?.['1']?.content?.images?.[0]?.url },
                    { label: "Image 4", id: "ServiceBanner", order: 4, url: content?.['1']?.content?.images?.[0]?.url },
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