import ContentSection from "../ContentSections";

const MarketManager = ({ language, currentContent, currentPath }) => {
    console.log(language, currentContent, currentPath)

    return (
        <div>
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description" },
                    { input: "input", label: "Button Text", updateType: "button" }
                ]}
                inputFiles={[{ label: "Backround Image", id: "marketBanner" }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
            />

            <ContentSection
                currentPath={currentPath}
                Heading={"Quote"}
                inputs={[
                    { input: "textarea", label: "Heading/title", updateType: "text" },
                    { input: "input", label: "Description", updateType: "author" },
                ]}
                section={"quote"}
                language={language}
                currentContent={currentContent}
            />
        </div>
    )
}

export default MarketManager