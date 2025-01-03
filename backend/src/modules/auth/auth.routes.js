import { Router } from "express";
import {AuthController} from "./auth.controller.js";

import Middlewares from '../../helper/authMiddleware.js';

const {authenticateJWT, authenticateSession} = Middlewares

const router = Router();

router.post("/login", AuthController.Login);
router.post("/logout",authenticateSession, AuthController.Logout);
router.post("/refreshToken", AuthController.RefreshToken);
router.post("/forgotPass", AuthController.ForgotPass);
router.post("/resetPass", AuthController.ResetPass);

export default router;


// router.get('/protected', authenticateJWT, authenticateSession, protectedRoute);


