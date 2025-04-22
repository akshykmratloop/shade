import { logger } from "../../config/index.js";
import { assert, assertEvery } from "../../errors/assertError.js";
import {
  createMedia,
  deleteMediaById,
  findMediaById,
} from "../../repository/media.repository.js";
import { deleteImageFromCloudinary } from "../../helper/cloudinaryService.js";

const uploadMedia = async (mediaType, resourceId, uploadedMedia) => {
  console.log("Media upload request:", {
    mediaType,
    resourceId,
    uploadedMedia,
  });
  // Validate inputs
  assert(mediaType, "Media type is required");
  assert(resourceId, "Resource ID is required");

  return { message: "Media upload request received" };
  
  const createdMedia = await Promise.all(
    uploadedMedia.map(async (media) => {
      return await createMedia(
        media.url,
        mediaType,
        resourceId,
        null, // width - could be extracted from image metadata if needed
        null, // height - could be extracted from image metadata if needed
        null // altText - could be provided by the user if needed
      );
    })
  );

  logger.info({
    message: "Media uploaded successfully",
    resourceId,
    mediaCount: createdMedia.length,
  });

  return {
    message: "Media uploaded successfully",
    media: createdMedia,
  };
};

/**
 * Delete media from Cloudinary and the database
 * @param {string} mediaId - The ID of the media to delete
 * @returns {object} Response with success message
 */
const deleteMedia = async (mediaId) => {
  // Validate input
  assert(mediaId, "Media ID is required");
  const media = await findMediaById(mediaId);
  assert(media, "Media not found");

  // Extract public_id from the URL or use the whole URL if needed
  // This assumes the public_id is stored or can be extracted from the URL
  const publicId = media.url.split("/").pop().split(".")[0];

  // Delete from Cloudinary
  await deleteImageFromCloudinary(publicId);

  // Delete from database
  await deleteMediaById(mediaId);

  logger.info({
    message: "Media deleted successfully",
    mediaId,
  });

  return { message: "Media deleted successfully" };
};

export { uploadMedia, deleteMedia };
