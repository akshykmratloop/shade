import {
  login,
  logout,
  refreshToken,
  forgotPass,
  resetPass,
} from "./auth.service.js";

const Login = async (req, res) => {
  const { userId, password } = req.body;
  const result = await login({ userId, password });
  res.status(200).json(result);
};

const Logout = async (req, res) => {
  const { data } = req.body;
  const result = await logout({ data });
  res.status(201).json(result);
};

const RefreshToken = async (req, res) => {
  const { data } = req.body;
  const result = await refreshToken({ data });
  res.status(201).json(result);
};

const ForgotPass = async (req, res) => {
  const { data } = req.body;
  const result = await forgotPass({ data });
  res.status(201).json(result);
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
  ForgotPass,
  ResetPass,
};
