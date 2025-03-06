import { useEffect, useState } from "react";
import InputFile from "../../../components/Input/InputFile";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import { useDispatch, useSelector } from "react-redux";
import { updateSpecificContent, update, updateServicesNumber } from "../../common/homeContentSlice";

const ContentSection = ({ Heading, subHeading, inputs = [], inputFiles = [], isBorder = true, fileId, section, language, subSection, index }) => {
    // const [formData, setFormData] = useState({}); // Store input values
    const dispatch = useDispatch();
    const homeContent = useSelector((state) => {
        return state.homeContent.present.home
    })


    // Function to update input values
    const updateFormValue = ({ updateType, value }) => {
        if (!isNaN(Number(value))) {
            let val = value.slice(0,7)
            dispatch(updateServicesNumber({ section: section, title: updateType, value: val, subSection, index }))
        } else {
            if(updateType === "count") return 
            dispatch(updateSpecificContent({ section: section, title: updateType, lan: language, value, subSection, index }))
        }
    };

    return (
        <div className={`w-full  flex flex-col gap-1 ${!isBorder ? "" : "border-b border-b-1 border-neutral-300"} pb-6`}>
            <h3 className={`font-semibold ${subHeading ? "text-[.9rem] mb-1" : "text-[1.25rem] mb-4"}`}>{Heading || subHeading}</h3>
            {inputs.length > 0 ? inputs.map((input, i) => {
                let valueExpression 
                if (subSection && typeof (homeContent?.[section]?.[subSection][index]?.[input.updateType]) !== "object") {
                    valueExpression = homeContent?.[section]?.[subSection][index]?.[input.updateType]
                } else if (subSection) {
                    valueExpression = homeContent?.[section]?.[subSection][index]?.[input.updateType]?.[language]
                }else{
                    valueExpression = homeContent?.[section]?.[input.updateType]?.[language]
                }
                return input.input === "textarea" ? (
                    <TextAreaInput
                        key={i}
                        labelTitle={input.label}
                        labelStyle={"block sm:text-xs xl:text-sm"}
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
                        InputClasses={"h-[2.125rem]"}
                        labelTitle={input.label}
                        labelStyle={"block sm:text-xs xl:text-sm"}
                        updateFormValue={updateFormValue}
                        updateType={input.updateType}
                        section={section}
                        defaultValue={valueExpression || ""}
                        language={language}
                        id={input.updateType}
                    />
                );
            }) : ""}
            {inputFiles.map((fileLabel, index) => (
                <InputFile key={index} label={fileLabel} id={fileId}  />
            ))}
        </div>
    );
};

export default ContentSection;
