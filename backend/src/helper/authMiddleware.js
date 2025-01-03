import { verifyToken } from "../helper/jwtManager.js";

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};
const authenticateSession = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Session missing" });
  }
  next();
};

export const Middlewares = {
  authenticateJWT,
  authenticateSession,
};
