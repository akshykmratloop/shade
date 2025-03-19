import {Router} from "express";
import UserController from "./user.controller.js";
import {authenticateUser} from "../../helper/authMiddleware.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import validate from "../../validation/validator.js";
import {userSchema} from "../../validation/userSchema.js";

const router = Router();

router.post(
  "/create",
  validate(userSchema),
  tryCatchWrap(UserController.createUserHandler)
);
router.get("/getAllUsers", tryCatchWrap(UserController.GetAllUsers));
router.get("/:id", tryCatchWrap(UserController.GetUserById));
router.put(
  "/updateUser/:userId",
  validate(userSchema),
  tryCatchWrap(UserController.EditUserDetails)
);

export default router;
