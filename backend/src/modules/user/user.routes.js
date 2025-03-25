import {Router} from "express";
import UserController from "./user.controller.js";
import {authenticateUser} from "../../helper/authMiddleware.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import validate from "../../validation/validator.js";
import {updateUserSchema, userSchema} from "../../validation/userSchema.js";
import {checkPermission} from "../../helper/roleBasedAccess.js";

const router = Router();

const requiredPermissionsForUser = ["USER_MANAGEMENT"];

router.post(
  "/create",
  checkPermission(requiredPermissionsForUser),
  validate(userSchema),
  tryCatchWrap(UserController.createUserHandler)
);
router.get(
  "/getAllUsers",
  checkPermission(requiredPermissionsForUser),
  tryCatchWrap(UserController.GetAllUsers)
);
router.get(
  "/:id",
  checkPermission(requiredPermissionsForUser),
  tryCatchWrap(UserController.GetUserById)
);
router.put(
  "/updateUser/:userId",
  checkPermission(requiredPermissionsForUser),
  validate(updateUserSchema),
  tryCatchWrap(UserController.EditUserDetails)
);
router.put(
  "/activate",
  checkPermission(requiredPermissionsForUser),
  tryCatchWrap(UserController.ActivateUser)
);
router.put(
  "/deactivate",
  checkPermission(requiredPermissionsForUser),
  tryCatchWrap(UserController.DeactivateUser)
);

export default router;
