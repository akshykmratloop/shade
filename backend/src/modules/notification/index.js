import {Router} from "express";
import NotificationRoutes from "./notification.routes.js";
import {authenticateUser} from "../../helper/index.js";

const router = Router();
router.use("/notification", authenticateUser, NotificationRoutes);

export default {
  init: (app) => app.use(router),
};
