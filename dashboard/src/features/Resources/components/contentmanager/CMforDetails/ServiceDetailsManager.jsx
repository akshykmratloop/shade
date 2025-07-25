import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import FileUploader from "../../../../../components/Input/InputFileUploader"
import ContentSection from "../../breakUI/ContentSections"
import { getResources } from "../../../../../app/fetch"
import MultiSelect from "../../breakUI/MultiSelect"
// import { updateMainContent } from "../../../../common/homeContentSlice"
// import MultiSelectForProjects from "../../breakUI/MultiSelectForProjects"
// import content from "../../websiteComponent/content.json"

const ServiceDetailsManager = ({ serviceId, content, currentPath, language, indexes, outOfEditing }) => {
    const [subService, setServicesOptions] = useState(null);
    const [subServiceItems, setServicesItemsOptions] = useState(null);
    const { slug, id } = useSelector(state => state?.homeContent?.present?.content) || { slug: "", id: "" };
    const context = useSelector(state => state.homeContent?.present?.content)


    const thumbIcon = useSelector(state => state.homeContent?.present?.content?.editVersion?.icon) || ""
    const thumbImage = useSelector(state => state.homeContent?.present?.content?.editVersion?.image) || ""

    useEffect(() => {
        async function getOptionsforServices() {
            const response = await getResources({ resourceType: "SUB_PAGE", resourceTag: "SERVICE", apiCallType: "INTERNAL", fetchType: "CONTENT" })
            const response2 = await getResources({ resourceType: "SUB_PAGE_ITEM", resourceTag: "SERVICE", apiCallType: "INTERNAL", fetchType: "CONTENT", parentId: id })
            if (response.message === "Success") {
                let options = response?.resources?.resources?.map((e, i) => {
                    if (e.slug === slug) { return null }
                    return ({
                        id: e.id,
                        order: i + 1,
                        slug: e.slug,
                        titleEn: e.titleEn,
                        titleAr: e.titleAr,
                        // icon: e.icon,
                        image: e?.liveModeVersionData?.sections?.image,
                        description: e?.liveModeVersionData?.sections?.[0]?.content.description
                    })
                })
                setServicesOptions(options.filter(Boolean))
            }

            if (response2.message === "Success") {
                let options = response2?.resources?.resources?.map((e, i) => {
                    return ({
                        id: e.id,
                        order: i + 1,
                        slug: e.slug,
                        titleEn: e.titleEn,
                        titleAr: e.titleAr,
                        // icon: e.icon,
                        image: e?.liveModeVersionData?.image,
                        description: e?.liveModeVersionData?.sections?.[0]?.content.description
                    })
                })
                setServicesItemsOptions(options)
            }
        }

        getOptionsforServices()
    }, [id])
    return (
        <div className={`w-[299px]`}>
            {/* file doc */}
            <FileUploader id={"ServiceDetailsIDReference" + serviceId} label={"Rerference doc"} fileName={"Upload your file..."} />

            {
                // context?.id === "N"
                // true
                // &&
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Page - Details"}
                    inputs={[
                        { input: "input", label: "Title English", updateType: "titleEn", value: context?.titleEn, dir: "ltr" },
                        { input: "input", label: "Title Arabic", updateType: "titleAr", value: context?.titleAr, dir: "rtl" },
                        // { input: "input", label: "Slug", updateType: "slug", value: context?.slug },
                        ...(context?.id === "N" ? [{ input: "input", label: "Slug", updateType: "slug", value: context?.slug }] : [])
                    ]}
                    section={"page-details"}
                    language={language}
                />
            }

            <ContentSection
                currentPath={currentPath}
                Heading={"Thumbnail"}
                inputFiles={[
                    { label: "Thumbnail Icon", id: "thumbIcon", order: 1, url: thumbIcon, name: "icon" },
                    { label: "Thumbnail Image", id: "thumbImage", order: 1, url: thumbImage, name: "image" }
                ]}
                section={"thumbnail"}
                language={language}
                currentContent={content}
            />

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
                outOfEditing={outOfEditing}

            />

            {/* sub services */}
            <MultiSelect
                heading={"Sub Services Section"}
                tabName={"Select Sub Services"}
                language={language}
                referenceOriginal={{ dir: "subServices" }}
                currentPath={currentPath}
                listOptions={subServiceItems}
                options={content?.[2]?.items || []}
                sectionIndex={indexes?.['2']}
                outOfEditing={outOfEditing}

            />

            {/* other services */}
            <MultiSelect
                heading={"Sub Services Section"}
                tabName={"Select Sub Services"}
                language={language}
                referenceOriginal={{ dir: "subServices" }}
                currentPath={currentPath}
                listOptions={subService}
                options={content?.[3]?.items?.filter(e => e.slug !== slug) || []}
                sectionIndex={indexes?.['3']}
                outOfEditing={outOfEditing}

            />
        </div>
    )
}

export default ServiceDetailsManager