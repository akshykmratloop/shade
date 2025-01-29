import { Router } from "express";
import AuthController from "./auth.controller.js";
import { authenticateUser } from "../../helper/authMiddleware.js";
import validator from "../../validation/validator.js";
import {
  loginSchema,
  generateOtpSchema,
  verifyOtpSchema,
  resetPassSchema,
} from "../../validation/index.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import { rateLimitMiddleware } from "../../helper/index.js";

const router = Router();

router.post(
  "/login",
  validator(loginSchema),
  tryCatchWrap(AuthController.Login)
);

// takes email and generates otp
router.post(
  "/mfa/login",
  validator(generateOtpSchema),
  tryCatchWrap(AuthController.MFALogin)
);

// takes otp and verifies it to login
router.post(
  "/mfa/verify",
  validator(verifyOtpSchema),
  tryCatchWrap(AuthController.VerifyMFALogin)
);

router.post(
  // forgot pass
  "/resendOtp",
  rateLimitMiddleware, // Rate limiter for OTP requests
  validator(generateOtpSchema),
  tryCatchWrap(AuthController.ResendOTP)
);

router.post("/logout", authenticateUser, tryCatchWrap(AuthController.Logout));

router.post(
  "/refreshToken",
  authenticateUser,
  tryCatchWrap(AuthController.RefreshToken)
);

router.post(
  // forgot pass
  "/forgotPassword",
  // rateLimitMiddleware, // Rate limiter for OTP requests
  validator(generateOtpSchema),
  tryCatchWrap(AuthController.ForgotPassword)
);

router.post(
  "/forgotPassword/verify",
  rateLimitMiddleware, // Rate limiter for OTP requests
  validator(verifyOtpSchema),
  tryCatchWrap(AuthController.ForgotPasswordVerify)
);

router.post(
  "/forgotPassword/updatePassword",
  rateLimitMiddleware, // Rate limiter for OTP requests
  validator(verifyOtpSchema),
  tryCatchWrap(AuthController.UpdatePassword)
);

router.post(
  "/resetPass",
  authenticateUser,
  validator(resetPassSchema),
  tryCatchWrap(AuthController.ResetPass)
);

export default router;

// router.get('/protected', authenticateUser, protectedRoute);
