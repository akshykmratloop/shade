import { useMemo, useRef, useState } from "react";
import InputFile from "../../../../components/Input/InputFile";
import InputText from "../../../../components/Input/InputText";
import TextAreaInput from "../../../../components/Input/TextAreaInput";
import { useDispatch, useSelector } from "react-redux";
import { updateSpecificContent, updateServicesNumber, updateImages, updateAList, addImageArray, rmImageArray, addImagePointArray, rmImagePointArray, updateSubServiceDetailsPointsArray, updateAffiliatesCardsArray, updateBaseData, updateFilterStatus } from "../../../common/homeContentSlice";
import InputFileForm from "../../../../components/Input/InputFileForm";
import JoditEditor from "jodit-react";
import { Jodit } from "jodit-react";
import Select from "../../../../components/Input/Select"

const skeleton = {
    socialLinks: {
        url: "", icon: ""
    },
    images: {
        url: "", altText: { en: "", ar: "" }
    },
    affiliates: {
        images: [
            {
                url: "",
                order: 1,
                altText: {
                    ar: "",
                    en: ""
                }
            }
        ]
    }
}

const ContentSection = ({
    Heading,
    subHeading,
    inputs = [],
    inputFiles = [],
    isBorder = true,
    currentPath,
    section,
    language,
    subSection,
    subSectionsProMax,
    index,
    subSecIndex,
    currentContent,
    allowExtraInput = false, // New prop to allow extra input
    attachOne = false,
    projectId,
    careerId,
    deepPath,
    sectionIndex,
    contentIndex,
    resourceId,
    ref,
    elementId,
    outOfEditing,
    directIcon,
}) => {
    const dispatch = useDispatch();
    const ImagesFromRedux = useSelector((state) => state.homeContent.present.images)

    const editor = useRef(null);


    const addExtraFileInput = () => {
        if (section === "pointsp") {
            dispatch(addImagePointArray({
                src: skeleton['images'],
                sectionIndex,
                section
            }))
        } else if (section === "affiliates") {
            dispatch(updateAffiliatesCardsArray({
                src: skeleton['affiliates'],
                sectionIndex,
                section: "cards",
                operation: "add"
            }))
        } else {
            dispatch(addImageArray({
                src: skeleton[section],
                sectionIndex,
                section
            }))
        }
    };

    const removeExtraFileInput = (order) => {
        if (section === "pointsp") {
            dispatch(rmImagePointArray({ sectionIndex, order, section }))
        } else if (section === "affiliates") {
            dispatch(updateAffiliatesCardsArray({
                sectionIndex,
                section: "cards",
                order
            }))
        } else {
            dispatch(rmImageArray({ sectionIndex, order, section }))
        }
    };

    const updateFormValue = (updateType, value, path, buttonIndex) => {
        if (section === "page-details") {
            if (updateType === "filter") {
                dispatch(updateFilterStatus({
                    value: value
                }))
            } else {
                dispatch(updateBaseData({
                    title: updateType,
                    value: value
                }))
            }
        } else if (updateType === 'count') {
            if (!isNaN(value)) {
                let val = value?.slice(0, 7);
                dispatch(updateServicesNumber({
                    section,
                    title: updateType,
                    value: val,
                    subSection,
                    index,
                    currentPath,
                    sectionIndex
                }));
            }
        } else if (updateType === 'url') {
            dispatch(updateSpecificContent({
                section,
                title: "link",
                lan: "url",
                value,
                subSection,
                index,
                currentPath,
                sectionIndex
            }));
        } else if (updateType === 'url/text') {
            dispatch(updateSpecificContent({
                section,
                title: "link",
                lan: "text",
                value,
                subSection,
                index,
                currentPath,
                sectionIndex
            }));
        } else {
            dispatch(updateSpecificContent({
                section,
                title: updateType,
                lan: language,
                value: value === "" ? "" : value,
                subSection,
                index,
                subSectionsProMax,
                subSecIndex,
                currentPath,
                projectId,
                careerId,
                deepPath,
                sectionIndex,
                contentIndex,
                path,
                buttonIndex
            }));
        }
    };

    const updateFormValueRichText = (updateType, value) => {
        if (updateType === 'count') {
            if (!isNaN(value)) {
                let val = value?.slice(0, 7);
                dispatch(updateServicesNumber({
                    section,
                    title: updateType,
                    value: val,
                    subSection,
                    index,
                    currentPath,
                    sectionIndex
                }));
            }
        } else {
            dispatch(updateSpecificContent({
                section,
                title: updateType,
                lan: language,
                value: value === "" ? "" : value,
                subSection,
                index,
                subSectionsProMax,
                subSecIndex,
                currentPath,
                projectId,
                careerId,
                deepPath,
                sectionIndex,
                contentIndex
                // type
            }));
        }
    };

    const config = useMemo(() => ({
        buttons: [
            "bold", "italic", "underline", "strikethrough", "|",
            "font", "lineHeight", "|", "eraser", "image", "ul"
        ],
        buttonsXS: [
            "bold", "italic", "underline", "strikethrough", "|",
            "font", "lineHeight", "|", "eraser", "ul"
        ],
        toolbarAdaptive: false,
        toolbarSticky: false,
        removeButtons: [
            "source", "ol", "indent", "outdent", "paragraph", "video", "table", "link", "unlink",
            "align", "undo", "redo", "hr", "fullsize",
            "copyformat", "selectall", "cut", "copy", "paste"
        ],
        showPlaceholder: false,
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        showEmptyParagraph: false,
        allowEmptyTags: false,
        useSplitMode: false,
        showButtonPanel: true,
        showTooltip: false,

        controls: {
            font: {
                list: {
                    'Arial': 'Arial',
                    'Verdana': 'Verdana',
                    'Tahoma': 'Tahoma',
                    // 'BankGothic-Regular': 'BankGothic-Regular',
                    // 'BankGothic-Regular-db': 'BankGothic-Regular-db',
                    // 'BankGothic-Russ-Medium': 'BankGothic-Russ-Medium',
                    // 'BankGothic-Regular-MD-Bt': 'BankGothic-Regular-MD-Bt',
                    'BankGothic-Medium-bt': 'BankGothic-Medium-bt',
                    'BankGothic-Medium-lt': 'BankGothic-Medium-lt'
                }
            },
            fontsize: {
                list: Jodit.atom([8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34])
            },
            lineHeight: {
                list: Jodit.atom(['1', '1.5', '2', '2.5', '2.7', '3', '3.25', '3.5', '4'])
            }
        },

        disablePlugins: ['addNewLine']
    }), [outOfEditing]);



    return (
        <div
            id={elementId}
            className={`w-full ${Heading ? "mt-4" : subHeading ? "mt-2" : ""} flex flex-col gap-1 ${!isBorder ? "" : "border-b border-b-1 border-neutral-300"} ${attachOne ? "pb-0" : (Heading || subHeading) ? "pb-3" : ""}`}>
            <h3 className={`font-semibold ${subHeading ? "text-[.9rem] mb-1" : Heading ? "text-[1.25rem] mb-4" : " mb-0"}`} style={{ wordBreak: "break-word" }}>{Heading || subHeading}</h3>
            {inputs.length > 0 &&
                inputs.map((input, i) => {
                    if (input.input === "textarea") {
                        return (
                            <TextAreaInput
                                key={i}
                                labelTitle={input.label}
                                labelStyle="block sm:text-xs xl:text-sm"
                                updateFormValue={({ updateType, value, path }) => updateFormValue(updateType, value, path, input.index)}
                                updateType={input.updateType}
                                section={section}
                                defaultValue={input.value || ""}
                                language={language}
                                id={input.updateType}
                                maxLength={input.maxLength}
                                outOfEditing={outOfEditing}
                            />
                        );
                    } else if (input.input === "select") {
                        return (
                            <Select
                                key={i}
                                label={input.label}
                                options={input.option}
                                labelClass="block sm:text-xs xl:text-sm text-[#6B7888]"
                                width={"w-full"}
                                baseClass={"outline-none border-none py-2"}
                                selectClass={"outline-none border border-stone-300 dark:border-[#3f444f] dark:bg-[#2A303C] bg-white"}
                                optionsClass={"dark:bg-[#242933]"}
                                setterOnChange={(updateType, value) => updateFormValue(updateType, value, input.index)}
                                field={input.updateType}
                                language={language}
                            // outOfEditing={outOfEditing}
                            />
                        );
                    } else if (input.input === "richtext") {
                        return (
                            <div dir={language === 'en' ? 'ltr' : 'rtl'} key={outOfEditing ? "readonly" : "editable"}
                                style={{ cursor: "" }}
                                className={`relative`}>
                                {
                                    outOfEditing &&
                                    <div className="bg-stone-200/35 absolute z-10 top-0 left-0 h-full w-full rounded-md cursor-not-allowed"></div>
                                }
                                <JoditEditor
                                    className=""
                                    ref={editor}
                                    value={input.value}
                                    config={config}
                                    onChange={(newContent) => {
                                        const trimmedVal = newContent.slice(0, input.maxLength);
                                        updateFormValueRichText(input.updateType, trimmedVal)
                                    }}
                                // onBlur={(newContent) => {
                                //     const trimmedVal = newContent.slice(0, input.maxLength);
                                //     updateFormValueRichText(input.updateType, trimmedVal)
                                // }}
                                />
                            </div>
                        );
                    } else {
                        return (
                            <InputText
                                key={i}
                                InputClasses="h-[2.125rem]"
                                labelTitle={input.label}
                                labelStyle="block sm:text-xs xl:text-sm"
                                updateFormValue={({ updateType, value, path }) => updateFormValue(updateType, value, path, input.index)}
                                updateType={input.updateType}
                                // section={section}
                                defaultValue={input.value || ""}
                                language={language}
                                id={input.updateType}
                                required={false}
                                maxLength={input.maxLength}
                                outOfEditing={outOfEditing}
                                dir={input.dir}
                                disabled={input.disable}
                            />
                        );
                    }
                })
            }


            <div className={`flex ${inputFiles.length > 1 ? "justify-center" : ""}`}>
                {
                    section === 'socialLinks' ?
                        <div>
                            <div className={`flex ${inputFiles.length > 1 ? "flex-wrap" : ""} gap-10 w-[100%] relative`}>
                                {inputFiles.map((file, index) => {
                                    let allowClose = index > 3
                                    return (
                                        <InputFileForm
                                            key={index}
                                            label={file.label}
                                            id={file.id}
                                            currentPath={currentPath}
                                            fileIndex={index}
                                            section={section}
                                            isCloseButton={allowClose}
                                            resourceId={resourceId}
                                            sectionIndex={sectionIndex}
                                            index={index}
                                            outOfEditing={outOfEditing}
                                            textValue={file.value}
                                            url={file.url}
                                            order={file.order}
                                        />
                                    )
                                })}
                                {
                                    (allowExtraInput && inputFiles?.length < 8) &&
                                    < button
                                        className="mt-2 px-3 py-2 bg-blue-500 h-[95px] w-[95px] text-white rounded-lg translate-y-3 self-center text-xl"
                                        onClick={outOfEditing ? () => { } : addExtraFileInput}
                                    >
                                        +
                                    </button>
                                }
                            </div>
                        </div>
                        : <div className={`flex ${inputFiles.length > 1 ? "flex-wrap" : ""} gap-10 w-[80%]`}>
                            {inputFiles.map((file, i) => {
                                return (
                                    <div className="relative" key={file.id}>
                                        {i > 3 && <button
                                            className={`absolute top-6 z-[22] right-[-12px] bg-red-500 text-white px-[5px] rounded-full shadow ${outOfEditing && "cursor-not-allowed"}`}
                                            onClick={() => { if (!outOfEditing) { removeExtraFileInput(file.order) } }}
                                        >
                                            ✖
                                        </button>}

                                        <InputFile
                                            label={file.label}
                                            id={file.id}
                                            currentPath={currentPath}
                                            fileIndex={i}
                                            section={section}
                                            index={section === "clientsImages" ? i : index}
                                            subSection={subSection}
                                            resourceId={resourceId}
                                            contentIndex={sectionIndex}
                                            outOfEditing={outOfEditing}
                                            directIcon={file.directIcon}
                                            order={file.order}
                                            url={file.url}
                                            textValue={file.value}
                                            type={file.type}
                                            name={file.name}
                                        />
                                    </div>
                                )
                            })}

                            {
                                section === 'socialLinks' ? ImagesFromRedux?.socialIcons?.length < 8 ?
                                    <button
                                        className="mt-2 px-3 py-2 bg-blue-500 h-[95px] w-[95px] text-white rounded-lg translate-y-3 self-center text-xl"
                                        onClick={addExtraFileInput}
                                    >
                                        +
                                    </button> : "" :
                                    (allowExtraInput && !outOfEditing) &&
                                    <button
                                        className="mt-2 px-3 py-2 bg-blue-500 h-[95px] w-[95px] text-white rounded-lg translate-y-3 self-center text-xl"
                                        onClick={addExtraFileInput}
                                    >
                                        +
                                    </button>
                            }
                        </div>
                }
            </div>
        </div >
    );
};

export default ContentSection;