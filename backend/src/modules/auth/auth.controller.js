import {
  login,
  mfa_login,
  verify_mfa_login,
  logout,
  refreshToken,
  forgotPassword,
  resendOTP,
  resetPass,
  forgotPasswordVerify,
  updatePassword,
} from "./auth.service.js";

import {
  setCookie,
  getCookie,
  clearCookie,
} from "../../helper/cookiesManager.js";
import { verifyToken } from "../../helper/jwtManager.js";

const Login = async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await login(email, password);
  setCookie(res, token);
  res.status(200).json({ user, token });
};

const MFALogin = async (req, res) => {
  const { email, deviceId, otpOrigin } = req.body;
  const message = await mfa_login(email, deviceId, otpOrigin);
  res.status(201).json(message);
};

const VerifyMFALogin = async (req, res) => {
  const { email, deviceId, otp, otpOrigin } = req.body;
  const { token, user } = await verify_mfa_login(
    email,
    deviceId,
    otp,
    otpOrigin
  );
  setCookie(res, token);
  res.status(200).json({ user, token });
};

const Logout = async (req, res) => {
  const message = await logout(req.user);
  clearCookie(res);
  res.status(200).json(message);
};

const RefreshToken = async (req, res) => {
  const oldToken = getCookie(req);
  const { newToken, message } = await refreshToken(oldToken);
  setCookie(res, newToken);
  res.status(201).json({ message });
};

const ForgotPassword = async (req, res) => {
  const { email, deviceId, otpOrigin } = req.body;
  const message = await forgotPassword(email, deviceId, otpOrigin);
  res.status(201).json(message);
};

const ForgotPasswordVerify = async (req, res) => {
  const { email, deviceId, otp, otpOrigin } = req.body;
  const { message, token } = await forgotPasswordVerify(
    email,
    deviceId,
    otp,
    otpOrigin
  );
  setCookie(res, token, "forgotPassToken");
  res.status(200).json(message);
};

const UpdatePassword = async (req, res) => {
  const { email, deviceId, otpOrigin, new_password, repeat_password } =
    req.body;
  const token = req.cookies.forgotPassToken;
  verifyToken(token);
  const result = await updatePassword(
    email,
    deviceId,
    otpOrigin,
    new_password,
    repeat_password
  );
  res.status(200).json(result);
};

const ResendOTP = async (req, res) => {
  const { email, deviceId } = req.body;
  res.status(201).json("result");
  // const result = await resendOTP(email, deviceId);
  // res.status(201).json(result);
};

const ResetPass = async (req, res) => {
  const { email, old_password, new_password, repeat_password } = req.body;
  const result = await resetPass(
    email,
    old_password,
    new_password,
    repeat_password
  );
  clearCookie(res);
  res.status(201).json(result);
};

export default {
  Login,
  MFALogin,
  VerifyMFALogin,
  Logout,
  RefreshToken,
  ForgotPassword,
  ForgotPasswordVerify,
  UpdatePassword,
  ResendOTP,
  ResetPass,
};
