import { useState, useRef, useEffect } from "react";

function TextAreaInput({
  labelTitle,
  labelStyle,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
  language
}) {
  const [value, setValue] = useState(defaultValue || "");
  const textareaRef = useRef(null);

  const updateInputValue = (val) => {
    setValue(val);
    updateFormValue({ updateType, value: val });
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to recalculate
      const newHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.minHeight = `${newHeight}px`; // Set height dynamically
    }
  }, [value]);

  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={"label-text text-base-content " + labelStyle}>
          {labelTitle}
        </span>
      </label>
      <textarea
        dir={language === "ar" ? "rtl" : "ltr"}
        ref={textareaRef}
        value={value}
        className="textarea textarea-bordered w-full overflow-hidden border border-stone-500 text-xs"
        placeholder={placeholder || ""}
        onChange={(e) => updateInputValue(e.target.value)}
        style={{ resize: "vertical", minHeight: "2.3rem", whiteSpace: "pre-wrap", }} // Allows only upward resizing
      ></textarea>
    </div>
  );
}

export default TextAreaInput;