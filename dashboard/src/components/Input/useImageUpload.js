// hooks/useImageUpload.js

import { useState } from "react";
import { uploadMedia } from "../../app/fetch"; // adjust path if needed

export function useImageUpload(resourceId, type) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const uploadImage = async (files) => {
        if (!files) return null;

        console.log(files)
        const formData = new FormData();
        if (Array.isArray(files)) {
            for (const file of files) {
                formData.append("mediaFile", file);
            }
        } else {
            formData.append("mediaFile", files); // files = "VIDEO" || "IMAGE" || "DOCUMENT" 
        }

        // formData.append("mediaFile", files);
        formData.append("mediaType", type);
        formData.append("resourceId", resourceId);


        try {
            setUploading(true);
            setError(null);

            const response = await uploadMedia(formData);

            // console.log(response)
            if (response.ok) {
                const result = response;
                return result?.imageUrl || URL.createObjectURL(files.length ? files[0] : files);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            throw err.message
            // setError(err.message);
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, uploading };
}
