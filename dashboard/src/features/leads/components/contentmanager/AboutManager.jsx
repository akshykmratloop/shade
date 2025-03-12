import ContentSection from "../ContentSections"

const AboutManager = ({ currentContent, currentPath, language }) => {


    return (
        <div>
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
        </div>
    )
}

export default AboutManager