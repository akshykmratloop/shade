import InputFile from "../../../components/Input/InputFile";
import InputText from "../../../components/Input/InputText";

const ContentSection = ({ Heading, inputs = [], inputFiles = [] }) => {
    return (
        <div className="w-[22rem] flex flex-col gap-1 border-b border-b-2 border-neutral-300 pb-6">
            <h3 className="font-semibold text-[1.25rem] mb-4">{Heading}</h3>
            {inputs.map((input, index) => (
                <InputText
                    key={index}
                    InputClasses={"h-[2.5rem]"}
                    labelTitle={input}
                    labelStyle={"mb-1 block"}
                />
            ))}
            {inputFiles.map((fileLabel, index) => (
                <InputFile key={index} label={fileLabel} />
            ))}
        </div>
    );
};

export default ContentSection;
