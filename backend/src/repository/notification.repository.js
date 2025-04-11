import prismaClient from "../config/dbConfig.js";

import {findRoleTypeByUserId} from "./user.repository.js";

export const createNotification = async ({userId, message}) => {
  const userrole = await findRoleTypeByUserId(userId);

  const notification = await prismaClient.notification.create({
    data: {
      userId,
      role: userrole?.roles[0]?.role?.roleType?.name,
      message,
    },
  });

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
