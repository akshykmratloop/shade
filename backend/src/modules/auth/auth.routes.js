import {Router} from "express";
import AuthController from "./auth.controller.js";
import {authenticateUser} from "../../helper/authMiddleware.js";
import validator from "../../validation/validator.js";
import {
  loginSchema,
  generateOtpSchema,
  verifyOtpSchema,
  resetPassSchema,
  updatePasswordSchema,
} from "../../validation/authSchema.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import {generateOtpRateLimiter} from "../../helper/rateLimiter.js";
import auditLogger from "../../helper/auditLogger.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints for authentication

 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@ssw.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

router.post(
  "/login",
  validator(loginSchema),
  // auditLogger,
  tryCatchWrap(AuthController.Login)
);

// takes email and generates otp
router.post(
  "/mfa/login",
  async (req, res, next) => {
    const {generateOtpRateLimiter} = await import(
      "../../helper/rateLimiter.js"
    );
    return generateOtpRateLimiter(req, res, next);
  },
  validator(generateOtpSchema),
  tryCatchWrap(AuthController.MFALogin)
);

// takes otp and verifies it to login
router.post(
  "/mfa/verify",
  validator(verifyOtpSchema),
  tryCatchWrap(AuthController.VerifyMFALogin)
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
  async (req, res, next) => {
    const {generateOtpRateLimiter} = await import(
      "../../helper/rateLimiter.js"
    );
    return generateOtpRateLimiter(req, res, next);
  },
  validator(generateOtpSchema),
  tryCatchWrap(AuthController.ForgotPassword)
);

router.post(
  "/forgotPassword/verify",
  validator(verifyOtpSchema),
  tryCatchWrap(AuthController.ForgotPasswordVerify)
);

router.post(
  "/forgotPassword/updatePassword",
  validator(updatePasswordSchema),
  tryCatchWrap(AuthController.UpdatePassword)
);

router.post(
  "/resetPass",
  authenticateUser,
  validator(resetPassSchema),
  tryCatchWrap(AuthController.ResetPass)
);
router.post(
  // forgot pass
  "/resendOtp",
  // resendOtpRateLimiter, // Rate limiter for OTP requests
  // validator(generateOtpSchema),
  tryCatchWrap(AuthController.ResendOTP)
);

router.get(
  // forgot pass
  "/logs",
  // resendOtpRateLimiter, // Rate limiter for OTP requests
  // validator(generateOtpSchema),
  tryCatchWrap(AuthController.GetAllLogs)
);

export default router;

// router.get('/protected', authenticateUser, protectedRoute);
