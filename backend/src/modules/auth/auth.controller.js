import {
  login,
  logout,
  refreshToken,
  generateAndSendOTP,
  resendOTP,
  verifyOTP,
  resetPass,
} from "./auth.service.js";

import {
  setCookie,
  getCookie,
  clearCookie,
} from "../../helper/cookiesManager.js";

const Login = async (req, res) => {
  const { userId, password } = req.body;
  const { token, user } = await login({ userId, password });
  //cookies wil be set in production mode only for https req
  setCookie(res, token);
  res.status(200).json(user);
};

const Logout = async (req, res) => {
  const result = await logout(req.user);
  clearCookie(res);
  res.status(200).json(result);
};

const RefreshToken = async (req, res) => {
  const oldToken = getCookie(req);
  const { newToken, message } = await refreshToken(oldToken);
  setCookie(res, newToken);
  res.status(200).json({ message });
};

const GenerateOTP = async (req, res) => {
  const { userId, deviceId } = req.body;
  const result = await generateAndSendOTP ({ userId, deviceId });
  res.status(201).json(result);
};

const ResendOTP = async (req, res) => {
  const { userId, deviceId } = req.body;
  const result = await resendOTP ({ userId, deviceId });
  res.status(201).json(result);
};

const VerifyOTP = async (req, res) => {
  const { userId, otp } = req.body;
  const result = await verifyOTP({ userId, otp });
  res.status(200).json(result);
};

const ResetPass = async (req, res) => {
  const { data } = req.body;
  const result = await resetPass({ data });
  res.status(201).json(result);
};

export default {
  Login,
  Logout,
  RefreshToken,
  GenerateOTP,
  ResendOTP,
  VerifyOTP,
  ResetPass,
};
