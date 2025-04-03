import ContentSection from "../ContentSections"
import FileUploader from "../../../../components/Input/InputFileUploader"

const SolutionManager = ({ currentPath, language, currentContent }) => {

    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"solutionReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/* banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Solution Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description" },
                    { input: "input", label: "Button Text", updateType: "button" }
                ]}
                inputFiles={[{ label: "Background Image", id: "bannerBackground" },]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
            />

            {/**What We Do */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Solution Section 2"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description 1", updateType: "description1" },
                    { input: "textarea", label: "Description 2", updateType: "description2" }
                ]}
                section={"whatWeDo"}
                language={language}
                currentContent={currentContent}
            />

            {/** Gallery */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Gallery 1"}
                inputFiles={[
                    { label: "Image 1", id: "Image 1" },
                    { label: "Image 2", id: "Image 2" },
                    { label: "Image 3", id: "Image 3" },
                ]}
                section={"gallery"}
                language={language}
                currentContent={currentContent}
                allowExtraInput={true}
            />

            {/**How We Do */}
            <ContentSection
                currentPath={currentPath}
                Heading={"About Section 3"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description" },
                ]}
                section={"howWeDo"}
                language={language}
                currentContent={currentContent}
            />

            <ContentSection
                currentPath={currentPath}
                Heading={"Gallery 2"}
                inputFiles={[
                    { label: "Image 4", id: "Image 4" },
                    { label: "Image 5", id: "Image 5" },
                    { label: "Image 6", id: "Image 6" },
                ]}
                section={"gallery"}
                language={language}
                currentContent={currentContent}
                allowExtraInput={true}
            />
        </div>
    )
}

export default SolutionManager