import {useEffect, useState} from "react";
import {Eye, EyeOff} from "lucide-react";
import xSign from "../../assets/x-close.png";
import ErrorText from "../Typography/ErrorText";

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
  options = [], // Used for select dropdown & checkboxes
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState(
    defaultValue || (type === "checkbox" ? [] : "")
  );

  const updateInputValue = (val) => {
    setValue(val);
    updateFormValue({updateType, value: val});
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    setValue(defaultValue || (type === "checkbox" ? [] : ""));
  }, [defaultValue]);

  return (
    <div
      className={`form-control my-2 ${width ?? "w-full"} ${containerStyle}`}
      style={{display: display ? "none" : ""}}
    >
      <label className="pl-0 mb-1">
        <span className={"label-text text-base-content " + labelStyle}>
          {labelTitle}
        </span>
      </label>
      <div className="relative">
        {type === "select" ? (
          // **Select Dropdown**
          <select
            name={name}
            value={value}
            onChange={(e) => updateInputValue(e.target.value)}
            className={`input ${
              width ?? "w-full"
            } h-[2.3rem] text-xs input input-bordered border-stone-500 focus:border-none ${
              InputClasses || ""
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
          <div className="flex flex-wrap gap-2">
            {options.map((opt, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={name}
                  value={opt.value}
                  checked={value.includes(opt.value)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const newValue = checked
                      ? [...value, opt.value]
                      : value.filter((v) => v !== opt.value);
                    updateInputValue(newValue);
                  }}
                  className="checkbox checkbox-primary"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        ) : (
          // **Regular Input (Text, Password, etc.)**
          <input
            dir={language === "ar" ? "rtl" : "ltr"}
            type={showPassword && type === "password" ? "text" : type || "text"}
            name={name}
            value={value || ""}
            placeholder={placeholder || ""}
            onChange={(e) => updateInputValue(e.target.value)}
            className={`input ${
              width ?? "w-full"
            } h-[2.3rem] text-xs input input-bordered border-stone-500 focus:border-none ${
              InputClasses || ""
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
          styleClass={`text-[.7rem] absolute top-[40px] left-[1px] gap-1 ${
            errorMessage ? "flex" : "hidden"
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
