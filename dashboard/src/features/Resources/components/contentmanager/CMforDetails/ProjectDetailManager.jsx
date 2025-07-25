import { useDispatch, useSelector } from "react-redux"
import FileUploader from "../../../../../components/Input/InputFileUploader"
import ContentSection from "../../breakUI/ContentSections"
import DynamicContentSection from "../../breakUI/DynamicContentSection"
import MultiSelect from "../../breakUI/MultiSelect"
import { updateCardAndItemsArray } from "../../../../common/homeContentSlice"
import { useEffect, useState } from "react"
// import content from "../../websiteComponent/content.json"
import { getResources, getAllFilters } from "../../../../../app/fetch"


const ProjectDetailManager = ({ projectId, currentContent: content, currentPath, language, indexes, outOfEditing }) => {
    const [filters, setFilters] = useState([])
    const dispatch = useDispatch()
    const slug = useSelector(state => state?.homeContent?.present?.content?.slug)

    // const thumbIcon = useSelector(state => state.homeContent?.present?.content?.editVersion?.icon) || ""
    const thumbImage = useSelector(state => state.homeContent?.present?.content?.editVersion?.image) || ""

    const context = useSelector(state => state.homeContent?.present?.content)


    const addExtraSummary = () => {
        dispatch(updateCardAndItemsArray(
            {
                insert: {
                    title: {
                        ar: "",
                        en: ""
                    },
                    description: {
                        ar: "",
                        en: ""
                    }
                },
                projectId,
                context: "projectDetail",
                operation: 'add',
                sectionIndex: indexes?.["3"]
            }
        ))
    }


    const introSection = content?.[1]?.content
    const urlSection = content?.[2]?.content;
    const projectInforCard = content?.[2]?.content || []
    const descriptionSection = content?.[3]?.content || []
    const gallerySection = content?.[4]?.content
    const moreProjects = content?.[5];

    const [all, setAll] = useState([])

    useEffect(() => {
        // if (context?.id === "N") {
            async function getOptionsforServices() {
                const response = await getAllFilters()

                if (response.message === "Success") {
                    let options = response?.filters?.map((e, i) => {
                        if (e.nameEn === "ONGOING" || e.nameEn === "COMPLETE") {
                            return e
                        }
                    }).filter(Boolean)
                    setFilters(options)
                }
            }

            getOptionsforServices()
        // }
    }, [context?.id])

    useEffect(() => {
        async function getOptionsForServices() {
            const query = {
                resourceType: "SUB_PAGE",
                resourceTag: "PROJECT",
                fetchType: "CONTENT",
                apiCallType: "INTERNAL"
            };

            const filters = [
                { key: "ALL", setter: setAll },
            ];

            const mapResources = (resources) =>
                resources?.map((e, i) => ({
                    id: e.id,
                    order: i + 1,
                    slug: e.slug,
                    titleEn: e.titleEn,
                    titleAr: e.titleAr,
                    icon: e.liveModeVersionData?.icon,
                    image: e.liveModeVersionData?.image,
                    location: e.liveModeVersionData?.sections?.[1]?.content?.[0]?.value
                })).filter(e => e.slug !== slug)

            const responses = await Promise.all(
                filters.map(({ key }) => getResources({ ...query, filterText: key }))
            );

            responses.forEach((response, index) => {
                if (response.ok) {
                    const options = mapResources(response?.resources?.resources);
                    filters[index].setter(options);
                }
            });
        }

        getOptionsForServices();
    }, []);

    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"ProjectIDReference" + projectId} label={"Rerference doc"} fileName={"Upload your file..."} outOfEditing={outOfEditing} />

            {
            // context?.id === "N" &&
                <>
                    <ContentSection
                        currentPath={currentPath}
                        Heading={"Page - Details"}
                        inputs={[ //filters
                            { input: "input", label: "Title English", updateType: "titleEn", value: context?.titleEn, dir: "ltr" },
                            { input: "input", label: "Title Arabic", updateType: "titleAr", value: context?.titleAr, dir: "rtl" },
                            // { input: "input", label: "Slug", updateType: "slug", value: context?.slug },
                            ...([{ input: "input", label: "Slug", updateType: "slug", value: context?.slug, disable: context?.id === "N" ? false : true }] ),
                    ...([{input: "select", label: "Status", updateType: "filter", option: filters }])
                        ]}
                    section={"page-details"}
                    language={language}
                    outOfEditing={outOfEditing}
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
                outOfEditing={outOfEditing}
            />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: introSection?.title?.[language] },
                    { input: "input", label: "Description", updateType: "subtitle", value: introSection?.subtitle?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", value: introSection?.button?.[0]?.text?.[language], index: 0 },
                    { input: "input", label: "Url", updateType: "url", value: introSection?.link?.url },
                    { input: "input", label: "Url Text", updateType: "url/text", value: introSection?.link?.text },
                ]}
                inputFiles={[{ label: "Cover Image", id: "ProjectBanner/" + (projectId), url: introSection?.images?.[0]?.url, order: 1 }]}
                section={"introSection"}
                language={language}
                currentContent={content}
                projectId={projectId}
                sectionIndex={indexes?.['1']}
                outOfEditing={outOfEditing}
            />
            <div className="mt-4">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Cards</h3>
                {
                    projectInforCard?.map((element, index, a) => {
                        const lastIndex = index === (a.length - 1)
                        return (
                            <ContentSection key={index}
                                currentPath={currentPath}
                                subHeading={"Card " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "key", value: element?.key?.[language] },
                                    { input: "input", label: "Description", updateType: "value", value: element?.value?.[language] },
                                ]}
                                inputFiles={[{ label: "Icon Image", id: `ProjectIcon/${index}/${projectId}`, url: element?.icon }]}
                                section={"Footer"}
                                subSection={"projectInforCard"}
                                index={index}
                                contentIndex={index}
                                language={language}
                                currentContent={content}
                                projectId={projectId}
                                isBorder={lastIndex}
                                sectionIndex={indexes?.['2']}
                                outOfEditing={outOfEditing}
                            />
                        )
                    })
                }
            </div>

            <div className="mt-4 border-b">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Project Summaries</h3>
                {
                    descriptionSection?.map((element, index, a) => {
                        const isLast = index === a.length - 1
                        return (
                            <DynamicContentSection key={index}
                                currentPath={currentPath}
                                subHeading={"Section " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title", value: element?.title?.[language] },
                                    { input: "richtext", label: "Description", updateType: "description", value: element?.description?.[language] },
                                ]}
                                section={"descriptionSection"}
                                index={index}
                                language={language}
                                currentContent={content}
                                projectId={projectId}
                                isBorder={false}
                                sectionIndex={indexes?.['3']}
                                contentIndex={index}
                                type={"content[index]"}
                                allowRemoval={true}
                                outOfEditing={outOfEditing}
                            />
                        )
                    })
                }
                <button className="text-blue-500 cursor-pointer mb-3" onClick={addExtraSummary}>Add Section...</button>
            </div>

            <ContentSection
                currentPath={currentPath}
                Heading={"Gallery"}
                inputFiles={
                    gallerySection?.images?.map((e, i) => {
                        return { label: "Image " + (i + 1), id: `ProjectBanner/${projectId}/gallery/${i}`, url: e.url, order: i + 1 }
                    })}
                section={"images"}
                language={language}
                currentContent={content}
                projectId={projectId}
                allowExtraInput={true}
                sectionIndex={indexes?.['4']}
                outOfEditing={outOfEditing}
            />

            <MultiSelect
                currentPath={currentPath}
                section={"moreProjects"}
                language={language}
                // label={"Select More Project List"}
                heading={"More Projects"}
                tabName={"Select Project"}
                listOptions={all}
                options={moreProjects?.items?.filter(e => e.slug !== slug) || []}
                referenceOriginal={{ dir: "home", index: 0 }}
                currentContent={content}
                projectId={projectId}
                sectionIndex={indexes?.['5']}
                maxLimit={6}
                outOfEditing={outOfEditing}
            />

        </div>
    )
}

export default ProjectDetailManager