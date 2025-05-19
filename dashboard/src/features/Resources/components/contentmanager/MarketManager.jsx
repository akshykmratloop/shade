import ContentSection from "../breakUI/ContentSections";
import MultiSelectPro from "../breakUI/MultiSelectPro";
import FileUploader from "../../../../components/Input/InputFileUploader";

import { useEffect } from "react";
import { updateMainContent } from "../../../common/homeContentSlice";
import content from "../websiteComponent/content.json"
import { useDispatch } from "react-redux";

const MarketManager = ({ language, currentContent, currentPath, indexes }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(updateMainContent({ currentPath: "home", payload: (content?.market) }))
    }, [])

    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"marketReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: currentContent?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 300, value: currentContent?.['1']?.content?.description?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", value: currentContent?.['1']?.content?.button?.[0]?.text?.[language] }
                ]}
                inputFiles={[{ label: "Backround Image", id: "marketBanner", order: 1 }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                sectionIndex={indexes?.["1"]}

            />

            {/* Quote */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Quote"}
                inputs={[
                    { input: "textarea", label: "Heading/title", updateType: "text", maxLength: 300, value: currentContent?.['2']?.content?.text?.[language] },
                    { input: "input", label: "Description", updateType: "author", value: currentContent?.['2']?.content?.author?.[language] },
                ]}
                section={"quote"}
                language={language}
                currentContent={currentContent}
                sectionIndex={indexes?.["2"]}

            />

            {/* Market Lists */}
            <div>
                <h1>Market Lists</h1>
                {
                    currentContent?.tabSection?.tabs.map((element, index) => {

                        return (
                            <div key={index}>
                                <MultiSelectPro
                                    options={currentContent?.tabSection.marketItems}
                                    currentPath={currentPath}
                                    section={"tabSection"}
                                    language={language}
                                    label={element.title.en}
                                    id={element.id}
                                    tabName={"Select Markets"}
                                    referenceOriginal={{ dir: "markets", index: 0 }}
                                    currentContent={currentContent}
                                    sectionIndex={indexes?.["4"]}
                                />
                            </div>
                        )
                    })
                }
            </div>


        </div>
    )
}

export default MarketManager