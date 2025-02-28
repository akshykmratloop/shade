import LanguageSwitch from "./components/SwitchLang";
import ContentSection from "./components/ContentSections";
import Select from "../../components/Input/Select";

const EditPage = () => {

    return (
        <div className="flex gap-[1.5rem] pr-1 h-[39.5rem] border border-1 border-fuchsia-500">

            {/* content manager */}
            <div className="border border-1 pt-8 border-info-500 bg-base-200 p-2 w-[23rem]  flex-[2] flex flex-col gap-4 items-center overflow-y-scroll customscroller">
                <LanguageSwitch />
                <ContentSection
                    Heading={"Hero Header"}
                    inputs={["Heading/title", "About section", "Button Text"]}
                    inputFiles={["Button Icon", "Backround Image"]}
                />
                <ContentSection
                    Heading={"About Section"}
                    inputs={["Heading/title", "About section", "Button Text"]}
                    inputFiles={["Button Icon", "Backround Image"]}
                />
                <div className="w-[22rem] flex flex-col gap-1 border-b border-b-2 border-neutral-300 pb-6">
                    <h3 className="font-semibold text-[1.25rem] mb-4">Service Section</h3>
                    <Select
                        baseClass="w-min"
                        label="Select Service List"
                        labelClass="font-[400] label-text"
                        inputClass="px-2 bg-[white] border border-stone-500 w-[21.7rem] mt-1 rounded-md p-2 h-[2.5rem] outline-none"
                    />
                </div>
                <ContentSection
                    Heading={"Experience Section"}
                    inputs={["Heading/title", "About section", "Button Text"]}
                    inputFiles={["Button Icon"]}
                />

            </div>
            {/* Content view */}
            <div className="border border-1 border-indigo-500 bg-base-200 flex-[4]">

            </div>
        </div>
    )
}

export default EditPage