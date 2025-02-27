import { useState } from "react";
import LanguageSwitch from "./components/SwitchLang";

const EditPage = () => {
    const [isEnglish, setIsEnglish] = useState(true);

    return (
        <div className="flex gap-[1.5rem] pr-1 overflow-x-hidden border border-1 border-fuchsia-500">
            <div className="border border-1 border-info-500 p-2 w-[23rem] flex-[2] flex flex-col items-center overflow-y-scroll customscroller">
                <LanguageSwitch />
                <div>
                    <h3 className="Her">Hero Header</h3>

                </div>
            </div>
            <div className="border border-1 border-indigo-500 flex-[4]">

            </div>
        </div>
    )
}

export default EditPage