// import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import FileUploader from "../../../../components/Input/InputFileUploader";
import ContentSection from "../breakUI/ContentSections";
import MultiSelect from "../breakUI/MultiSelect";
import { updateMainContent } from "../../../common/homeContentSlice";
// import content from "../websiteComponent/content.json"
import { getResources } from "../../../../app/fetch";
import createContent from "../../defineContent";
import { useDispatch, useSelector } from "react-redux";

const HomeManager = ({ language, currentPath, outOfEditing }) => {
    // states
    const [currentId, setCurrentId] = useState("")
    const [ServicesOptions, setServicesOptions] = useState([])
    const [ProjectOptions, setProjectOptions] = useState([])
    const [TestimonialsOptions, setTestimonialsOptions] = useState([])

    const currentContent = useSelector((state) => state.homeContent.present)
    const { content, indexes } = createContent(currentContent, "edit")
    const dispatch = useDispatch()
    // fucntions

    useEffect(() => {
        async function getOptionsforServices() {
            const response = await getResources({ resourceType: "SUB_PAGE", resourceTag: "SERVICE", apiCallType: "INTERNAL" })
            const response2 = await getResources({ resourceType: "SUB_PAGE", resourceTag: "PROJECT", apiCallType: "INTERNAL" })
            const response3 = await getResources({ resourceType: "SUB_PAGE", resourceTag: "TESTIMONIAL", fetchType: "CONTENT", apiCallType: "INTERNAL" })
            if (response.message === "Success") {
                let options = response?.resources?.resources?.map((e, i) => ({
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
                let options = response2?.resources?.resources?.map((e, i) => ({
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
                let options = response3?.resources?.resources?.map((e, i) => ({
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

    // useEffect(() => {
    //     return () => dispatch(updateMainContent({ currentPath: "content", payload: undefined }))
    // }, [])

    return ( /// Component
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"homeReference"} label={"Rerference doc"} fileName={"Upload your file..."} outOfEditing={outOfEditing} />
            {/* homeBanner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Hero Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.["1"]?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 500, value: content?.["1"]?.content?.description?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", maxLength: 20, value: content?.["1"]?.content?.button?.[0]?.text?.[language], index: 0 }]}
                inputFiles={[{ label: "Backround Image", id: "homeBanner", order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                section={"homeBanner"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.["1"]}
                resourceId={currentId}
                outOfEditing={outOfEditing}
            />

            {/* about section */}
            <ContentSection
                currentPath={currentPath}
                Heading={"About Section"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['2']?.content?.title?.[language] },
                    { input: "richtext", label: "About section", updateType: "description", maxLength: 800, value: content?.['2']?.content?.description?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", value: content?.['2']?.content?.button?.[0]?.text?.[language], index: 0 }]}
                inputFiles={[{ label: "Backround Image", id: "aboutUsSection", order: 1, url: content?.["2"]?.content?.images?.[0]?.url }]}
                section={"aboutUsSection"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
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
                options={content?.['3']?.items}
                listOptions={ServicesOptions}
                referenceOriginal={{ dir: "home", index: 0 }}
                currentContent={content}
                sectionIndex={indexes?.['3']}
                outOfEditing={outOfEditing}
            />

            {/* exprerince */}
            <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Experience Section"}
                    inputs={[
                        { input: "input", label: "Heading/title", updateType: "title", value: content?.['4']?.content?.title?.[language] },
                        { input: "textarea", label: "Description", updateType: "description", value: content?.['4']?.content?.description?.[language] },
                        { input: "input", label: "Button Text", updateType: "button", value: content?.['4']?.content?.button?.[0]?.text?.[language], index: 0 }]}
                    isBorder={false}
                    fileId={"experienceSection"}
                    section={"experienceSection"}
                    language={language}
                    currentContent={content}
                    sectionIndex={indexes?.['4']}
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
                                { input: "input", label: "Item text 1", updateType: "count", value: content?.['4']?.content?.cards?.[index]?.count },
                                { input: "input", label: "Item text 2", updateType: "title", value: content?.['4']?.content?.cards?.[index]?.title?.[language] }]}
                            inputFiles={[{ label: "Item Icon", id: item, order: (index + 1), directIcon: true, url: content?.['4']?.content?.cards?.[index]?.icon }]}
                            // fileId={item}
                            language={language}
                            section={"experienceSection"}
                            subSection={"cards"}
                            index={+index}
                            isBorder={isLast}
                            currentContent={content}
                            sectionIndex={indexes?.['4']}
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
                        content?.['5']?.sections?.map((section, index, array) => {
                            const names = { 0: "Projects", 1: "Markets", 2: "Safety & Responsibility" }
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
                                        sectionIndex={indexes?.['5']}
                                        resourceId={currentId}
                                        outOfEditing={outOfEditing}
                                    />
                                    <MultiSelect
                                        currentPath={currentPath}
                                        language={language}
                                        label={`Select ${names[index]}`}
                                        tabName={"Select Projects"}
                                        options={content?.['5']?.sections?.[index]?.items}
                                        referenceOriginal={{ dir: "recentproject", index }}
                                        currentContent={content}
                                        sectionIndex={indexes?.['5']}
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
                    { input: "input", label: "Heading/title", updateType: "title", value: content?.['6']?.content?.title[language] },
                    { input: "input", label: "Description", updateType: "description", value: content?.['6']?.content?.description[language] },
                ]}
                inputFiles={content?.['6']?.content?.clientsImages?.map((e, i) => ({ label: "Client " + (i + 1), id: e.order, order: e.order, url: e.url }))}
                section={"clientsImages"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['6']}
                allowExtraInput={true}
                resourceId={currentId}
                outOfEditing={outOfEditing}
            />

            {/* testimonials */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Testimonials"}
                inputs={[
                    { input: "input", label: "Heading/title", maxLength: 55, updateType: "title", value: content?.['7']?.content?.title[language] },
                ]}
                section={"Testimonials heading"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['7']}
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
                options={content?.['7']?.items}
                listOptions={TestimonialsOptions}
                referenceOriginal={{ dir: "testimonials", index: 0 }}
                currentContent={content}
                sectionIndex={indexes?.['7']}
                limitOptions={4}
                min={4}
                outOfEditing={outOfEditing}
            />


            {/* New Project */}
            <ContentSection
                currentPath={currentPath}
                Heading={"New Project"}
                inputs={[
                    { input: "input", label: "Heading/title", maxLength: 55, updateType: "title", value: content?.['8']?.content?.title?.[language] },
                    { input: "richtext", label: "Description 1", updateType: "description", value: content?.['8']?.content?.description?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", value: content?.['8']?.content?.button?.[0]?.text?.[language], index: 0 },
                ]}
                section={"newProjectSection"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['8']}
                resourceId={currentId}
                outOfEditing={outOfEditing}
            />

        </div>
    )
}

export default HomeManager