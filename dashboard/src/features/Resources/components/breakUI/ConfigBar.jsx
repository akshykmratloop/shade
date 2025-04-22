import React, { useEffect, useRef, useState } from "react";
import Select from "../../../../components/Input/Select";
import SelectorAccordion from "./SelectorAccordion";
import { X } from "lucide-react";
import { getEligibleUsers } from "../../../../app/fetch";

const ConfigBar = ({ display, setOn, data, resourceId }) => {
    const configRef = useRef(null);
    const [userList, setUserList] = useState({ managers: [], editors: [], verifiers: [], publishers: [] })
    const [formObj, setFormObj] = useState({
        resourceId,
        manager: "",
        editor: "",
        verifiers: [{ id: "", stage: NaN }],
        publisher: ""
    })

    console.log(formObj)

    function updateSelection(field, value) {
        setFormObj(prev => {
            return { ...prev, [field]: value }
        })
    }

    async function onSubmit(e) {
        e.preventDefault();
        

    }

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

    useEffect(() => {
        setFormObj(prev => ({
            ...prev,
            resourceId: resourceId,
        }))
    }, [resourceId])

    useEffect(() => {
        async function getUser() {
            const response1 = await getEligibleUsers({ permission: "EDIT" });
            const response2 = await getEligibleUsers({ permission: "PUBLISH" });
            const response3 = await getEligibleUsers({ permission: "VERIFY" });
            const response4 = await getEligibleUsers({ permission: "SINGLE_RESOURCE_MANAGEMENT" });
            setUserList({
                managers: [...response4.eligibleUsers],
                editors: [...response1.eligibleUsers],
                verifiers: [...response2.eligibleUsers],
                publishers: [...response3.eligibleUsers]
            })
        }
        getUser()
    }, [])

    return (
        <div className={`${display ? "block" : "hidden"} fixed z-20 top-0 left-0 w-[100vw] h-screen bg-black bg-opacity-50`}>

            <div ref={configRef} className="fixed z-30 top-0 right-0 w-[26rem] h-screen bg-[white] dark:bg-[#242933]">
                <button className="bg-transparent hover:bg-stone-900 hover:text-stone-200 dark:hover:bg-stone-900 rounded-full absolute top-7 border border-gray-500 left-4 p-2 py-2"
                    onClick={() => setOn(false)}>
                    <X className="w-[16px] h-[16px]" />
                </button>
                <h1 className="font-medium text-[1.1rem] shadow-md-custom p-[30px] text-center">Assign User for Page {data.heading}</h1>
                <form className="mt-1 flex flex-col justify-between h-[88%] p-[30px] pt-[0px]">
                    <div className="flex flex-col gap-4 pt-6 ">
                        {/* Selected Page/Content */}
                        {/* <div className="dark:border dark:border-[1px] dark:border-stone-700 rounded-md">
                            <input
                                type="text"
                                className="input px-3 bg-base-300 rounded-md w-[25rem] h-[2.5rem] outline-none disabled:pointer-events-none disabled:cursor-text"
                                value={data.heading || ""}
                                disabled
                            />
                        </div> */}

                        {/* Select Manager */}
                        <Select
                            options={userList.managers.map(e => ({ id: e.id, name: e.name }))}
                            setterOnChange={updateSelection}
                            field={"manager"}
                            baseClass=""
                            label="Select Manager"
                            labelClass="font-[400] text-[#6B7888] text-[14px]"
                            selectClass="bg-transparent border border-[#cecbcb] dark:border-stone-600 mt-1 rounded-md py-2 h-[2.5rem] outline-none"
                        />

                        {/* Select Editor */}
                        <Select
                            options={userList.editors.map(e => ({ id: e.id, name: e.name }))}
                            setterOnChange={updateSelection}
                            field={"editor"}
                            baseClass=""
                            label="Select Editor"
                            labelClass="font-[400] text-[#6B7888] text-[14px]"
                            selectClass="bg-transparent border border-[#cecbcb] dark:border-stone-600 mt-1 rounded-md py-2 h-[2.5rem] outline-none"
                        />

                        {/* Selector Accordion */}
                        <div>
                            <label className={"font-[400] text-[#6B7888] dark:border-stone-600 text-[14px]"}>Select Verifier</label>
                            <SelectorAccordion
                                options={userList.verifiers.map(e => ({ id: e.id, name: e.name }))}
                                field={"verifier"}
                                onChange={updateSelection}
                            />
                        </div>

                        {/* Select Publisher */}
                        <Select
                            options={userList.publishers.map(e => ({ id: e.id, name: e.name }))}
                            setterOnChange={updateSelection}
                            baseClass=""
                            field={"publisher"}
                            label="Select Publisher"
                            labelClass="font-[400] text-[#6B7888] text-[14px]"
                            selectClass="bg-transparent border border-[#cecbcb] dark:border-stone-600 mt-1 rounded-md py-2 h-[2.5rem] outline-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center gap-2">
                        <button className="w-[8rem] h-[2.3rem] rounded-md text-xs bg-stone-700 text-white" onClick={(e) => { e.preventDefault(); setOn(false); }}>Cancel</button>
                        <button className="w-[8rem] h-[2.3rem] rounded-md text-xs bg-[#29469c] border-none hover:bg-[#29469c] text-[white]">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConfigBar;
