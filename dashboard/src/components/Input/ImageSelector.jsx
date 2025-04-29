import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { uploadMedia } from "../../app/fetch";

const ImageSelector = ({ onSelectImage, onClose }) => {
    const fileInputRef = useRef(null);
    const modalRef = useRef(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [metadata, setMetadata] = useState(null);

    const images = [
        "https://images.pexels.com/photos/1012216/pexels-photo-1012216.jpeg",
        "https://images.unsplash.com/photo-1601278963628-7b7b7cbdfe96",
        "https://plus.unsplash.com/premium_photo-1671245156908-61e26926cef9",
        "https://as2.ftcdn.net/v2/jpg/03/74/44/27/1000_F_374442717_Qg4mjeIjxMvOzr4oVxP4oYRN228kM6ac.jpg",
        "https://images.pexels.com/photos/1012216/pexels-photo-1012216.jpeg",
        "https://images.unsplash.com/photo-1601278963628-7b7b7cbdfe96",
        "https://plus.unsplash.com/premium_photo-1671245156908-61e26926cef9",
        "https://as2.ftcdn.net/v2/jpg/03/74/44/27/1000_F_374442717_Qg4mjeIjxMvOzr4oVxP4oYRN228kM6ac.jpg", "https://images.pexels.com/photos/1012216/pexels-photo-1012216.jpeg",
        "https://images.unsplash.com/photo-1601278963628-7b7b7cbdfe96",
        "https://plus.unsplash.com/premium_photo-1671245156908-61e26926cef9",
        "https://as2.ftcdn.net/v2/jpg/03/74/44/27/1000_F_374442717_Qg4mjeIjxMvOzr4oVxP4oYRN228kM6ac.jpg", "https://images.pexels.com/photos/1012216/pexels-photo-1012216.jpeg",
        "https://images.unsplash.com/photo-1601278963628-7b7b7cbdfe96",
        "https://plus.unsplash.com/premium_photo-1671245156908-61e26926cef9",
        "https://as2.ftcdn.net/v2/jpg/03/74/44/27/1000_F_374442717_Qg4mjeIjxMvOzr4oVxP4oYRN228kM6ac.jpg",
    ];

    // ========== HANDLERS ==========

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await uploadMedia(formData);
            if (response.message !== "Success") throw new Error("Upload failed");

            const result = await response.json();
            const uploadedImageURL = result?.imageUrl || URL.createObjectURL(file);
            setSelectedImage(uploadedImageURL);

            // Extract dimensions
            const img = new Image();
            img.onload = () => {
                const sizeKB = file.size / 1024;
                const size =
                    sizeKB > 1024
                        ? `${(sizeKB / 1024).toFixed(2)} MB`
                        : `${sizeKB.toFixed(2)} KB`;

                setMetadata({
                    name: file.name,
                    size,
                    width: img.width,
                    height: img.height,
                    uploadedAt: new Date().toLocaleString(),
                });
            };
            img.src = uploadedImageURL;
        } catch (err) {
            console.error("Upload error:", err);
        }
    };

    const handleImageSelect = (src, index) => {
        const img = new Image();
        img.onload = () => {
            setSelectedImage(src);
            setMetadata({
                name: `Image ${index + 1}`,
                size: "Unknown",
                width: img.width,
                height: img.height,
                uploadedAt: "Remote Image",
            });
        };
        img.src = src;
    };

    const clearSelectedImage = () => {
        setSelectedImage(null);
        setMetadata(null);
    };

    // ========== OUTSIDE CLICK ==========

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [onClose]);

    // ========== RENDER ==========

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div
                ref={modalRef}
                className="bg-white p-6 rounded-lg max-w-[90%] h-[80vh] overflow-hidden w-full relative dark:bg-[#242933]"
            >
                <h2 className="text-[20px] font-[500] dark:text-stone-300">Select or Upload an Image</h2>

                <div className="flex h-[80%] gap-2 mt-4">
                    {/* Image Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-scroll flex-[5_1_1200px] h-full customscroller p-5 dark:border dark:border-stone-50/0">
                        {images.map((src, idx) => (
                            <div
                                key={idx}
                                className={`w-full h-40 overflow-hidden rounded cursor-pointer border-2 ${selectedImage === src
                                    ? "border-blue-500 brightness-[.6]"
                                    : "border-transparent"
                                    }`}
                                onClick={() => handleImageSelect(src, idx)}
                            >
                                <img
                                    src={src}
                                    alt={`Image ${idx}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Preview Panel */}
                    <div className="flex-[1_0_auto] h-full bg-[#F3F3F3] p-4 rounded w-1/3 dark:bg-[#242941]">
                        <h3 className="font-semibold mb-2">Attachment Details</h3>
                        {selectedImage ? (
                            <div className="flex flex-col">
                                <div className=" w-full relative flex gap-2 border-b border-b-2 pb-4">
                                    <div className="h-[20vh] w-[18vw] relative border">
                                        <img
                                            src={selectedImage}
                                            alt="Selected"
                                            className="w-full h-full object-contain rounded cursor-pointer"
                                            title="Click to clear"
                                        />
                                        <button className="absolute top-[2px] right-2 bg-[#ffffff80] dark:bg-[#fffffffa] rounded-full p-1" onClick={clearSelectedImage}>
                                            <X width={16} height={16} />
                                        </button>
                                    </div>
                                    <div className="mt-2 text-[10px] space-y-1 w-1/3">
                                        <p><strong> {metadata?.name} </strong>  </p>
                                        <p>{metadata?.size}</p>
                                        <p>{metadata?.width} × {metadata?.height}</p>
                                        <p>{metadata?.uploadedAt}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex gap-4">
                                        <label htmlFor="altText" className="w-[50%] text-right">Alt text</label>
                                        <div className="flex flex-col gap-2">
                                            <input type="text" className="w-full rounded-md h-[5vh] dark:bg-[#fff]"  id="altText"/>
                                            <p className="text-[10px]"><span className="text-blue-500">Describe the purpose of the image.</span> Leave empty if the image is purely decorative</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">No image selected</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 items-center mt-6">
                    <div className="flex gap-4">
                        {selectedImage && (
                            <button
                                onClick={() => onSelectImage(selectedImage)}
                                className="bg-blue-800 text-white px-4 py-2 rounded shadow"
                            >
                                Select
                            </button>
                        )}
                    </div>
                    <div>
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                        >
                            <Upload className="w-4 h-4" /> Upload Image
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>

                {/* Close Button */}
                <button
                    className="absolute top-4 right-6 text-gray-500 text-xl"
                    onClick={onClose}
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default ImageSelector;
