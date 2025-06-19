import { useEffect, useState } from "react"
import { getResources } from "../../../../app/fetch"
import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"
// import MultiSelect from "../breakUI/MultiSelect"
import DynamicContentSection from "../breakUI/DynamicContentSection"
import { useDispatch, useSelector } from "react-redux"
import { updateCardAndItemsArray, updatePoliciesItems } from "../../../common/homeContentSlice"

const SnRPoliciesManager = ({ content, currentPath, language, indexes }) => {
    const [policiesList, setPoliciesList] = useState(null)
    const dispatch = useDispatch()

    const context = useSelector(state => state.homeContent?.present?.content)

    // const thumbIcon = useSelector(state => state.homeContent?.present?.content?.editVersion?.icon) || ""
    const thumbImage = useSelector(state => state.homeContent?.present?.content?.editVersion?.image) || ""

    const addExtraSummary = () => {
        dispatch(updatePoliciesItems(
            {
                insert: {
                    title: {
                        ar: "",
                        en: ""
                    },
                    description: {
                        ar: "",
                        en: ""
                    },
                    images: [
                        {
                            url: "",
                            order: 1,
                            altText: {
                                ar: "",
                                en: ""
                            }
                        }
                    ]
                },
                sectionIndex: indexes?.['2'],
                operation: 'add'
            }
        ))
    }

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

        // getOptionsforServices()
    }, [])

    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"SnR-Polilcy-ID-Reference"} label={"Rerference doc"} fileName={"Upload your file..."} />

            {context?.id === "N" &&
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Page - Details"}
                    inputs={[
                        { input: "input", label: "Title English", updateType: "titleEn", value: context?.titleEn },
                        { input: "input", label: "Title Arabic", updateType: "titleAr", value: context?.titleAr, dir: "rtl" },
                        { input: "input", label: "Slug", updateType: "slug", value: context?.slug },

                    ]}
                    section={"page-details"}
                    language={language}
                />
            }

            <ContentSection
                currentPath={currentPath}
                Heading={"Thumbnail"}
                inputFiles={[
                    // { label: "Thumbnail Icon", id: "thumbIcon", order: 1, url: thumbIcon, name: "icon" },
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
                inputFiles={[{ label: "Backround Image", id: "ServiceBanner", order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                section={"banner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['1']}
            />
            <ContentSection
                Heading={"Sub Heading"}
                currentPath={currentPath}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['2']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['2']?.content?.description?.[language] },
                ]}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
            />

            <ContentSection
                Heading={"Policies"}
                currentPath={currentPath}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['2']?.content?.procedures?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", value: content?.['2']?.content?.procedures?.description?.[language] },
                ]}
                section={"procedures"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
            />

            {
                content?.['2']?.content?.procedures?.terms?.map((e, i) => {
                    return (
                        <DynamicContentSection
                            key={i}
                            // Heading={"Policies"}
                            currentPath={currentPath}
                            inputs={[
                                { input: "input", label: "Heading/title", updateType: "title", value: e?.title?.[language] },
                                { input: "textarea", label: "Description", updateType: "description", value: e?.description?.[language] },
                            ]}
                            section={"procedures/terms"}
                            index={i}
                            language={language}
                            currentContent={content}
                            sectionIndex={indexes?.['2']}
                            allowRemoval={true}
                            type={"content[index]"}
                        />
                    )
                })
            }
            <button className="text-blue-500 cursor-pointer mb-3" onClick={() => addExtraSummary('whatWeDo')}>Add More Section...</button>

        </div>
    )
}

export default SnRPoliciesManager