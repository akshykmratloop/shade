import { useState } from "react"


function InputText({ labelTitle, labelStyle, type, containerStyle, defaultValue, placeholder, updateFormValue, updateType, display }) {

    const [value, setValue] = useState(defaultValue)

    const updateInputValue = (val) => {
        setValue(val)
        updateFormValue({ updateType, value: val })
    }

    return (
        <div className={`form-control w-full ${containerStyle}`} style={{ display: display ? "none" : "" }}>
            <label className="label">
                <span className={"label-text font-semibold text-base-content " + labelStyle}>{labelTitle}</span>
            </label>
            <input type={type || "text"} value={value} placeholder={placeholder || ""} onChange={(e) => updateInputValue(e.target.value)} className="input w-full border border-1 border-stone-700 focus:border-none" />
        </div>
    )
}


export default InputText