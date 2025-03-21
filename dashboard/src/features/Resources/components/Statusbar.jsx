import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";

export default function StatusBar() {
    const [progress, setProgress] = useState(0);
    const steps = [0, 33.3, 66.6, 100];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => (prev < 66.6 ? prev + 33.3 : 100));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center bg-gray-100 py-4 px-2">
            <div className="relative w-[98%] h-2 bg-gray-300 rounded-full">
                {/* Progress Bar */}
                <div 
                    className="h-full bg-[#2947A9] transition-all duration-500 rounded-full" 
                    style={{ width: `${progress}%` }}
                ></div>
                
                {/* Icons */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
                    {steps.map((step, index) => (
                        <div 
                            key={index} 
                            className={`w-6 h-6 border-2 border-[#2947A9] rounded-full flex items-center justify-center transition-all duration-500 ${progress >= step ? 'bg-[#2947A9] text-white' : 'bg-white'}`}
                        >
                            {progress >= step ? <FaCheck className="" /> : ""}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}