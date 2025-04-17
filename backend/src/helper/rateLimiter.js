import rateLimit from "express-rate-limit";
import {findOtpAttempts, blockUser} from "../repository/user.repository.js";
// Global rate limiter
const globalRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500, // limit each IP to 100 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again after an hour",
    blockedFor: `01:00:00`,
  },
});

// Rate limiter for generating OTP 15 otp per 15 minutes
export const generateOtpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: {
    message:
      "Too many OTP requests from this IP, please try again after 15 minutes",
    blockedFor: `00:15:00`,
  },
});

const BLOCK_TIME_24H = 24 * 60 * 60 * 1000; // 24 hours
const BLOCK_TIME_15M = 15 * 60 * 1000; // 15 minutes
const BLOCK_TIME_1M = 1 * 60 * 1000; // 1 minute

// Middleware for limiting resend opt and block user ip if limit exceeds
const resendOtpRateLimiter = async (req, res, next) => {
  const userId = req.ip.replace(/^.*:/, ""); // Extract IP as user ID
  const now = new Date();
  const user = await findOtpAttempts(userId);
  if (!user) {
    return next();
  }
  const blockUntilDate = new Date(user.blockUntil);
  if (blockUntilDate > now) {
    // check if user is blocked and return the time
    const remainingTime = blockUntilDate - now;
    const totalSeconds = Math.ceil(remainingTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.ceil((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    let message = `Too many requests. Try again after `;
    if (hours > 0) message += `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0 && !hours > 0)
      message += `${hours > 0 ? " and " : ""}${minutes} minute${
        minutes > 1 ? "s" : ""
      }`;
    // if (seconds > 0)
    //   message += `${hours > 0 || minutes > 0 ? " and " : ""}${seconds} second${
    //     seconds > 1 ? "s" : ""
    //   }`;
    return res
      .status(429)
      .json({message, blockedFor: `${hours}:${minutes}:${seconds}`});
  }
  if (user.attempts >= 15) {
    // block user after 15 attempts for 24 hours
    await blockUser(userId, new Date(now.getTime() + BLOCK_TIME_24H));
    const hours = 24;
    return res.status(429).json({
      message: `Too many requests. Try again after ${hours} hours.`,
      blockedFor: `${hours}:00:00`,
    });
  }
  if (user.attempts >= 5) {
    // block user after 5 attempts for 15 minutes
    await blockUser(userId, new Date(now.getTime() + BLOCK_TIME_15M));
    const minutes = 15;
    return res.status(429).json({
      message: `Too many requests. Try again after ${minutes} minutes.`,
      blockedFor: `00:${minutes}:00`,
    });
  }
  if (
    user.attempts >= 0 && // allow user to regenerate the otp after 1 minutes
    lastAttemptDate.getTime() + BLOCK_TIME_1M > now.getTime()
  ) {
    const remainingTime = Math.ceil(
      (lastAttemptDate.getTime() + BLOCK_TIME_1M - now.getTime()) / 1000
    );
    return res.status(429).json({
      message: `Wait ${remainingTime} seconds before requesting again.`,
      blockedFor: `00:00:${remainingTime}`,
    });
  }
  next();
};

export {globalRateLimiter, resendOtpRateLimiter};
