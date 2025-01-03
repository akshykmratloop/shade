import { Router } from "express";   
import UserRoute from "./auth.router.js";

const router = Router()
router.use("/auth", UserRoute);

export default {
  init: (app) => app.use(router),
};
