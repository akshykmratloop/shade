import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeImages, updateImages } from "../../features/common/homeContentSlice";

const InputFile = ({ label, baseClass, id, currentPath }) => {
  const dispatch = useDispatch();
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const ImageFromRedux = useSelector(state => state.homeContent.present.images);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const fileType = file.type.split("/")[0];

    if (fileType === "image") {
      const reader = new FileReader();
      reader.onload = (e) => setContent(e.target.result);
      reader.readAsDataURL(file);
    } else if (fileType === "video") {
      setContent(URL.createObjectURL(file)); // Only storing the URL/path for videos
    }
  };

  const clearFile = () => {
    setContent("");
    setFileName("");
    dispatch(removeImages({ section: id, src: "", currentPath }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (content) {
      dispatch(updateImages({ section: id, src: content, currentPath }));
    }
  }, [content]);

  return (
    <div className={`relative ${baseClass} mt-2 flex flex-col`}>
      <label htmlFor={id} className="label-text sm:text-xs xl:text-sm mb-1">{label}</label>
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
          {ImageFromRedux[id] ? (
            ImageFromRedux[id].includes("blob:") || ImageFromRedux[id].includes("video") ? (
              <video src={ImageFromRedux[id]} className="w-full h-full object-cover" controls />
            ) : (
              <img src={ImageFromRedux[id]} alt="Preview" className="w-full h-full object-cover" />
            )
          ) : (
            <Upload className="w-6 h-6" />
          )}
        </label>
        {ImageFromRedux[id] && (
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

export default InputFile;