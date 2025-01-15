import { Router } from "express";
import AuthController from "./auth.controller.js";
import { authenticateUser } from "../../helper/authMiddleware.js";
import validator from "../../validation/validator.js";
import { loginSchema, generateOtpSchema, verifyOtp } from "../../validation/index.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import { rateLimitMiddleware } from "../../helper/index.js";

const router = Router();

router.post(
  "/login",
  validator(loginSchema),
  tryCatchWrap(AuthController.Login)
);
router.post("/logout", authenticateUser, tryCatchWrap(AuthController.Logout));

router.post(
  "/refreshToken",
  authenticateUser,
  tryCatchWrap(AuthController.RefreshToken)
);

router.post( // forgot pass
  "/generateOtp",
  rateLimitMiddleware, // Rate limiter for OTP requests
  validator(generateOtpSchema),
  tryCatchWrap(AuthController.GenerateOTP)
);

router.post( // forgot pass
  "/resendOtp",
  rateLimitMiddleware, // Rate limiter for OTP requests
  validator(generateOtpSchema),
  tryCatchWrap(AuthController.ResendOTP)
);

router.post(
  "/verifyOtp",
  rateLimitMiddleware, // Rate limiter for OTP requests
  validator(verifyOtp),
  authenticateUser,
  tryCatchWrap(AuthController.VerifyOTP)
);

router.post(
  "/resetPass",
  validator(loginSchema),
  tryCatchWrap(AuthController.ResetPass)
);

export default router;

// router.get('/protected', authenticateUser, protectedRoute);
