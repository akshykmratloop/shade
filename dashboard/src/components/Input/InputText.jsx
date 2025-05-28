import { useEffect, useState } from "react";
import { Eye, EyeOff, UndoIcon } from "lucide-react";
import xSign from "../../assets/x-close.png";
import greenDot from "../../assets/icons/dot.svg";
import ErrorText from "../Typography/ErrorText";
// import capitalizeword from "../../app/capitalizeword";
import capitalizeWords from "../../app/capitalizeword";

function InputText({
  labelTitle,
  labelStyle,
  type,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
  display,
  name,
  errorMessage,
  InputClasses,
  width,
  language,
  customType,
  options = [],
  required = true,
  errorClass,
  disabled = false,
  maxLength,
  outOfEditing
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState(defaultValue || "");

  const updateInputValue = (val) => {
    const trimmedVal = val.slice(0, Number(maxLength) || 100);
    if (customType === "number" && isNaN(parseInt(trimmedVal))) {
      if (trimmedVal === "") {
        setValue(trimmedVal);
        setTimeout(() => {
          updateFormValue({ updateType, value: trimmedVal });
        }, 0);
      }
      return;
    } else {
      setValue(trimmedVal);
      setTimeout(() => {
        updateFormValue({ updateType, value: trimmedVal });
      }, 0);
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  return (
    <div
      className={`form-control my-2 ${width ?? "w-full"} ${containerStyle}`}
      style={{ display: display ? "none" : "" }}
    >
      <label className={`pl-0 ${type === "checkbox" ? "mb-6" : "mb-1 "}`}>
        <span className={"label-text text-[#6B7888] " + labelStyle}>
          {labelTitle}
          {required && (<span className="text-[red]">*</span>)}
        </span>
      </label>
      <div className="relative">
        {type === "select" ? (
          // **Select Dropdown**
          <select
            name={name}
            value={value}
            onChange={(e) => updateInputValue(e.target.value)}
            className={`input ${width ?? "w-full"
              } h-[2.3rem] text-xs input input-bordered border-[#cecbcb] focus:border-none ${InputClasses || ""
              }`}
          >
            <option value="" disabled>
              {placeholder || "Select an option"}
            </option>
            {options.map((opt, index) => (
              <option key={index} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === "checkbox" ? (
          // **Checkboxes**
          <div className="grid grid-cols-2 md:grid-cols-2 gap-x-10 gap-y-2 w-full items-center pl-2">
            {options.map((opt, index) => (
              <label key={index} className="flex items-center space-x-2 label-text text-[#6B7888] cursor-pointer">
                <input
                  type="checkbox"
                  name={name}
                  value={opt.id}
                  checked={value.includes(opt.id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setValue((prev) => {
                      const newValue = checked
                        ? [...prev, opt.id] // Add to array if checked
                        : prev.filter((v) => v !== opt.id); // Remove if unchecked

                      updateFormValue({ updateType, value: newValue });
                      return newValue;
                    });
                  }}
                  className="cursor-pointer"
                />
                {/* <div
                  className={`w-5 h-5 flex items-center justify-center border-2 border-gray-300 transition-all ${
                    value.includes(opt.id)
                      ? "bg-[white] p-[2px] border-[#12B28C] text-white"
                      : "bg-white border-gray-400 group-hover:border-primary"
                  }`}
                >
                  {value.includes(opt.id) && (
                    <div className="w-3 h-3 rounded-full  border-[#12B28C] bg-[#12B28C]"></div>
                  )}
                </div> */}
                <span className="text-xs cursor-pointer">{capitalizeWords(opt.name)}</span>
              </label>
            ))}
          </div>
        ) : (
          // **Regular Input (Text, Password, etc.)**
          <input
            dir={language === "ar" ? updateType === "url" ? "ltr" : "rtl" : "ltr"}
            type={showPassword && type === "password" ? "text" : type || "text"}
            name={name}
            value={value || ""}
            placeholder={placeholder || ""}
            onChange={(e) => updateInputValue(e.target.value)}
            disabled={disabled || outOfEditing}
            maxLength={maxLength || 35}
            className={`input ${width ?? "w-full"}
            dark:disabled:bg-[#2a303c] dark:disabled:border-stone-200/10
             h-[2.3rem] text-xs input input-bordered border-[#80808044] focus:border-[#0000007e] dark:focus:border-[#ffffff7e] ${InputClasses || ""
              }`}

          />
        )}
        {type === "password" && value && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-1/2 right-3 transform -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        <ErrorText
          styleClass={`absolute ${errorClass ? errorClass : "text-[.7rem] top-[40px] left-[1px] gap-1"} ${errorMessage ? "flex" : "hidden"
            }`}
        >
          <img src={xSign} alt="" className="h-3 translate-y-[2px]" />
          {errorMessage}
        </ErrorText>
      </div>
    </div>
  );
}

export default InputText;
