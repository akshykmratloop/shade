import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";

const Select = ({
    options,
    optionsClass,
    selectClass,
    label,
    labelClass,
    baseClass,
    setterOnChange,
    index,
    value,
    height,
    width,
    field,
}) => {
    const handleSelectChange = (e) => {
        let value = e.target.value
        if (value === "") return
        for (let x of options) {
            if (x.id === value && x.status === "INACTIVE") {
                // toast.error("Unable to select Inactive user")
                return
            }
        }
        if (typeof index === "number") {
            setterOnChange(index, "value", value);
        } else {
            setterOnChange(field, value)
        }
    };

    return (
        <div className={`${baseClass} text-sm relative`}>
            {label && <label className={labelClass}>{label}</label>}
            <div className="relative">
                <select
                    className={`${selectClass} ${width ? width : "w-[22rem]"} ${height ?? "h-[2.3rem]"} text-xs pl-2 ${value === "" ? "" : "text-zinc-700 dark:text-zinc-300"}`}
                    onChange={handleSelectChange}
                    value={value} // <-- Ensure value is controlled
                >
                    <option value="" className=""> Select </option>
                    {options?.map((option, i) => {
                        // console.log(option)
                        return (
                            <option value={option.id} key={option + i} className={`${optionsClass || "text-stone-700"} `}>
                                {option?.name}
                            </option>
                        )
                    })}
                </select>
                <span className="absolute top-1/2 -translate-y-1/2 right-[10px]">
                    <IoIosArrowDown className="translate-y-[1px]" strokeWidth={0.1} />
                </span>
            </div>
        </div>
    );
};

export default Select;

