import { logger } from "../../config/index.js";
import { assert, assertEvery } from "../../errors/assertError.js";
import {
  findUserByUserId,
  updateUserPassword,
  createOrUpdateOTP,
  findOTP,
} from "../../repository/user.repository.js";
import {
  EncryptData,
  compareEncryptedData,
  sendEmail,
  generateToken,
  verifyToken,
  generateRandomOTP,
} from "../../helper/index.js";

const login = async ({ userId, password }) => {
  const isUserExist = await findUserByUserId(userId);
  // if user not exist throw an error
  assert(isUserExist, "NOT_FOUND", "invalid userId");
  // if user is blocked throw an error
  assert(
    isUserExist.status === "ACTIVE",
    "UNAUTHORIZED",
    "User is blocked by the super admin."
  );
  // if invalid password throw an error
  assert(
    compareEncryptedData(password, isUserExist.password),
    "NOT_FOUND",
    "invalid password"
  );
  const token = generateToken(isUserExist);
  // this line removes the password from the userdata object
  const { password: userPassword, ...userData } = isUserExist;
  logger.info({ ...userData, response: "logged in successfully" });
  return {
    token,
    user: {
      message: "Logged in successfully",
      ...userData,
    },
  };
};

const logout = async (user) => {
  // add any functionality here
  logger.info(`user: ${user.id} has logged out`);
  return { message: "Logged out successfully" };
};

const refreshToken = async ({ oldToken }) => {
  const decode = verifyToken(oldToken);
  const newToken = generateToken(decode);
  logger.info(`token has been refreshed for user : ${decode?.id}`);
  return { newToken, message: "Token updated successfully" };
};

const generateOTP = async (userId, deviceId) => {

  const isUserExist = await findUserByUserId(userId);
  // if user not exist throw an error
  assert(isUserExist, "NOT_FOUND", "invalid Email");
  // if user is blocked throw an error
  assert(
    isUserExist.status === "ACTIVE",
    "UNAUTHORIZED",
    "User is blocked by the super admin."
  );
  // Generate OTP
  const otpCode = generateRandomOTP();

  // Send otp on email
  const emailPayload = {
    to: isUserExist.email,
    subject: "Shade Corporation: OTP for password reset request",
    text: `Please use the following OTP to reset your password: ${otpCode}. This OTP will expire in 5 minutes.`,
    html: `<p>Please use the following OTP to reset your password: <strong>${otpCode}</strong></p><p>This OTP will expire in 5 minutes.</p>`,
  };

  const isEmailSend = await sendEmail(emailPayload);

  // if email not sent throw an error
  assert(isEmailSend, "EXPECTATION_FAILED", "Unable to send otp");

  // Store otp in database
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  await createOrUpdateOTP(
    userId,
    deviceId,
    await EncryptData(otpCode, 6), // encrypting otp before storing it with 6 rounds of salt
    expiresAt
  );
  logger.info(`Otp has been successfully sent on this email ${userId}`);
  return { message: "Email has been successfully sent" };
};

const generateAndSendOTP = async ({ userId, deviceId }) => {
  return await generateOTP(userId, deviceId);
};

const resendOTP = async ({ userId, deviceId }) => {

  const isOTPExist = await findOTP(userId, deviceId);

  // logger.info({isExpired, expiresAt, isUsed});
  // if (!isOTPExist) { //if otp is not exist generate and send
  //   logger.info(`ResendOT : OPT not found generating...new otp`)
  //   return await generateOTP(userId, deviceId);
  // }

  // if otp exist check expiry time and generate

  // function isOTPExpired(expireAt) {
  //   const now = new Date();
  //   return now > expireAt;
  // }

  // // Add this function to check if OTP is valid
  // const isValidOTP =(otpCode, expireAt) => {
  //   if (isOTPExpired(expireAt)) {
  //     throw new Error("OTP has expired. Please try again after 1 minute.");
  //   }

    // Additional checks can be added here if needed
  //   return true;
  // }
  
  assertEvery(
    [isOTPExist, !isOTPExist?.isUsed, !isOTPExist?.isExpired ],
    "UNAUTHORIZED",
    "Request Time out. Please request a new OTP."
  );
return true
  await generateOTP(userId, deviceId);
};

const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;
  const result = await verifyOTP({ userId, otp });
  res.status(200).json(result);
};

const resetPass = async (data) => {
  const { token, newPassword } = data;
  // Verify token and update password
  const decoded = jwt.verify(token, JWT_SECRET);

  if (!decoded) {
    throw new Error("Invalid token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await updateUserPassword(decoded.userId, hashedPassword);
  return { message: "Password reset successfully" };
};

export {
  login,
  logout,
  refreshToken,
  generateAndSendOTP,
  resendOTP,
  verifyOTP,
  resetPass,
};

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { findUserByUserId, createUser } = require('../services/userService');
// const { saveSession } = require('../services/authService');

// const JWT_SECRET = 'your_jwt_secret';

// exports.register = async (req, res) => {
//   const { email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   await createUser(email, hashedPassword);
//   res.status(201).json({ message: 'User registered successfully' });
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   const isUserExist = await findUserByUserId(email);

//   if (!isUserExist || !(await bcrypt.compare(password, isUserExist.password))) {
//     return res.status(401).json({ message: 'Invalid email or password' });
//   }

//   const token = jwt.sign({ userId: isUserExist.id }, JWT_SECRET, { expiresIn: '1h' });
//   req.session.isUserExist = { id: isUserExist.id, email: isUserExist.email };
//   await saveSession(req.session.id, req.session);

//   res.cookie('authToken', token, { httpOnly: true });
//   res.status(200).json({ message: 'Logged in successfully' });
// };

// exports.logout = (req, res) => {
//   req.session.destroy(() => {
//     res.clearCookie('authToken');
//     res.status(200).json({ message: 'Logged out successfully' });
//   });
// };

// exports.protectedRoute = (req, res) => {
//   res.status(200).json({ message: `Welcome ${req.session.isUserExist.email}` });
// };
