import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
      className={`form-control mb-4 w-full ${containerStyle}`}
      style={{ display: display ? "none" : "" }}
    >
      <label className="label">
        <span
          className={"label-text font-semibold text-base-content " + labelStyle}
        >
          {labelTitle}
        </span>
      </label>
      <div className="relative">
        <input
          type={showPassword && type === "password" ? "text" : type || "text"}
          name={name}
          value={value || ""}
          placeholder={placeholder || ""}
          onChange={(e) => updateInputValue(e.target.value)}
          className="input w-full input input-bordered border-stone-700 focus:border-none"
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
      </div>
    </div>
  );
}

export default InputText;
