import {
  login,
  mfa_login,
  verify_mfa_login,
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
  const { email, password } = req.body;
  const { token, user } = await login({ email, password });
  //cookies wil be set in production mode only for https req
  setCookie(res, token);
  res.status(200).json(user);
};

const MFALogin = async (req, res) => {
  const { email, deviceId } = req.body;
  const { mfa_token, user } = await mfa_login({ email, deviceId });
  // mfa token will be verified with otp
  setCookie(res, mfa_token, "mfa_token");
  res.status(200).json(user);
};

const VerifyMFALogin = async (req, res) => {
  const { email, otp } = req.body;
  // get the mfa token
  const { mfa_token } = await getCookie(req, "mfa_token");
  const { token, user } = await verify_mfa_login({ email, otp, mfa_token });
  // remove mfa token from cookies and set new token
  clearCookie(res, "mfa_token");
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
  const { email, deviceId } = req.body;
  const result = await generateAndSendOTP({ email, deviceId });
  res.status(201).json(result);
};

const ResendOTP = async (req, res) => {
  const { email, deviceId } = req.body;
  const result = await resendOTP({ email, deviceId });
  res.status(201).json(result);
};

const VerifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const result = await verifyOTP({ email, otp });
  res.status(200).json(result);
};

const ResetPass = async (req, res) => {
  const { data } = req.body;
  const result = await resetPass({ data });
  res.status(201).json(result);
};

export default {
  Login,
  MFALogin,
  VerifyMFALogin,
  Logout,
  RefreshToken,
  GenerateOTP,
  ResendOTP,
  VerifyOTP,
  ResetPass,
};
