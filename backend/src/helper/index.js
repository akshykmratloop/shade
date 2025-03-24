import {authenticateUser} from "./authMiddleware.js";
import {EncryptData, compareEncryptedData} from "./bcryptManager.js";
import {setCookie, getCookie, clearCookie} from "./cookiesManager.js";
import {generateRandomOTP} from "./generateOtp.js";
import {generateToken, verifyToken} from "./jwtManager.js";
import {
  globalRateLimiter,
  generateOtpRateLimiter,
  resendOtpRateLimiter,
} from "./rateLimiter.js";
import {sendEmail} from "./sendEmail.js";
export {
  //User Authentication
  authenticateUser,

  // Password Manager - bcrypt
  EncryptData,
  compareEncryptedData,

  // otp generator
  generateRandomOTP,

  // Email Service
  sendEmail,

  // Jwt Manager
  generateToken,
  verifyToken,

  // Cookie Manager
  setCookie,
  getCookie,
  clearCookie,

  // Rate Limiter
  globalRateLimiter,
  generateOtpRateLimiter,
  resendOtpRateLimiter,
};
