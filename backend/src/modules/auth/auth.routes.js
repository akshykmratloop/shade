import { Router } from "express";
import AuthController from "./auth.controller.js";
import {authenticateJWT, authenticateSession} from "../../helper/authMiddleware.js";
import validator from "../../validation/validator.js";
import { authSchema } from "../../validation/index.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
const router = Router();


router.post(
  "/login",
  validator(authSchema),
  tryCatchWrap(AuthController.Login)
);
router.post(
  "/logout",
  authenticateSession,
  validator(authSchema),
  tryCatchWrap(AuthController.Logout)
);
router.post(
  "/refreshToken",
  validator(authSchema),
  tryCatchWrap(AuthController.RefreshToken)
);
router.post(
  "/forgotPass",
  validator(authSchema),
  tryCatchWrap(AuthController.ForgotPass)
);
router.post(
  "/resetPass",
  validator(authSchema),
  tryCatchWrap(AuthController.ResetPass)
);

export default router;

// router.get('/protected', authenticateJWT, authenticateSession, protectedRoute);
