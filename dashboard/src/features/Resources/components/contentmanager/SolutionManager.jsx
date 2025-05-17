import { useEffect } from "react";
import FileUploader from "../../../../components/Input/InputFileUploader";
import ContentSection from "../breakUI/ContentSections";
import { updateMainContent, updateCardAndItemsArray } from "../../../common/homeContentSlice";
import content from "../websiteComponent/content.json"
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

    useEffect(() => {

        return () => dispatch(updateMainContent({ currentPath: "content", payload: undefined }))
    }, [])

    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"solutionReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/* banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Solution Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: currentContent?.["1"]?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 300, value: currentContent?.["1"]?.content?.description?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", maxLength: 20, value: currentContent?.["1"]?.content?.button?.[0]?.text?.[language] }
                ]}
                inputFiles={[{ label: "Background Image", id: "bannerBackground" },]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                sectionIndex={indexes?.['1']}

            />

            {/**What We Do */}
            {/* <ContentSection
                currentPath={currentPath}
                Heading={"Solution Section 2"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description 1", updateType: "description1" },
                    { input: "textarea", label: "Description 2", updateType: "description2" }
                ]}
                section={"whatWeDo"}
                language={language}
                currentContent={currentContent}
            /> */}

            <div className="mt-4 border-b">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Description</h3>
                {
                    currentContent?.['2']?.content?.map((element, index, a) => {
                        const isLast = index === a.length - 1
                        console.log(index)
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
                                // type={'rich'}
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
                inputFiles={[
                    { label: "Image 1", id: "Image 1" },
                    { label: "Image 2", id: "Image 2" },
                    { label: "Image 3", id: "Image 3" },
                ]}
                section={"gallery"}
                language={language}
                currentContent={currentContent}
                allowExtraInput={true}
                sectionIndex={indexes?.['3']}

            />

            {/**How We Do */}
            {/* <ContentSection
                currentPath={currentPath}
                Heading={"About Section 3"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description" },
                ]}
                section={"howWeDo"}
                language={language}
                currentContent={currentContent}
            /> */}
            {/* <div className="mt-4 border-b">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Description 2</h3>
                {
                    currentContent?.howWeDo?.map((element, index, a) => {
                        const isLast = index === a.length - 1
                        return (
                            <DynamicContentSection key={index}
                                currentPath={currentPath}
                                subHeading={"Section " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title" },
                                    { input: "richtext", label: "Description", updateType: "description" },
                                ]}
                                section={"howWeDo"}
                                index={index}
                                language={language}
                                currentContent={currentContent}
                                isBorder={false}
                                type={'rich'}
                                sectionIndex={indexes?.['1']}


                            />
                        )
                    })
                }
                <button className="text-blue-500 cursor-pointer mb-3" onClick={() => addExtraSummary('howWeDo')}>Add More Section...</button>
            </div> */}
{/* 
            <ContentSection
                currentPath={currentPath}
                Heading={"Gallery 2"}
                inputFiles={[
                    { label: "Image 4", id: "Image 4" },
                    { label: "Image 5", id: "Image 5" },
                    { label: "Image 6", id: "Image 6" },
                ]}
                section={"gallery"}
                language={language}
                currentContent={currentContent}
                allowExtraInput={true}
                sectionIndex={indexes?.['4']}
            /> */}
        </div>
    )
}

export default SolutionManager