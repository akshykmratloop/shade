import ContentSection from "../ContentSections"

const HeaderManager = ({ language, currentContent, currentPath }) => {

    return (
        <div>
            <ContentSection
                currentPath={currentPath}
                Heading={"Section 1"}
                inputs={[
                    { input: "textarea", label: "Section 1", updateType: "section 1" },
                ]}
                section={"companyInfo"}
                language={language}
                currentContent={currentContent}
            />
        </div>
    )
}

export default HeaderManager