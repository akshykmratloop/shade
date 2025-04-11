import { useEffect, useRef, useState } from "react";
import { Upload, X, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeImages, updateImages } from "../../features/common/homeContentSlice";

const InputFileWithText = ({ label, baseClass, id, currentPath }) => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const ImageFromRedux = useSelector(state => state.homeContent.present.images);
    const [items, setItems] = useState([]);

    const handleFileChange = (event, index) => {
        const file = event.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const newItems = [...items];
        newItems[index] = { ...newItems[index], img: url };
        setItems(newItems);
        dispatch(updateImages({ section: id, src: url, currentPath }));
    };

    const handleUrlChange = (event, index) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], url: event.target.value };
        setItems(newItems);
    };

    const clearItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        dispatch(removeImages({ section: id, src: "", currentPath }));
    };

    const addItem = () => {
        setItems([...items, { img: "", url: "" }]);
    };

    useEffect(() => {
        if (ImageFromRedux[id]) {
            setItems(ImageFromRedux[id]);
        }
    }, [ImageFromRedux, id]);

    return (
        <div className={`relative ${baseClass} mt-2 flex flex-col`}>
            <label className="label-text sm:text-xs xl:text-sm mb-1 text-[#6B7888]">{label}</label>
            {items.map((item, index) => (
                <div key={index} className="flex items-center flex-col gap-2 mb-2">
                    <div className="relative w-24 h-24 border border-[#cecbcb] rounded-md overflow-hidden cursor-pointer bg-white dark:bg-[#2a303c]">
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => handleFileChange(e, index)}
                            accept="image/*,video/*"
                        />
                        <label className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            {item.img ? (
                                item.img.includes(".mp4") || item.img.includes("video") ? (
                                    <video src={item.img} className="w-full h-full object-cover" controls />
                                ) : (
                                    <img src={item.img} alt="Preview" className="w-full h-full object-cover" />
                                )
                            ) : (
                                <Upload className="w-6 h-6" />
                            )}
                        </label>
                        {item.img && (
                            <button
                                className="absolute top-1 right-1 bg-[#00000080] text-white p-1 rounded-full shadow"
                                onClick={() => clearItem(index)}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Enter URL"
                        value={item.url}
                        onChange={(e) => handleUrlChange(e, index)}
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                    />
                </div>
            ))}
            <button
                className="mt-2 flex items-center gap-1 text-blue-500 hover:text-blue-700"
                onClick={addItem}
            >
                <Plus className="w-5 h-5" /> Add Item
            </button>
        </div>
    );
};

export default InputFileWithText;
