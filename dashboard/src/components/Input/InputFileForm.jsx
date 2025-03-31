import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeImages, updateImages } from "../../features/common/homeContentSlice";

const InputFile = ({ label, baseClass, id, currentPath, section, fileIndex, isCloseButton }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const ImageFromRedux = useSelector(state => state.homeContent.present.images);
  const [fileURL, setFileURL] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create a URL from the file and store it
    const url = URL.createObjectURL(file);
    setFileURL(url);
    if (section === "socialIcons") {

      const newArray = ImageFromRedux?.socialIcons?.map((element, index) => {
        if (index === fileIndex) {
          return { ...element, img: url }
        } else {
          return element
        }
      })
      dispatch(updateImages({ section: "socialIcons", src: newArray, currentPath }));
    }
  };

  const clearFile = () => {
    setFileURL("");
    const newArray = ImageFromRedux?.socialIcons?.map((e, i) => {
      console.log(ImageFromRedux.OriginalSocialIcons[i], id.slice(-1))
      if (id.slice(-1) == ImageFromRedux.OriginalSocialIcons[i].id) {
        console.log("find true")
        return ImageFromRedux.OriginalSocialIcons[i]
      } else {
        return e
      }
    })
    dispatch(updateImages({ section: "socialIcons", src: newArray, currentPath }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const removeFileInput = () => {
    if (section === 'socialIcons') {
      const newArray = ImageFromRedux.socialIcons.filter((e, i) => { return e.id !== parseInt(id.slice(-1)) })
      const newOriginalArray = ImageFromRedux.OriginalSocialIcons.filter((e, i) => { return e.id !== parseInt(id.slice(-1)) })
      dispatch(updateImages({ src: newArray, section: "socialIcons" }))
      dispatch(updateImages({ src: newArray, section: "OriginalSocialIcons" }))
    }
    // setExtraFiles(extraFiles.filter(file => file.id !== id));
  };

  useEffect(() => {
    if (ImageFromRedux[id]) {
      setFileURL(ImageFromRedux[id]);
    }
  }, [ImageFromRedux, id]);

  useEffect(() => {
    dispatch(updateImages({ section: "OriginalSocialIcons", src: ImageFromRedux.socialIcons, currentPath }))
  }, [])

  return (
    <div className={`relative ${baseClass} mt-2 flex flex-col`}>
      {isCloseButton && <button
        className="absolute top-3 z-20 right-[-8px] bg-[#ff0000] text-white px-[5px] rounded-full shadow"
        onClick={removeFileInput}
      >
        ✖
      </button>}
      <label htmlFor={id} className="label-text sm:text-xs xl:text-sm mb-1 text-[#6B7888]">{label}</label>
      <div className="relative w-24 h-24 border border-[#cecbcb] rounded-md overflow-hidden cursor-pointer bg-white dark:bg-[#2a303c]">

        <input
          type="file"
          id={id}
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
        />
        <label htmlFor={id} className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
          {fileURL ? (
            fileURL.includes(".mp4") || fileURL.includes("video") || ImageFromRedux.video ? (
              <video src={fileURL} className="w-full h-full object-cover" controls />
            ) : (
              <img src={fileURL} alt="Preview" className="w-full h-full object-cover" />
            )
          ) : (
            <Upload className="w-6 h-6" />
          )}
        </label>
        {fileURL && (
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
