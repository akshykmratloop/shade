import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"

const HeaderManager = ({ language, currentContent, currentPath }) => {
    let contents
    if (currentContent) {
        contents = Object.keys(currentContent)
    }
    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"headerReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {contents?.map((section, i, a) => {
                const lastIndex = i === a.length - 1
                return (
                    <div key={i}>
                        <ContentSection
                            currentPath={currentPath}
                            subHeading={"Section " + (i + 1)}
                            inputs={[
                                { input: "input", label: "title", updateType: "title" },
                            ]}
                            section={section}
                            language={language}
                            currentContent={currentContent}
                            isBorder={false}
                            attachOne={true}
                        />
                        <ContentSection
                            currentPath={currentPath}
                            inputs={[
                                { input: "input", label: "url", updateType: "url" },
                            ]}
                            subSection={'url'}
                            section={section}
                            currentContent={currentContent}
                            isBorder={lastIndex}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default HeaderManager