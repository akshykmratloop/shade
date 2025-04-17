import { useSelector } from "react-redux"
import FileUploader from "../../../../../components/Input/InputFileUploader";
import { useEffect } from "react";
import ContentSection from "../../breakUI/ContentSections";
import MultiSelect from "../../breakUI/MultiSelect";
import { updateContent } from "../../../../common/homeContentSlice";
import content from "../../websiteComponent/content.json"
import { useDispatch } from "react-redux";


const FooterManager = ({ language, currentContent, currentPath }) => {
    const socialIcons = useSelector((state) => state.homeContent.present.images.socialIcons)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(updateContent({ currentPath: "home", payload: (content?.footer) }))
    }, [])
    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"footerReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}

            <ContentSection
                currentPath={currentPath}
                Heading={"Footer top"}
                inputs={[
                    { input: "textarea", label: "Address", updateType: "address", maxLength: 150 },
                ]}
                inputFiles={[{ label: "Main Icons Image", id: "footerIcon" }]}
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
                        { input: "input", label: "Title", updateType: "title",  maxLength: 25 },
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
                                { input: "input", label: "Label", updateType: language, maxLength: 25 },
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
                        { input: "input", label: "Title", updateType: "title",  maxLength: 25 },
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
                                { input: "input", label: "Label", updateType: language,  maxLength: 25 },
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
                        { input: "input", label: "Title", updateType: "title",  maxLength: 22 },
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
                                { input: "input", label: "Label", updateType: language,  maxLength: 22 },
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
                        { input: "input", label: "Title", updateType: "title",  maxLength: 22 },
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
                                { input: "input", label: "Label", updateType: language,  maxLength: 22 },
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
                inputFiles={socialIcons?.map(
                    (e, i) =>
                        ({ label: "Image " + (i + 1), id: "image " + e.id })
                )}
                section={"socialIcons"}
                language={language}
                currentContent={currentContent}
                allowExtraInput={true}
            />

        </div>
    )
}

export default FooterManager