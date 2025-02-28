import { useState } from "react";
import InputFile from "../../../components/Input/InputFile";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";

const ContentSection = ({ Heading,subHeading, inputs = [], inputFiles = [], isBorder=true, fileId }) => {
    const [formData, setFormData] = useState({}); // Store input values

    // Function to update input values
    const updateFormValue = ({ updateType, value }) => {
        setFormData((prev) => ({
            ...prev,
            [updateType]: value,
        }));
    };

    return (
        <div className={`w-full flex flex-col gap-1 ${!isBorder ? "" : "border-b border-b-2 border-neutral-300"} pb-6`}>
            <h3 className={`font-semibold ${subHeading?"text-[.9rem] mb-1":"text-[1.25rem] mb-4"}`}>{Heading || subHeading}</h3>
            {inputs.map((input, index) => {
                return input.input === "textarea" ? (
                    <TextAreaInput
                        key={index}
                        labelTitle={input.label}
                        labelStyle={"block sm:text-xs xl:text-sm"}
                        updateFormValue={updateFormValue}
                        updateType={input.label}
                    />
                ) : (
                    <InputText
                        key={index}
                        InputClasses={"h-[2.125rem]"}
                        labelTitle={input.label}
                        labelStyle={"block sm:text-xs xl:text-sm"}
                        updateFormValue={updateFormValue}
                        updateType={input.label}
                        
                    />
                );
            })}
            {inputFiles.map((fileLabel, index) => (
                <InputFile key={index} label={fileLabel} id={fileId} />
            ))}
        </div>
    );
};

export default ContentSection;
