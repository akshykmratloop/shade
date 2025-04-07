import { useEffect } from "react"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../ContentSections"
import { useDispatch } from "react-redux"
import { updateContent } from "../../../common/homeContentSlice"
import content from "../websiteComponent/content.json"

const CareerDetailManager = ({ careerId, currentContent, currentPath, language }) => {
    const dispatch = useDispatch();
    console.log(careerId, currentContent, currentPath, language)
    const careerIndex = currentContent?.findIndex(e => e.id === careerId)
    console.log(careerIndex)

    useEffect(() => {

        dispatch(updateContent({ currentPath: "careerDetails", payload: (content?.careerDetails) }))
    }, [])
    return (
        <div>
            <FileUploader id={"CareerIDReference" + careerId} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "input", label: "Description", updateType: "subTitle" },
                    { input: "input", label: "Button Text", updateType: "button" },
                    // { input: "input", label: "Url", updateType: "url" },
                ]}
                inputFiles={[{ label: "Backround Image", id: "careerBanner/" + (careerId) }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                projectId={careerIndex + 1}
            />
        </div>
    )
}

export default CareerDetailManager