import { useEffect } from "react"
import { updateContent } from "../../../common/homeContentSlice"
import { useDispatch } from "react-redux"
import ContentSection from "../ContentSections"
import FileUploader from "../../../../components/Input/InputFileUploader"
import content from '../websiteComponent/content.json'

const TestimonyManager = ({ testimonyId, currentContent, currentPath, language }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(updateContent({ currentPath: "testimonialSection", payload: content.testimonialSection }))
    }, [])
    return (
        <div>
            <FileUploader id={"testimonyReference/" + testimonyId} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Testimony " + testimonyId}
                inputs={[
                    { input: "input", label: "Name", updateType: "name" },
                    { input: "input", label: "Position", updateType: "position" },
                    { input: "textarea", label: "Quote", updateType: "quote" },
                    { input: "input", label: "Company", updateType: "company" },
                ]}
                inputFiles={[{ label: "Backround Image", id: "testimony/" + (testimonyId) }]}
                section={"testimonials"}
                language={language}
                currentContent={currentContent}
                projectId={testimonyId}
            />

        </div>
    )
}

export default TestimonyManager