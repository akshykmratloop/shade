import React, { useEffect, useRef } from "react";
import Select from "../../../components/Input/Select";
import SelectorAccordion from "./SelectorAccordion";

const ConfigBar = ({ display, setOn, data }) => {
    const configRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (configRef.current && !configRef.current.contains(event.target)) {
                setOn(false);
            }
        };

        if (display) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [display, setOn]);

    return (
        <div className={`${display ? "block" : "hidden"} fixed z-20 top-0 left-0 w-[100vw] h-screen bg-black bg-opacity-50`}>
            <div ref={configRef} className="fixed p-[42px] z-30 top-0 right-0 w-[31rem] h-screen bg-base-200 shadow-xl-custom rounded-tl-3xl rounded-bl-3xl">
                <h1 className="font-medium text-[1.1rem]">Assign User</h1>
                <form className="mt-5 flex flex-col justify-between h-[93%]">
                    <div className="flex flex-col items-center gap-4">
                        {/* Selected Page/Content */}
                        <div className="dark:border dark:border-[1px] dark:border-stone-700 rounded-md">
                            <input
                                type="text"
                                className="input px-3 bg-base-300 rounded-md w-[25rem] h-[2.5rem] outline-none disabled:pointer-events-none disabled:cursor-text"
                                value={data.heading || ""}
                                disabled
                            />
                        </div>

                        {/* Select Manager */}
                        <Select
                            baseClass="w-min"
                            label="Select Manager"
                            labelClass="font-[400] text-[#6B7888] text-[14px]"
                            inputClass="px-2 bg-base-200 border border-stone-500 w-[25rem] mt-1 rounded-md p-2 h-[2.5rem] outline-none"
                        />

                        {/* Select Editor */}
                        <Select
                            baseClass="w-min"
                            label="Select Editor"
                            labelClass="font-[400] text-[#6B7888] text-[14px]"
                            inputClass="px-2 bg-base-200 border border-stone-500 w-[25rem] mt-1 rounded-md p-2 h-[2.5rem] outline-none"
                        />

                        {/* Selector Accordion */}
                        <SelectorAccordion />

                        {/* Select Publisher */}
                        <Select
                            baseClass="w-min"
                            label="Select Publisher"
                            labelClass="font-[400] text-[#6B7888] text-[14px]"
                            inputClass="px-2 bg-base-200 border border-stone-500 w-[25rem] mt-1 rounded-md p-2 h-[2.5rem] outline-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
                        <button className="btn w-[8rem]" onClick={(e) => { e.preventDefault(); setOn(false); }}>Cancel</button>
                        <button className="btn w-[8rem] bg-blue-500 border-none hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-900">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConfigBar;
