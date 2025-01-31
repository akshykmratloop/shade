import rateLimit from "express-rate-limit";
import {
  trackOtpAttempts, blockUser
} from "../repository/user.repository.js";


// Global rate limiter
const globalRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again after an hour",
  },
});

const generateOtpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message:
      "Too many OTP requests from this IP, please try again after 15 minutes",
  },
});



const BLOCK_TIME_24H = 24 * 60 * 60 * 1000; // 24 hours
const BLOCK_TIME_15M = 15 * 60 * 1000; // 15 minutes
const BLOCK_TIME_1M = 1 * 60 * 1000; // 1 minute

const resendOtpRateLimiter = async (req, res, next) => {
  const userId = req.ip.replace(/^.*:/, ''); // Extract IP as user ID
  const now = new Date();

  const user = await trackOtpAttempts(userId);

  if (user.blockUntil && new Date(user.blockUntil) > now) {
    const remainingTime = Math.ceil((new Date(user.blockUntil) - now) / 1000);
    return res.status(429).json({ message: `Blocked for ${remainingTime} seconds` });
  }

  if (user.attempts >= 15) {
    await blockUser(userId, new Date(now.getTime() + BLOCK_TIME_24H));
    return res.status(429).json({ message: "Blocked for 24 hours." });
  }

  if (user.attempts >= 5) {
    await blockUser(userId, new Date(now.getTime() + BLOCK_TIME_15M));
    return res.status(429).json({ message: "Too many requests. Try again in 15 minutes." });
  }

  if (user.lastAttempt && new Date(user.lastAttempt).getTime() + BLOCK_TIME_1M > now.getTime()) {
    return res.status(429).json({ message: "Wait 1 minute before requesting again." });
  }

  next();
};

export { globalRateLimiter, generateOtpRateLimiter, resendOtpRateLimiter };
