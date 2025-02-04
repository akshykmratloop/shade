import prismaClient from "../config/dbConfig.js";

/// USER QUERIES====================================================
// Find and return the user object
export const findUserByEmail = async (email) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email,
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

/// OPT RELATED QUERIES====================================================

// Create or update the otp
export const createOrUpdateOTP = async (
  userId,
  deviceId,
  otpOrigin,
  otpCode,
  expiresAt
) => {
  return await prismaClient.otp.upsert({
    where: {
      userId_deviceId_otpOrigin: {
        userId,
        deviceId,
        otpOrigin,
      },
    },
    create: { userId, deviceId, otpOrigin, otpCode, expiresAt },
    update: { otpCode, expiresAt, isUsed: false },
  });
};

// find existing otp
export const findOTP = async (userId, deviceId, otpOrigin) => {
  return await prismaClient.otp.findFirst({
    where: { userId, deviceId, otpOrigin },
  });
};

// mark otp as used
export const markOTPUsed = async (otpId) => {
  return await prismaClient.otp.update({
    where: { id: otpId },
    data: { isUsed: true },
  });
};

// delete otp
export const deleteOTP = async (otpId) => {
  return await prismaClient.otp.delete({
    where: { id: otpId },
  });
};

/// RATE LIMITER RELATED QUERIES====================================================

// Find OTP attempts
export const findOtpAttempts = async (userId) => {
  return await prismaClient.rateLimit.findFirst({
    where: { userId },
  });
};

// Create OTP attempts
export const createOrUpdateOtpAttempts = async (userId) => {
  const now = new Date();

  return await prismaClient.rateLimit.upsert({
    where: { userId },
    update: {
      attempts: { increment: 1 },
      lastAttempt: now,
    },
    create: {
      userId,
      attempts: 0,
      failures: 0,
      lastAttempt: now,
      blockUntil: null,
    },
  });
};

// Block a user temporarily
export const blockUser = async (userId, blockUntil) => {
  return await prismaClient.rateLimit.update({
    where: { userId },
    data: { blockUntil },
  });
};

// Reset attempts after 24 hours (Cron Job)
export const resetOtpAttempts = async () => {
  const now = new Date();
  await prismaClient.rateLimit.updateMany({
    where: { blockUntil: { lte: now } },
    data: { attempts: 0, failures: 0, blockUntil: null },
  });
};

export const resetUserOtpAttempts = async () => {
  const now = new Date();

  // Find users whose last attempt was more than 24 hours ago but not blocked
  await prismaClient.rateLimit.updateMany({
    where: {
      blockUntil: null, // Only update users who are not blocked
      lastAttempt: {
        lte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 24 hours
      },
    },
    data: {
      attempts: 0, // Reset attempts
      failures: 0, // Reset failures
    },
  });

  // For users who are still blocked but need an updated block time:
  await prismaClient.rateLimit.updateMany({
    where: {
      blockUntil: { // Users who are blocked and should be updated
        lte: now,
      },  
    },
    data: {
      attempts: 0, // Reset attempts after block period has ended
      failures: 0, // Reset failures
      blockUntil: null, // Clear block time after reset
    },
  });
};

