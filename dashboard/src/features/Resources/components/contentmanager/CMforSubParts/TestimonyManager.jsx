import { useEffect } from "react"
import { updateMainContent } from "../../../../common/homeContentSlice"
import { useDispatch } from "react-redux"
import ContentSection from "../../breakUI/ContentSections"
import FileUploader from "../../../../../components/Input/InputFileUploader"
import content from '../../websiteComponent/content.json'

const TestimonyManager = ({ testimonyId, currentContent, currentPath, language, indexes }) => {
    const dispatch = useDispatch()

    const content = currentContent?.[1]?.content

    return (
        <div>
            <FileUploader id={"testimonyReference/" + testimonyId} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Testimony " + testimonyId}
                inputs={[
                    { input: "input", label: "Name", updateType: "name", maxLength: 20, value: content?.name?.[language] },
                    { input: "input", label: "Position", updateType: "position", maxLength: 25, value: content?.position?.[language] },
                    { input: "textarea", label: "Quote", updateType: "quote", maxLength: 400, value: content?.quote?.[language] },
                    { input: "input", label: "Company", updateType: "company", maxLength: 30, value: content?.company?.[language] },
                ]}
                inputFiles={[
                    { label: "Backround Image", id: "testimony/" + (testimonyId), url: content?.images?.[0]?.url, order: 1 },
                ]}

                section={"testimonials"}
                language={language}
                currentContent={currentContent}
                projectId={testimonyId}
                sectionIndex={indexes?.['1']}
            />

        </div>
    )
}

export default TestimonyManager