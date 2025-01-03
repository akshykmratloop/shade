import prismaClient from '../config/dbConnection.js';

// Find a user by email
export const findUserByEmail = async (email) => {
  return await prismaClient.user.findUnique({
    where: { email },
  });
};

// Save a session
export const saveSession = async (sid, sessionData) => {
  return await prismaClient.session.upsert({
    where: { sid },
    update: {
      data: JSON.stringify(sessionData),
      expiresAt: new Date(Date.now() + sessionData.cookie.maxAge),
    },
    create: {
      sid,
      data: JSON.stringify(sessionData),
      expiresAt: new Date(Date.now() + sessionData.cookie.maxAge),
    },
  });
};

// Delete a session
export const deleteSession = async (sid) => {
  return await prismaClient.session.delete({
    where: { sid },
  });
};

// Update user password
export const updateUserPassword = async (userId, newPassword) => {
  return await prismaClient.user.update({
    where: { id: userId },
    data: { password: newPassword },
  });
}; 