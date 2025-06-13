import FileUploader from "../../../../components/Input/InputFileUploader"
import ContentSection from "../breakUI/ContentSections"

const AffiliatesManager = ({ language, content, indexes, currentPath, outOfEditing }) => {

    return (
        <div>
            <FileUploader id={"Market-Details-ID-Reference"} label={"Rerference doc"} fileName={"Upload your file..."} />

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
                currentPath={currentPath}
                Heading={"Images"}
                inputFiles={content?.[2]?.content?.cards?.map((e, i) => {
                    return {
                        label: "Image " + (i + 1),
                        id: "Image " + (1 + i),
                        order: e.order,
                        url: e.images?.[0]?.url
                    }
                })}
                section={"affiliates"}
                language={language}
                currentContent={content}
                sectionIndex={indexes?.['2']}
                outOfEditing={outOfEditing}
                allowExtraInput={true}
            />

            {/* {
                content?.[2]?.content?.cards?.map((card, index) => {

                    return (
                        <ContentSection
                            currentPath={currentPath}
                            Heading={"Banner"}
                            inputFiles={[
                                {
                                    label: "Image" + (index + 1),
                                    id: "ServiceBanner",
                                    order: 1,
                                    url: card?.images?.[0]?.url
                                }
                            ]}
                            section={"banner"}
                            language={language}
                            currentContent={content}
                            sectionIndex={indexes?.['2']}
                            outOfEditing={outOfEditing}
                        />
                    )
                })
            } */}

        </div>
    )
}

export default AffiliatesManager