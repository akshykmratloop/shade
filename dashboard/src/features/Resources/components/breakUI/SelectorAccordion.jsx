import React, { useEffect, useRef, useState } from "react";
import Select from "../../../../components/Input/Select";
import { RxCross2 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";

const SelectorAccordion = ({ options, onChange, field, value }) => {
    const [selector, setSelector] = useState([{ label: "Level 1", value: "" }]);
    const selectorRef = useRef(null);
    const prevSelectorRef = useRef(selector);

    const addSelector = (e) => {
        e.preventDefault();
        setSelector((prev) => [...prev, { label: `Level ${prev.length + 1}`, value: "" }]);
    };

    const updateSelectorValue = (index, label, newValue) => {
        setSelector((prev) => {
            if (prev[index][label] === newValue) return prev; // Skip if value is unchanged
            const valueExists = prev.some((e, i) => e.value === newValue && i !== index);
            if (valueExists) return prev; // Skip if duplicate value
            const updated = [...prev];
            updated[index] = { ...updated[index], [label]: newValue };
            return updated;
        });
    };

    const removeSelector = (index) => {
        setSelector((prev) => {
            const filtered = prev.filter((_, i) => i !== index);
            return filtered.map((item, i) => ({
                ...item,
                label: `Level ${i + 1}`,
            }));
        });
    };

    useEffect(() => {
        if (value?.length > 0) {
            setSelector(
                value.map((e, i) => ({
                    label: `Level ${i + 1}`,
                    value: e.id,
                }))
            );
        }
    }, [value]);

    useEffect(() => {
        if (selectorRef.current) {
            selectorRef.current.scrollTop = selectorRef.current.scrollHeight;
        }
    }, [selector]);

    useEffect(() => {
        const newValue = selector.map((e, i) => ({ stage: i + 1, id: e.value }));
        const prevValue = prevSelectorRef.current.map((e, i) => ({ stage: i + 1, id: e.value }));
        const isEqual = JSON.stringify(newValue) === JSON.stringify(prevValue);
        if (!isEqual) {
            onChange(field, newValue);
            prevSelectorRef.current = selector;
        }
    }, [selector]);

    return (
        <div
            ref={selectorRef}
            className="mt- max-h-[12.25rem] pb-4 overflow-y-scroll customscroller-2 w-[22rem]"
        >
            {selector.map((select, index) => {
                const isLast = index === selector.length - 1;
                return (
                    <div key={index} className="flex items-center my-1 mt-[2px] gap-2">
                        <p className="flex flex-[0_1_auto] justify-center items-center rounded-lg font-[400] translate-y-[2px] w-[5rem] h-[2.2rem] bg-[#DFDFDF] dark:bg-[#29469c] text-[#637888] dark:text-[#cecece] text-xs border-none">
                            {select.label}
                        </p>
                        <div className="flex-[2_1_auto] relative ">
                            <Select
                                options={options || []}
                                setterOnChange={updateSelectorValue}
                                index={index}
                                selectClass="px-2 bg-transparent mt-1 border border-stone-300 dark:border-stone-600 rounded-md p-2 outline-none"
                                height={""}
                                width={"w-full"}
                                value={select.value}
                                id={"selectVerifier " + (index + 1)}
                            />
                            {isLast &&
                                <span onClick={addSelector} className="absolute top-[90%] right-[1px] rounded-full bg-blue-700 text-white" >
                                    <GoPlus />
                                </span>}
                        </div>
                        {
                            selector.length > 1 &&
                            <button
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        removeSelector(index);
                                    }
                                }
                                className="flex justify-center items-center translate-y-[2px] rounded-lg w-[2.2rem] h-[2.2rem] text-[1.2rem] text-[#637888] border border-[#cecbcb] dark:border-stone-600"
                            >
                                {<RxCross2 className="w-3 h-3" />}
                            </button>}
                    </div>
                );
            })}
        </div>
    );
};

export default SelectorAccordion;
