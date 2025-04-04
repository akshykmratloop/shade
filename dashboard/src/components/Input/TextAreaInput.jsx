import { useState, useRef, useEffect } from "react";

function TextAreaInput({
  labelTitle,
  labelStyle,
  containerStyle,
  defaultValue,
  placeholder,
  textAreaStyle,
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

  // Function to adjust height dynamically
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset to calculate correct height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height dynamically
    }
  };

  useEffect(() => {
    adjustHeight(); // Adjust height on value change
  }, [value]);

  useEffect(() => {
    setValue(defaultValue || "");
    adjustHeight(); // Ensure correct height when default value changes
  }, [defaultValue]);

  return (
    <div className={`form-control w-full my-2 ${containerStyle}`}>
      {labelTitle && (
        <label className="label-text text-[#6B7888]">
          <span className={"label-text text-[#6B7888]" + labelStyle} style={{color:"#6B7888"}}>
            {labelTitle}
          </span>
        </label>
      )}
      <textarea
        dir={language === "ar" ? "rtl" : "ltr"}
        ref={textareaRef}
        value={value}
        className={`textarea textarea-bordered w-full border border-[#cecbcb] text-xs ${textAreaStyle}`}
        placeholder={placeholder || ""}
        onChange={(e) => updateInputValue(e.target.value)}
        rows={2} // Initial height of 2 rows
        style={{
          resize: "none", // Prevent manual resizing
          overflow: "hidden", // Avoid unnecessary scrollbars
          minHeight: "3rem", // Ensures at least 2 rows height
          whiteSpace: "pre-wrap", // Maintain text formatting
        }}
      ></textarea>
    </div>
  );
}

export default TextAreaInput;
