import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"

const FooterManager = ({ language, currentContent, currentPath }) => {

    console.log(currentContent)
    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"footerReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Footer top"}
                inputs={[
                    { input: "textarea", label: "Address", updateType: "address" },
                ]}
                // inputFiles={[{ label: "Backround Image", id: "marketBanner" }]}
                section={"companyInfo"}
                language={language}
                currentContent={currentContent}
            />



            <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"About Links"}
                    inputs={[
                        { input: "input", label: "Title", updateType: "title" },
                    ]}
                    // inputFiles={[{ label: "Backround Image", id: "marketBanner" }]}
                    section={"aboutUs"}
                    language={language}
                    isBorder={false}
                    currentContent={currentContent}
                />
                {currentContent?.aboutUs?.links?.map((item, index, array) => {
                    const isLast = index === array.length - 1;
                    return (
                        <ContentSection key={item + index}
                            currentPath={currentPath}
                            subHeading={"item " + (index + 1)}
                            inputs={[
                                { input: "input", label: "label", updateType: language },
                                { input: "input", label: "url", updateType: "url" }
                            ]}
                            // inputFiles={[{ label: "Item Icon", id: item.url + item[language] + Math.floor(Math.random() * 20) }]}
                            // fileId={item}
                            language={language}
                            section={"aboutUs"}
                            subSection={"links"}
                            subSectionsProMax={"Links"}
                            index={+index}
                            isBorder={isLast}
                            currentContent={currentContent}
                        />
                    )
                })}
            </div>

            <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Markets Links"}
                    inputs={[
                        { input: "input", label: "Title", updateType: "title" },
                    ]}
                    // inputFiles={[{ label: "Backround Image", id: "marketBanner" }]}
                    section={"markets"}
                    language={language}
                    isBorder={false}
                    currentContent={currentContent}
                />
                {currentContent?.markets?.links?.map((item, index, array) => {
                    const isLast = index === array.length - 1;
                    return (
                        <ContentSection key={item + index}
                            currentPath={currentPath}
                            subHeading={"item " + (index + 1)}
                            inputs={[
                                { input: "input", label: "label", updateType: language },
                                { input: "input", label: "url", updateType: "url" }
                            ]}
                            // inputFiles={[{ label: "Item Icon", id: item.url + item[language] + Math.floor(Math.random() * 20) }]}
                            // fileId={item}
                            language={language}
                            section={"markets"}
                            subSection={"links"}
                            subSectionsProMax={"Links"}
                            
                            index={+index}
                            isBorder={isLast}
                            currentContent={currentContent}
                        />
                    )
                })}
            </div>

            <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Services Links"}
                    inputs={[
                        { input: "input", label: "Title", updateType: "title" },
                    ]}
                    // inputFiles={[{ label: "Backround Image", id: "marketBanner" }]}
                    section={"services"}
                    language={language}
                    isBorder={false}
                    currentContent={currentContent}
                />
                {currentContent?.services?.links?.map((item, index, array) => {
                    const isLast = index === array.length - 1;
                    return (
                        <ContentSection key={item + index}
                            currentPath={currentPath}
                            subHeading={"item " + (index + 1)}
                            inputs={[
                                { input: "input", label: "label", updateType: language },
                                { input: "input", label: "url", updateType: "url" }
                            ]}
                            // inputFiles={[{ label: "Item Icon", id: item.url + item[language] + Math.floor(Math.random() * 20) }]}
                            // fileId={item}
                            language={language}
                            section={"services"}
                            subSection={"links"}
                            subSectionsProMax={"Links"}
                            
                            index={+index}
                            isBorder={isLast}
                            currentContent={currentContent}
                        />
                    )
                })}
            </div>


        </div>
    )
}

export default FooterManager