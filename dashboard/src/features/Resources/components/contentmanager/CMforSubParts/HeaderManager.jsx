import { useDispatch } from "react-redux";
import FileUploader from "../../../../../components/Input/InputFileUploader"
import ContentSection from "../../breakUI/ContentSections"
import DynamicContentSection from "../../breakUI/DynamicContentSection"
import { updateCardAndItemsArray } from "../../../../common/homeContentSlice";
import Select from "../../../../../components/Input/Select";
import { useEffect, useState } from "react";
import { getResources } from "../../../../../app/fetch";

const HeaderManager = ({ language, currentContent, currentPath, indexes, outOfEditing }) => {
    const dispatch = useDispatch();
    const [list, setLists] = useState([])
    console.log(list)
    const listName = {}

    list.forEach((e, i) => {
        listName[e.id] = e
    })

    const addNav = (name, value) => {
        dispatch(updateCardAndItemsArray({
            sectionIndex: 0,
            operation: 'add',
            insert: {
                nav: {
                    ar: listName[value].nameAr,
                    en: listName[value].nameEn
                },
                url: listName[value].slug,
            }
        }))
    }


    useEffect(() => {
        async function getRouteList() {
            try { //resourceType=MAIN_PAGE&fetchType=SLUG
                const response = await getResources({ resourceType: "MAIN_PAGE", fetchType: "SLUG" })
                if (response.ok) {
                    const payload = response.resources.resources.map(e => {
                        if (e.resourceTag === "HOME") { return null }
                        return { ...e, id: e.nameEn }
                    }).filter(Boolean)
                    setLists(payload)
                }
            } catch (err) {

            }
        }
        getRouteList()
    }, [])
    // let contents
    // if (currentContent) {
    //     contents = Object.keys(currentContent)
    // }
    return (
        <div className="w-full">
            {/* reference doc */}
            <FileUploader id={"headerReference"} label={"Rerference doc"} fileName={"Upload your file..."} outOfEditing={outOfEditing} />

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
                outOfEditing={outOfEditing}
            />

            {currentContent?.['1']?.content?.map((section, i, a) => {
                const moreThanFive = i > 0
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
                            outOfEditing={outOfEditing}
                        />

                    </div>
                )
            })}
            {/* <button className="text-blue-500 cursor-pointer mb-3" onClick={() => addNav()}>Add More Section...</button> */}

            {/* <ContentSection
                currentPath={currentPath}
                Heading={"Page - Details"}
                inputs={[
                    ...(context?.id === "N" ? [{ input: "select", label: "Add new navigation", updateType: "", option: serviceParents }] : [])
                ]}
                section={"page-details"}
                language={language}
                outOfEditing={outOfEditing}
            /> */}
            <Select
                options={list}
                label={"create a new navigation"}
                baseClass={"w-full mt-10"}
                width={"w-full"}
                value={""}
                setterOnChange={addNav}
                language={language}
                optionsClass={`dark:bg-white text-black`}
                selectClass={`bg-white dark:bg-[#2a303c] border border-[#80808044] `}
            />
        </div>
    )
}

export default HeaderManager