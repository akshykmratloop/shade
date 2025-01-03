// backend/src/app.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { serverStatus } from "./other/serverStatus.js";
import morgan from "morgan";
import * as path from "path";
import { errorHandler } from "./helper/expressMiddleware.js";
import { notFoundHandler } from "./helper/expressMiddleware.js";

const CORS = process.env.CORS_ORIGIN;

export const createApp = () => {
  const app = express();
  app.use(
    cors({
      origin: [CORS],
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
  );
  app.use(bodyParser.json());
  app.use(morgan("dev"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.resolve("public")));
  app.use("/healthy", (req, res) => res.send(serverStatus()));
  return app;
};

export const finishApp = (app) => {
  app.use(notFoundHandler);
  app.use(errorHandler);
};
