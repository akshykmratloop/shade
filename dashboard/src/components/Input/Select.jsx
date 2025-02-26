import React from 'react';

const Select = ({ options, inputClass, label, labelClass, baseClass }) => {

    return (
        <div className={baseClass}>
            <label
                htmlFor=""
                className={`${labelClass}`}
            >{label}</label>
            <select
                name=""
                id=""
                className={`${inputClass}`}
            >
                <option value="">-- default --</option>
            </select>
        </div>
    )
}


export default Select