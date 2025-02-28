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
  errorMessagePosition,
  InputClasses
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState(defaultValue || "");

  const updateInputValue = (val) => {
    setValue(val);
    updateFormValue({ updateType, value: val });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])
  return (
    <div
      className={`form-control my-2 w-full ${containerStyle}`}
      style={{ display: display ? "none" : "" }}
    >
      <label className="pl-0">
        <span
          className={"label-text text-base-content " + labelStyle}
        >
          {labelTitle}
        </span>
      </label>
      <div className="relative ">
        <input
          type={showPassword && type === "password" ? "text" : type || "text"}
          name={name}
          value={value || ""}
          placeholder={placeholder || ""}
          onChange={(e) => updateInputValue(e.target.value)}
          className={`input w-full input input-bordered border-stone-700 focus:border-none ${InputClasses || ""}`}
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
        <ErrorText styleClass={`text-xs absolute top-[50px] gap-1 ${errorMessage ? "flex" : "hidden"}`}>
          <img src={xSign} alt="" className='h-3 translate-y-[2px]' />
          {errorMessage}</ErrorText>
      </div>
    </div>
  );
}

export default InputText;
