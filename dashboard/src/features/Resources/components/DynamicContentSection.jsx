import { useState, useRef, useMemo } from "react";
import InputFile from "../../../components/Input/InputFile";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import { useDispatch, useSelector } from "react-redux";
import { updateSpecificContent, updateServicesNumber, updateImages, updateTheProjectSummaryList, updateWhatWeDoList } from "../../common/homeContentSlice";
import InputFileWithText from "../../../components/Input/InputFileText";
import InputFileForm from "../../../components/Input/InputFileForm";
// import ReactQuill from "react-quill";
import JoditEditor from "jodit-react";

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
    subSectionsProMax,
    index,
    subSecIndex,
    currentContent,
    allowExtraInput = false, // New prop to allow extra input
    attachOne = false,
    projectId,
    type
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
        if (projectId) {
            dispatch(updateTheProjectSummaryList({
                index,
                projectId,
                operation: 'remove'
            }))
        } else {
            dispatch(updateWhatWeDoList({
                index,
                operation: 'remove',
                section
            }))
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        if (updateType === 'count') {
            if (!isNaN(value)) {
                let val = value?.slice(0, 7);
                dispatch(updateServicesNumber({ section, title: updateType, value: val, subSection, index, currentPath }));
            }
        } else {
            dispatch(updateSpecificContent({ section, title: updateType, lan: language, value: value === "" ? "" : value, subSection, index, subSectionsProMax, subSecIndex, currentPath, projectId, type }));
        }
    };

    const updateFormValueRichText = (updateType, value) => {
        // console.log(`Updating field (ReactQuill): ${updateType}, Value:`, value);

        if (updateType === 'count') {
            if (!isNaN(value)) {
                let val = value?.slice(0, 7);
                dispatch(updateServicesNumber({ section, title: updateType, value: val, subSection, index, currentPath }));
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
                type
            }));
        }
    };

    const modules = {
        toolbar: [
            [{ color: [] }, { background: [] }], ,
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            // [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ['clean'] // Remove formatting
        ],
    };

    const config = useMemo(() => ({
        buttons: [
            "bold", "italic", "underline", "strikethrough", "|",
            "font", "fontsize", "lineHeight", "|",
            "brush", "eraser", "image"
        ],
        buttonsXS: [
            "bold", "italic", "underline", "strikethrough", "|",
            "font", "fontsize", "lineHeight", "|",
            "brush", "eraser"
        ],
        toolbarAdaptive: false, // Disables toolbar auto-resizing
        toolbarSticky: false, // Prevents the toolbar from sticking when scrolling
        removeButtons: [
            "source", "ul", "ol", "indent", "outdent", "paragraph", "video", "table", "link", "unlink",
            "align", "undo", "redo", "hr", "fullsize",
            "copyformat", "selectall", "cut", "copy", "paste"
        ],
        showPlaceholder: false, // Hides placeholder text
        showCharsCounter: false, // Hides character counter
        showWordsCounter: false, // Hides word counter
        showXPathInStatusbar: false, // Hides path at the bottom
    }), []);


    return (
        <div className={`w-full relative ${Heading ? "mt-4" : subHeading ? "mt-2" : ""} flex flex-col gap-1 ${!isBorder ? "" : "border-b border-b-1 border-neutral-300"} ${attachOne ? "pb-0" : (Heading || subHeading) ? "pb-6" : ""}`}>
            <button
                className="absolute top-6 z-10 right-[-8px] bg-red-500 text-white px-[5px] rounded-full shadow"
                onClick={() => { removeSummary(index) }}
            >
                ✖
            </button>
            <h3 className={`font-semibold ${subHeading ? "text-[.9rem] mb-1" : Heading ? "text-[1.25rem] mb-4" : " mb-0"}`}>{Heading || subHeading}</h3>
            {inputs.length > 0 &&
                inputs.map((input, i) => {
                    let valueExpression;
                    if (projectId) {
                        if (subSection) {
                            valueExpression = currentContent?.[projectId - 1]?.[section]?.[subSection]?.[index]?.[input.updateType]?.[language];
                        } else if (input.updateType === 'url') {
                            valueExpression = currentContent?.[projectId - 1]?.[section]?.[input.updateType];
                        } else if (section === 'descriptionSection') {
                            valueExpression = currentContent?.[projectId - 1]?.[section]?.[index]?.[input.updateType]?.[language];
                        } else {
                            valueExpression = currentContent?.[projectId - 1]?.[section]?.[input.updateType]?.[language];
                        }
                    } else if (subSectionsProMax === "Links") {
                        valueExpression = currentContent?.[section]?.[subSection]?.[index]?.[input.updateType];
                    } else if (subSectionsProMax) {
                        valueExpression = currentContent?.[section]?.[subSection]?.[index]?.[subSectionsProMax]?.[subSecIndex]?.[input.updateType]?.[language];
                    } else if (subSection && typeof currentContent?.[section]?.[subSection]?.[index]?.[input.updateType] !== "object") {
                        valueExpression = currentContent?.[section]?.[subSection]?.[index]?.[input.updateType];
                    } else if (subSection === 'url') {
                        valueExpression = currentContent?.[section]?.[subSection]?.[index]?.[input.updateType];
                    } else if (subSection) {
                        valueExpression = currentContent?.[section]?.[subSection]?.[index]?.[input.updateType]?.[language];
                    } else if (type === 'rich') {
                        valueExpression = currentContent?.[section]?.[index]?.[input.updateType]?.[language];
                    } else {
                        valueExpression = currentContent?.[section]?.[input.updateType]?.[language];
                    }

                    if (input.input === "textarea") {
                        return (
                            <TextAreaInput
                                key={i}
                                labelTitle={input.label}
                                labelStyle="block sm:text-xs xl:text-sm"
                                updateFormValue={updateFormValue}
                                updateType={input.updateType}
                                section={section}
                                defaultValue={valueExpression || ""}
                                language={language}
                                id={input.updateType}
                            />
                        );
                    } else if (input.input === "richtext") {
                        return (
                            <div dir={language === 'en' ? 'ltr' : 'rtl'} key={i}>
                                <JoditEditor
                                    ref={editor}
                                    value={valueExpression}
                                    config={config}
                                    onChange={(newContent) => updateFormValueRichText(input.updateType, newContent)}
                                    onBlur={(newContent) => updateFormValueRichText(input.updateType, newContent)}

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
                                defaultValue={valueExpression || ""}
                                language={language}
                                id={input.updateType}
                                required={false}
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



// <ReactQuill
//     key={i}
//     className=""
//     modules={modules}
//     theme="snow"
//     value={valueExpression}
//     onChange={updateFormValueReactQuill(input.updateType)}
// />