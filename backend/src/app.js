import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { serverStatus } from "./other/serverStatus.js";
import morgan from "morgan";
import * as path from "path";
import { errorHandler } from "./helper/expressMiddleware.js"; // Custom error handler
import { notFoundHandler } from "./helper/expressMiddleware.js"; // Not found handler
import winston from "winston";

// Set up Winston logger
const logger = winston.createLogger({
  level: "info", // Minimum log level
  format: winston.format.combine(
    winston.format.colorize(), // Add color to logs in the console
    winston.format.timestamp(), // Add timestamps to logs
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: "logs/app.log" }) // Log to a file
  ]
});

// Morgan setup with Winston for logging HTTP requests
morgan.token("custom", (req, res) => {
  return `Method: ${req.method} | URL: ${req.originalUrl} | Status: ${res.statusCode}`;
});
const morganFormat = ':custom';

export const createApp = () => {
  const app = express();

  // Middleware setup
  app.use(
    cors({
      origin: [process.env.CORS_ORIGIN],
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
  );
  
  // Body parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // HTTP request logging using Morgan with Winston
  app.use(morgan(morganFormat, { stream: { write: (msg) => logger.info(msg.trim()) } }));

  // Serve static files
  app.use(express.static(path.resolve("public")));

  // Health check route
  app.use("/healthy", (req, res) => res.send(serverStatus()));

  return app;
};

// Global error handling
export const finishApp = (app) => {
  // Global error logging for uncaught exceptions and unhandled promise rejections
  process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1); // Optional: Exit after logging critical errors
  });

  process.on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled Rejection: ${reason}`);
  });

  // Custom error handler for routes inside the app
  app.use(errorHandler); // Logs errors and sends a 500 response
  app.use(notFoundHandler); // Handles undefined routes and sends a 404 response
};
