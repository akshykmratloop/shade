import prismaClient from "../config/dbConfig.js";

export const createMedia = async (url, type, mediaType, resourceId, width = null, height = null, altText = null) => {
  return await prismaClient.media.create({
    data: {
      url,
      type,
      mediaType,
      resourceId,
      width,
      height,
      altText
    }
  });
};

/**
 * Delete a media record from the database by its ID
 * @param {string} id - The ID of the media to delete
 * @returns {Promise<object>} The deleted media record
 */
export const deleteMediaById = async (id) => {
  return await prismaClient.media.delete({
    where: { id }
  });
};

/**
 * Find a media record by its ID
 * @param {string} id - The ID of the media to find
 * @returns {Promise<object|null>} The media record or null if not found
 */
export const findMediaById = async (id) => {
  return await prismaClient.media.findUnique({
    where: { id }
  });
};

/**
 * Find all media records for a specific resource
 * @param {string} resourceId - The ID of the resource
 * @returns {Promise<Array>} Array of media records
 */
export const findMediaByResourceId = async (resourceId) => {
  return await prismaClient.media.findMany({
    where: { resourceId }
  });
};
