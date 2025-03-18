import {Router} from "express";
import UserController from "./user.controller.js";
import {authenticateUser} from "../../helper/authMiddleware.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";

const router = Router();

router.post("/create", tryCatchWrap(UserController.createUserHandler));
router.get("/getAllUsers", tryCatchWrap(UserController.GetAllUsers));
router.put("/updateUser/:userId", tryCatchWrap(UserController.EditUserDetails));

export default router;
