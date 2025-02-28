import { useState } from "react";
import { Upload } from "lucide-react";

const InputFile = ({ label, baseClass, labelClass, inputClass, id }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : ""); // Update the filename or reset if no file is selected
  };

  return (
    <div className={`relative ${baseClass} mt-2`}>
      <label htmlFor={id} className="label-text sm:text-xs xl:text-sm">{label}</label>
      <input
        type="file"
        id={id}  // ✅ This must match the label's htmlFor
        className="hidden"
        onChange={handleFileChange}
      />
      <label
        htmlFor={id}  // ✅ This ensures clicking the label opens the correct file input
        className={`flex justify-center gap-2 items-center w-full border border-stone-500 rounded-md px-3 py-2 cursor-pointer bg-[white] dark:bg-[#2a303c] text-gray-700 ${inputClass} mt-1`}
      >
        <Upload className="w-5 h-5 text-gray-400 text-xs" />
        <span className="text-gray-400 text-xs">{fileName || "Upload Image"}</span>
      </label>
    </div>
  );
};

export default InputFile;
