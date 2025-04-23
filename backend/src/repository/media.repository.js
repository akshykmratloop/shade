import prismaClient from "../config/dbConfig.js";

export const createMedia = async (
  url,
  publicId,
  type,
  width = null,
  height = null,
  altText = null,
  resourceId
) => {
  return await prismaClient.media.create({
    data: {
      url,
      publicId,
      type,
      width,
      height,
      altText,
      resourceId,
    },
  });
};



export const findMediaById = async (id) => {
  return await prismaClient.media.findUnique({
    where: { id },
  });
};

export const deleteMediaById = async (id) => {
  return await prismaClient.media.delete({
    where: { id },
  });
};

