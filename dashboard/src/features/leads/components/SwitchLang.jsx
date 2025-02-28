import { useState } from "react";

export default function LanguageSwitch() {
    const [isEnglish, setIsEnglish] = useState(true);

    return (
        <div
            className="relative w-full h-[2.5rem] text-[.8rem] font-light bg-gray-300 rounded-md cursor-pointer flex-shrink-0 overflow-visible isolation-isolate"
            onClick={() => setIsEnglish(!isEnglish)}
        >
            {/* Toggle Background */}
            <div
                className={`absolute top-0 bottom-0 w-1/2 rounded-md transition-all duration-300 
                ${isEnglish ? "left-0 bg-blue-500" : "left-1/2 bg-blue-500"}`}
            ></div>

            {/* Language Labels */}
            <div
                className={`absolute w-1/2 h-full flex items-center justify-center left-0  pointer-events-none 
                ${isEnglish ? "text-white" : "text-black"}`}
            >
                English
            </div>
            <div
                className={`absolute w-1/2 h-full flex items-center justify-center right-0  pointer-events-none 
                ${!isEnglish ? "text-white" : "text-black"}`}
            >
                Arabic
            </div>
        </div>
    );
}

