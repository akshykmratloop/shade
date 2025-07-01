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
    language
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

    const nameLan = language === "en" ? "nameEn" : "nameAr"
    const titleLan = language === "en" ? "titleEn" : "titleAr"

    return (
        <div className={`${baseClass} w-full text-sm relative mb-2`}>
            {label && <label className={labelClass}>{label}</label>}
            <div className="relative">
                <select
                    className={`w-full bg-transparent  text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-none px-0 py-1 ${selectClass || ''}`}
                    onChange={handleSelectChange}
                    value={value}
                >
                    <option value="" className="bg-white dark:bg-[#23272f] text-zinc-700 dark:text-zinc-200" disabled selected dir={language === "ar" ? "rtl" : "ltr"}> {language === "ar" ? "اختر" : "Select"} </option>
                    {options?.map((option, i) => (
                        <option
                            dir={language === "ar" ? "rtl" : "ltr"}
                            value={option?.id}
                            key={option + i}
                            className={`bg-white dark:bg-[#23272f] text-zinc-700 dark:text-zinc-200 ${optionsClass || ''}`}
                        >
                            {option?.[nameLan] || option?.name}
                        </option>
                    ))}
                </select>
                <span className="absolute top-1/2 -translate-y-1/2 right-[10px] pointer-events-none">
                    <IoIosArrowDown className="translate-y-[1px]" strokeWidth={0.1} />
                </span>
            </div>
        </div>
    );
};

export default Select;

