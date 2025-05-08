
// import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import FileUploader from "../../../../components/Input/InputFileUploader";
import ContentSection from "../breakUI/ContentSections";
// import MultiSelect from "../breakUI/MultiSelect";
import { updateMainContent } from "../../../common/homeContentSlice";
// import content from "../websiteComponent/content.json"
import { useDispatch, useSelector } from "react-redux";
import { getContent } from "../../../../app/fetch";

const AboutManager = ({  content, currentPath, language, }) => {
    const dispatch = useDispatch()
    const [currentId, setCurrentId] = useState("")

    const { isManager, isEditor } = useSelector(state => state.user)

    // useEffect(() => {
    //     dispatch(updateContent({ currentPath: "home", payload: (content?.about) }))
    // }, [])

    useEffect(() => {
        const currentId = localStorage.getItem("contextId");
        if (currentId) {
            setCurrentId(currentId)
        }
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

                        dispatch(updateMainContent({ currentPath: "content", payload }))
                    }
                } catch (err) {

                }
            }
            context()
        }
    }, [currentId, isManager, isEditor])
    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"aboutReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/* services */}
            <div className="w-full">
                <ContentSection
                    currentPath={currentPath}
                    Heading={"Services"}
                    inputs={[
                        { input: "input", label: "Heading/title", updateType: "title", value: content?.heroBanner?.content?.title[language] },
                        { input: "input", label: "Description", updateType: "subtitle" },
                    ]}
                    isBorder={false}
                    section={"services"}
                    language={language}
                    currentContent={content}
                />
                {
                    content?.services?.cards.map((item, index, array) => {
                        const isLast = index === array.length - 1;
                        return (
                            <ContentSection key={item + index}
                                currentPath={currentPath}
                                subHeading={"card " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Item text 1", updateType: "title", maxLength: 20 },
                                    { input: "textarea", label: "Item text 2", updateType: "description", maxLength: 200 }
                                ]}
                                inputFiles={[{ label: "Item Icon", id: item.icon }]}
                                // fileId={item}
                                language={language}
                                section={"services"}
                                subSection={"cards"}
                                index={+index}
                                isBorder={isLast}
                                currentContent={content}
                            />
                        )
                    })
                }
            </div>

            {/* main */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Main"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title" },
                    { input: "textarea", label: "Description 1", updateType: "description1", maxLength: 400 },
                    { input: "textarea", label: "Description 2", updateType: "description2", maxLength: 400 },
                ]}
                inputFiles={[{ label: "Video", id: "video" }]}
                section={"main"}
                language={language}
                currentContent={content}
            />
        </div>
    )
}

export default AboutManager