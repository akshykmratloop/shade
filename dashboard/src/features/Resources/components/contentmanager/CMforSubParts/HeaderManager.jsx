import { useDispatch } from "react-redux";
import FileUploader from "../../../../../components/Input/InputFileUploader"
import ContentSection from "../../breakUI/ContentSections"
import DynamicContentSection from "../../breakUI/DynamicContentSection"
import { updateCardAndItemsArray } from "../../../../common/homeContentSlice";

const HeaderManager = ({ language, currentContent, currentPath, indexes }) => {
    const dispatch = useDispatch();

    const addNav = () => {

        dispatch(updateCardAndItemsArray({
            sectionIndex: 0,
            operation: 'add',
            insert: {
                nav: {
                    ar: "",
                    en: ""
                },
                url: "",
            }
        }))
    }


    // let contents
    // if (currentContent) {
    //     contents = Object.keys(currentContent)
    // }
    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"headerReference"} label={"Rerference doc"} fileName={"Upload your file..."} />

            <ContentSection
                currentPath={currentPath}
                Heading={"Extra Keys"}
                inputs={[
                    { input: "input", label: "Button", updateType: "contact", maxLength: 10, value: currentContent?.['2']?.content?.contact?.[language] },
                    { input: "input", label: "Extra Key", updateType: "extraKey", value: currentContent?.['2']?.content?.extraKey?.[language] },
                ]}
                section={"Extra Key"}
                language={language}
                currentContent={currentContent}
                isBorder={false}
                sectionIndex={indexes?.['2']}
            />

            {currentContent?.['1']?.content?.map((section, i, a) => {
                const moreThanFive = i > 4
                const isContactButton = section.type === "contact"
                return (
                    <div key={i}>
                        <DynamicContentSection
                            currentPath={currentPath}
                            subHeading={"Section " + (i + 1)}
                            inputs={[
                                { input: "input", label: "Name", updateType: "nav", maxLength: 10, value: section.nav?.[language] },
                                { input: "input", label: "Url", updateType: "url", value: section.url, dir: "ltr" },
                            ]}
                            section={section}
                            language={language}
                            currentContent={currentContent}
                            isBorder={false}
                            attachOne={true}
                            contentIndex={i}
                            index={i}
                            sectionIndex={indexes?.['1']}
                            allowRemoval={moreThanFive && !isContactButton}
                            type={"content[index]"}
                        />

                    </div>
                )
            })}
            <button className="text-blue-500 cursor-pointer mb-3" onClick={() => addNav()}>Add More Section...</button>
        </div>
    )
}

export default HeaderManager