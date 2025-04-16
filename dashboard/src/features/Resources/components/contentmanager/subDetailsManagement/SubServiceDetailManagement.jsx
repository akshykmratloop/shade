import { useDispatch } from "react-redux"
import FileUploader from "../../../../../components/Input/InputFileUploader"
import ContentSection from "../../breakUI/ContentSections"
import DynamicContentSection from "../../breakUI/DynamicContentSection"
import { updateTheProjectSummaryList } from "../../../../common/homeContentSlice"

const SubServiceDetailManager = ({ serviceId, currentContent, currentPath, language, deepPath }) => {
    const dispatch = useDispatch()

    const addExtraSummary = () => {
        dispatch(updateTheProjectSummaryList(
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
                serviceId,
                deepPath,
                context: "subOfsubService",
                operation: 'add'
            }
        ))
    }

    return (
        <div>
            {/* file doc */}
            <FileUploader id={"SubServiceDetailsIDReference" + serviceId + deepPath} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}

            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", maxLength: 18 },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 350 },
                ]}
                inputFiles={[{ label: "Backround Image", id: `subServiceBanner/${serviceId}/${deepPath}` }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                projectId={serviceId}
                deepPath={deepPath}
            />

            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", maxLength: 34 },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 350 },
                ]}
                section={"subBanner"}
                language={language}
                currentContent={currentContent}
                projectId={serviceId}
                deepPath={deepPath}
            />

            <div className="mt-4 border-b">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Details Sections</h3>
                {
                    currentContent?.[serviceId]?.[deepPath - 1]?.descriptions?.map((element, index, a) => {
                        return (
                            <DynamicContentSection key={index}
                                currentPath={currentPath}
                                subHeading={"Section " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title", maxLength: 100 },
                                    { input: "textarea", label: "Description", updateType: "description" },
                                ]}
                                section={"descriptions"}
                                isBorder={false}
                                index={index}
                                language={language}
                                currentContent={currentContent}
                                projectId={serviceId}
                                deepPath={deepPath}
                                allowRemoval={true}
                            />
                        )
                    })
                }
                <button className="text-blue-500 cursor-pointer mb-3"
                    onClick={addExtraSummary}
                >Add More Section...</button>
            </div>
        </div>
    )
}

export default SubServiceDetailManager