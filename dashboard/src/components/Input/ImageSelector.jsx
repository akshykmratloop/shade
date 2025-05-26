import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { useImageUpload } from "./useImageUpload"; // import the hook
import { deleteMedia, fetchAllImages } from "../../app/fetch";
import { Img_url } from "../../routes/backend";
import Popups from "../../features/Resources/components/breakUI/Popups";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
const imageStructure = [{
    "id": "",
    "url": "",
    "publicId": "",
    "type": "",
    "width": NaN,
    "height": NaN,
    "altText": "",
    "createdAt": "",
    "resourceId": ""
}]

const ImageSelector = ({ onSelectImage, onClose }) => {
    const [resourceId, setResourceId] = useState('')
    // const resourceId = useSelector(state => state.versions.resourceId)
    console.log(resourceId)
    const fileInputRef = useRef(null);
    const modalRef = useRef(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [uploading, setUploading] = useState(false); // Local uploading state for UI
    // const [error, setError] = useState(null); // For any upload errors
    const [uploadCancel, setUploadCancel] = useState(false); // To track cancel status
    const [imagesByResource, setImagesByResources] = useState(true)
    const [images, setImages] = useState(imageStructure)
    const [loadingImages, setLoadingImages] = useState(false);
    const [deleteImgId, setDeleteImgId] = useState("")
    const [popup, setPopup] = useState(false)
    const [random, setRandom] = useState(Math.random())
    const [altText, setAltText] = useState({ en: "", ar: "" })

    const { uploadImage } = useImageUpload(resourceId); // hook for uploading images

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length || uploading) return;

        const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length) {
            toast.error("One or more files exceed the 5MB size limit.", { hideProgressBar: true, autoClose: 1000 });
            return;
        }

        setUploading(true);
        setUploadCancel(false);

        try {
            // Call your API to upload all files at once
            await uploadImage(files.length > 1 ? files : files[0]); // Replace with your API call
            setRandom(Math.random()); // Refresh image grid
            toast.success("All images uploaded successfully", { hideProgressBar: true, autoClose: 1000 });
        } catch (err) {
            console.error("Error uploading images:", err);
            toast.error(err, { hideProgressBar: true, autoClose: 1000 });
        } finally {
            setUploading(false);
        }
    };


    const handleAltText = (e) => {
        setAltText(prev => {

            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    const handleImageSelect = (src, index) => {
        if (uploading) return; // Prevent image selection if uploading
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

    const handleImageDelete = async () => {
        try {
            const response = await deleteMedia(deleteImgId)
            if (response.ok) {
                toast.success("Image has been deleted Successfully.", { pauseOnHover: false, autoClose: 700, hideProgressBar: true })
                setRandom(Math.random())
            } else {
                throw new Error("Failed to delete image")
            }
        } catch (err) {
            console.log(err)
            toast.error(err, { hideProgressBar: true })
        }
    }

    const clearSelectedImage = () => {
        setSelectedImage(null);
        setMetadata(null);
    };

    useEffect(() => { // get images
        async function getAllImagesHandler() {
            setLoadingImages(true);
            if (!imagesByResource || (imagesByResource && resourceId)) {
                try {
                    const response = await fetchAllImages(imagesByResource ? { resourceId } : "");
                    if (response.ok) {
                        setImages(response.media);
                    } else {
                        throw new Error("Error while fetching images");
                    }
                } catch (err) {
                    console.log(err);
                } finally {
                    setLoadingImages(false);
                }
            }
        }
        getAllImagesHandler();
    }, [imagesByResource, random, resourceId]);


    useEffect(() => {
        setResourceId(localStorage.getItem("contextId"))
    }, [])
    // OUTSIDE CLICK 

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [onClose]);

    // RENDER 

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div
                ref={modalRef}
                className="bg-white p-6 rounded-lg max-w-[90%] h-[80vh] overflow-hidden w-full relative dark:bg-[#242933]"
            >
                <h2 className="text-[20px] font-[500] dark:text-stone-300">Select or Upload an Image</h2>

                <div className="flex h-[80%] gap-2 mt-4 items-stretch">
                    {/* Image Grid */}
                    <div className="flex-[5_1_1200px] self-stretch h-full flex flex-col ">

                        <ul className="flex gap-">
                            <li onClick={() => setImagesByResources(true)} className={`dark:text-stone-200 text-stone-50 px-2 text-sm py-1 rounded-[2px] ${imagesByResource ? "dark:bg-blue-800 bg-blue-500" : "bg-stone-300 dark:bg-stone-500 "}`}>This Page only</li>
                            <li onClick={() => setImagesByResources(false)} className={`dark:text-stone-200 text-stone-50 px-2 text-sm py-1 rounded-[2px] ${!imagesByResource ? "dark:bg-blue-800 bg-blue-500" : "bg-stone-300 dark:bg-stone-500 "}`}>All Images</li>
                        </ul>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-scroll flex-[1] customscroller p-5 border border-stone-500/20 ">
                            {loadingImages ? (
                                <div className="col-span-full flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                                    <span className="ml-4 text-gray-600 dark:text-stone-300">Loading images...</span>
                                </div>
                            ) : (
                                images.map((imgObj, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-full h-40 relative overflow-hidden rounded cursor-pointer border-2 
                                            ${selectedImage === `${Img_url}/${imgObj.publicId}` ?
                                                "border-blue-500" : "border-transparent"
                                            }`}
                                    >
                                        <img
                                            src={`${Img_url}/${imgObj.publicId}`}
                                            alt={`Image ${idx}`}
                                            className={`w-full h-full object-fill ${selectedImage === `${Img_url}/${imgObj.publicId}` && "brightness-[0.6]"}`}
                                            draggable={false}
                                            onClick={() => handleImageSelect(`${Img_url}/${imgObj.publicId}`, idx)}

                                        />
                                        {
                                            imagesByResource &&
                                            <button className="absolute z-[40] top-[2px] right-2 bg-[#80808080] text-white rounded-full p-1"
                                                onClick={() => { setDeleteImgId(imgObj.id); setPopup(true) }}
                                            >
                                                <X width={16} height={16} />
                                            </button>
                                        }
                                    </div>
                                ))
                            )}
                        </div>
                    </div>


                    {/* Preview Panel */}
                    <div className="flex-[1_0_auto]  bg-[#F3F3F3] p-4 rounded w-1/3 dark:bg-[#242941] mt-[25px]">
                        <h3 className="font-semibold mb-2">Attachment Details</h3>
                        {uploading ? (
                            <div className="flex justify-center items-center w-full h-full">
                                <div className="spinner-border animate-spin border-4 border-blue-500 rounded-full w-12 h-12" />
                                <p className="text-gray-500 ml-4">Uploading...</p>
                            </div>
                        ) : selectedImage ? (
                            <div className="flex flex-col">
                                <div className=" w-full relative flex gap-2 border-b border-b-2 pb-4">
                                    <div className="h-[20vh] w-[18vw] relative border">
                                        <img
                                            src={selectedImage}
                                            alt="Selected"
                                            className="w-full h-full object-contain rounded cursor-pointer"
                                            draggable={false}
                                        />
                                        <button title="Click to clear" className="absolute top-[2px] right-2 bg-[#808080a8] text-white rounded-full p-1" onClick={clearSelectedImage}>
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
                                <div className="flex flex-col gap-4 mt-4">
                                    <label htmlFor="altEn" className="flex sm:flex-col xl:flex-row text-sm justify-between xl:items-center">
                                        Alt Text English
                                        <input onChange={handleAltText} type="text" name="en" id="altEn" className="rounded-sm p-2 text-xs xl:w-[15vw] sm:w-full" />
                                    </label>
                                    <label htmlFor="altEn" className="flex sm:flex-col xl:flex-row text-sm justify-between xl:items-center">
                                        Alt Text Arabic
                                        <input onChange={handleAltText} type="text" name="ar" id="altEn" className="rounded-sm p-2 text-xs xl:w-[15vw] sm:w-full" dir="rtl" />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">No image selected</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between gap-4 items-center mt-6">
                    <div>
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                            disabled={uploading}
                        >
                            <Upload className="w-4 h-4" /> Upload Image
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleFileUpload}
                            multiple
                        />
                    </div>
                    <div className="flex gap-4">
                        {selectedImage && !uploading && (
                            <button
                                onClick={() => onSelectImage(selectedImage.split("/").slice(-1), altText)}
                                className="bg-blue-800 text-white px-4 py-2 rounded shadow text-[15px]"
                            >
                                Select
                            </button>
                        )}
                    </div>

                </div>

                {/* Close Button */}
                <button
                    className="absolute top-4 right-6 text-gray-500 text-xl"
                    onClick={onClose}
                >
                    ✕
                </button>
                <Popups display={popup} setClose={() => setPopup(false)} confirmationText={"Are you sure you want to delete this image?"} confirmationFunction={handleImageDelete} />
            </div>

            {/* <ToastContainer /> */}
        </div>
    );
};

export default ImageSelector;



// HANDLERS 

// const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file || uploading) return; // Prevent uploading if already uploading

//     if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size must be less than 5MB", { hideProgressBar: true });
//         return;
//     }

//     setUploading(true);
//     setUploadCancel(false);

//     try {
//         const uploadedImageURL = await uploadImage(file);
//         if (uploadedImageURL) {
//             // Instead of previewing, trigger image list reload
//             setRandom(Math.random());
//             toast.success("Image uploaded successfully", { hideProgressBar: true })
//         }
//     } catch {
//         console.log("Error Uploading Image Please Try again later")
//         toast.error("Error Uploading Image Please Try again later", { hideProgressBar: true })
//     } finally {
//         setUploading(false);
//     }
// };