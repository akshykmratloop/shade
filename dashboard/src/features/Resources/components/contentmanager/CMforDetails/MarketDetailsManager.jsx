import { useDispatch, useSelector } from "react-redux"
import FileUploader from "../../../../../components/Input/InputFileUploader"
import ContentSection from "../../breakUI/ContentSections"
import DynamicContentSection from "../../breakUI/DynamicContentSection"
import { updateSubServiceDetailsPointsArray } from "../../../../common/homeContentSlice"
import { getResources } from "../../../../../app/fetch"
import { useEffect, useState } from "react"
import MultiSelect from "../../breakUI/MultiSelect"

const MarketDetailsManager = ({ language, content, indexes, currentPath, serviceId, deepPath, outOfEditing }) => {

    const dispatch = useDispatch()
    const [marketList, setMarketList] = useState([])
    const slug = useSelector(state => state.homeContent?.present?.content?.slug)

    const context = useSelector(state => state.homeContent?.present?.content)



    // const thumbIcon = useSelector(state => state.homeContent?.present?.content?.editVersion?.icon) || ""
    const thumbImage = useSelector(state => state.homeContent?.present?.content?.editVersion?.image) || ""

    const addExtraSummary = (subContext) => {
        dispatch(updateSubServiceDetailsPointsArray(
            {
                insert: {
                    title: {
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
                    ],
                    description: {
                        ar: "",
                        en: ""
                    }
                },
                section: "points",
                operation: 'add',
                sectionIndex: indexes?.['2'],
            }
        ))
    }

    useEffect(() => {
        async function getOptionsforServices() {
            const response = await getResources({ resourceType: "SUB_PAGE", resourceTag: "MARKET", apiCallType: "INTERNAL", fetchType: "CONTENT" })
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
                    })
                })
                setMarketList(options.filter(Boolean))
            }
        }

        getOptionsforServices()
    }, [])

    return (
        <div>
            {/* reference doc */}
            <FileUploader id={"Market-Details-ID-Reference"} label={"Rerference doc"} fileName={"Upload your file..."} />

            {context?.id === "N" &&
                <>
                    <ContentSection
                        currentPath={currentPath}
                        Heading={"Page - Details"}
                        inputs={[
                            { input: "input", label: "Title English", updateType: "titleEn", value: context?.titleEn, dir: "ltr" },
                            { input: "input", label: "Title Arabic", updateType: "titleAr", value: context?.titleAr, dir: "rtl" },
                            // { input: "input", label: "Slug", updateType: "slug", value: context?.slug },
                        ...(context?.id === "N" ? [{ input: "input", label: "Slug", updateType: "slug", value: context?.slug } ]: []),
                        ]}
                        section={"page-details"}
                        language={language}
                    />
                </>
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
                outOfEditing={outOfEditing}
            />

            <ContentSection
                Heading={"Sub Heading"}
                currentPath={currentPath}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['2']?.content?.title?.[language] },
                    { input: "richtext", label: "Description", updateType: "description", value: content?.['2']?.content?.description?.[language] },
                ]}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
                outOfEditing={outOfEditing}
            />

            <div className="mt-4 border-b">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Details Sections</h3>
                {
                    content?.['2']?.content?.points?.map((element, index, a) => {
                        return (
                            <DynamicContentSection key={index}
                                currentPath={currentPath}
                                subHeading={"Section " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title", maxLength: 21, value: element?.title?.[language] },
                                    { input: "textarea", label: "Description", updateType: "description", value: element?.description?.[language] },
                                ]}
                                inputFiles={[{ label: "Image", id: "cardImageOfMarket", order: 1, url: element?.images?.[0]?.url }]}
                                section={"points"}
                                isBorder={false}
                                index={index}
                                language={language}
                                currentContent={content}
                                projectId={serviceId}
                                deepPath={deepPath}
                                allowRemoval={true}
                                sectionIndex={indexes?.['2']}
                                // contentIndex={index}
                                outOfEditing={outOfEditing}
                            />
                        )
                    })
                }
                {
                    !outOfEditing &&
                    <button className="text-blue-500 cursor-pointer mb-3"
                        onClick={() => addExtraSummary()}
                    >Add More Section...</button>}
            </div>


            <MultiSelect
                heading={"Sub Market Section"}
                tabName={"Select Market"}
                language={language}
                referenceOriginal={{ dir: "subServices" }}
                currentPath={currentPath}
                listOptions={marketList}
                options={content?.[3]?.items?.filter(e => e.slug !== slug)}
                sectionIndex={indexes?.['3']}
                outOfEditing={outOfEditing}
            />
        </div>
    )
}

export default MarketDetailsManager