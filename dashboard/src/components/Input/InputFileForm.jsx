import { useEffect, useRef, useState } from "react";
import { X, User } from "lucide-react";

const InputFileForm = ({ label, baseClass, id, updater }) => {
  const [content, setContent] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    updater(prev => ({...prev, file}))
    if (!file) return;

    const fileType = file.type.split("/")[0];

    if (fileType === "image") {
      const reader = new FileReader();
      reader.onload = (e) => setContent(e.target.result);
      reader.readAsDataURL(file);
    } else if (fileType === "video") {
      setContent(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setContent("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`relative ${baseClass} mt-2 flex flex-col items-center`}>
      <label htmlFor={id} className="label-text sm:text-xs xl:text-sm mb-1">
        {label}
      </label>
      <div className="relative w-24 h-24 border border-stone-500 rounded-md overflow-hidden cursor-pointer bg-white dark:bg-[#2a303c]">
        <input
          type="file"
          id={id}
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
        />
        <label
          htmlFor={id}
          className="w-full h-full flex items-center justify-center text-gray-400 text-xs"
        >
          {content ? (
            content.includes("blob") ? (
              <video src={content} className="w-full h-full object-cover" controls />
            ) : (
              <img src={content} alt="Preview" className="w-full h-full object-cover" />
            )
          ) : (
            <User className="w-6 h-6" />
          )}
        </label>
        {content && (
          <button
            className="absolute top-1 right-1 bg-[#00000080] text-white p-1 rounded-full shadow"
            onClick={clearFile}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InputFileForm;
