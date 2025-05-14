import {Router} from "express";
import UserController from "./user.controller.js";
import {authenticateUser} from "../../helper/authMiddleware.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import validate from "../../validation/validator.js";
import {updateUserSchema, userSchema} from "../../validation/userSchema.js";
import {checkPermission} from "../../helper/roleBasedAccess.js";
import auditLogger from "../../helper/auditLogger.js";
import user from "./index.js";

const router = Router();

const requiredPermissionsForUser = ["USER_MANAGEMENT"];

router.get(
  "/getAllUserByRoleId/:roleId",
  tryCatchWrap(UserController.GetAllUsersByRoleId)
);
router.get("/getRolesForUser", tryCatchWrap(UserController.GetRolesForUser));
router.post(
  "/create",
  checkPermission(requiredPermissionsForUser),
  validate(userSchema),
  auditLogger,
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
  auditLogger,
  tryCatchWrap(UserController.GetUserById)
);
router.put(
  "/updateUser/:id",
  checkPermission(requiredPermissionsForUser),
  validate(updateUserSchema),
  auditLogger,
  tryCatchWrap(UserController.EditUserDetails)
);
router.put(
  "/activate",
  checkPermission(requiredPermissionsForUser),
  auditLogger,
  tryCatchWrap(UserController.ActivateUser)
);
router.put(
  "/deactivate",
  checkPermission(requiredPermissionsForUser),
  auditLogger,
  tryCatchWrap(UserController.DeactivateUser)
);
router.get(
  "/userRoleType/:id",
  auditLogger,
  tryCatchWrap(UserController.UserRoleType)
);

export default router;
