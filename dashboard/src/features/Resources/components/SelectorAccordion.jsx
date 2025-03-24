import React, { useEffect, useRef, useState } from "react";
import Select from "../../../components/Input/Select";
import { RxCross2 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";

const SelectorAccordion = () => {
    const [selector, setSelector] = useState([{ label: "Level 1", value: "" }]);
    const selectorRef = useRef(null);

    const dummyData = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];

    const addSelector = (e) => {
        e.preventDefault();
        setSelector((prev) => [...prev, { label: `Level ${prev.length + 1}`, value: "" }]);
    };

    const updateSelectorValue = (index, label, value) => {
        setSelector((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [label]: value } : item))
        );
    };

    const removeSelector = (index) => {
        setSelector((prev) => {
            const newSelectors = prev.filter((_, i) => i !== index);

            // Shift values up
            for (let i = index; i < newSelectors.length; i++) {
                newSelectors[i].value = prev[i + 1]?.value || ""; // Assign next value or empty string
            }

            // Reassign labels
            return newSelectors.map((item, i) => ({ ...item, label: `Level ${i + 1}` }));
        });
    };

    useEffect(() => {
        if (selectorRef.current) {
            selectorRef.current.scrollTop = selectorRef.current.scrollHeight;
        }
    }, [selector]);

    return (
        <div className="mt- max-h-[12.25rem] overflow-y-scroll customscroller-2 w-[22rem]" ref={selectorRef}>
            {selector.map((select, index) => {
                const isLast = index === selector.length - 1;
                return (
                    <div key={index} className="flex items-center my-1 mt-[2px] gap-2">
                        <p className="flex justify-center items-center rounded-lg font-[400] translate-y-[2px] w-[5rem] h-[2.2rem] bg-[#DFDFDF] dark:bg-[#29469c] text-[#637888] dark:text-[#cecece] text-xs border-none">
                            {select.label}
                        </p>
                        <Select
                            setterOnChange={updateSelectorValue}
                            index={index}
                            selectClass="px-2 bg-transparent mt-1 border border-stone-300 dark:border-stone-600 rounded-md p-2 outline-none"
                            height={""}
                            width={"w-[14rem]"}
                            options={dummyData}
                            value={select.value}  // <-- Ensure the Select component gets the correct value
                        />

                        <button
                            onClick={isLast ? addSelector : (e) => { e.preventDefault(); removeSelector(index); }}
                            className={`flex justify-center items-center translate-y-[2px] rounded-lg w-[2.2rem] h-[2.2rem] text-[1.2rem] text-[#637888] border border-[#cecbcb] dark:border-stone-600`}
                        >
                            {isLast ? <GoPlus className="w-4 h-4" /> : <RxCross2 className="w-3 h-3" />}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default SelectorAccordion;
