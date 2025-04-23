import { uploadMedia, deleteMedia } from "./media.service.js";

const UploadMedia = async (req, res) => {
  const uploadedMedia = req.uploadedImages;
  const { mediaType, resourceId } = req.body;
  const response = await uploadMedia(mediaType, resourceId, uploadedMedia);
  res.status(200).json(response);
};

const DeleteMedia = async (req, res) => {
  const mediaId = req.params.id;
  const response = await deleteMedia(mediaId);
  res.status(200).json(response);
};

export default {
  UploadMedia,
  DeleteMedia,
};
