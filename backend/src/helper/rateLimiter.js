import rateLimit from "express-rate-limit";
import { findOrCreateRateLimit, updateRateLimit, blockUser } from "../repository/user.repository.js";
// Global rate limiter
const globalRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again after an hour",
  },
});

// Time periods in milliseconds
const BLOCK_TIME_24H = 24 * 60 * 60 * 1000; // 24 hours
const BLOCK_TIME_15M = 15 * 60 * 1000; // 15 minutes
const BLOCK_TIME_1M = 1 * 60 * 1000; // 1 minute

// Track the user attempts and check if they are blocked
const trackUserAttempts = async (userId) => {
  const now = new Date();

  // Fetch the user's rate-limiting data from the database
  let user = await findOrCreateRateLimit(userId);

  // Check if the user is blocked
  if (user.blockUntil && new Date(user.blockUntil) > now) {
    const remainingBlockTime = Math.ceil((new Date(user.blockUntil) - now) / 1000); // in seconds
    return { blocked: true, message: `Blocked for ${remainingBlockTime} seconds` };
  }

  // Check if the time window has passed (reset attempts if more than 1 minute has passed)
  if (new Date(user.lastAttempt).getTime() + BLOCK_TIME_1M < now.getTime()) {
    // Reset attempts after 1 minute
    user = await updateRateLimit(userId, 1, 0, now);
    return { attempts: 1, failures: 0, block_until: null };
  }

  // Update the attempts count and last attempt timestamp
  user = await updateRateLimit(userId, user.attempts + 1, user.failures, now);

  return { attempts: user.attempts + 1, failures: user.failures, block_until: user.blockUntil };
};

// Handle Rate Limiting and Blocking Logic
const handleRateLimit = async (userId) => {
  const { attempts, failures, block_until } = await trackUserAttempts(userId);
  const now = new Date();

  // If the user is blocked, reject the request
  if (block_until && new Date(block_until) > now) {
    const remainingBlockTime = Math.ceil((new Date(block_until) - now) / 1000); // in seconds
    return { blocked: true, message: `Blocked for ${remainingBlockTime} seconds` };
  }

  // If attempts exceed the limit, block the user
  if (attempts >= 5) {
    if (failures >= 3) {
      // Block the user for 24 hours if there are 3 consecutive failures
      await blockUser(userId, new Date(now.getTime() + BLOCK_TIME_24H));
      return { blocked: true, message: 'You have been blocked for 24 hours due to repeated failures.' };
    }

    // Block the user for 15 minutes if attempts exceed limit
    await blockUser(userId, new Date(now.getTime() + BLOCK_TIME_15M));
    return { blocked: true, message: 'Too many requests. Please try again after 15 minutes.' };
  }

  // If the attempts are within the limit, allow the request to proceed
  return { blocked: false, message: 'Request allowed' };
};

// The Rate Limiting Middleware
const rateLimitMiddleware = async (req, res, next) => {
  const userId = req.ip; // You can use req.ip or any other unique identifier like userId
  
  const { blocked, message } = await handleRateLimit(userId);

  if (blocked) {
    return res.status(429).json({ message });
  }

  next();
};

export { globalRateLimiter, rateLimitMiddleware };