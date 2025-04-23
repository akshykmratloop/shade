import React from "react";

const Select = ({ options, defaultValue, selectClass, label, labelClass, baseClass, setterOnChange, index, value, height, width, field }) => {
    const handleSelectChange = (e) => {
        if (typeof index === "number") {
            setterOnChange(index, "value", e.target.value);
        } else {
            setterOnChange(field, e.target.value)
        }
    };

    return (
        <div className={`${baseClass} text-sm`}>
            {label && <label className={labelClass}>{label}</label>}
            <select
                className={`${selectClass} ${width ? width : "w-[22rem]"} ${height ?? "h-[2.3rem]"} text-xs pl-2`}
                onChange={handleSelectChange}
                value={value} // <-- Ensure value is controlled
            >
                <option value="" className=""> Select </option>
                {options?.map((option, i) => (
                    <option value={option.id} key={option + i}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;

