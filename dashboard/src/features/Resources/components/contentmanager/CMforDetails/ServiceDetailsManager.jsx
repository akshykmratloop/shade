import { useDispatch } from "react-redux"
import FileUploader from "../../../../../components/Input/InputFileUploader"
import { updateContent } from "../../../../common/homeContentSlice"
import ContentSection from "../../breakUI/ContentSections"
import MultiSelectForProjects from "../../breakUI/MultiSelectForProjects"
import content from "../../websiteComponent/content.json"
import { useEffect } from "react"

const ServiceDetailsManager = ({ serviceId, currentContent, currentPath, language, screen }) => {
    const dispatch = useDispatch()
    const serviceIndex = currentContent?.findIndex(e => {
        return e.id == serviceId
    })

    useEffect(() => {
        dispatch(updateContent({ currentPath: "serviceDetails", payload: content.serviceDetails }))
    }, [])
    return (
        <div className={`w-[299px]`}>
            {/* file doc */}
            <FileUploader id={"ServiceDetailsIDReference" + serviceId} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description", updateType: "description" },
                ]}
                inputFiles={[{ label: "Backround Image", id: "serviceBanner/" + (serviceId) }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                projectId={serviceIndex + 1}
            />

            {/* sub services */}
            <MultiSelectForProjects
                heading={"Sub Services Section"}
                tabName={"Select Sub Services"}
                language={language}
                referenceOriginal={{ dir: "subServices" }}
                currentPath={currentPath}
                options={currentContent?.[serviceId - 1]?.subServices}
                id={serviceIndex}
            />

            {/* other services */}
            <MultiSelectForProjects
                heading={"Sub Services Section"}
                tabName={"Select Sub Services"}
                language={language}
                referenceOriginal={{ dir: "otherServices" }}
                currentPath={currentPath}
                options={currentContent?.[serviceId - 1]?.otherServices}
                id={serviceIndex}
            />
        </div>
    )
}

export default ServiceDetailsManager