import prismaClient from "../config/dbConfig.js";

// Find and return the user object
export const findUserByUserId = async (input) => {
  const field = input.includes("@") ? "email" : "username"; // Check if input contains '@', if so, it's an email
  const user = await prismaClient.user.findUnique({
    where: {
      [field]: input, // Dynamically use either 'email' or 'username'
    },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return false; // Handle case where user is not found
  }

  const roles = user.roles?.map((role) => role.role.name) || [];
  const permissions =
    user.roles?.flatMap((role) =>
      role.role.permissions.map((permission) => permission.permission.name)
    ) || [];

  return {
    ...user,
    roles,
    permissions,
  };
};

// Update user password
export const updateUserPassword = async (userId, newPassword) => {
  return await prismaClient.user.update({
    where: { id: userId },
    data: { password: newPassword },
  });
};

// Create or update the otp
export const createOrUpdateOTP = async (
  userId,
  deviceId,
  otpCode,
  expiresAt
) => {
  return await prismaClient.otp.upsert({
    where: { userId, deviceId },
    create: { userId, deviceId, otpCode, expiresAt },
    update: { otpCode, expiresAt, isUsed: false, isExpired: false },
  });
};

// find existing otp
export const findOTP = async (userId, deviceId, otpCode) => {
  return await prismaClient.otp.findFirst({
    where: { userId, deviceId, otpCode, isUsed: false },
  });
};

// mark otp as used
export const markOTPUsed = async (otpId) => {
  return await prismaClient.otp.update({
    where: { id: otpId },
    data: { used: true },
  });
};

// delete expired otp
export const cleanupExpiredOTPs = async () => {
  const now = new Date();
  return await prismaClient.otp.updateMany({
    where: { expiresAt: { lte: now }, used: false },
    data: { used: true },
  });
};

export const deleteOldOTPs = async () => {
  const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  return await prismaClient.otp.deleteMany({
    where: { createdAt: { lte: oneDayAgo } },
  });
};




// Function to find or create the user rate limit data
export const findOrCreateRateLimit = async (userId) => {
  const now = new Date();

  let user = await prismaClient.rateLimit.findUnique({
    where: { userId },
  });

  if (!user) {
    // If the user doesn't exist, create a new rate-limiting record
    user = await prismaClient.rateLimit.create({
      data: {
        userId,
        attempts: 0,
        failures: 0,
        lastAttempt: now,
        blockUntil: null,
      },
    });
  }
  return user;
};

// Function to update user rate-limiting data (attempts, last attempt)
export const updateRateLimit = async (userId, attempts, failures, lastAttempt) => {
  return await prismaClient.rateLimit.update({
    where: { userId },
    data: {
      attempts,
      failures,
      lastAttempt,
    },
  });
};

// Function to update the blockUntil field (block user temporarily)
export const blockUser = async (userId, blockUntil) => {
  return await prismaClient.rateLimit.update({
    where: { userId },
    data: {
      blockUntil,
    },
  });
};