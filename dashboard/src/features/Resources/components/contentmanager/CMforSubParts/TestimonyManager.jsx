import { useEffect } from "react"
import { updateContent } from "../../../../common/homeContentSlice"
import { useDispatch } from "react-redux"
import ContentSection from "../../breakUI/ContentSections"
import FileUploader from "../../../../../components/Input/InputFileUploader"
import content from '../../websiteComponent/content.json'

const TestimonyManager = ({ testimonyId, currentContent, currentPath, language }) => {
    const dispatch = useDispatch()

    console.log(testimonyId)

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
                    { input: "input", label: "Name", updateType: "name", maxLength: 20 },
                    { input: "input", label: "Position", updateType: "position", maxLength: 25 },
                    { input: "textarea", label: "Quote", updateType: "quote", maxLength: 400 },
                    { input: "input", label: "Company", updateType: "company", maxLength: 30 },
                ]}
                inputFiles={[
                    { label: "Backround Image", id: "testimony/" + (testimonyId) },
                ]}

                section={"testimonials"}
                language={language}
                currentContent={currentContent}
                projectId={testimonyId}
            />

        </div>
    )
}

export default TestimonyManager