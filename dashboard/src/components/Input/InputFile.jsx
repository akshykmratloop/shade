import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeImages, updateImages } from "../../features/common/homeContentSlice";

const InputFile = ({ label, baseClass, inputClass, id, currentPath}) => {
  const dispatch = useDispatch();
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const ImageFromRedux = useSelector(state => state.homeContent.present.images)
  const fileInputRef = useRef(null); // Reference to input file

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : ""); // Update filename
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setContent(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setContent("");
    setFileName("");
    dispatch(removeImages({ section: id, src: "", currentPath }));

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input field
    }
  };

  useEffect(() => {
    if(content){
      dispatch(updateImages({ section: id, src: content, currentPath }));
    }
  }, [content]);


  return (
    <div className={`relative ${baseClass} mt-2`}>
      <label htmlFor={id} className="label-text sm:text-xs xl:text-sm">{label}</label>
      <input
        type="file"
        id={id}
        className="hidden"
        ref={fileInputRef} // Assign ref
        onChange={handleFileChange}
      />
      <label
        htmlFor={id}
        className={`flex justify-center gap-2 items-center w-full border border-stone-500 rounded-md px-3 py-2 cursor-pointer bg-[white] dark:bg-[#2a303c] text-gray-700 ${inputClass} mt-1`}
      >
        <Upload className="w-5 h-5 text-gray-400 text-xs" />
        <span className="text-gray-400 text-xs">{fileName || "Upload Image"}</span>
      </label>
      {ImageFromRedux[id] && (
        <div className="relative mt-2">
          <button className="absolute top-2 right-2 text-white bg-[#00000080] p-1 rounded-full shadow" onClick={clearFile}>
            <X className="w-4 h-4" />
          </button>
          <img src={ImageFromRedux[id]} alt="Preview" className="w-full max-w-xs rounded-md" />
        </div>
      )}
    </div>
  );
};

export default InputFile;
