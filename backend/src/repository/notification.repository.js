import prismaClient from "../config/dbConfig.js";

export const createNotification = async ({userId, role, message, io}) => {
  const notification = await prismaClient.notification.create({
    data: {
      userId,
      role,
      message,
    },
  });

  if (io && userId) {
    io.to(userId).emit("notification", notification);
  }

  return notification;
};

export const findAllNotification = async (userId) => {
  const notification = await prismaClient.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notification;
};
