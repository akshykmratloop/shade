import {Router} from "express";
import ContentController from "./content.controller.js";
// import validator from "../../validation/validator.js";
// import {ContentSchema} from "../../validation/contentSchema.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import auditLogger from "../../helper/auditLogger.js";
import contentController from "./content.controller.js";

const router = Router();

router.post(
  "/addResource",
  auditLogger,
  tryCatchWrap(ContentController.AddNewResource)
);

router.get(
  "/getResources",
  tryCatchWrap(ContentController.GetResources)
);

router.get(
  "/getResourceInfo/:resourceId",
  tryCatchWrap(ContentController.GetResourceInfo)
);

router.get(
  "/getAssignedUsers/:resourceId",
  tryCatchWrap(ContentController.GetAssignedUsers)
);

router.get(
  "/getEligibleUsers",
  tryCatchWrap(ContentController.GetEligibleUser)
);

router.post(
  "/assignUser",
  auditLogger,
  tryCatchWrap(ContentController.AssignUser)
);

router.patch(
  "/removeAssignedUser/:resourceId",
  auditLogger,
  tryCatchWrap(ContentController.RemoveAssignedUser)
);

router.get(
  "/getContent/:resourceId",
  tryCatchWrap(ContentController.GetContent)
);

router.put(
  "/updateContent",
  auditLogger,
  tryCatchWrap(ContentController.UpdateContent)
);

router.post(
  "/directPublishContent",
  auditLogger,
  tryCatchWrap(ContentController.DirectPublishContent)
);

router.put(
  "/generateRequest",
  auditLogger,
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
  auditLogger,
  tryCatchWrap(ContentController.ApproveRequest)
);

router.post(
  "/rejectRequest/:requestId",
  auditLogger,
  tryCatchWrap(ContentController.RejectRequest)
);

router.post(
  "/scheduleRequest/:requestId",
  auditLogger,
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.ScheduleRequest)
);

// router.post(
//   "/publishRequest/:requestId",
//   //   checkPermission(requiredPermissionsForContentManagement),
//   tryCatchWrap(ContentController.PublishRequest)
// );

router.get(
  "/getVersionsList/:resourceId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetVersionsList)
);

router.get(
  "/getVersionInfo/:versionId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetVersionInfo)
);

router.get(
  "/restoreVersion/:versionId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.RestoreVersion)
);

router.delete(
  "/deleteAllContentData",
  // authenticateUser,
  // checkPermission(["SUPER_ADMIN"]),
  // auditLogger,
  tryCatchWrap(ContentController.DeleteAllContentData)
);

router.put(
  "/deactivateResource/:resourceId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.DeactivateResources)
);

router.put(
  "/activateResource/:resourceId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.ActivateResources)
);

router.get(
  "/getDashboardInsight",
  tryCatchWrap(contentController.GetDashboardInsight)
);

router.get(
  "/getVersionContent/:versionId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetVersionContent)
);

router.get(
  "/getAllFilters",
  tryCatchWrap(ContentController.GetAllFilters)
);

export default router;
