import FileUploader from "../../../../../components/Input/InputFileUploader"
import ContentSection from "../../breakUI/ContentSections"
import DynamicContentSection from "../../breakUI/DynamicContentSection"

const HeaderManager = ({ language, currentContent, currentPath, indexes }) => {
    // let contents
    // if (currentContent) {
    //     contents = Object.keys(currentContent)
    // }
    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"headerReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {currentContent?.['1']?.content?.map((section, i, a) => {
                const lastIndex = i === a.length - 1
                return (
                    <div key={i}>
                        <DynamicContentSection
                            currentPath={currentPath}
                            subHeading={"Section " + (i + 1)}
                            inputs={[
                                { input: "input", label: "Name", updateType: "nav", maxLength: 10, value: section.nav?.[language] },
                                { input: "input", label: "Url", updateType: "url", value: section.url, dir: "ltr" },
                            ]}
                            section={section}
                            language={language}
                            currentContent={currentContent}
                            isBorder={false}
                            attachOne={true}
                            contentIndex={i}
                            sectionIndex={indexes?.['1']}
                        />
                    
                    </div>
                )
            })}
        </div>
    )
}

export default HeaderManager