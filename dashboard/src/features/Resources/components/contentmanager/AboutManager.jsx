import ContentSection from "../ContentSections"
import FileUploader from "../../../../components/Input/InputFileUploader";

const AboutManager = ({ currentContent, currentPath, language }) => {


    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"aboutReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/* services */}
            <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Services"}
                    inputs={[
                        { input: "input", label: "Heading/title", updateType: "title" },
                        { input: "input", label: "Description", updateType: "subtitle" },
                    ]}
                    isBorder={false}
                    section={"services"}
                    language={language}
                    currentContent={currentContent}
                />
                {
                    currentContent?.services?.cards.map((item, index, array) => {
                        const isLast = index === array.length - 1;
                        return (
                            <ContentSection key={item + index}
                                currentPath={currentPath}
                                subHeading={"card " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Item text 1", updateType: "title" },
                                    { input: "textarea", label: "Item text 2", updateType: "description" }
                                ]}
                                inputFiles={[{ label: "Item Icon", id: item.icon }]}
                                // fileId={item}
                                language={language}
                                section={"services"}
                                subSection={"cards"}
                                index={+index}
                                isBorder={isLast}
                                currentContent={currentContent}
                            />
                        )
                    })
                }
            </div>

            {/* main */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Main"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description 1", updateType: "description1" },
                    { input: "textarea", label: "Description 2", updateType: "description2" },
                ]}
                inputFiles={[{ label: "Video", id: "video" }]}
                section={"main"}
                language={language}
                currentContent={currentContent}
            />
        </div>
    )
}

export default AboutManager