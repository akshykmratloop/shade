import { useEffect, useState } from "react";
import InputFile from "../../../components/Input/InputFile";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import { useDispatch, useSelector} from "react-redux";
import { updateSpecificContent } from "../../common/homeContentSlice";

const ContentSection = ({ Heading, subHeading, inputs = [], inputFiles = [], isBorder = true, fileId, section, language }) => {
    // const [formData, setFormData] = useState({}); // Store input values
    const dispatch = useDispatch();
    const homeContent = useSelector((state) => {
        return state.homeContent.home
    })

    // Function to update input values
    const updateFormValue = ({ updateType, value }) => {
        dispatch(updateSpecificContent({ section: section, title: updateType, lan: language, value }))
    };

    console.log(homeContent)

    return (
        <div className={`w-full  flex flex-col gap-1 ${!isBorder ? "" : "border-b border-b-1 border-neutral-300"} pb-6`}>
            <h3 className={`font-semibold ${subHeading ? "text-[.9rem] mb-1" : "text-[1.25rem] mb-4"}`}>{Heading || subHeading}</h3>
            {inputs.map((input, index) => {
                return input.input === "textarea" ? (
                    <TextAreaInput
                        key={index}
                        labelTitle={input.label}
                        labelStyle={"block sm:text-xs xl:text-sm"}
                        updateFormValue={updateFormValue}
                        updateType={input.updateType}
                        section={section}
                        defaultValue={homeContent?.[section]?.[input.updateType][language] || ""}
                        language={language} 
                    />
                ) : (
                    <InputText
                        key={index}
                        InputClasses={"h-[2.125rem]"}
                        labelTitle={input.label}
                        labelStyle={"block sm:text-xs xl:text-sm"}
                        updateFormValue={updateFormValue}
                        updateType={input.updateType}
                        section={section}
                        defaultValue={homeContent?.[section]?.[input.updateType][language]}
                        language={language}
                    />
                );
            })}
            {inputFiles.map((fileLabel, index) => (
                <InputFile key={index} label={fileLabel} id={fileId} section={section} />
            ))}
        </div>
    );
};

export default ContentSection;
