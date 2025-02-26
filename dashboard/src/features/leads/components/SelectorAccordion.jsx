import React, { useState } from "react";
import Select from "../../../components/Input/Select";
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";

const SelectorAccordion = () => {
    const [selector, setSelector] = useState([{ label: "level 1", value: "" }]);

    function addSelector(e) {
        e.preventDefault();
        setSelector(prev => [
            ...prev,
            { label: `level ${prev.length + 1}`, value: "" }
        ]);
    }

    function removeSelector(index) {
        setSelector(prev =>
            prev
                .filter((_, i) => i !== index) // Remove the selected item
                .map((item, i) => ({ ...item, label: `level ${i + 1}` })) // Reassign levels
        );
    }

    return (
        <div>
            {selector.map((select, index) => {
                const isLast = index === selector.length - 1;
                return (
                    <div key={index} className="flex items-center my-1 gap-1">
                        <p className="flex justify-center items-center rounded-lg translate-y-[2px] w-[6.81rem] h-[2.5rem] bg-[#DFDFDF] text-black font-light border-none">
                            {select.label}
                        </p>
                        <Select inputClass="px-2 border border-stone-300 w-[18rem] mt-1 rounded-md p-2 h-[2.5rem] outline-none" />
                        <button
                            onClick={isLast ? addSelector : (e) => { e.preventDefault(); removeSelector(index); }}
                            className={`flex justify-center items-center translate-y-[2px] rounded-lg w-[3.7rem] h-[2.5rem] text-[1.2rem] ${
                                isLast
                                    ? "bg-[#145098] text-white"
                                    : "bg-white border border-red-500 text-red-500"
                            }`}
                        >
                            {isLast ? <FaPlus /> : <RxCross2 />}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default SelectorAccordion;
