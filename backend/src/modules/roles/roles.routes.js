import { Router } from "express";
import RolesController from "./roles.controller.js";
import { authenticateUser } from "../../helper/authMiddleware.js";
import validator from "../../validation/validator.js";
import {
  updatePasswordSchema
} from "../../validation/index.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";

const router = Router();

router.get(
  "/roles",
  authenticateUser,
  tryCatchWrap(RolesController.FetchRoles)
);

router.post(
  "/create",
  authenticateUser,
  validator(createRoleSchema),
  tryCatchWrap(RolesController.CreateRole)
);

router.put(
  "/update",
  authenticateUser,
  validator(updatePasswordSchema),
  tryCatchWrap(RolesController.UpdateRole)
);

router.post("/activate", authenticateUser, tryCatchWrap(RolesController.ActivateRole));
router.post("/deActivate", authenticateUser, tryCatchWrap(RolesController.DeactivateRole));


export default router;

