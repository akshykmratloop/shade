import React from "react";

const Select = ({ options, selectClass, label, labelClass, baseClass, setterOnChange, index, value, height, width }) => {
    const handleSelectChange = (e) => {
        if (typeof index === "number") {
            setterOnChange(index, "value", e.target.value);
        }
    };

    return (
        <div className={`${baseClass} text-sm`}>
            {label && <label className={labelClass}>{label}</label>}
            <select
                className={`${selectClass} ${width ? width : "w-[22rem]"} ${height ?? "h-[2.3rem]"} text-xs`}
                onChange={handleSelectChange}
                value={value} // <-- Ensure value is controlled
            >
                <option value="">-- Select an option --</option>
                {options?.map((option, i) => (
                    <option value={option} key={option + i}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;

