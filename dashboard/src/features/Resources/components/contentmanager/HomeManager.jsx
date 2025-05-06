// import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import FileUploader from "../../../../components/Input/InputFileUploader";
import ContentSection from "../breakUI/ContentSections";
import MultiSelect from "../breakUI/MultiSelect";
import { updateContent } from "../../../common/homeContentSlice";
// import content from "../websiteComponent/content.json"
import { useDispatch, useSelector } from "react-redux";
import { getContent, getResources } from "../../../../app/fetch";

const HomeManager = ({ language, content, currentPath, indexes, outOfEditing }) => {
    // states
    const [currentId, setCurrentId] = useState("")
    const [ServicesOptions, setServicesOptions] = useState([])
    const [ProjectOptions, setProjectOptions] = useState([])
    const [TestimonialsOptions, setTestimonialsOptions] = useState([])
    const { isManager, isEditor } = useSelector(state => state.user)
    // fucntions
    const dispatch = useDispatch()


    useEffect(() => {
        const currentId = localStorage.getItem("contextId");
        if (currentId) {
            setCurrentId(currentId)
        }
    }, [])

    useEffect(() => {
        async function getOptionsforServices() {
            const response = await getResources({ resourceType: "SUB_PAGE", resourceTag: "SERVICE" })
            const response2 = await getResources({ resourceType: "SUB_PAGE", resourceTag: "PROJECT" })
            const response3 = await getResources({ resourceType: "SUB_PAGE", resourceTag: "TESTIMONIAL", fetchType: "CONTENT" })
            if (response.message === "Success") {
                let options = response.resources.resources.map((e, i) => ({
                    id: e.id,
                    order: i + 1,
                    slug: e.slug,
                    titleEn: e.titleEn,
                    titleAr: e.titleAr,
                    // icon: e.icon,
                    // image: e.image
                }))
                setServicesOptions(options)
            }
            if (response2.message === "Success") {
                let options = response2.resources.resources.map((e, i) => ({
                    id: e.id,
                    order: i + 1,
                    slug: e.slug,
                    titleEn: e.titleEn,
                    titleAr: e.titleAr,
                    // icon: e.icon,
                    // image: e.image
                }))
                setProjectOptions(options)
            }

            if (response3.ok) {
                let options = response3.resources.resources.map((e, i) => ({
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

    useEffect(() => {
        if (currentId) {
            async function context() {
                try {
                    const response = await getContent(currentId)
                    if (response.message === "Success") {
                        const payload = {
                            id: response.content.id,
                            titleEn: response.content.titleEn,
                            titleAr: response.content.titleAr,
                            slug: response.content.slug,
                            resourceType: response.content.resourceType,
                            resourceTag: response.content.resourceTag,
                            relationType: response.content.relationType,
                            editVersion: isManager ? response.content.liveModeVersionData : response.content.editModeVersionData ?? response.content.liveModeVersionData
                        }
                        if (payload.editVersion.status !== "EDITING" || payload.editVersion.status !== "DRAFT") {

                        }

                        dispatch(updateContent({ currentPath: "content", payload }))
                    }
                } catch (err) {

                }
            }
            context()
        }
    }, [currentId, isManager])

    return ( /// Component
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"homeReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/* homeBanner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Hero Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.homeBanner?.content?.title[language], update: `editVersion.sections[${indexes.homeBanner}].content.title.${language}` },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 500, value: content?.homeBanner?.content?.description[language], update: `sections.${indexes.homeBanner}.description.${language}` },
                    { input: "input", label: "Button Text", updateType: "button", maxLength: 20, value: content?.homeBanner?.content?.button?.[0]?.text?.[language], update: `sections.${indexes.homeBanner}.buttonText[0]/${language}` }]}
                inputFiles={[{ label: "Backround Image", id: "homeBanner" }]}
                section={"homeBanner"}
                language={language}
                currentContent={content}
                contentIndex={indexes.homeBanner}
                resourceId={currentId}
                outOfEditing={outOfEditing}
            />

            {/* about section */}
            <ContentSection
                currentPath={currentPath}
                Heading={"About Section"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.markDown?.content?.title[language] },
                    { input: "richtext", label: "About section", updateType: "description", maxLength: 800, value: content?.markDown?.content?.description[language] },
                    { input: "input", label: "Button Text", updateType: "button", value: content?.markDown?.content?.button?.[0]?.text?.[language] }]}
                inputFiles={[{ label: "Backround Image", id: "aboutUsSection" }]}
                section={"aboutUsSection"}
                language={language}
                currentContent={content}
                contentIndex={indexes.markDown}
                resourceId={currentId}
                outOfEditing={outOfEditing}
            />

            {/* services  */}
            <MultiSelect
                currentPath={currentPath}
                section={"serviceSection"}
                language={language}
                label={"Select Service List"}
                heading={"Services Section"}
                tabName={"Select Services"}
                options={content?.serviceCards?.items}
                listOptions={ServicesOptions}
                referenceOriginal={{ dir: "home", index: 0 }}
                currentContent={content}
                contentIndex={indexes.serviceCards}
                outOfEditing={outOfEditing}
            />

            {/* exprerince */}
            <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Experience Section"}
                    inputs={[
                        { input: "input", label: "Heading/title", updateType: "title", value: content?.statistics?.content?.title[language] },
                        { input: "textarea", label: "Description", updateType: "description", value: content?.statistics?.content?.description[language] },
                        { input: "input", label: "Button Text", updateType: "button", value: content?.statistics?.content?.button?.[0]?.text?.[language] }]}
                    isBorder={false}
                    fileId={"experienceSection"}
                    section={"experienceSection"}
                    language={language}
                    currentContent={content}
                    contentIndex={indexes.statistics}
                    resourceId={currentId}
                    outOfEditing={outOfEditing}
                />
                {["Item 1", "Item 2", "Item 3", "Item 4"].map((item, index, array) => {
                    const isLast = index === array.length - 1;
                    return (
                        <ContentSection key={item + index}
                            currentPath={currentPath}
                            subHeading={item}
                            inputs={[
                                { input: "input", label: "Item text 1", updateType: "count", value: content?.statistics?.content?.cards?.[index]?.count },
                                { input: "input", label: "Item text 2", updateType: "title", value: content?.statistics?.content?.cards?.[index]?.title?.[language] }]}
                            inputFiles={[{ label: "Item Icon", id: item }]}
                            // fileId={item}
                            language={language}
                            section={"experienceSection"}
                            subSection={"cards"}
                            index={+index}
                            isBorder={isLast}
                            currentContent={content}
                            contentIndex={indexes.statistics}
                            resourceId={currentId}
                            outOfEditing={outOfEditing}
                        />
                    )
                })}
            </div>

            {/* project selection */}
            <div className="w-full">
                <h3 className={`font-semibold text-[1.25rem] mb-4 mt-4`} >
                    Project Section
                </h3>
                <div>
                    {
                        content?.projectGrid?.sections?.map((section, index, array) => {
                            const isLast = index === array.length - 1;
                            return (
                                <div key={index} className="mt-3 ">
                                    <ContentSection
                                        currentPath={currentPath}
                                        subHeading={'section ' + (index + 1)}
                                        inputs={[
                                            { input: "input", label: (section?.title?.en)?.toUpperCase(), updateType: "title", value: section?.content?.title?.[language] },
                                            { input: "textarea", label: "Description", updateType: "description", maxLength: 500, value: section?.content?.description?.[language] }
                                        ]}
                                        language={language}
                                        section={"recentProjectsSection"}
                                        subSection={"sections"}
                                        index={+index}
                                        isBorder={isLast}
                                        currentContent={content}
                                        contentIndex={indexes.projectGrid}
                                        resourceId={currentId}
                                        outOfEditing={outOfEditing}
                                    />
                                    <MultiSelect
                                        currentPath={currentPath}
                                        language={language}
                                        label={"Select Project List " + (index + 1)}
                                        tabName={"Select Projects"}
                                        options={content.projectGrid.sections[index].items}
                                        referenceOriginal={{ dir: "recentproject", index }}
                                        currentContent={content}
                                        contentIndex={indexes.projectGrid}
                                        listOptions={ProjectOptions}
                                        outOfEditing={outOfEditing}
                                    />
                                </div>
                            )
                        })}
                </div>
            </div>

            {/* client section */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Client Section"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.clientLogo?.content?.title[language] },
                    { input: "input", label: "Description", updateType: "description", value: content?.clientLogo?.content?.description[language] },
                ]}
                inputFiles={content?.clientLogo?.content?.clients?.map((e, i) => ({ label: "Client " + (i + 1), id: e.image[0] }))}
                section={"clientSection"}
                language={language}
                currentContent={content}
                contentIndex={indexes.clientLogo}
                allowExtraInput={true}
                resourceId={currentId}
                outOfEditing={outOfEditing}
            />

            <ContentSection
                currentPath={currentPath}
                Heading={"Testimonials"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.testimonials?.content?.title[language] },
                ]}
                section={"Testimonials heading"}
                language={language}
                currentContent={content}
                contentIndex={indexes.testimonials}
                resourceId={currentId}
                outOfEditing={outOfEditing}
            />
            <MultiSelect
                currentPath={currentPath}
                section={"testimonialsSections"}
                language={language}
                label={"Select Testimony List"}
                heading={"Testimonials Section"}
                tabName={"Select Testimonies"}
                options={content?.testimonials?.items}
                listOptions={TestimonialsOptions}
                referenceOriginal={{ dir: "testimonials", index: 0 }}
                currentContent={content}
                contentIndex={indexes.testimonials}
                limitOptions={4}
                min={4}
                outOfEditing={outOfEditing}
            />


            {/* New Project */}
            <ContentSection
                currentPath={currentPath}
                Heading={"New Project"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.normalContent?.content?.title?.[language] },
                    { input: "richtext", label: "Description 1", updateType: "description", value: content?.normalContent?.content?.description?.[language] },
                    // { input: "textarea", label: "Description 2", updateType: "description2", value: content?.normalContent?.content?.description2?.[language] },
                    // { input: "intpu", label: "Highlight Text", updateType: "highlightedText", value: content?.normalContent?.content?.highlightedText?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", value: content?.normalContent?.content?.button?.[0]?.text?.[language] },
                ]}
                section={"newProjectSection"}
                language={language}
                currentContent={content}
                contentIndex={indexes.normalContent}
                resourceId={currentId}
                outOfEditing={outOfEditing}
            />

        </div>
    )
}

export default HomeManager