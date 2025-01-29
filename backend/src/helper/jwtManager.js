import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_AGE_HOURS || "24h";
//  Returns the Generated JWT token for the given user
const generateToken = (user, time) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: time || JWT_EXPIRY,
  });
};

// Verifies the given JWT token and returns the decoded payload
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export { generateToken, verifyToken };
