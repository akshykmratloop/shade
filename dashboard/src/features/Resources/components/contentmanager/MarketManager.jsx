import ContentSection from "../breakUI/ContentSections";
import MultiSelectPro from "../breakUI/MultiSelectPro";
import FileUploader from "../../../../components/Input/InputFileUploader";

import { useEffect, useState } from "react";
import { updateMainContent } from "../../../common/homeContentSlice";
import content from "../websiteComponent/content.json"
import { useDispatch } from "react-redux";
import MultiSelect from "../breakUI/MultiSelect";
import { getResources } from "../../../../app/fetch";

const MarketManager = ({ language, currentContent, currentPath, indexes, outOfEditing }) => {
    const dispatch = useDispatch()

    const [projectOptions, setProjectOptions] = useState([])
    const [testimonialsOptions, setTestimonialsOptions] = useState([])


    // useEffect(() => {
    //     dispatch(updateMainContent({ currentPath: "home", payload: (content?.market) }))
    // }, [])

    useEffect(() => {
        async function getOptionsforServices() {
            const response = await getResources({ resourceType: "SUB_PAGE", resourceTag: "MARKET", fetchType: "CONTENT", apiCallType: "INTERNAL" })
            const response2 = await getResources({ resourceType: "SUB_PAGE", resourceTag: "TESTIMONIAL", fetchType: "CONTENT", apiCallType: "INTERNAL" })

            if (response.message === "Success") {
                let options = response?.resources?.resources?.map((e, i) => ({
                    id: e.id,
                    order: i + 1,
                    slug: e.slug,
                    titleEn: e.titleEn,
                    titleAr: e.titleAr,
                    icon: e.icon,
                    image: e.liveModeVersionData?.image,
                    description: e.liveModeVersionData?.sections?.[0]?.content?.description
                }))
                setProjectOptions(options)
            }

            if (response2.ok) {
                let options = response2?.resources?.resources?.map((e, i) => ({
                    id: e.id,
                    order: i + 1,
                    slug: e.slug,
                    titleEn: e.titleEn,
                    titleAr: e.titleAr,
                    // icon: e.icon,
                    // image: e.image
                    liveModeVersionData: e.liveModeVersionData
                }))
                setTestimonialsOptions(options)
            }
        }

        getOptionsforServices()
    }, [])

    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"marketReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: currentContent?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 300, value: currentContent?.['1']?.content?.description?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", value: currentContent?.['1']?.content?.button?.[0]?.text?.[language], index: 0 }
                ]}
                inputFiles={[{ label: "Backround Image", id: "marketBanner", order: 1 }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                sectionIndex={indexes?.["1"]}
                outOfEditing={outOfEditing}

            />

            <ContentSection
                currentPath={currentPath}
                Heading={"Sub Heading"}
                inputs={[
                    { input: "input", label: "Heading/title", maxLength: 55, updateType: "title", value: currentContent?.['3']?.content?.introSection?.title?.[language] },
                    { input: "textarea", label: "Description", maxLength: 400, updateType: "description", value: currentContent?.['3']?.content?.introSection?.description?.[language] },
                    { input: "input", label: "Button for projects", maxLength: 15, updateType: "button", value: currentContent?.['3']?.content?.button?.[0]?.text?.[language], index: 0 }
                ]}
                section={"Market Sub heading"}
                subSection={"sub"}
                language={language}
                currentContent={currentContent}
                sectionIndex={indexes?.['3']}
                // resourceId={currentId}
                outOfEditing={outOfEditing}
            />
            <MultiSelect
                currentPath={currentPath}
                section={"testimonialsSections"}
                language={language}
                label={"Select Sub Project List"}
                heading={"Sub Project Section"}
                tabName={"Select Sub Projects"}
                options={currentContent?.['3']?.items}
                listOptions={projectOptions}
                referenceOriginal={{ dir: "testimonials", index: 0 }}
                currentContent={content}
                sectionIndex={indexes?.['3']}
                // limitOptions={4}
                // min={4}
                outOfEditing={outOfEditing}
            />

            {/* Quote */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Quote"}
                inputs={[
                    { input: "textarea", label: "Heading/title", updateType: "text", maxLength: 300, value: currentContent?.['2']?.content?.text?.[language] },
                    { input: "input", label: "Description", updateType: "author", value: currentContent?.['2']?.content?.author?.[language] },
                ]}
                section={"quote"}
                language={language}
                currentContent={currentContent}
                sectionIndex={indexes?.["2"]}
                outOfEditing={outOfEditing}

            />

            {/* Market Lists */}
            {/* <div>
                <h1>Market Lists</h1>
                {
                    currentContent?.tabSection?.tabs.map((element, index) => {

                        return (
                            <div key={index}>
                                <MultiSelectPro
                                    options={currentContent?.tabSection.marketItems}
                                    currentPath={currentPath}
                                    section={"tabSection"}
                                    language={language}
                                    label={element.title.en}
                                    id={element.id}
                                    tabName={"Select Markets"}
                                    referenceOriginal={{ dir: "markets", index: 0 }}
                                    currentContent={currentContent}
                                    sectionIndex={indexes?.["4"]}
                                    outOfEditing={outOfEditing}

                                />
                            </div>
                        )
                    })
                }
            </div> */}
            {/* testimonials */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Testimonials"}
                inputs={[
                    { input: "input", label: "Heading/title", maxLength: 55, updateType: "title", value: currentContent?.['4']?.content?.title[language] },
                ]}
                section={"Testimonials heading"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['4']}
                // resourceId={currentId}
                outOfEditing={outOfEditing}
            />
            <MultiSelect
                currentPath={currentPath}
                section={"testimonialsSections"}
                language={language}
                label={"Select Testimony List"}
                heading={"Testimonials Section"}
                tabName={"Select Testimonies"}
                options={currentContent?.['4']?.items}
                listOptions={testimonialsOptions}
                referenceOriginal={{ dir: "testimonials", index: 0 }}
                currentContent={content}
                sectionIndex={indexes?.['4']}
                limitOptions={4}
                outOfEditing={outOfEditing}
            />

        </div>
    )
}

export default MarketManager