import { useState } from "react";

export default function LanguageSwitch() {
    const [isEnglish, setIsEnglish] = useState(true);

    return (
        <div
            className="relative w-[20rem] h-12 bg-gray-300 rounded-md cursor-pointer"
            onClick={() => setIsEnglish(!isEnglish)}
        >
            <div
                className={`absolute top-0 bottom-0 w-1/2 rounded-md transition-all duration-300 ${isEnglish ? "left-0 bg-blue-500" : "left-1/2 bg-blue-500"
                    }`}
            ></div>
            <div className="absolute w-1/2 h-full flex items-center justify-center left-0 text-gray-700 font-light">
                English
            </div>
            <div className="absolute w-1/2 h-full flex items-center justify-center right-0 text-gray-700 font-light">
                Arabic
            </div>
        </div>
    );
}