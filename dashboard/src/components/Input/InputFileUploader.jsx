import { useEffect, useRef, useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
// import { removeImages, updateImages } from "../../features/common/homeContentSlice";
import { FaFileUpload } from "react-icons/fa";
import { TruncateText } from "../../app/capitalizeword";
import ImageSelector from "./ImageSelector";

const FileUploader = ({ label, baseClass, id, currentPath, outOfEditing }) => {
    const dispatch = useDispatch();
    const [fileName, setFileName] = useState("");
    const [fileURL, setFileURL] = useState("");
    const fileInputRef = useRef(null);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setFileName(file.name);
        const fileType = file.type.split("/")[0];
        const fileExtension = file.name.split(".").pop().toLowerCase();

        if (fileType === "image") {
            // Handle image preview
            const reader = new FileReader();
            reader.onload = (e) => setFileURL(e.target.result);
            reader.readAsDataURL(file);
        } else if (fileExtension === "pdf") {
            // Handle PDF preview
            setFileURL(URL.createObjectURL(file));
        } else {
            // Other file types (DOCX, ZIP, etc.)
            setFileURL("");
        }
    };

    const handleImageSelect = (url, altText) => {
        // setFileURL(url[0]);
        const payloadData = {
            url: url[0],
            altText: {
                en: altText.en,
                ar: altText.ar
            },
            order
        }
        dispatch(updateImages({
            section,
            src: directIcon ? url[0] : payloadData,
            currentPath,
            index: contentIndex,
            cardIndex: index,
            subSection,
            directIcon,
            order,
            type: "refDoc"
        }));
        setIsSelectorOpen(false);
    };

    const clearFile = () => {
        setFileURL("");
        setFileName("");
        // dispatch(removeImages({ section: id, src: "", currentPath }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        if (fileURL) {
            // dispatch(updateImages({ section: id, src: fileURL, type: "refDoc" }));
        }
    }, [fileURL]);

    return (
        <div className={`relative ${baseClass} mt-2 mb-4 flex flex-col `}>

            <label htmlFor={id} className="label-text sm:text-xs xl:text-sm mb-1 text-[#6B7888]">{label}</label>

            {/* File Input Bar */}
            <div className="relative w-full rounded-md overflow-hidden cursor-pointer bg-[#F4F4F4] dark:bg-[#2a303c] flex items-center p-2">
                {outOfEditing &&
                    <div className="absolute bg-stone-300/30 top-0 left-0 z-[35] cursor-not-allowed w-full h-full select-none">
                    </div>}
                <input
                    type="file"
                    id={id}
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,application/pdf,.docx,.xlsx,.zip,.txt"
                    disabled={outOfEditing}
                />
                <label htmlFor={id} className="flex items-center gap-2 cursor-pointer w-full ">
                    <FaFileUpload className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-[#6B7888] dark:text-gray-300 truncate">
                        {TruncateText(fileName, 20) || "Upload your file..."}
                    </span>
                </label>

            </div>

            {/* File Preview Section */}
            {/* {fileURL && (
                <div className="mt-3 p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800 relative">
                    {fileName && (
                        <button
                            className="absolute right-[-8px] top-[-8px] bg-[#00000080] text-white p-1 rounded-full shadow"
                            onClick={clearFile}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    {fileName.endsWith(".pdf") ? (
                        <embed src={fileURL} type="application/pdf" className="w-full h-48" />
                    ) : fileURL ? (
                        <img src={fileURL} alt="Preview" className="w-full h-auto rounded-md" />
                    ) : (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FileText className="w-5 h-5" />
                            <span className="text-sm truncate">{TruncateText(fileName, 20)}</span>
                        </div>
                    )}
                </div>
            )} */}
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

export default FileUploader;
