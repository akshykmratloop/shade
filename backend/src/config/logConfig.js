import winston from "winston";
import morgan from "morgan";

const isProduction = process.env.MODE === "production";
const level = isProduction ? "error" : "info";

// Set up Winston logger
const logger = winston.createLogger({
  level: level, // Ensure this is set correctly
  format: winston.format.combine(
    winston.format.colorize(), // Add color to logs in the console
    winston.format.timestamp(), // Add timestamps to logs
    winston.format.printf(({ timestamp, level, message }) => {
      return `${level}: \x1b[34m${message}\x1b[0m ${timestamp} `; // Make the message only in blue
    })
  ),
  transports: [
    new winston.transports.File({ filename: "app.log" }),, // always store the logs in app.log file
    ...(isProduction
      ? []
      : [new winston.transports.Console()]), //  log to console only in development
  ],
});

// Morgan setup with Winston for logging HTTP requests
morgan.token("custom", (req, res) => {
  return `Method: ${req.method} | URL: ${req.originalUrl} | Status: ${res.statusCode}`;
});

const morganFormat = ":custom";

// Create a Morgan middleware function that uses the Winston logger
const morganMiddleware = morgan(morganFormat, {
  stream: { write: (msg) => logger.info(msg.trim()) },
});

export { logger, morganMiddleware };
