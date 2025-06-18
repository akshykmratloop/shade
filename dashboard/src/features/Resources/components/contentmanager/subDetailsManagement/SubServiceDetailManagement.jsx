import { useDispatch, useSelector } from "react-redux"
import FileUploader from "../../../../../components/Input/InputFileUploader"
import ContentSection from "../../breakUI/ContentSections"
import DynamicContentSection from "../../breakUI/DynamicContentSection"
import { updateSubServiceDetailsPointsArray } from "../../../../common/homeContentSlice"

const SubServiceDetailManager = ({ serviceId, content, currentPath, language, deepPath, indexes, outOfEditing }) => {
    const dispatch = useDispatch()


    const thumbIcon = useSelector(state => state.homeContent?.present?.content?.editVersion?.icon) || ""
    const thumbImage = useSelector(state => state.homeContent?.present?.content?.editVersion?.image) || ""

    const addExtraSummary = (subContext) => {
        dispatch(updateSubServiceDetailsPointsArray(
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
                section: "points",
                operation: 'add',
                sectionIndex: indexes?.['2'],
            }
        ))
    }

    return (
        <div>
            {/* file doc */}
            <FileUploader id={"SubServiceDetailsIDReference" + serviceId + deepPath} label={"Rerference doc"} fileName={"Upload your file..."} />

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
                    { input: "input", label: "Heading/title", updateType: "title", maxLength: 40, value: content?.['1']?.content?.title?.[language] },
                    { input: "richtext", label: "Description", updateType: "description", maxLength: 350, value: content?.['1']?.content?.description?.[language] },
                ]}
                inputFiles={[{ label: "Backround Image", id: `subServiceBanner/${serviceId}/${deepPath}`, order: 1, url: content?.['1']?.content?.images?.[0]?.url }]}
                section={"banner"}
                language={language}
                currentContent={content}
                projectId={serviceId}
                deepPath={deepPath}
                sectionIndex={indexes?.['1']}
                outOfEditing={outOfEditing}
            />

            {/* sub banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", maxLength: 34, value: content?.['2']?.content?.title?.[language] },
                    { input: "richtext", label: "Description", updateType: "description", maxLength: 350, value: content?.['2']?.content?.description?.[language] },
                ]}
                section={"subBanner"}
                language={language}
                currentContent={content}
                projectId={serviceId}
                deepPath={deepPath}
                sectionIndex={indexes?.['2']}
                outOfEditing={outOfEditing}
            />

            {/* Details Sections */}
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
                                section={"points"}
                                isBorder={false}
                                index={index}
                                language={language}
                                currentContent={content}
                                projectId={serviceId}
                                deepPath={deepPath}
                                allowRemoval={true}
                                sectionIndex={indexes?.['2']}
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

            {/* Gallery 1 */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Gallery"}
                inputFiles={
                    content?.[3]?.content?.images?.map((e, i) => {
                        return { label: "Image " + (i + 1), id: `subServiceChild/gallery/${i}`, order: i + 1, url: e.url }
                    })}
                section={"pointsp"}
                language={language}
                currentContent={content}
                projectId={serviceId}
                deepPath={deepPath}
                allowExtraInput={true}
                sectionIndex={indexes?.['3']}
                outOfEditing={outOfEditing}
            />
        </div>
    )
}

export default SubServiceDetailManager