import { logger } from "../../config/index.js";
import { assert, assertEvery } from "../../errors/assertError.js";
import {
  findUserByEmail,
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

const getUser = async (email) => {
  const user = await findUserByEmail(email);
  // if user not exist throw an error
  assert(user, "NOT_FOUND", "invalid email");
  // if user is blocked throw an error
  assert(
    user.status === "ACTIVE",
    "UNAUTHORIZED",
    "User is blocked by the super admin."
  );
  return user;
};

const login = async ({ email, password }) => {
  const user = await getUser(email);
  // if invalid password throw an error
  assert(
    compareEncryptedData(password, user.password),
    "NOT_FOUND",
    "invalid password"
  );
  const token = generateToken(user);
  // this line removes the password from the userdata object
  const { password: userPassword, ...userData } = user;
  logger.info({ ...userData, response: "logged in successfully" });
  return {
    token,
    user: {
      message: "Logged in successfully",
      ...userData,
    },
  };
};

const mfa_login = async ({ email, deviceId }) => {
  const user = await getUser(email);
  const response = await generateOtpAndSendOnEmail(user, deviceId);
  const mfa_token = generateToken(user);
  return {
    mfa_token,
    message: response,
  };
};

const verify_mfa_login = async ({  email, otp, mfa_token }) => {
  const user = await getUser(email);
  verifyToken(mfa_token)
  
 
};

const logout = async (user) => {
  // add any functionality here
  logger.info(`user: ${user.name} has logged out`);
  return { message: "Logged out successfully" };
};

const refreshToken = async ({ oldToken }) => {
  const decode = verifyToken(oldToken);
  const newToken = generateToken(decode);
  logger.info(`token has been refreshed for user : ${decode?.id}`);
  return { newToken, message: "Token updated successfully" };
};

const generateOtpAndSendOnEmail = async (user, deviceId) => {
  const otp = generateRandomOTP();
  // Send otp on email
  const emailPayload = {
    to: user.email,
    subject: "Shade Corporation: OTP for password reset request",
    text: `Please use the following OTP to reset your password: ${otp}. This OTP will expire in 5 minutes.`,
    html: `<p>Please use the following OTP to reset your password: <strong>${otp}</strong></p><p>This OTP will expire in 5 minutes.</p>`,
  };

  const isEmailSend = await sendEmail(emailPayload);

  // if email not sent throw an error
  assert(isEmailSend, "EXPECTATION_FAILED", "Unable to send otp");

  // Store otp in database
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  await createOrUpdateOTP(
    user.id,
    deviceId,
    await EncryptData(otp, 6), // encrypting otp before storing it with 6 rounds of salt
    expiresAt
  );
  logger.info(`Otp has been successfully sent on this email ${user.email}`);
  return { message: "Email has been successfully sent" };
};

const generateAndSendOTP = async ({ userId, deviceId }) => {
  return await generateOtpAndSendOnEmail(userId, deviceId);
};

const resendOTP = async ({ userId, deviceId }) => {
  const isOTPExist = await findOTP(userId, deviceId);

  // logger.info({isExpired, expiresAt, isUsed});
  // if (!isOTPExist) { //if otp is not exist generate and send
  //   logger.info(`ResendOT : OPT not found generating...new otp`)
  //   return await generateOtpAndSendOnEmail(userId, deviceId);
  // }

  // if otp exist check expiry time and generate

  // function isOTPExpired(expireAt) {
  //   const now = new Date();
  //   return now > expireAt;
  // }

  // // Add this function to check if OTP is valid
  // const isValidOTP =(otp, expireAt) => {
  //   if (isOTPExpired(expireAt)) {
  //     throw new Error("OTP has expired. Please try again after 1 minute.");
  //   }

  // Additional checks can be added here if needed
  //   return true;
  // }

  assertEvery(
    [isOTPExist, !isOTPExist?.isUsed, !isOTPExist?.isExpired],
    "UNAUTHORIZED",
    "Request Time out. Please request a new OTP."
  );
  return true;
  await generateOtpAndSendOnEmail(userId, deviceId);
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
  mfa_login,
  verify_mfa_login,
  logout,
  refreshToken,
  generateAndSendOTP,
  resendOTP,
  verifyOTP,
  resetPass,
};

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { findUserByEmail, createUser } = require('../services/userService');
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
//   const isUserExist = await findUserByEmail(email);

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
