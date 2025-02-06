import { Router } from "express";
import RolesController from "./roles.controller.js";
import { authenticateUser } from "../../helper/authMiddleware.js";
import validator from "../../validation/validator.js";
import {
  createRoleSchema
} from "../../validation/rolesSchema.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";

const router = Router();

router.get(
  "/roles",
  authenticateUser,
  tryCatchWrap(RolesController.FetchRoles)
);

// router.post(
//   "/create",
//   authenticateUser,
//   validator(createRoleSchema),
//   tryCatchWrap()
// );

// router.put(
//   "/update",
//   authenticateUser,
//   // validator(updatePasswordSchema),
//   tryCatchWrap()
// );

// router.post("/activate", authenticateUser, tryCatchWrap());
// router.post("/deActivate", authenticateUser, tryCatchWrap());


export default router;

