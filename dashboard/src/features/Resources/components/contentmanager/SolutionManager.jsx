// import { useEffect } from "react";
import FileUploader from "../../../../components/Input/InputFileUploader";
import ContentSection from "../breakUI/ContentSections";
import {  updateCardAndItemsArray } from "../../../common/homeContentSlice";
import { useDispatch } from "react-redux";
import DynamicContentSection from "../breakUI/DynamicContentSection";

const SolutionManager = ({ currentPath, language, currentContent, indexes }) => {
    const dispatch = useDispatch()

    const addExtraSummary = () => {
        dispatch(updateCardAndItemsArray(
            {
                insert: {
                    title: {
                        ar: "",
                        en: ""
                    },
                    description: {
                        ar: "",
                        en: ""
                    }
                },
                sectionIndex: indexes?.['2'],
                operation: 'add'
            }
        ))
    }

    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"solutionReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/* banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Solution Banner"}
                inputs={[
                    { input: "input", label: "Heading", updateType: "title", value: currentContent?.["1"]?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 300, value: currentContent?.["1"]?.content?.description?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", maxLength: 20, value: currentContent?.["1"]?.content?.button?.[0]?.text?.[language], index: 0 }
                ]}
                inputFiles={[{ label: "Background Image", id: "bannerBackground", order: 1, url: currentContent?.["1"]?.content?.images?.[0]?.url },]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                sectionIndex={indexes?.['1']}
            />

            <div className="mt-4 border-b">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Description</h3>
                {
                    currentContent?.['2']?.content?.map((element, index, a) => {
                        const isLast = index === a.length - 1
                        return (
                            <DynamicContentSection key={index}
                                currentPath={currentPath}
                                subHeading={"Section " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title", maxLength: 35, value: element?.title?.[language] },
                                    { input: "richtext", label: "Description", updateType: "description", value: element?.description?.[language] },
                                ]}
                                section={"whatWeDo"}
                                index={index}
                                language={language}
                                currentContent={currentContent}
                                isBorder={false}
                                type={'content[index]'}
                                sectionIndex={indexes?.['2']}
                                contentIndex={index}
                                allowRemoval={true}
                            />
                        )
                    })
                }
                <button className="text-blue-500 cursor-pointer mb-3" onClick={() => addExtraSummary('whatWeDo')}>Add More Section...</button>
            </div>

            {/** Gallery */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Gallery 1"}
                inputFiles={
                    currentContent?.['3']?.content.images?.map((e, i) => {
                        return { label: "Image " + (i + 1), id: "Image " + (1 + i), order: e.order, url: e.url }
                    })
                }
                section={"images"}
                language={language}
                currentContent={currentContent}
                allowExtraInput={true}
                sectionIndex={indexes?.['3']}

            />
        </div>
    )
}

export default SolutionManager