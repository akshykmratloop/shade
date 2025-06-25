import { useEffect, useState } from "react"
import { getResources } from "../../../../app/fetch"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
import MultiSelect from "../breakUI/MultiSelect"
import { useSelector } from "react-redux"

const ServiceManager = ({ currentContent, currentPath, language, indexes }) => {
    const [subService, setServicesOptions] = useState(null)


    useEffect(() => {
        async function getOptionsforServices() {
            const response = await getResources({ resourceType: "SUB_PAGE", resourceTag: "SERVICE", apiCallType: "INTERNAL", fetchType: "CONTENT" })
            if (response.message === "Success") {
                let options = response?.resources?.resources?.map((e, i) => ({
                    id: e.id,
                    order: i + 1,
                    slug: e.slug,
                    titleEn: e.titleEn,
                    titleAr: e.titleAr,
                    // icon: e.icon,
                    image: e?.liveModeVersionData?.sections?.image,
                    description: e?.liveModeVersionData?.sections?.[0]?.content.description
                }))
                setServicesOptions(options)
            }
        }

        getOptionsforServices()
    }, [])

    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"ServiceIDReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
          

            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading", updateType: "title", value: currentContent?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: currentContent?.['1']?.content?.description?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", value: currentContent?.['1']?.content?.button?.[0]?.text?.[language], index: 0 },
                ]}
                inputFiles={[{ label: "Backround Image", id: "ServiceBanner", order: 1, url: currentContent?.['1']?.content?.images?.[0]?.url }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                sectionIndex={indexes?.['1']}
            />
            <ContentSection
                Heading={"Buttons"}
                currentPath={currentPath}
                inputs={[
                    { input: "input", label: "Button Text 1", updateType: "button", value: currentContent?.['2']?.content?.button?.[1]?.text?.[language], index: 1 },
                    { input: "input", label: "Button Text 2", updateType: "button", value: currentContent?.['2']?.content?.button?.[0]?.text?.[language], index: 0 }
                ]}
                // section={"banner"}
                language={language}
                currentContent={currentContent}
                sectionIndex={indexes?.['2']}
            />

            <MultiSelect
                heading={"Select Services"}
                currentPath={currentPath}
                language={language}
                label={"Select Services List"}
                tabName={"Select Services"}
                options={currentContent?.['2']?.items}
                listOptions={subService}
                referenceOriginal={{ dir: "home" }}
                currentContent={currentContent}
                sectionIndex={indexes?.['2']}
            />
        </div>
    )
}

export default ServiceManager