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
                    Heading={"Footer About"}
                    inputs={[
                        { input: "input", label: "Title", updateType: "title" },
                    ]}
                    // inputFiles={[{ label: "Backround Image", id: "marketBanner" }]}
                    section={"aboutUs"}
                    language={language}
                    currentContent={currentContent}
                />
                {currentContent?.aboutUs?.links?.map((item, index, array) => {
                    const isLast = index === array.length - 1;
                    return (
                        <ContentSection key={item + index}
                            currentPath={currentPath}
                            subHeading={item}
                            inputs={[
                                { input: "input", label: "Item text 1", updateType: "count" },
                                { input: "input", label: "Item text 2", updateType: "title" }]}
                            inputFiles={[{ label: "Item Icon", id: item }]}
                            // fileId={item}
                            language={language}
                            section={"experienceSection"}
                            subSection={"cards"}
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