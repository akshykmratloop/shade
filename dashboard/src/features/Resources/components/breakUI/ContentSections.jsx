import { useMemo, useRef, useState } from "react";
import InputFile from "../../../../components/Input/InputFile";
import InputText from "../../../../components/Input/InputText";
import TextAreaInput from "../../../../components/Input/TextAreaInput";
import { useDispatch, useSelector } from "react-redux";
import { updateSpecificContent, updateServicesNumber, updateImages, updateAList, addImageArray, rmImageArray } from "../../../common/homeContentSlice";
import InputFileForm from "../../../../components/Input/InputFileForm";
import JoditEditor from "jodit-react";
import { Jodit } from "jodit-react";

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
    outOfEditing
}) => {
    const dispatch = useDispatch();
    // const [extraFiles, setExtraFiles] = useState([]);
    const ImagesFromRedux = useSelector((state) => state.homeContent.present.images)

    const editor = useRef(null);


    const addExtraFileInput = () => {
        dispatch(addImageArray({
            src: {
                url: "", altText: { en: "", ar: "" }
            },
            sectionIndex
        }))
        // if (deepPath) {
        //     dispatch(updateImages({ src: { url: "" }, section, currentPath, deepPath, projectId, operation: "add" }))
        // } else if (section === 'socialIcons') {
        //     if (ImagesFromRedux.socialIcons.length < 8) {
        //         dispatch(updateImages({ src: [...ImagesFromRedux.socialIcons, { img: "", url: "", id: ImagesFromRedux.socialIcons.length + 1 }], section: "socialIcons" }))
        //         dispatch(updateImages({ src: [...ImagesFromRedux.socialIcons, { img: "", url: "", id: ImagesFromRedux.socialIcons.length + 1 }], section: "socialIcons" }))
        //     }
        // } else if (section === 'gallerySection') {
        //     dispatch(updateImages({
        //         src: { url: "", alt: { en: "", ar: "" } },
        //         updateType: section,
        //         projectId,
        //         operation: 'add'
        //     }))
        // } else {
        //     dispatch(updateAList({
        //         data: { alt: { ar: "", en: "" }, image: [""] },
        //         index: sectionIndex,
        //         operation: "add"
        //     }))
        // }
    };

    const removeExtraFileInput = (order) => {
        dispatch(rmImageArray({ sectionIndex, order }))

        // if (section === 'gallerySection' || deepPath) {
        //     dispatch(updateImages({
        //         src: id,
        //         updateType: section,
        //         projectId,
        //         deepPath,
        //         currentPath,
        //         section,
        //         operation: 'remove'
        //     }))
        // } else {
        //     console.log(id)
        //     dispatch(updateAList({
        //         data: id,
        //         index: sectionIndex,
        //         operation: "remove"
        //     }))
        // }
    };

    const updateFormValue = (updateType, value, path, buttonIndex) => {
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
                sectionIndex
                // type
            }));
        }
    };

    const config = useMemo(() => ({
        buttons: [
            "bold", "italic", "underline", "strikethrough", "|",
            "font", "fontsize", "lineHeight", "|", "eraser", "image", "ul"
        ],
        buttonsXS: [
            "bold", "italic", "underline", "strikethrough", "|",
            "font", "fontsize", "lineHeight", "|",
            "eraser", "ul"
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
            fontsize: {
                list: Jodit.atom([8, 9, 10, 12, 14, 16, 18, 24, 30, 32, 34])
            }
        },


        // 👇 Disable the plus "+" hover icon
        disablePlugins: ['addNewLine']
    }), [outOfEditing]);


    return (
        <div
            id={elementId}
            className={`w-full ${Heading ? "mt-4" : subHeading ? "mt-2" : ""} flex flex-col gap-1 ${!isBorder ? "" : "border-b border-b-1 border-neutral-300"} ${attachOne ? "pb-0" : (Heading || subHeading) ? "pb-6" : ""}`}>
            <h3 className={`font-semibold ${subHeading ? "text-[.9rem] mb-1" : Heading ? "text-[1.25rem] mb-4" : " mb-0"}`} style={{ wordBreak: "break-word" }}>{Heading || subHeading}</h3>
            {inputs.length > 0 &&
                inputs.map((input, i) => {
                    if (input.input === "textarea") {
                        return (
                            <TextAreaInput
                                key={i}
                                labelTitle={input.label}
                                labelStyle="block sm:text-xs xl:text-sm"
                                updateFormValue={updateFormValue}
                                updateType={input.updateType}
                                section={section}
                                defaultValue={input.value || ""}
                                language={language}
                                id={input.updateType}
                                maxLength={input.maxLength}
                                outOfEditing={outOfEditing}
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
                            />
                        );
                    }
                })
            }


            <div className={`flex ${inputFiles.length > 1 ? "justify-center" : ""}`}>
                {
                    section === 'socialIcons' ?
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
                                            contentIndex={sectionIndex}
                                            outOfEditing={outOfEditing}
                                        />
                                    )
                                })}
                                {allowExtraInput &&
                                    <button
                                        className="mt-2 px-3 py-2 bg-blue-500 h-[95px] w-[95px] text-white rounded-lg translate-y-3 self-center text-xl"
                                        onClick={outOfEditing ? addExtraFileInput : () => { }}
                                    >
                                        +
                                    </button>
                                }
                            </div>
                        </div>
                        : <div className={`flex ${inputFiles.length > 1 ? "flex-wrap" : ""} gap-10 w-[80%]`}>
                            {inputFiles.map((file, i) => {
                                return (
                                    <div className="relative" key={i}>
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
                                            index={section === "clientSection" ? i : index}
                                            subSection={subSection}
                                            resourceId={resourceId}
                                            contentIndex={sectionIndex}
                                            outOfEditing={outOfEditing}
                                            directIcon={file.directIcon}
                                            order={file.order}
                                        />
                                    </div>
                                )
                            })}
                            {/* {extraFiles.map((file, index) => (
                                <div key={index} className="relative flex items-center justify-center">
                                    <button
                                        className="absolute top-6 z-10 right-[-8px] bg-red-500 text-white px-1 rounded-full shadow"
                                        onClick={() => removeExtraFileInput(file.id)}
                                    >
                                        ✖
                                    </button>
                                    <InputFile
                                        label={file.label}
                                        id={file.id}
                                        currentPath={currentPath}
                                        section={section}
                                        fileIndex={index}
                                        resourceId={resourceId}
                                        contentIndex={contentIndex}
                                    />
                                </div>
                            ))} */}
                            {
                                section === 'socialIcons' ? ImagesFromRedux?.socialIcons?.length < 8 ?
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
        </div>
    );
};

export default ContentSection;