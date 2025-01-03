import { Router } from "express";
import {AuthController} from "./auth.controller.js";

// import UserServices from './user.services';
// import Middleware from './auth.controller';

const router = Router();

router.post("/login", AuthController.Login);
router.post("/logout", AuthController.Logout);
router.post("/refreshToken", AuthController.RefreshToken);
router.post("/forgotPass", AuthController.ForgotPass);
router.post("/resetPass", AuthController.ResetPass);

export default router;


// const express = require('express');
// const { login, register, protectedRoute, logout } = require('../controllers/authController');
// const { authenticateJWT, authenticateSession } = require('../middleware/authMiddleware');

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
// router.get('/protected', authenticateJWT, authenticateSession, protectedRoute);
// router.post('/logout', logout);

// module.exports = router;

