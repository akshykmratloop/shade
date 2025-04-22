// middlewares/mediaUploader.js
import { uploadFileToCloudinary } from "./cloudinaryService.js";

const mediaUploader = async (req, res, next) => {
  try {
    console.log('MediaUploader middleware - Request files:', req.files);

    if (!req.files || req.files.length === 0) {
      console.error('No files provided in the request');
      return res.status(400).json({ error: 'No files provided' });
    }

    console.log(`Processing ${req.files.length} files for upload to Cloudinary...`);

    const uploadedImages = await Promise.all(
      req.files.map(file => {
        console.log('Uploading file:', file.originalname, 'from path:', file.path);
        return uploadFileToCloudinary(file.path);
      })
    );

    console.log('Files successfully uploaded to Cloudinary:', uploadedImages);

    req.uploadedImages = uploadedImages;
    next();
  } catch (error) {
    console.error('Error in mediaUploader middleware:', error);
    res.status(500).json({ error: 'File upload failed', details: error.message });
  }
};

export default mediaUploader;
