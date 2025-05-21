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
 *                 example: dkataria576@gmail.com
 *               password:
 *                 type: string
 *                 example: Akshay7053@
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

/**
 * @swagger
 * /auth/mfa/login:
 *   post:
 *     summary: Generate a one‑time password (OTP) for multi‑factor authentication
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Payload containing the user’s email and client details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - deviceId
 *               - otpOrigin
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: dkataria576@gmail.com
 *               deviceId:
 *                 type: string
 *                 description: A unique identifier for the client device
 *                 example: "123456789"
 *               otpOrigin:
 *                 type: string
 *                 description: Source of the OTP request (e.g., "web", "mobile")
 *                 example: "MFA_Login"
 *     responses:
 *       201:
 *         description: OTP generated and sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP sent to your email"
 *       400:
 *         description: Bad request (missing or invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Too many OTP requests. Please try again later."
 */

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

/**
 * @swagger
 * /auth/mfa/verify:
 *   post:
 *     summary: Verify the one‑time password (OTP) for multi‑factor authentication
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Payload containing the user’s email, device details, OTP, and origin
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - deviceId
 *               - otp
 *               - otpOrigin
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: dkataria576@gmail.com
 *               deviceId:
 *                 type: string
 *                 description: Unique identifier for the client device
 *                 example: "123456789"
 *               otp:
 *                 type: string
 *                 description: The one‑time password sent to the user
 *                 example: "4321"
 *               otpOrigin:
 *                 type: string
 *                 description: Source of the OTP request (e.g., "web", "mobile")
 *                 example: "MFA_Login"
 *     responses:
 *       200:
 *         description: OTP verified successfully, user logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *                 user:
 *                  type: object
 *                  description: user details
 *       400:
 *         description: Bad request (missing or invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (invalid or expired OTP)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// takes otp and verifies it to login
router.post(
  "/mfa/verify",
  validator(verifyOtpSchema),
  tryCatchWrap(AuthController.VerifyMFALogin)
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the authenticated user
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       401:
 *         description: Unauthorized – missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 errorType:
 *                   type: string
 *                   example: "Unauthorized"
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Token Missing"
 *                 errorDetails:
 *                   type: string
 *                   example: ""
 */

router.post("/logout", authenticateUser, tryCatchWrap(AuthController.Logout));

/**
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     summary: Refresh the JWT access and refresh tokens
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: New JWT access token
 *                 message:
 *                   type: string
 *                   description: Success message
 *       401:
 *         description: Unauthorized – missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 errorType:
 *                   type: string
 *                   example: "Unauthorized"
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Token Missing"
 *                 errorDetails:
 *                   type: string
 *                   example: ""
 */

router.post(
  "/refreshToken",
  authenticateUser,
  tryCatchWrap(AuthController.RefreshToken)
);

/**
 * @swagger
 * /auth/forgotPassword:
 *   post:
 *     summary: Generate an OTP for password reset
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Payload containing the user’s email and client details to send the OTP
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - deviceId
 *               - otpOrigin
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: dkataria576@gmail.com
 *               deviceId:
 *                 type: string
 *                 description: Unique identifier for the client device
 *                 example: "123456789"
 *               otpOrigin:
 *                 type: string
 *                 description: Source of the OTP request (e.g., "web", "mobile")
 *                 example: "forgot_Pass"
 *     responses:
 *       201:
 *         description: OTP generated and sent successfully for password reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: boolean
 *                   example: "OTP has been Sent"
 *                 otp:
 *                   type: string
 *                   example: "A six digit number"
 *       400:
 *         description: Bad request (missing or invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 errorType:
 *                   type: string
 *                   example: "TooManyRequests"
 *                 statusCode:
 *                   type: integer
 *                   example: 429
 *                 message:
 *                   type: string
 *                   example: "Too many OTP requests. Please try again later."
 *                 errorDetails:
 *                   type: string
 *                   example: ""
 */

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

/**
 * @swagger
 * /auth/forgotPassword/verify:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Payload containing email, device details, OTP, and origin for password reset verification
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - deviceId
 *               - otp
 *               - otpOrigin
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: dkataria576@gmail.com
 *               deviceId:
 *                 type: string
 *                 description: Unique identifier for the client device
 *                 example: "123456789"
 *               otp:
 *                 type: string
 *                 description: One‑time password sent to the user
 *                 example: "4321"
 *               otpOrigin:
 *                 type: string
 *                 description: Source of the OTP request (e.g., "web", "mobile")
 *                 example: "forgot_Pass"
 *     responses:
 *       200:
 *         description: OTP verified successfully for password reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully."
 *       400:
 *         description: Bad request (missing or invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (invalid or expired OTP)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post(
  "/forgotPassword/verify",
  validator(verifyOtpSchema),
  tryCatchWrap(AuthController.ForgotPasswordVerify)
);

/**
 * @swagger
 * /auth/forgotPassword/updatePassword:
 *   post:
 *     summary: Update the user’s password after OTP verification
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Payload containing email, device details, OTP origin, and new password fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - deviceId
 *               - otpOrigin
 *               - new_password
 *               - repeat_password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: dkataria576@gmail.com
 *               deviceId:
 *                 type: string
 *                 description: Unique identifier for the client device
 *                 example: "123456789"
 *               otpOrigin:
 *                 type: string
 *                 description: Source of the OTP request (e.g., "web", "mobile")
 *                 example: "forgot_Pass"
 *               new_password:
 *                 type: string
 *                 description: The new password to set
 *                 example: "Akshay7053@"
 *               repeat_password:
 *                 type: string
 *                 description: Confirmation of the new password
 *                 example: "Akshay7053@"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *       400:
 *         description: Bad request (missing fields or password mismatch)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (invalid or expired OTP token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post(
  "/forgotPassword/updatePassword",
  validator(updatePasswordSchema),
  tryCatchWrap(AuthController.UpdatePassword)
);

/**
 * @swagger
 * /auth/resetPass:
 *   post:
 *     summary: Reset password for an authenticated user
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Payload containing email, old password, and new password fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - old_password
 *               - new_password
 *               - repeat_password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: dkataria576@gmail.com
 *               old_password:
 *                 type: string
 *                 description: The current password
 *                 example: "Akshay7053!"
 *               new_password:
 *                 type: string
 *                 description: The new password to set
 *                 example: "Akshay7053@"
 *               repeat_password:
 *                 type: string
 *                 description: Confirmation of the new password
 *                 example: "Akshay7053@"
 *     responses:
 *       201:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Passwords has been updated successfully"
 *       400:
 *         description: Bad request (missing fields or password mismatch)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (invalid token or credentials)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post(
  "/resetPass",
  authenticateUser,
  validator(resetPassSchema),
  tryCatchWrap(AuthController.ResetPass)
);

/**
 * @swagger
 * /auth/resendOtp:
 *   post:
 *     summary: Resend a one‑time password (OTP) to the user
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Payload containing the user’s email and client details to resend the OTP
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - deviceId
 *               - otpOrigin
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: dkataria576@gmail.com
 *               deviceId:
 *                 type: string
 *                 description: Unique identifier for the client device
 *                 example: "123456789"
 *               otpOrigin:
 *                 type: string
 *                 description: Source of the OTP request (e.g., "web", "mobile")
 *                 example: "MFA_Login"
 *     responses:
 *       201:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP has been sent"
 *                 otp:
 *                   type: boolean
 *                   example: "A six digit number"
 *       400:
 *         description: Bad request (missing or invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 errorType:
 *                   type: string
 *                   example: "TooManyRequests"
 *                 statusCode:
 *                   type: integer
 *                   example: 429
 *                 message:
 *                   type: string
 *                   example: "Too many OTP requests. Please try again later."
 *                 errorDetails:
 *                   type: string
 *                   example: ""
 */

router.post(
  // forgot pass
  "/resendOtp",
  // resendOtpRateLimiter, // Rate limiter for OTP requests
  // validator(generateOtpSchema),
  tryCatchWrap(AuthController.ResendOTP)
);

/**
 * @swagger
 * /auth/logs:
 *   get:
 *     summary: Retrieve all authentication audit logs
 *     tags:
 *       - Auth
 *     description: Returns a list of all logs for auditing purposes.
 *     responses:
 *       200:
 *         description: A JSON array of log entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "f7d40b79-83af-45af-995c-be0a9f9de2af"
 *                   action_performed:
 *                     type: string
 *                     description: Action performed on the entity
 *                     example: "Login in successfull"
 *                   actionType:
 *                     type: string
 *                     description: The action performed (e.g., "LOGIN", "LOGOUT", "OTP_GENERATED")
 *                     example: "LOGIN"
 *                   entity:
 *                     type: string
 *                     description: On which action has been performed
 *                     example: "SUCCESS"
 *                   entityId:
 *                     type: string
 *                     description: ID of the entity
 *                     example: "User logged in from IP 123.45.67.89"
 *                   oldValue:
 *                     type: object
 *                     description: Old value of the entity
 *                   newValue:
 *                     type: object
 *                     description: New value of the entity
 *                   ipAddress:
 *                     type: string
 *                     description: IP Address of the user taking action
 *                     example: ::ffff:172.18.0.1
 *                   browserInfo:
 *                     type: string
 *                     description: Brower info of the user taking action
 *                     example: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36
 *                   outcome:
 *                     type: string
 *                     description: Result of the action taken
 *                     example: Success
 *                   timestamp:
 *                     type: string
 *                     description: Time on which the action has been taken
 *                     example: 2025-05-15T07:21:26.563Z
 *                   metadata:
 *                     type: object
 *                     description: Additional data of the log
 *                   user:
 *                     type: object
 *                     description: User details
 *       500:
 *         description: Server error retrieving logs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  // forgot pass
  "/logs",
  // resendOtpRateLimiter, // Rate limiter for OTP requests
  // validator(generateOtpSchema),
  tryCatchWrap(AuthController.GetAllLogs)
);

export default router;

// router.get('/protected', authenticateUser, protectedRoute);
