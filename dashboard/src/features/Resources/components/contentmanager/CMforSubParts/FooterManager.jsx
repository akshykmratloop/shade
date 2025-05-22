import { useSelector } from "react-redux"
import FileUploader from "../../../../../components/Input/InputFileUploader";
import { useEffect } from "react";
import ContentSection from "../../breakUI/ContentSections";
import MultiSelect from "../../breakUI/MultiSelect";
import { updateMainContent } from "../../../../common/homeContentSlice";
import content from "../../websiteComponent/content.json"
import { useDispatch } from "react-redux";


const FooterManager = ({ language, currentContent, currentPath, indexes }) => {
    const socialIcons = useSelector((state) => state.homeContent.present.images.socialIcons)
    const dispatch = useDispatch()

    // useEffect(() => {
    //     dispatch(updateMainContent({ currentPath: "home", payload: (content?.footer) }))
    // }, [])
    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"footerReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}

            <ContentSection
                currentPath={currentPath}
                Heading={"Footer top"}
                inputs={[
                    { input: "textarea", label: "Address", updateType: "address", maxLength: 150, value: currentContent?.['1']?.content?.address?.[language] },
                ]}
                inputFiles={[{ label: "Main Icons Image", id: "footerIcon", url: currentContent?.['1']?.content?.logo?.url }]}
                section={"companyInfo"}
                language={language}
                currentContent={currentContent}
                sectionIndex={indexes?.['1']}
            />

            {
                currentContent?.['2']?.content?.map((section, index) => {
                    return (
                        <div className="w-full" key={index}>
                            <ContentSection
                                currentPath={currentPath}
                                Heading={"Section " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title", maxLength: 25, value: section.title?.[language] },
                                ]}
                                section={"Footer"}
                                language={language}
                                isBorder={false}
                                sectionIndex={indexes?.['2']}
                                contentIndex={index}
                            />
                            {section.links?.map((item, i, array) => {
                                const isLast = i === array.length - 1;
                                return (
                                    <ContentSection key={i}
                                        currentPath={currentPath}
                                        subHeading={"Item " + (i + 1)}
                                        inputs={[
                                            { input: "input", label: "Label", updateType: language, maxLength: 25, value: item?.[language] },
                                            { input: "input", label: "Url", updateType: "url", value: item?.url }
                                        ]}
                                        language={language}
                                        section={"Footer/Links"}
                                        subSection={"links"}
                                        subSectionsProMax={"Links"}
                                        isBorder={isLast}
                                        currentContent={currentContent}
                                        sectionIndex={indexes?.['2']}
                                        contentIndex={index}
                                        index={+i}
                                    />
                                )
                            })}
                        </div>
                    )
                })
            }


            <ContentSection
                Heading={"Contact Section"}
                currentPath={currentPath}
                inputs={[
                    { input: "input", label: "Title", updateType: 'title', maxLength: 25, value: currentContent?.['3']?.content?.title?.[language] },
                    { input: "input", label: "Fax", updateType: "fax", maxLength: 25, value: currentContent?.['3']?.content?.fax?.[language] },
                    { input: "input", label: "Phone", updateType: "phone", maxLength: 25, value: currentContent?.['3']?.content?.phone?.[language] },
                    { input: "input", label: "Help Text", updateType: "helpText", maxLength: 25, value: currentContent?.['3']?.content?.helpText?.[language] },
                    { input: "input", label: "Button", updateType: "button", maxLength: 12, value: currentContent?.['3']?.content?.button?.[0]?.text?.[language] }
                ]}
                language={language}
                // section={"Section 1"}
                // subSection={"links"}
                // subSectionsProMax={"Links"}
                // index={+index}
                isBorder={true}
                currentContent={currentContent}
                sectionIndex={indexes?.['3']}
            />


            {/* markets and its links */}
            {/* <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Section 2"}
                    inputs={[
                        { input: "input", label: "Title", updateType: "title", maxLength: 25 },
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
                                { input: "input", label: "Label", updateType: language, maxLength: 25 },
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
            </div> */}


            {/* services and its links */}
            {/* <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Sections 3"}
                    inputs={[
                        { input: "input", label: "Title", updateType: "title", maxLength: 22 },
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
                                { input: "input", label: "Label", updateType: language, maxLength: 22 },
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
            </div> */}

            {/* <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Sections 4"}
                    inputs={[
                        { input: "input", label: "Title", updateType: "title", maxLength: 22 },
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
                                { input: "input", label: "Label", updateType: language, maxLength: 22 },
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
            </div> */}

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