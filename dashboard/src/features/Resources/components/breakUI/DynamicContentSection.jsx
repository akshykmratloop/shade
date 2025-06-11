// libraries
import { useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import JoditEditor, { Jodit } from "jodit-react";
// custom module
import TextAreaInput from "../../../../components/Input/TextAreaInput";
import InputFile from "../../../../components/Input/InputFile";
import InputText from "../../../../components/Input/InputText";
import { updateSpecificContent, updateServicesNumber, updateImages, updateTheProjectSummaryList, updateCardAndItemsArray, updatePoliciesItems, updateSubServiceDetailsPointsArray } from "../../../common/homeContentSlice";
import InputFileForm from "../../../../components/Input/InputFileForm";

const DynamicContentSection = ({
    Heading,
    subHeading,
    inputs = [],
    inputFiles = [],
    isBorder = true,
    currentPath,
    section,
    language,
    subSection,
    index,
    allowRemoval = false, // New prop to allow extra input
    allowExtraInput = false, // New prop to allow extra input
    attachOne = false,
    projectId,
    deepPath,
    type,
    sectionIndex,
    contentIndex,
    outOfEditing
}) => {
    const dispatch = useDispatch();
    const [extraFiles, setExtraFiles] = useState([]);
    const ImagesFromRedux = useSelector((state) => state.homeContent.present.images)

    const addExtraFileInput = () => {
        if (section === 'socialIcons') {
            if (ImagesFromRedux.socialIcons.length < 8) {
                dispatch(updateImages({ src: [...ImagesFromRedux.socialIcons, { img: "", url: "", id: ImagesFromRedux.socialIcons.length + 1 }], section: "socialIcons" }))
                dispatch(updateImages({ src: [...ImagesFromRedux.socialIcons, { img: "", url: "", id: ImagesFromRedux.socialIcons.length + 1 }], section: "socialIcons" }))
            }
        }
        setExtraFiles([...extraFiles, { label: `Extra File ${extraFiles.length + 1}`, id: `extraFile${extraFiles.length + 1}` }]);
    };
    const editor = useRef(null);

    const removeExtraFileInput = (id) => {
        setExtraFiles(extraFiles.filter(file => file.id !== id));
    };


    const removeSummary = (index) => {
        if (section === "points" || section === "cards") {
            return dispatch(updateSubServiceDetailsPointsArray({
                sectionIndex,
                index,
                section
            }))
        }
        if (section === 'procedures/terms') {
            return dispatch(updatePoliciesItems({
                sectionIndex,
                index
            }))
        }
        if (deepPath) {
            dispatch(updateTheProjectSummaryList({
                index,
                operation: 'remove',
                // newsIndex: projectId - 1,
                context: currentPath,
                serviceId: projectId,
                subContext: section,
                deepPath
            }))
        } else if (projectId) {
            dispatch(updateTheProjectSummaryList({
                index,
                projectId,
                operation: 'remove',
                context: currentPath
            }))
        } else {
            dispatch(updateCardAndItemsArray({
                sectionIndex,
                operation: 'remove',
                index
            }))
        }
    }

    const updateFormValue = ({updateType, value}) => {
        if (updateType === 'count') {
            if (!isNaN(value)) {
                let val = value?.slice(0, 7);
                dispatch(updateServicesNumber({ section, title: updateType, value: val, subSection, index, currentPath, sectionIndex }));
            }
        } else {
            dispatch(updateSpecificContent({
                section,
                title: updateType,
                lan: language,
                value: value === "" ? "" : value,
                subSection,
                index,
                currentPath,
                projectId,
                deepPath,
                type,
                sectionIndex,
                contentIndex,
                // path,
                buttonIndex: index
            }));
        }
    };

    const updateFormValueRichText = ({ updateType, value }) => {

        if (updateType === 'count') {
            if (!isNaN(value)) {
                let val = value?.slice(0, 7);
                dispatch(updateServicesNumber({ section, title: updateType, value: val, subSection, index, currentPath, sectionIndex }));
            }
        } else {
            dispatch(updateSpecificContent({
                section,
                title: updateType,
                lan: language,
                value: value === "" ? "" : value,
                subSection,
                index,
                currentPath,
                projectId,
                deepPath,
                type: "content[index]",
                sectionIndex,
                contentIndex,
            }));
        }
    };

    const config = useMemo(() => ({
        buttons: [
            "bold", "italic", "underline", "strikethrough", "|",
            "font",
            //  "fontsize",
            "lineHeight", "|", "eraser", "image", "ul"
        ],
        buttonsXS: [
            "bold", "italic", "underline", "strikethrough", "|",
            "font",
            //  "fontsize",
            "lineHeight", "|", "eraser", "ul"
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
        <div className={`w-full relative ${Heading ? "mt-4" : subHeading ? "mt-2" : ""} flex flex-col gap-1 ${!isBorder ? "" : "border-b border-b-1 border-neutral-300"} ${attachOne ? "pb-0" : (Heading || subHeading) ? "pb-6" : ""}`}
            style={{ wordBreak: "break-word" }}>
            {(allowRemoval && !outOfEditing) && <button
                className="absolute top-6 z-10 right-[-8px] bg-red-500 text-white px-[5px] rounded-full shadow"
                onClick={() => { removeSummary(index) }}
            >
                ✖
            </button>}
            <h3 className={`font-semibold ${subHeading ? "text-[.9rem] mb-1" : Heading ? "text-[1.25rem] mb-4" : " mb-0"}`}>{Heading || subHeading}</h3>
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
                                    ref={editor}
                                    value={input.value}
                                    config={config}
                                    onChange={(newContent) => {
                                        const trimmedVal = newContent.slice(0, input.maxLength);
                                        updateFormValueRichText(input.updateType, trimmedVal)
                                    }}
                                    onBlur={(newContent) => {
                                        const trimmedVal = newContent.slice(0, input.maxLength);
                                        updateFormValueRichText(input.updateType, trimmedVal)
                                    }}
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
                                updateFormValue={updateFormValue}
                                updateType={input.updateType}
                                section={section}
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
                                        />
                                    )
                                })}
                                {allowExtraInput &&
                                    <button
                                        className="mt-2 px-3 py-2 bg-blue-500 h-[95px] w-[95px] text-white rounded-lg translate-y-3 self-center text-xl"
                                        onClick={addExtraFileInput}
                                    >
                                        +
                                    </button>
                                }
                            </div>
                        </div>
                        : <div className={`flex ${inputFiles.length > 1 ? "flex-wrap" : "flex-wrap"} gap-10 w-[80%]`}>

                            {inputFiles.map((file, index) => (
                                <InputFile
                                    key={index}
                                    label={file.label}
                                    id={file.id}
                                    currentPath={currentPath}
                                    fileIndex={index}
                                    section={section}
                                />
                            ))}
                            {extraFiles.map((file, index) => (
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
                                    />
                                </div>
                            ))}
                            {
                                section === 'socialIcons' ? ImagesFromRedux?.socialIcons?.length < 8 ?
                                    <button
                                        className="mt-2 px-3 py-2 bg-blue-500 h-[95px] w-[95px] text-white rounded-lg translate-y-3 self-center text-xl"
                                        onClick={addExtraFileInput}
                                    >
                                        +
                                    </button> : "" :
                                    allowExtraInput &&
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

export default DynamicContentSection;