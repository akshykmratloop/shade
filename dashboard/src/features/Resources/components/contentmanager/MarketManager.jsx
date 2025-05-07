import ContentSection from "../breakUI/ContentSections";
import MultiSelectPro from "../breakUI/MultiSelectPro";
import FileUploader from "../../../../components/Input/InputFileUploader";

import { useEffect } from "react";
import { updateMainContent } from "../../../common/homeContentSlice";
import content from "../websiteComponent/content.json"
import { useDispatch } from "react-redux";

const MarketManager = ({ language, currentContent, currentPath }) => {
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
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 300 },
                    { input: "input", label: "Button Text", updateType: "button" }
                ]}
                inputFiles={[{ label: "Backround Image", id: "marketBanner" }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
            />

            {/* Quote */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Quote"}
                inputs={[
                    { input: "textarea", label: "Heading/title", updateType: "text", maxLength: 300 },
                    { input: "input", label: "Description", updateType: "author" },
                ]}
                section={"quote"}
                language={language}
                currentContent={currentContent}
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