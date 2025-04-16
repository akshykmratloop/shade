import { useDispatch } from "react-redux"
import FileUploader from "../../../../../components/Input/InputFileUploader"
import ContentSection from "../../breakUI/ContentSections"
import DynamicContentSection from "../../breakUI/DynamicContentSection"
import { updateTheProjectSummaryList } from "../../../../common/homeContentSlice"

const SubServiceDetailManager = ({ serviceId, currentContent, currentPath, language, deepPath }) => {
    const dispatch = useDispatch()

    const addExtraSummary = (subContext) => {
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
                subContext,
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
                    { input: "richtext", label: "Description", updateType: "description", maxLength: 350 },
                ]}
                inputFiles={[{ label: "Backround Image", id: `subServiceBanner/${serviceId}/${deepPath}` }]}
                section={"banner"}
                language={language}
                currentContent={currentContent}
                projectId={serviceId}
                deepPath={deepPath}
            />

            {/* sub banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", maxLength: 34 },
                    { input: "richtext", label: "Description", updateType: "description", maxLength: 350 },
                ]}
                section={"subBanner"}
                language={language}
                currentContent={currentContent}
                projectId={serviceId}
                deepPath={deepPath}
            />

            {/* Gallery 1 */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Gallery"}
                inputFiles={
                    currentContent?.[serviceId]?.[deepPath - 1]?.gallery1?.map((e, i) => {
                        return { label: "Image " + (i + 1), id: `subService/${serviceId}/gallery/${deepPath}/${i}` }
                    })}
                section={"gallery1"}
                language={language}
                currentContent={currentContent}
                projectId={serviceId}
                allowExtraInput={true}
            />

            {/* Details Sections */}
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
                    onClick={() => addExtraSummary("descriptions")}
                >Add More Section...</button>
            </div>

            {/* Details Sections 2 */}
            <div className="mt-4 border-b">
                <h3 className={`font-semibold text-[1.25rem] mb-4`}>Details Sections 2</h3>
                {
                    currentContent?.[serviceId]?.[deepPath - 1]?.descriptions2?.map((element, index, a) => {
                        return (
                            <DynamicContentSection key={index}
                                currentPath={currentPath}
                                subHeading={"Section " + (index + 1)}
                                inputs={[
                                    { input: "input", label: "Title", updateType: "title", maxLength: 100 },
                                    { input: "textarea", label: "Description", updateType: "description" },
                                ]}
                                section={"descriptions2"}
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
                    onClick={() => addExtraSummary("descriptions2")}
                >Add More Section...</button>
            </div>

            {/* Gallery 2 */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Gallery"}
                inputFiles={
                    currentContent?.[serviceId]?.[deepPath - 1]?.gallery2?.map((e, i) => {
                        return { label: "Image " + (i + 1), id: `subService/${serviceId}/gallery2/${deepPath}/${i}` }
                    })}
                section={"gallery1"}
                language={language}
                currentContent={currentContent}
                projectId={serviceId}
                allowExtraInput={true}
            />
        </div>
    )
}

export default SubServiceDetailManager