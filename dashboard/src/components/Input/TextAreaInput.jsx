import { useState, useRef, useEffect } from "react";

function TextAreaInput({
  labelTitle,
  labelStyle,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
}) {
  const [value, setValue] = useState(defaultValue || "");
  const textareaRef = useRef(null);

  const updateInputValue = (val) => {
    setValue(val);
    updateFormValue({ updateType, value: val });
  };

  // Adjust height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // Adjust height
    }
  }, [value]);

  useEffect(() => {
    setValue(defaultValue || "")
  }, [defaultValue])

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={"label-text text-base-content " + labelStyle}>
          {labelTitle}
        </span>
      </label>
      <textarea
        ref={textareaRef}
        value={value}
        className="textarea textarea-bordered w-full min-h-[2.3rem] overflow-hidden resize-none border border-stone-500 text-xs"
        placeholder={placeholder || ""}
        onChange={(e) => updateInputValue(e.target.value)}
        style={{ height: "2.3rem", whiteSpace:"pre-wrap" }} // Default height same as input
      ></textarea>
    </div>
  );
}

export default TextAreaInput;
