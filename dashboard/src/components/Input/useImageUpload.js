// hooks/useImageUpload.js

import { useState } from "react";
import { uploadMedia } from "../../app/fetch"; // adjust path if needed

export function useImageUpload(resourceId) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const uploadImage = async (file) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("mediaFile", file);
        formData.append("mediaType", "IMAGE");
        formData.append("resourceId", resourceId);


        try {
            setUploading(true);
            setError(null);

            const response = await uploadMedia(formData);

            console.log(response)
            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const result = response;
            return result?.imageUrl || URL.createObjectURL(file);
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
