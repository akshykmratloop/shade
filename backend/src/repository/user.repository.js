import prismaClient from "../config/dbConfig.js";
import { EncryptData } from "../helper/bcryptManager.js";
import { sendEmail } from "../helper/sendEmail.js";
import user from "../modules/user/index.js";

/// USER QUERIES====================================================
// Create User
export const createUserHandler = async (
  name,
  email,
  password,
  phone,
  roles
) => {
  const existingUser = await prismaClient.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists. Please use a different email.");
  }

  const hashedPassword = await EncryptData(password, 10);
  const newUser = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      roles: {
        create:
          roles?.map((roleId) => ({
            role: {
              connect: { id: roleId },
            },
          })) || [],
      },
    },
    include: {
      roles: {
        include: { role: true },
      },
    },
  });
  const emailPayload = {
    to: email,
    subject: "Your Account Details",
    text: `Hello ${name}, your account has been created successfully. Username: ${email}, Password: ${password}. Please change your password after logging in.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #333;">Welcome to Our Platform! 🎉</h2>
        <p style="font-size: 16px; color: #555;">Hello <strong>${name}</strong>,</p>
        <p style="font-size: 16px; color: #555;">
          Your account has been successfully created. Here are your login details:
        </p>
        <div style="background-color: #fff; padding: 15px; border-radius: 6px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; margin: 0;"><strong>Username:</strong> ${email}</p>
          <p style="font-size: 16px; margin: 0;"><strong>Password:</strong> ${password}</p>
        </div>
        <p style="font-size: 16px; color: #555; margin-top: 20px;">
          Please change your password after logging in for security purposes.
        </p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="http://localhost:3001/login" style="display: inline-block; background-color: #007bff; color: #fff; padding: 12px 20px; font-size: 16px; text-decoration: none; border-radius: 5px;">Login Now</a>
        </div>
        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 20px;">
          If you didn't request this, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 14px; color: #999; text-align: center;">© 2025 Your Company. All rights reserved.</p>
      </div>
    `,
  };

  // await sendEmail(emailPayload);

  return newUser;
};

//Fetch all users
export const fetchAllUsers = async (
  name = "",
  email = "",
  phone = "",
  status = "",
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  const allUsers = await prismaClient.user.findMany({
    where: {
      name: {
        not: "Super Admin",
        contains: name,
        mode: "insensitive",
      },
      email: email ? { contains: email, mode: "insensitive" } : undefined,
      phone: phone ? { contains: phone } : undefined,
      ...(status ? { status: status } : {}),
    },
    include: {
      roles: {
        include: {
          role: {
            // include: {
            //   permissions: {
            //     include: {
            //       permission: true,
            //     },
            //   },
            //   roleType: true,
            // },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
    skip,
    take: limit,
  });

  const totalUser = await prismaClient.user.count({
    where: {
      name: {
        not: "Super Admin",
        contains: name,
        mode: "insensitive",
      },
      email: email ? { contains: email, mode: "insensitive" } : undefined,
      phone: phone ? { contains: phone } : undefined,
      ...(status ? { status: status } : {}),
    },
  });

  return {
    allUsers,
    pagination: {
      totalUser,
      totalPages: Math.ceil(totalUser / limit),
      currentPage: page,
      limit,
    },
  };
};

// Update User
export const updateUser = async (id, name, password, phone, roles) => {
  const dataToUpdate = {
    name,
    phone,
    roles: {
      deleteMany: {},
      create:
        roles?.map((roleId) => ({
          role: { connect: { id: roleId } },
        })) || [],
    },
  };

  if (password) {
    // "changes for making password optional" at apr 7 11:32
    const hashedPassword = await EncryptData(password, 10);
    dataToUpdate.password = hashedPassword;
  }

  const updatedUser = await prismaClient.user.update({
    where: { id },
    data: dataToUpdate,
    include: { roles: { include: { role: true } } },
  });

  return updatedUser;
};

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
              roleType: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return false; // Handle case where user is not found
  }

  // const roles = user.roles?.map((role) => role.role.name) || [];
  // const permissions =
  //   user.roles?.flatMap((role) =>
  //     role.role.permissions.map((permission) => permission.permission.name)
  //   ) || [];

  const roleAndPermission =
    user.roles?.map((role) => ({
      id:role.role.id,
      role: role.role.name,
      roleType: role.role.roleType.name,
      status: role.role.status,
      permissions: role.role.permissions.map((perm) => perm.permission.name),
    })) || [];
  // const roles = user.roles?.map((role) => role.role.name) || [];
  // const permissions =
  //   user.roles?.flatMap((role) =>
  //     role.role.permissions.map((permission) => permission.permission.name)
  //   ) || [];

  return {
    ...user,
    roles: roleAndPermission,
    // permissions,
  };
};

export const findUserById = async (id) => {
  const user = await prismaClient.user.findUnique({
    where: { id },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                select: {
                  permission: true,
                },
              },
              roleType: true,
            },
          },
        },
      },
      resourceRoles: {
        where: {
          status: "ACTIVE",
        },
        select: {
          role: true,
          userId: true,
          resource: {
            select: {
              titleEn: true,
              resourceType: true,
              resourceTag: true,
            },
          },
        },
      },
      resourceVerifiers: {
        where: {
          status: "ACTIVE",
        },
        select: {
          resource: {
            select: {
              titleEn: true,
              resourceType: true,
            },
          },
          userId: true,
          stage: true,
        },
      },
    },
  });

  return user;
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
      blockUntil: {
        // Users who are blocked and should be updated
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

export const userActivation = async (id) => {
  const user = await prismaClient.user.update({
    where: {
      id: id,
    },
    data: {
      status: "ACTIVE",
    },
  });

  return user;
};

export const userDeactivation = async (id) => {
  const user = await prismaClient.user.update({
    where: {
      id: id,
    },
    data: {
      status: "INACTIVE",
    },
  });

  return user;
};

export const findRoleTypeByUserId = async (id) => {
  const roleType = await prismaClient.user.findUnique({
    where: { id },
    include: {
      roles: {
        include: {
          role: {
            include: {
              roleType: true,
            },
          },
        },
      },
    },
  });

  return roleType;
};

export const findAllLogs = async () => {
  return await prismaClient.auditLog.findMany({
    include: {
      user: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });
};
