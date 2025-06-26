import { useEffect, useState } from "react"
import { getResources } from "../../../../app/fetch"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
import MultiSelect from "../breakUI/MultiSelect"

const SnRManager = ({ content, currentPath, language, indexes, outOfEditing }) => {
    const [policiesList, setPoliciesList] = useState(null)

    useEffect(() => {
        async function getOptionsforServices() {
            const response = await getResources({ resourceType: "SUB_PAGE", resourceTag: "SAFETY_RESPONSIBILITY", apiCallType: "INTERNAL", fetchType: "CONTENT" })
            if (response.message === "Success") {
                let options = response?.resources?.resources?.map((e, i) => ({
                    id: e.id,
                    order: i + 1,
                    slug: e.slug,
                    titleEn: e.titleEn,
                    titleAr: e.titleAr,
                    icon: e?.icon,
                    image: e?.image,
                    descriptions: [
                        e?.liveModeVersionData?.sections?.[0]?.content?.description,
                        e?.liveModeVersionData?.sections?.[1]?.content?.description,
                        e?.liveModeVersionData?.sections?.[1]?.content?.procedures?.description,
                        e?.liveModeVersionData?.sections?.[1]?.content?.procedures?.terms?.[0]?.description,
                    ]
                }))
                setPoliciesList(options)
            }
        }

        getOptionsforServices()
    }, [])

    return (
        <div>
            {/* reference doc */} 
            <FileUploader id={"SnRIDReference"} label={"Rerference doc"} fileName={"Upload your file..."} outOfEditing={outOfEditing} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['1']?.content?.description?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", value: content?.['1']?.content?.button?.[0]?.text?.[language], index: 0 },
                ]}
                inputFiles={[{ label: "Backround Image", id: "ServiceBanner", order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['1']}
                outOfEditing={outOfEditing}
            />
            <ContentSection
                Heading={"Buttons"}
                currentPath={currentPath}
                inputs={[
                    { input: "input", label: "Button Text 1", updateType: "button", value: content?.['2']?.content?.button?.[0]?.text?.[language], index: 0 }
                ]}
                // section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
                outOfEditing={outOfEditing}
            />

            <MultiSelect
                heading={"Select Policies"}
                currentPath={currentPath}
                language={language}
                label={"Select Policy List"}
                tabName={"Select Policy"}
                options={content?.['2']?.items}
                listOptions={policiesList}
                referenceOriginal={{ dir: "home" }}
                currentContent={content}
                sectionIndex={indexes?.['2']}
                outOfEditing={outOfEditing}
            />
        </div>
    )
}

export default SnRManager