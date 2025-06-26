import { useEffect } from "react"
import { updateMainContent } from "../../../../common/homeContentSlice"
import { useDispatch, useSelector } from "react-redux"
import ContentSection from "../../breakUI/ContentSections"
import FileUploader from "../../../../../components/Input/InputFileUploader"
import content from '../../websiteComponent/content.json'

const TestimonyManager = ({ testimonyId, currentContent, currentPath, language, indexes, outOfEditing }) => {
    const dispatch = useDispatch()

    const context = useSelector(state => state.homeContent?.present?.content)

    const content = currentContent?.[1]?.content

    return (
        <div>
            <FileUploader id={"testimonyReference/" + testimonyId} label={"Rerference doc"} fileName={"Upload your file..."} outOfEditing={outOfEditing} />

            {context?.id === "N" &&
                <>
                    <ContentSection
                        currentPath={currentPath}
                        Heading={"Page - Details"}
                        inputs={[
                            { input: "input", label: "Title English", updateType: "titleEn", value: context?.titleEn, dir: "ltr" },
                            { input: "input", label: "Title Arabic", updateType: "titleAr", value: context?.titleAr, dir: "rtl" },
                            // { input: "input", label: "Slug", updateType: "slug", value: context?.slug },
                            ...(context?.id === "N" ? [{ input: "input", label: "Slug", updateType: "slug", value: context?.slug }] : []),
                        ]}
                        section={"page-details"}
                        language={language}
                        outOfEditing={outOfEditing}
                    />
                </>
            }

            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Testimony"}
                inputs={[
                    { input: "input", label: "Name", updateType: "name", maxLength: 20, value: content?.name?.[language] },
                    { input: "input", label: "Position", updateType: "position", maxLength: 25, value: content?.position?.[language] },
                    { input: "textarea", label: "Quote", updateType: "quote", maxLength: 400, value: content?.quote?.[language] },
                    { input: "input", label: "Company", updateType: "company", maxLength: 30, value: content?.company?.[language] },
                ]}
                inputFiles={[
                    { label: "Backround Image", id: "testimony/" + (testimonyId), url: content?.images?.[0]?.url, order: 1 },
                ]}
                outOfEditing={outOfEditing}
                section={"testimonials"}
                language={language}
                currentContent={currentContent}
                projectId={testimonyId}
                sectionIndex={indexes?.['1']}
            />

        </div>
    )
}

export default TestimonyManager