import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"
import { useSelector } from "react-redux"

const FooterManager = ({ language, currentContent, currentPath }) => {
    const socialIcons = useSelector((state) => {
        
        return state.homeContent.present.images.socialIcons})

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
                section={"companyInfo"}
                language={language}
                currentContent={currentContent}
            />

            {/* About and its links */}
            <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Section 1"}
                    inputs={[
                        { input: "input", label: "Title", updateType: "title" },
                    ]}
                    section={"Section 1"}
                    language={language}
                    isBorder={false}
                    currentContent={currentContent}
                />
                {currentContent?.["Section 1"]?.links?.map((item, index, array) => {
                    const isLast = index === array.length - 1;
                    return (
                        <ContentSection key={item + index}
                            currentPath={currentPath}
                            subHeading={"Item " + (index + 1)}
                            inputs={[
                                { input: "input", label: "Label", updateType: language },
                                { input: "input", label: "Url", updateType: "url" }
                            ]}
                            language={language}
                            section={"Section 1"}
                            subSection={"links"}
                            subSectionsProMax={"Links"}
                            index={+index}
                            isBorder={isLast}
                            currentContent={currentContent}
                        />
                    )
                })}
            </div>


            {/* markets and its links */}
            <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Section 2"}
                    inputs={[
                        { input: "input", label: "Title", updateType: "title" },
                    ]}
                    section={"Section 2"}
                    language={language}
                    isBorder={false}
                    currentContent={currentContent}
                />
                {currentContent?.["Section 2"]?.links?.map((item, index, array) => {
                    const isLast = index === array.length - 1;
                    return (
                        <ContentSection key={item + index}
                            currentPath={currentPath}
                            subHeading={"Item " + (index + 1)}
                            inputs={[
                                { input: "input", label: "Label", updateType: language },
                                { input: "input", label: "Url", updateType: "url" }
                            ]}
                            language={language}
                            section={"Section 2"}
                            subSection={"links"}
                            subSectionsProMax={"Links"}
                            index={+index}
                            isBorder={isLast}
                            currentContent={currentContent}
                        />
                    )
                })}
            </div>


            {/* services and its links */}
            <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Sections 3"}
                    inputs={[
                        { input: "input", label: "Title", updateType: "title" },
                    ]}
                    section={"Section 3"}
                    language={language}
                    isBorder={false}
                    currentContent={currentContent}
                />
                {currentContent?.["Section 3"]?.links?.map((item, index, array) => {
                    const isLast = index === array.length - 1;
                    return (
                        <ContentSection key={item + index}
                            currentPath={currentPath}
                            subHeading={"Item " + (index + 1)}
                            inputs={[
                                { input: "input", label: "Label", updateType: language },
                                { input: "input", label: "Url", updateType: "url" }
                            ]}
                            language={language}
                            section={"Section 3"}
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
                    Heading={"Sections 4"}
                    inputs={[
                        { input: "input", label: "Title", updateType: "title" },
                    ]}
                    section={"Section 4"}
                    language={language}
                    isBorder={false}
                    currentContent={currentContent}
                />
                {currentContent?.["Section 4"]?.links?.map((item, index, array) => {
                    const isLast = index === array.length - 1;
                    return (
                        <ContentSection key={item + index}
                            currentPath={currentPath}
                            subHeading={"Item " + (index + 1)}
                            inputs={[
                                { input: "input", label: "Label", updateType: language },
                                { input: "input", label: "Url", updateType: "url" }
                            ]}
                            language={language}
                            section={"Section 4"}
                            subSection={"links"}
                            subSectionsProMax={"Links"}
                            index={+index}
                            isBorder={isLast}
                            currentContent={currentContent}
                        />
                    )
                })}
            </div>

            {/* social icons */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Social Media Icons"}
                inputFiles={
                    
                    [
                    { label: "Image 1", id: "Image 1" },
                    { label: "Image 2", id: "Image 2" },
                    { label: "Image 3", id: "Image 3" },
                ]}
                section={"icons"}
                language={language}
                currentContent={currentContent}
                allowExtraInput={true}
            />

        </div>
    )
}

export default FooterManager