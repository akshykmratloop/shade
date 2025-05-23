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
  "/getResources",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetResources)
);

router.get(
  "/getResourceInfo/:resourceId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetResourceInfo)
);

router.get(
  "/getAssignedUsers/:resourceId",
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
  auditLogger,
  tryCatchWrap(ContentController.AssignUser)
);

router.patch(
  "/removeAssignedUser/:resourceId",
  //   checkPermission(requiredPermissionsForContentManagement),
  auditLogger,
  tryCatchWrap(ContentController.RemoveAssignedUser)
);

router.get(
  "/getContent/:resourceId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetContent)
);

router.put(
  "/updateContent",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.UpdateContent)
);

router.post(
  "/directPublishContent",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.DirectPublishContent)
);

router.post(
  "/directPublishContent",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.DirectPublishContent)
);

router.put(
  "/generateRequest",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GenerateRequest)
);

router.get(
  "/getRequests",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetRequest)
);

router.get(
  "/getRequestInfo/:requestId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetRequestInfo)
);

router.post(
  "/approveRequest/:requestId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.ApproveRequest)
);


router.post(
  "/rejectRequest/:requestId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.RejectRequest)
);

router.post(
  "/scheduleRequest/:requestId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.ScheduleRequest)
);

router.post(
  "/publishRequest/:requestId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.PublishRequest)
);


router.get(
  "/getVersionsList/:resourceId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetVersionsList)
);


router.get(
  "/inactiveResource/:resourceId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetVersionsList)
);

export default router;
