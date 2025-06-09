import { useDispatch } from "react-redux"
import FileUploader from "../../../../../components/Input/InputFileUploader"
import { updateMainContent } from "../../../../common/homeContentSlice"
import ContentSection from "../../breakUI/ContentSections"
import MultiSelectForProjects from "../../breakUI/MultiSelectForProjects"
import content from "../../websiteComponent/content.json"
import { useEffect } from "react"

const ServiceDetailsManager = ({ serviceId, content, currentPath, language, indexes }) => {
    const dispatch = useDispatch()
    // const serviceIndex = content?.findIndex(e => {
    //     return e.id == serviceId
    // }) || 0

    // useEffect(() => {
    //     dispatch(updateMainContent({ currentPath: "serviceDetails", payload: content.serviceDetails }))
    // }, [])
    return (
        <div className={`w-[299px]`}>
            {/* file doc */}
            <FileUploader id={"ServiceDetailsIDReference" + serviceId} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['1']?.content?.description?.[language] },
                ]}
                inputFiles={[{ label: "Backround Image", id: "serviceBanner/" + (serviceId), order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                section={"banner"}
                language={language}
                currentContent={content}
                // projectId={serviceIndex + 1}
                sectionIndex={indexes?.['1']}
            />

            {/* sub services */}
            <MultiSelectForProjects
                heading={"Sub Services Section"}
                tabName={"Select Sub Services"}
                language={language}
                referenceOriginal={{ dir: "subServices" }}
                currentPath={currentPath}
                options={content?.[serviceId - 1]?.subServices}
                // id={serviceIndex}
                sectionIndex={indexes?.['2']}
            />

            {/* other services */}
            <MultiSelectForProjects
                heading={"Sub Services Section"}
                tabName={"Select Sub Services"}
                language={language}
                referenceOriginal={{ dir: "otherServices" }}
                currentPath={currentPath}
                options={content?.[serviceId - 1]?.otherServices}
                // id={serviceIndex}
                sectionIndex={indexes?.['3']}
            />
        </div>
    )
}

export default ServiceDetailsManager