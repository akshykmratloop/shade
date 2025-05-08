import { useState } from "react";
import { Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeImages, updateImages } from "../../features/common/homeContentSlice";
import ImageSelector from "./ImageSelector"; // Import here
import { Img_url } from "../../routes/backend";

const InputFile = ({ label, baseClass, id, currentPath, resourceId, contentIndex, index, subSection, section, outOfEditing }) => {
  const dispatch = useDispatch();
  const ImageFromRedux = useSelector(state => state.homeContent.present.images);
  const [fileURL, setFileURL] = useState("");
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const clearFile = () => {
    setFileURL("");
    dispatch(removeImages({ section: id, src: "", currentPath }));
  };

  const handleImageSelect = (url) => {
    setFileURL(url);
    dispatch(updateImages({ section, src: url[0], currentPath, index: contentIndex, cardIndex: index, subSection }));
    setIsSelectorOpen(false);
  };

  return (
    <div className={`relative ${baseClass} mt-2 flex flex-col`}>

      <label htmlFor={id} className="label-text sm:text-xs xl:text-sm mb-1 text-[#6B7888]">{label}</label>
      <div
        className="relative w-24 h-24 border border-[#80808044] rounded-md overflow-hidden cursor-pointer bg-white dark:bg-[#2a303c]"
      >
        {
          outOfEditing &&
          <div className="bg-black/30 absolute z-[20] top-0 left-0 h-full w-full rounded-md cursor-not-allowed"></div>
        }
        <div onClick={() => setIsSelectorOpen(true)}
          className="relative w-24 h-24 border border-[#80808044] rounded-md overflow-hidden cursor-pointer bg-white dark:bg-[#2a303c]"
          >


          {fileURL ? (
            fileURL.includes(".mp4") || fileURL.includes("video") ? (
              <video src={fileURL} className="w-full h-full object-cover" controls />
            ) : (
              <img src={Img_url + fileURL} alt="Preview" className="w-full h-full object-cover" />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              <Upload className="w-6 h-6" />
            </div>
          )}
          {/* {fileURL && (
          <button
            className="absolute top-1 right-1 bg-[#00000080] text-white p-1 rounded-full shadow"
            onClick={(e) => { e.stopPropagation(); clearFile(); }}
          >
            <X className="w-4 h-4" />
          </button>
          )} */}
        </div>
      </div>

      {isSelectorOpen && (
        <ImageSelector
          onSelectImage={handleImageSelect}
          onClose={() => setIsSelectorOpen(false)}
          resourceId={resourceId}
        />
      )}
    </div>
  );
};

export default InputFile;
