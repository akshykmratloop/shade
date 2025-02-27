import React from "react";

const Select = ({ options, inputClass, label, labelClass, baseClass, setterOnChange, index, value }) => {
    const handleSelectChange = (e) => {
        if (typeof index === "number") {
            setterOnChange(index, "value", e.target.value);
        }
    };

    return (
        <div className={baseClass}>
            {label && <label className={labelClass}>{label}</label>}
            <select 
                className={inputClass} 
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

