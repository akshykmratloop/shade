import {Router} from "express";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import notificationController from "./notification.controller.js";
const router = Router();

router.get("/:id", tryCatchWrap(notificationController.GetAllNotification));

export default router;
