import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import xSign from '../../assets/x-close.png'
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
  customType
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState(defaultValue || "");

  const updateInputValue = (val) => {
    if (customType === "number" && isNaN(parseInt(val))) {
      if (val === "") {
        setValue(val);
        updateFormValue({ updateType, value: val });
      }
      return
    } else {
      setValue(val);
      updateFormValue({ updateType, value: val });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    setValue(defaultValue || "")
  }, [defaultValue])

  return (
    <div
      className={`form-control my-2 ${width ?? "w-full"} ${containerStyle}`}
      style={{ display: display ? "none" : "" }}
    >
      <label className="pl-0 mb-2">
        <span
          className={"label-text  " + labelStyle}
        >
          {labelTitle}
        </span>
      </label>
      <div className="relative ">
        <input
          dir={language === "ar" ? "rtl" : "ltr"}
          type={showPassword && type === "password" ? "text" : type || "text"}
          name={name}
          value={value || ""}
          placeholder={placeholder || ""}
          onChange={(e) => updateInputValue(e.target.value)}
          className={`input ${width ?? "w-full"}  h-[2.3rem] text-xs input input-bordered focus:border-none ${InputClasses || "border-stone-500"}`}
        />
        {type === "password" && value && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-1/2 right-3 transform -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        <ErrorText styleClass={`text-[.7rem] absolute top-[40px] left-[1px] gap-1 ${errorMessage ? "flex" : "hidden"}`}>
          <img src={xSign} alt="" className='h-3 translate-y-[2px]' />
          {errorMessage}</ErrorText>
      </div>
    </div>
  );
}

export default InputText;
