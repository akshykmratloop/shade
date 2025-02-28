import { useState } from "react";
import { Upload } from "lucide-react";

const InputFile = ({ label, baseClass, labelClass, inputClass }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : ""); // Update the filename or reset if no file is selected
  };

  return (
    <div className={`relative ${baseClass} mt-2`}>
        <label htmlFor="" className="label-text">{label}</label>
      <input
        type="file"
        id="fileUpload"
        className="hidden"
        onChange={handleFileChange}
      />
      <label
        htmlFor="fileUpload"
        className={`flex justify-center gap-2 items-center w-full border border-stone-700 rounded-md px-3 py-2 cursor-pointer bg-white text-gray-700 ${inputClass}`}
      >
        <Upload className="w-5 h-5 text-gray-400" />
        <span className="text-gray-400">{fileName || "Upload Image"}</span>
      </label>
    </div>
  );
};

export default InputFile;