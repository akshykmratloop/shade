import {Router} from "express";
import ContentController from "./content.controller.js";
import {authenticateUser} from "../../helper/authMiddleware.js";
import validator from "../../validation/validator.js";
// import {ContentSchema} from "../../validation/contentSchema.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import {checkPermission} from "../../helper/roleBasedAccess.js";
import auditLogger from "../../helper/auditLogger.js";

const router = Router();

// const requiredPermissionsForContentManagement = ["ROLES_PERMISSION_MANAGEMENT"];

router.get(
  "/getPages",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetPages)
);

router.get(
  "/getPageInfo",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetPageInfo)
);

router.get(
  "/getAssignedUsers",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetAssignedUsers)
);

router.get(
  "/getEligibleUsers",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetEligibleUser)
);

router.post(
  "/assignUser",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.AssignUser)
);

router.get(
  "/getContent",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetContent)
);

export default router;
