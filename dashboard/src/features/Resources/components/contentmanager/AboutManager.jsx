
// import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import FileUploader from "../../../../components/Input/InputFileUploader";
import ContentSection from "../breakUI/ContentSections";
// import MultiSelect from "../breakUI/MultiSelect";
import { updateMainContent } from "../../../common/homeContentSlice";
// import content from "../websiteComponent/content.json"
import { useDispatch, useSelector } from "react-redux";
import { getContent } from "../../../../app/fetch";

const AboutManager = ({ content, currentPath, language, indexes, outOfEditing }) => {
    const dispatch = useDispatch()
    const [currentId, setCurrentId] = useState("")

    const { isManager, isEditor } = useSelector(state => state.user)

    useEffect(() => {
        const currentId = localStorage.getItem("contextId");
        if (currentId) {
            setCurrentId(currentId)
        }
    }, [])

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
                        { input: "input", label: "Heading", updateType: "title", value: content?.['1']?.content?.title[language] },
                        { input: "input", label: "Description", updateType: "subtitle", value: content?.['1']?.content?.subtitle[language] },
                    ]}
                    isBorder={false}
                    section={"services"}
                    language={language}
                    currentContent={content}
                    sectionIndex={indexes?.['1']}
                    // resourceId={currentId}
                    outOfEditing={outOfEditing}
                />
                {
                    content?.['1']?.content?.cards.map((item, index, array) => {
                        const isLast = index === array.length - 1;
                        return (
                            <ContentSection key={item + index}
                                currentPath={currentPath}
                                subHeading={"card " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Item text 1", updateType: "title", maxLength: 20, value: content?.['1']?.content?.cards?.[index]?.title?.[language] },
                                    { input: "textarea", label: "Item text 2", updateType: "description", maxLength: 200, value: content?.['1']?.content?.cards?.[index]?.description?.[language] }
                                ]}
                                inputFiles={[{ label: "Icon", id: item.icon, order: item.order, directIcon: true, url: item.icon }]}
                                // fileId={item}
                                language={language}
                                section={"services"}
                                subSection={"cards"}
                                index={+index}
                                isBorder={isLast}
                                currentContent={content}
                                sectionIndex={indexes?.['1']}
                                // resourceId={currentId}
                                outOfEditing={outOfEditing}
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
                    { input: "input", label: "Title", updateType: "title", value: content?.['2']?.content?.title?.[language] },
                    { input: "richtext", label: "Descriptions", updateType: "descriptions", maxLength: 400, value: content?.['2']?.content?.descriptions?.[language] },
                    { input: "input", label: "Button", updateType: "button", maxLength: 20, value: content?.['2']?.content?.button?.[0]?.text?.[language], index: 0 },
                ]}
                inputFiles={[{ label: "Video", id: "video", type: "VIDEO" }]}
                section={"main"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
                // resourceId={currentId}
                outOfEditing={outOfEditing}
            />
        </div>
    )
}

export default AboutManager