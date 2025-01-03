import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, saveSession, deleteSession, updateUserPassword } from '../../repository/user.repository.js';
import { sendResetEmail } from '../utils/emailService.js'; // Assuming you have an email service

const JWT_SECRET = process.env.JWT_SECRET; // Ensure you have this in your environment variables

const login = async (data) => {
  const { email, password } = data;
  const user = await findUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "1h",
  });
  req.session.user = { id: user.id, email: user.email };
  await saveSession(req.session.id, req.session);

  return { message: "Logged in successfully", token };
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

export const AuthServices = {
  login,
  logout,
  refreshToken,
  forgotPass,
  resetPass,
};
