import { useDispatch } from "react-redux"
import ContentSection from "../breakUI/ContentSections"
import MultiSelectPro from "../breakUI/MultiSelectPro"
import { updateAllProjectlisting } from "../../../common/homeContentSlice"
import FileUploader from "../../../../components/Input/InputFileUploader"

import { useEffect, useState } from "react";
import MultiSelect from "../breakUI/MultiSelect";
import { updateMainContent } from "../../../common/homeContentSlice";
import content from "../websiteComponent/content.json"
import { getResources } from "../../../../app/fetch"


const ProjectManager = ({ currentPath, currentContent, language, indexes }) => {

    const [all, setAll] = useState([])
    const [ongoing, setOngoing] = useState([])
    const [completed, setCompleted] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        async function getOptionsForServices() {
            const query = {
                resourceType: "SUB_PAGE",
                resourceTag: "PROJECT",
                fetchType: "CONTENT",
                apiCallType: "INTERNAL"
            };

            const filters = [
                { key: "ALL", setter: setAll },
                { key: "ONGOING", setter: setOngoing },
                { key: "COMPLETE", setter: setCompleted }
            ];

            const mapResources = (resources) =>
                resources?.map((e, i) => ({
                    id: e.id,
                    order: i + 1,
                    slug: e.slug,
                    titleEn: e.titleEn,
                    titleAr: e.titleAr,
                    icon: e.liveModeVersionData?.icon,
                    image: e.liveModeVersionData?.image,
                    location: e.liveModeVersionData?.sections?.[1]?.content?.[0]?.value
                }));

            const responses = await Promise.all(
                filters.map(({ key }) => getResources({ ...query, filterText: key }))
            );

            responses.forEach((response, index) => {
                if (response.ok) {
                    const options = mapResources(response?.resources?.resources);
                    filters[index].setter(options);
                }
            });
        }

        getOptionsForServices();
    }, []);

    useEffect(() => {
        return () => dispatch(updateMainContent({ currentPath: "content", payload: undefined }))
    }, [])

    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"projectReference"} label={"Rerference doc"} fileName={"Upload your file..."} />
            {/** Hero Banner */}
            <ContentSection
                currentPath={currentPath}
                Heading={"Banner"}
                inputs={[
                    { input: "input", label: "Heading/title", updateType: "title", value: currentContent?.['1']?.content?.title?.[language] },
                    { input: "textarea", label: "Description", updateType: "description", maxLength: 300, value: currentContent?.['1']?.content?.description?.[language] },
                    { input: "input", label: "Button Text", updateType: "button", value: currentContent?.['1']?.content?.button?.[0]?.text?.[language] }
                ]}
                inputFiles={[{ label: "Backround Image", id: "projectsBanner", order: 1, url: currentContent?.['1']?.content?.images?.[0]?.url }]}
                section={"bannerSection"}
                language={language}
                currentContent={currentContent}
                sectionIndex={indexes?.["1"]}

            />

            <div className="py-2 pt-6">
                <h1 className="font-semibold text-[1.25rem] mb-4">Projects</h1>
                {
                    currentContent?.['2']?.sections?.map((element, index, a) => {
                        const heading = { 0: { name: "All Lists", list: all }, 1: { name: "Ongoing Lists", list: ongoing }, 2: { name: "Completed Lists", list: completed } }

                        const lastIndex = index === a.length - 1
                        return (
                            <div key={index}>
                                <h3 className="mt-3 text-sm">
                                    {heading[index].name}
                                </h3>
                                <MultiSelectPro
                                    options={element?.items}
                                    listOptions={heading?.[index]?.list}
                                    currentPath={currentPath}
                                    section={"projects"}
                                    language={language}
                                    label={element.title.en}
                                    id={element.id}
                                    tabName={"Select Projects"}
                                    referenceOriginal={{ dir: "project/main", index: index }}
                                    currentContent={currentContent}
                                    sectionIndex={indexes?.["2"]}
                                    bottomBorder={lastIndex}
                                />
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default ProjectManager