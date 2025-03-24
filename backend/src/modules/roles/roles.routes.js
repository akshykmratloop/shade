import {Router} from "express";
import RolesController from "./roles.controller.js";
import {authenticateUser} from "../../helper/authMiddleware.js";
import validator from "../../validation/validator.js";
import {createRoleSchema} from "../../validation/rolesSchema.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";

const router = Router();

const requiredRoles = ["role"];

router.get("/roles", tryCatchWrap(RolesController.GetRoles));

router.get("/roleType", tryCatchWrap(RolesController.GetRoleType));

router.get("/:id", tryCatchWrap(RolesController.GetRoleById));

router.post(
  "/create",
  validator(createRoleSchema),
  tryCatchWrap(RolesController.CreateRole)
);

router.put("/update", tryCatchWrap(RolesController.UpdateRole));

router.put("/activate", tryCatchWrap(RolesController.ActivateRole));

router.put("/deactivate", tryCatchWrap(RolesController.DeactivateRole));

export default router;
