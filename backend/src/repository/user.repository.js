import prismaClient from '../config/dbConfig.js';

export const findUserByEmail = async (input) => {
  const field = input.includes('@') ? 'email' : 'username'; // Check if input contains '@', if so, it's an email
  return await prismaClient.user.findUnique({
    where: {
      [field]: input, // Dynamically use either 'email' or 'username'
    },
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