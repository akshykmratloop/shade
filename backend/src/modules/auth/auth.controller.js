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


const Login = async (req, res) => {
  const { email, password } = req.body;
  const response = await login(email, password);
  res.status(200).json(response);
};

const MFALogin = async (req, res) => {
  const { email, deviceId, otpOrigin } = req.body;
  const response = await mfa_login(email, deviceId, otpOrigin);
  res.status(201).json(response);
};

const VerifyMFALogin = async (req, res) => {
  const { email, deviceId, otp, otpOrigin } = req.body;
  const response = await verify_mfa_login(email, deviceId, otp, otpOrigin);
  res.status(200).json(response);
};

const Logout = async (req, res) => {
  const response = await logout(req.user);
  res.status(200).json(response);
};

const RefreshToken = async (req, res) => {
  const response = await refreshToken(req.user);
  res.status(201).json(response);
};

const ForgotPassword = async (req, res) => {
  const { email, deviceId, otpOrigin } = req.body;
  const response = await forgotPassword(email, deviceId, otpOrigin);
  res.status(201).json(response);
};

const ForgotPasswordVerify = async (req, res) => {
  const { email, deviceId, otp, otpOrigin } = req.body;
  const response = await forgotPasswordVerify(
    email,
    deviceId,
    otp,
    otpOrigin
  );
  res.status(200).json(response);
};

const UpdatePassword = async (req, res) => {
  const { email, deviceId, otpOrigin, new_password, repeat_password } =
    req.body;
  const response = await updatePassword(
    email,
    deviceId,
    otpOrigin,
    new_password,
    repeat_password
  );
  clearCookie(res, "forgotPassToken");
  res.status(200).json(response);
};

const ResendOTP = async (req, res) => {
  const { email, deviceId, otpOrigin } = req.body;
  const userId = req.ip.replace(/^.*:/, ""); // Extract IP as user ID
  const response = await resendOTP(email, deviceId, otpOrigin, userId);
  res.status(201).json(response);
};

const ResetPass = async (req, res) => {
  const { email, old_password, new_password, repeat_password } = req.body;
  const response = await resetPass(
    email,
    old_password,
    new_password,
    repeat_password
  );
  res.status(201).json(response);
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
