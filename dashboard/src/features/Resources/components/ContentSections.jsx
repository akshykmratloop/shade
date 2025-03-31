import { useState } from "react";
import InputFile from "../../../components/Input/InputFile";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import { useDispatch, useSelector } from "react-redux";
import { updateSpecificContent, updateServicesNumber, updateImages } from "../../common/homeContentSlice";
import InputFileWithText from "../../../components/Input/InputFileText";
import InputFileForm from "../../../components/Input/InputFileForm";

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
    allowExtraInput = false // New prop to allow extra input
}) => {
    const dispatch = useDispatch();
    const [extraFiles, setExtraFiles] = useState([]);
    const ImagesFromRedux = useSelector((state) => state.homeContent.present.images)

    const addExtraFileInput = () => {
        if (section === 'socialIcons') {
            dispatch(updateImages({ src: [...ImagesFromRedux.socialIcons, { img: "", url: "", id: ImagesFromRedux.socialIcons.length + 1 }], section: "socialIcons" }))
            dispatch(updateImages({ src: [...ImagesFromRedux.socialIcons, { img: "", url: "", id: ImagesFromRedux.socialIcons.length + 1 }], section: "socialIcons" }))
        }
        setExtraFiles([...extraFiles, { label: `Extra File ${extraFiles.length + 1}`, id: `extraFile${extraFiles.length + 1}` }]);
    };

    const removeExtraFileInput = (id) => {
        setExtraFiles(extraFiles.filter(file => file.id !== id));
    };

    const updateFormValue = ({ updateType, value }) => {
        if (updateType === 'count') {
            if (!isNaN(value)) {
                let val = value?.slice(0, 7);
                dispatch(updateServicesNumber({ section, title: updateType, value: val, subSection, index, currentPath }));
            }
        } else {
            dispatch(updateSpecificContent({ section, title: updateType, lan: language, value: value === "" ? "" : value, subSection, index, subSectionsProMax, subSecIndex, currentPath }));
        }
    };

    return (
        <div className={`w-full ${Heading ? "mt-4" : "mt-1"} flex flex-col gap-1 ${!isBorder ? "" : "border-b border-b-1 border-neutral-300"} pb-6`}>
            <h3 className={`font-semibold ${subHeading ? "text-[.9rem] mb-1" : "text-[1.25rem] mb-4"}`}>{Heading || subHeading}</h3>
            {inputs.length > 0 ? inputs.map((input, i) => {
                let valueExpression;
                if (subSectionsProMax === "Links") {
                    valueExpression = currentContent?.[section]?.[subSection]?.[index]?.[input.updateType];
                } else if (subSectionsProMax) {
                    valueExpression = currentContent?.[section]?.[subSection]?.[index]?.[subSectionsProMax]?.[subSecIndex]?.[input.updateType]?.[language];
                } else if (subSection && typeof (currentContent?.[section]?.[subSection]?.[index]?.[input.updateType]) !== "object") {
                    valueExpression = currentContent?.[section]?.[subSection]?.[index]?.[input.updateType];
                } else if (subSection) {
                    valueExpression = currentContent?.[section]?.[subSection]?.[index]?.[input.updateType]?.[language];
                } else {
                    valueExpression = currentContent?.[section]?.[input.updateType]?.[language];
                }
                return input.input === "textarea" ? (
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
                ) : (
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
            }) : ""}

            <div className={`flex ${inputFiles.length > 1 ? "justify-center" : ""}`}>
                {
                    section === 'socialIcons' ?
                        <div>
                            <div className={`flex ${inputFiles.length > 1 ? "flex-wrap" : ""} gap-10 w-[80%] relative`}>
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
                                )})}
                               
                                {/* {extraFiles.map((file, index) => (
                                    <div key={index} className="relative flex items-center justify-center">

                                        <InputFileForm
                                            label={file.label}
                                            id={file.id}
                                            currentPath={currentPath}
                                            section={section}
                                            fileIndex={index}
                                        />
                                    </div>
                                ))} */}
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
                        : <div className={`flex ${inputFiles.length > 1 ? "flex-wrap" : ""} gap-10 w-[80%]`}>
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
                            {allowExtraInput &&
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