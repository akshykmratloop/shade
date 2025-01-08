import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "../../config/index.js";
import {
  findUserByEmail,
  saveSession,
  deleteSession,
  updateUserPassword,
} from "../../repository/user.repository.js";
import { sendEmail, sendResetEmail } from "../../helper/emailService.js"; // Ensure the correct file extension is included
import { assert } from "../../errors/assertError.js"; // Ensure the correct file extension is included

const JWT_SECRET = process.env.JWT_SECRET; // Ensure you have this in your environment variables

const login = async ({userId, password}) => {

  const isUserExist = await findUserByEmail(userId);
  // console.log(isUserExist,"isuser Exiet")

  assert(isUserExist, "NOT_FOUND", "invalid userId");

  return isUserExist;

  // if (!user || !(await bcrypt.compare(password, user.password))) {
  //   throw new Error("Invalid email or password");
  // }

  // const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
  //   expiresIn: "1h",
  // });
  // req.session.user = { id: user.id, email: user.email };
  // await saveSession(req.session.id, req.session);

  // return { message: "Logged in successfully", token };
};

const logout = async (sessionId) => {
  await deleteSession(sessionId); // Clear session from the database
  return { message: "Logged out successfully" };
};

const refreshToken = async (oldToken) => {
  try {
    const decoded = jwt.verify(oldToken, JWT_SECRET);
    const newToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return { token: newToken };
  } catch (error) {
    throw new Error("Invalid token");
  }
};

const forgotPass = async (data) => {
  const { email } = data;
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  // Send reset password email
  await sendResetEmail(user.email);
  return { message: "Password reset link sent" };
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

export { login, logout, refreshToken, forgotPass, resetPass };

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
//   const user = await findUserByEmail(email);

//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).json({ message: 'Invalid email or password' });
//   }

//   const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
//   req.session.user = { id: user.id, email: user.email };
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
//   res.status(200).json({ message: `Welcome ${req.session.user.email}` });
// };
