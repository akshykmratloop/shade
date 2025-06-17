import {Router} from "express";
import ContentController from "./content.controller.js";
import {authenticateUser} from "../../helper/authMiddleware.js";
import validator from "../../validation/validator.js";
// import {ContentSchema} from "../../validation/contentSchema.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import {checkPermission} from "../../helper/roleBasedAccess.js";
import auditLogger from "../../helper/auditLogger.js";

const router = Router();

router.post(
  "/createResource",
  tryCatchWrap(ContentController.CreateNewResource)
);

// const requiredPermissionsForContentManagement = ["ROLES_PERMISSION_MANAGEMENT"];

// /**
//  * @swagger
//  * /content/getResources:
//  *   get:
//  *     summary: Get content resources with filters and pagination
//  *     tags: [Content]
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: resourceType
//  *         required: false
//  *         schema:
//  *           type: string
//  *         description: Filter by the type of resource (e.g., "article", "page")
//  *       - in: query
//  *         name: resourceTag
//  *         required: false
//  *         schema:
//  *           type: string
//  *         description: Filter by a specific tag associated with the resource
//  *       - in: query
//  *         name: relationType
//  *         required: false
//  *         schema:
//  *           type: string
//  *         description: Filter by relation type (e.g., "parent", "child")
//  *       - in: query
//  *         name: isAssigned
//  *         required: false
//  *         schema:
//  *           type: boolean
//  *         description: Whether the resource is assigned (true/false)
//  *       - in: query
//  *         name: search
//  *         required: false
//  *         schema:
//  *           type: string
//  *         description: Full-text search term
//  *       - in: query
//  *         name: status
//  *         required: false
//  *         schema:
//  *           type: string
//  *         description: Filter by workflow status (e.g., "draft", "published")
//  *       - in: query
//  *         name: page
//  *         required: false
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *         description: Page number for pagination
//  *       - in: query
//  *         name: limit
//  *         required: false
//  *         schema:
//  *           type: integer
//  *           default: 100
//  *         description: Number of items per page
//  *       - in: query
//  *         name: fetchType
//  *         required: false
//  *         schema:
//  *           type: string
//  *         description: Type of fetch operation (e.g., "all", "assignedOnly")
//  *       - in: query
//  *         name: roleId
//  *         required: false
//  *         schema:
//  *           type: string
//  *         description: Role ID to filter resources by user role
//  *       - in: query
//  *         name: apiCallType
//  *         required: false
//  *         schema:
//  *           type: string
//  *         description: Indicates the context of the API call (e.g., "inline", "bulk")
//  *     responses:
//  *       200:
//  *         description: Resources fetched successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Resources fetched successfully
//  *                 data:
//  *                   type: array
//  *                   description: List of resource objects
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       id:
//  *                         type: string
//  *                         format: uuid
//  *                         example: e4f8c0a2-3b7a-4c5d-9e2f-1a2b3c4d5e6f
//  *                       title:
//  *                         type: string
//  *                         example: "Getting Started with Shade CMS"
//  *                       resourceType:
//  *                         type: string
//  *                         example: article
//  *                       status:
//  *                         type: string
//  *                         example: published
//  *                       tags:
//  *                         type: array
//  *                         items:
//  *                           type: string
//  *                         example: ["guide", "intro"]
//  *                       createdAt:
//  *                         type: string
//  *                         format: date-time
//  *                         example: 2025-05-19T06:00:00Z
//  *                 page:
//  *                   type: integer
//  *                   example: 1
//  *                 limit:
//  *                   type: integer
//  *                   example: 100
//  *                 total:
//  *                   type: integer
//  *                   example: 42
//  *       400:
//  *         $ref: '#/components/schemas/ErrorResponse'
//  */

router.get(
  "/getResources",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetResources)
);

// /**
//  * @swagger
//  * /content/getResourceInfo/{resourceId}:
//  *   get:
//  *     summary: Get detailed information for a single resource
//  *     tags: [Content]
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: resourceId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the resource to retrieve
//  *     responses:
//  *       200:
//  *         description: Resource info fetched successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Success
//  *                 resourceInfo:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: string
//  *                       example: cmanxcohj00topc4yeubbou2m
//  *                     titleEn:
//  *                       type: string
//  *                       example: Home Page
//  *                     titleAr:
//  *                       type: string
//  *                       example: الصفحة الرئيسية
//  *                     slug:
//  *                       type: string
//  *                       example: home
//  *                     status:
//  *                       type: string
//  *                       example: ACTIVE
//  *                     resourceType:
//  *                       type: string
//  *                       example: MAIN_PAGE
//  *                     resourceTag:
//  *                       type: string
//  *                       example: HOME
//  *                     relationType:
//  *                       type: string
//  *                       example: PARENT
//  *                     isAssigned:
//  *                       type: boolean
//  *                       example: false
//  *                     liveVersionId:
//  *                       type: string
//  *                       example: cmanxcohn00tqpc4y5bpbjw7w
//  *                     newVersionEditModeId:
//  *                       nullable: true
//  *                       type: string
//  *                       example: null
//  *                     scheduledVersionId:
//  *                       nullable: true
//  *                       type: string
//  *                       example: null
//  *                     createdAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: 2025-05-14T12:36:14.455Z
//  *                     updatedAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: 2025-05-14T12:36:14.461Z
//  *                     _count:
//  *                       type: object
//  *                       properties:
//  *                         versions:
//  *                           type: integer
//  *                           example: 1
//  *                     roles:
//  *                       type: array
//  *                       items:
//  *                         type: string
//  *                       example: []
//  *                     liveVersion:
//  *                       type: object
//  *                       properties:
//  *                         versionNumber:
//  *                           type: integer
//  *                           example: 1
//  *                     newVersionEditMode:
//  *                       nullable: true
//  *                       type: object
//  *                       example: null
//  *                     verifiers:
//  *                       type: array
//  *                       items:
//  *                         type: object
//  *                       example: []
//  *       400:
//  *         $ref: '#/components/schemas/ErrorResponse'
//  *       404:
//  *         description: Resource not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Resource not found
//  */

router.get(
  "/getResourceInfo/:resourceId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetResourceInfo)
);

// /**
//  * @swagger
//  * /content/getAssignedUsers/{resourceId}:
//  *   get:
//  *     summary: Get users assigned to a specific resource
//  *     tags: [Content]
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: resourceId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the resource for which to retrieve assigned users
//  *     responses:
//  *       200:
//  *         description: Assigned users fetched successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Success
//  *                 assignedUsers:
//  *                   type: object
//  *                   properties:
//  *                     roles:
//  *                       type: array
//  *                       items:
//  *                         type: object
//  *                         properties:
//  *                           id:
//  *                             type: string
//  *                             format: uuid
//  *                             example: 9c3083b6-de55-4eb4-b901-4d7dc742c7b3
//  *                           resourceId:
//  *                             type: string
//  *                             format: uuid
//  *                             example: cmanxcohj00topc4yeubbou2m
//  *                           userId:
//  *                             type: string
//  *                             format: uuid
//  *                             example: cmaoux1f1000qpc0w5vlqhgjx
//  *                           role:
//  *                             type: string
//  *                             example: MANAGER
//  *                           status:
//  *                             type: string
//  *                             example: ACTIVE
//  *                           createdAt:
//  *                             type: string
//  *                             format: date-time
//  *                             example: 2025-05-19T10:22:43.787Z
//  *                           user:
//  *                             type: object
//  *                             properties:
//  *                               id:
//  *                                 type: string
//  *                                 format: uuid
//  *                                 example: cmaoux1f1000qpc0w5vlqhgjx
//  *                               name:
//  *                                 type: string
//  *                                 example: Deepanshu Kataria
//  *                     verifiers:
//  *                       type: array
//  *                       items:
//  *                         type: object
//  *                         properties:
//  *                           id:
//  *                             type: string
//  *                             format: uuid
//  *                             example: ca9d4344-b067-4383-b5c6-992c6bd6639d
//  *                           stage:
//  *                             type: integer
//  *                             example: 1
//  *                           status:
//  *                             type: string
//  *                             example: ACTIVE
//  *                           resourceId:
//  *                             type: string
//  *                             format: uuid
//  *                             example: cmanxcohj00topc4yeubbou2m
//  *                           userId:
//  *                             type: string
//  *                             format: uuid
//  *                             example: cmaovteo80010pc0ww0eqt1w3
//  *                           createdAt:
//  *                             type: string
//  *                             format: date-time
//  *                             example: 2025-05-19T10:22:43.795Z
//  *                           user:
//  *                             type: object
//  *                             properties:
//  *                               id:
//  *                                 type: string
//  *                                 format: uuid
//  *                                 example: cmaovteo80010pc0ww0eqt1w3
//  *                               name:
//  *                                 type: string
//  *                                 example: Rajesh Rishi
//  *       400:
//  *         $ref: '#/components/schemas/ErrorResponse'
//  *       404:
//  *         description: Resource not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Resource not found
//  */

router.get(
  "/getAssignedUsers/:resourceId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetAssignedUsers)
);

// /**
//  * @swagger
//  * /content/getEligibleUsers:
//  *   get:
//  *     summary: Get users eligible based on role type and permission
//  *     tags: [Content]
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: roleType
//  *         required: false
//  *         schema:
//  *           type: string
//  *         description: Filter eligible users by role type (e.g., "MANAGER, USER")
//  *       - in: query
//  *         name: permission
//  *         required: false
//  *         schema:
//  *           type: string
//  *         description: Filter eligible users by a specific permission (e.g., "publish_content")
//  *     responses:
//  *       200:
//  *         description: Eligible users fetched successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Success
//  *                 eligibleUsers:
//  *                   type: array
//  *                   description: List of eligible users matching the criteria
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       id:
//  *                         type: string
//  *                         example: cmaov27ni000spc0w9oxjpdd6
//  *                       name:
//  *                         type: string
//  *                         example: Bhavnesh Sharma
//  *                       email:
//  *                         type: string
//  *                         format: email
//  *                         example: bhavnesh@sharma.com
//  *                       phone:
//  *                         type: string
//  *                         example: "7878787878"
//  *                       status:
//  *                         type: string
//  *                         example: ACTIVE
//  *                       roles:
//  *                         type: array
//  *                         description: Roles assigned to the user
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             name:
//  *                               type: string
//  *                               example: Publisher
//  *                             type:
//  *                               type: string
//  *                               example: USER
//  *                             permissions:
//  *                               type: array
//  *                               items:
//  *                                 type: string
//  *                               example: ["PUBLISH"]
//  *       400:
//  *         $ref: '#/components/schemas/ErrorResponse'
//  */

router.get(
  "/getEligibleUsers",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetEligibleUser)
);

// /**
//  * @swagger
//  * /content/assignUser:
//  *   post:
//  *     summary: Assign users to a content resource
//  *     tags: [Content]
//  *     security:
//  *       - BearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - resourceId
//  *             properties:
//  *               resourceId:
//  *                 type: string
//  *                 example: "cmaw7xsgh00tdnt4val4aae3e"
//  *               manager:
//  *                 type: string
//  *                 example: "ManagerUserId"
//  *               editor:
//  *                 type: string
//  *                 example: "EditorUserId"
//  *               verifiers:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: string
//  *                       example: cmaw7xsgh00tdnt4val4aae3e
//  *                     stage:
//  *                       type: integar
//  *                       example: 1
//  *               publisher:
//  *                 type: string
//  *                 example: "PublisherUserId"
//  *     responses:
//  *       200:
//  *         description: Users assigned successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Users assigned successfully
//  *                 assignedUsers:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: string
//  *                       format: uuid
//  *                       example: cmaw7xsgh00tdnt4val4aae3e
//  *                     titleEn:
//  *                       type: string
//  *                       example: Home Page
//  *                     titleAr:
//  *                       type: string
//  *                       example: الصفحة الرئيسية
//  *                     slug:
//  *                       type: string
//  *                       example: home
//  *                     status:
//  *                       type: string
//  *                       example: ACTIVE
//  *                     resourceType:
//  *                       type: string
//  *                       example: MAIN_PAGE
//  *                     resourceTag:
//  *                       type: string
//  *                       example: HOME
//  *                     relationType:
//  *                       type: string
//  *                       example: PARENT
//  *                     isAssigned:
//  *                       type: boolean
//  *                       example: true
//  *                     liveVersionId:
//  *                       type: string
//  *                       format: uuid
//  *                       example: cmawb9jm30001nt9wne52ghzc
//  *                     newVersionEditModeId:
//  *                       type: string
//  *                       format: uuid
//  *                       example: cmaw88umy000ant7zeqovh5w6
//  *                     scheduledVersionId:
//  *                       type: string
//  *                       nullable: true
//  *                     parentId:
//  *                       type: string
//  *                       nullable: true
//  *                     createdAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: 2025-05-20T07:54:44.946Z
//  *                     updatedAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: 2025-05-21T05:28:59.779Z
//  *                     roles:
//  *                       type: array
//  *                       items:
//  *                         type: object
//  *                         properties:
//  *                           id:
//  *                             type: string
//  *                             format: uuid
//  *                           resourceId:
//  *                             type: string
//  *                             format: uuid
//  *                           userId:
//  *                             type: string
//  *                             format: uuid
//  *                           role:
//  *                             type: string
//  *                           status:
//  *                             type: string
//  *                           createdAt:
//  *                             type: string
//  *                             format: date-time
//  *                           user:
//  *                             type: object
//  *                             properties:
//  *                               id:
//  *                                 type: string
//  *                                 format: uuid
//  *                               name:
//  *                                 type: string
//  *                               image:
//  *                                 type: string
//  *                               email:
//  *                                 type: string
//  *                                 format: email
//  *                     verifiers:
//  *                       type: array
//  *                       items:
//  *                         type: object
//  *                         properties:
//  *                           id:
//  *                             type: string
//  *                             format: uuid
//  *                           stage:
//  *                             type: integer
//  *                           status:
//  *                             type: string
//  *                           resourceId:
//  *                             type: string
//  *                             format: uuid
//  *                           userId:
//  *                             type: string
//  *                             format: uuid
//  *                           createdAt:
//  *                             type: string
//  *                             format: date-time
//  *                           user:
//  *                             type: object
//  *                             properties:
//  *                               id:
//  *                                 type: string
//  *                                 format: uuid
//  *                               name:
//  *                                 type: string
//  *                     newVersionEditMode:
//  *                       type: object
//  *                       properties:
//  *                         id:
//  *                           type: string
//  *                           format: uuid
//  *                         versionNumber:
//  *                           type: integer
//  *                         versionStatus:
//  *                           type: string
//  *                         notes:
//  *                           type: string
//  *                         referenceDoc:
//  *                           type: string
//  *                           nullable: true
//  *                         content:
//  *                           type: object
//  *                         icon:
//  *                           type: string
//  *                           nullable: true
//  *                         Image:
//  *                           type: string
//  *                           nullable: true
//  *                         lockedById:
//  *                           type: string
//  *                           nullable: true
//  *                         lockedAt:
//  *                           type: string
//  *                           format: date-time
//  *                           nullable: true
//  *                         resourceId:
//  *                           type: string
//  *                           format: uuid
//  *                         createdAt:
//  *                           type: string
//  *                           format: date-time
//  *                         updatedAt:
//  *                           type: string
//  *                           format: date-time
//  *                         scheduledAt:
//  *                           type: string
//  *                           format: date-time
//  *                           nullable: true
//  *                         publishedAt:
//  *                           type: string
//  *                           format: date-time
//  *                           nullable: true
//  *                         roles:
//  *                           type: array
//  *                           items:
//  *                             type: object
//  *                             properties:
//  *                               id:
//  *                                 type: string
//  *                                 format: uuid
//  *                               role:
//  *                                 type: string
//  *                               status:
//  *                                 type: string
//  *                               resourceVersionId:
//  *                                 type: string
//  *                                 format: uuid
//  *                               userId:
//  *                                 type: string
//  *                                 format: uuid
//  *                               createdAt:
//  *                                 type: string
//  *                                 format: date-time
//  *                               user:
//  *                                 type: object
//  *                                 properties:
//  *                                   id:
//  *                                     type: string
//  *                                     format: uuid
//  *                                   name:
//  *                                     type: string
//  *                         verifiers:
//  *                           type: array
//  *                           items:
//  *                             type: object
//  *                             properties:
//  *                               id:
//  *                                 type: string
//  *                                 format: uuid
//  *                               stage:
//  *                                 type: integer
//  *                               status:
//  *                                 type: string
//  *                               resourceVersionId:
//  *                                 type: string
//  *                                 format: uuid
//  *                               userId:
//  *                                 type: string
//  *                                 format: uuid
//  *                               createdAt:
//  *                                 type: string
//  *                                 format: date-time
//  *                               user:
//  *                                 type: object
//  *                                 properties:
//  *                                   id:
//  *                                     type: string
//  *                                     format: uuid
//  *                                   name:
//  *                                     type: string
//  *       400:
//  *         $ref: '#/components/schemas/ErrorResponse'
//  */

router.post(
  "/assignUser",
  //   checkPermission(requiredPermissionsForContentManagement),
  auditLogger,
  tryCatchWrap(ContentController.AssignUser)
);

// /**
//  * @swagger
//  * /content/removeAssignedUser/{resourceId}:
//  *   patch:
//  *     summary: Remove an assigned user from a specific resource
//  *     tags: [Content]
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: resourceId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the resource from which to remove the user
//  *     responses:
//  *       200:
//  *         description: Users removed successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Users removed successfully
//  *                 result:
//  *                   type: object
//  *                   properties:
//  *                     success:
//  *                       type: boolean
//  *                       example: true
//  *                     message:
//  *                       type: string
//  *                       example: All active user assignments for resource cmanxcohj00topc4yeubbou2m have been marked as inactive
//  *       400:
//  *         $ref: '#/components/schemas/ErrorResponse'
//  *       404:
//  *         description: Resource or assigned user not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Assigned user not found for this resource
//  */

router.patch(
  "/removeAssignedUser/:resourceId",
  //   checkPermission(requiredPermissionsForContentManagement),
  // auditLogger,
  tryCatchWrap(ContentController.RemoveAssignedUser)
);

// /**
//  * @swagger
//  * /content/getContent/{resourceId}:
//  *   get:
//  *     summary: Get the raw content for a specific resource
//  *     tags: [Content]
//  *     security:
//  *       - BearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: resourceId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the resource to retrieve content for
//  *     responses:
//  *       200:
//  *         description: Resource info fetched successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Success
//  *                 content:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: string
//  *                       example: cmanxcohj00topc4yeubbou2m
//  *                     titleEn:
//  *                       type: string
//  *                       example: Home Page
//  *                     titleAr:
//  *                       type: string
//  *                       example: الصفحة الرئيسية
//  *                     slug:
//  *                       type: string
//  *                       example: home
//  *                     resourceType:
//  *                       type: string
//  *                       example: MAIN_PAGE
//  *                     resourceTag:
//  *                       type: string
//  *                       example: HOME
//  *                     relationType:
//  *                       type: string
//  *                       example: PARENT
//  *                     liveModeVersionData:
//  *                       type: object
//  *                       properties:
//  *                         id:
//  *                           type: string
//  *                           example: cmanxcohn00tqpc4y5bpbjw7w
//  *                         versionNumber:
//  *                           type: integer
//  *                           example: 1
//  *                         icon:
//  *                           type: string
//  *                           nullable: true
//  *                         image:
//  *                           type: string
//  *                           nullable: true
//  *                         comments:
//  *                           type: string
//  *                           example: Initial version created
//  *                         referenceDoc:
//  *                           type: string
//  *                           nullable: true
//  *                         updatedAt:
//  *                           type: string
//  *                           format: date-time
//  *                           example: 2025-05-14T12:36:14.459Z
//  *                         status:
//  *                           type: string
//  *                           example: PUBLISHED
//  *                         sections:
//  *                           type: array
//  *                           items:
//  *                             type: object
//  *                             properties:
//  *                               sectionId:
//  *                                 type: string
//  *                                 example: cmanxcohz00tspc4yn7rl5kk6
//  *                               order:
//  *                                 type: integer
//  *                                 example: 1
//  *                               version:
//  *                                 type: integer
//  *                                 example: 1
//  *                               title:
//  *                                 type: string
//  *                                 example: HeroSection-home-b3dd
//  *                               content:
//  *                                 type: object
//  *                                 properties:
//  *                                   title:
//  *                                     type: object
//  *                                     properties:
//  *                                       ar:
//  *                                         type: string
//  *                                         example: بناء مستقبل أقوى
//  *                                       en:
//  *                                         type: string
//  *                                         example: Building a Stronger Future
//  *                                   button:
//  *                                     type: array
//  *                                     items:
//  *                                       type: object
//  *                                       properties:
//  *                                         url:
//  *                                           type: string
//  *                                           nullable: true
//  *                                         icon:
//  *                                           type: string
//  *                                           nullable: true
//  *                                         text:
//  *                                           type: object
//  *                                           properties:
//  *                                             ar:
//  *                                               type: string
//  *                                               example: أعمالنا
//  *                                             en:
//  *                                               type: string
//  *                                               example: View Our Work
//  *                                         order:
//  *                                           type: integer
//  *                                           example: 1
//  *                                   images:
//  *                                     type: array
//  *                                     items:
//  *                                       type: object
//  *                                       properties:
//  *                                         url:
//  *                                           type: string
//  *                                         order:
//  *                                           type: integer
//  *                                           example: 1
//  *                                         altText:
//  *                                           type: object
//  *                                           properties:
//  *                                             ar:
//  *                                               type: string
//  *                                             en:
//  *                                               type: string
//  *                                   description:
//  *                                     type: object
//  *                                     properties:
//  *                                       ar:
//  *                                         type: string
//  *                                       en:
//  *                                         type: string
//  *                               items:
//  *                                 type: array
//  *                                 items:
//  *                                   type: object
//  *                                   properties:
//  *                                     id:
//  *                                       type: string
//  *                                     titleEn:
//  *                                       type: string
//  *                                     titleAr:
//  *                                       type: string
//  *                                     slug:
//  *                                       type: string
//  *                                   # ... additional item props omitted for brevity
//  *       400:
//  *         $ref: '#/components/schemas/ErrorResponse'
//  *       404:
//  *         description: Resource not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Resource not found
//  */

router.get(
  "/getContent/:resourceId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetContent)
);

// /**
//  * @swagger
//  * /content/updateContent:
//  *   put:
//  *     summary: Update or save content for resources
//  *     tags: [Content]
//  *     security:
//  *       - BearerAuth: []
//  *     requestBody:
//  *       description: Full content payload, including draft mode and structured sections
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - resourceId
//  *               - titleEn
//  *               - titleAr
//  *               - slug
//  *               - newVersionEditMode
//  *               - sections
//  *             properties:
//  *               resourceId:
//  *                 type: string
//  *                 format: uuid
//  *                 example: cmanwipvc00toqrj6zytmop4d
//  *               titleEn:
//  *                 type: string
//  *                 example: Home Page
//  *               titleAr:
//  *                 type: string
//  *                 example: الصفحة الرئيسية
//  *               slug:
//  *                 type: string
//  *                 example: home
//  *               newVersionEditMode:
//  *                 type: object
//  *                 required:
//  *                   - comments
//  *                   - sections
//  *                 properties:
//  *                   comments:
//  *                     type: string
//  *                     example: Initial version created
//  *                   referenceDoc:
//  *                     type: string
//  *                     nullable: true
//  *                     example: null
//  *                   icon:
//  *                     type: string
//  *                     nullable: true
//  *                     example: null
//  *                   image:
//  *                     type: string
//  *                     nullable: true
//  *                     example: null
//  *                   sections:
//  *                     type: array
//  *                     items:
//  *                       type: object
//  *                       required:
//  *                         - sectionId
//  *                         - order
//  *                         - content
//  *                       properties:
//  *                         sectionId:
//  *                           type: string
//  *                           format: uuid
//  *                           example: cmanwipvr00tsqrj6nkmm7080
//  *                         order:
//  *                           type: integer
//  *                           example: 1
//  *                         content:
//  *                           type: object
//  *                           properties:
//  *                             title:
//  *                               type: object
//  *                               properties:
//  *                                 ar:
//  *                                   type: string
//  *                                   example: بناء مستقبل أقوى
//  *                                 en:
//  *                                   type: string
//  *                                   example: Building a Stronger Future
//  *                             button:
//  *                               type: array
//  *                               items:
//  *                                 type: object
//  *                                 required:
//  *                                   - order
//  *                                   - text
//  *                                 properties:
//  *                                   url:
//  *                                     type: string
//  *                                     nullable: true
//  *                                     example: null
//  *                                   icon:
//  *                                     type: string
//  *                                     nullable: true
//  *                                     example: null
//  *                                   text:
//  *                                     type: object
//  *                                     properties:
//  *                                       ar:
//  *                                         type: string
//  *                                         example: أعمالنا
//  *                                       en:
//  *                                         type: string
//  *                                         example: View Our Work
//  *                                   order:
//  *                                     type: integer
//  *                                     example: 1
//  *                             images:
//  *                               type: array
//  *                               items:
//  *                                 type: object
//  *                                 required:
//  *                                   - order
//  *                                   - altText
//  *                                 properties:
//  *                                   url:
//  *                                     type: string
//  *                                     example: ""
//  *                                   order:
//  *                                     type: integer
//  *                                     example: 1
//  *                                   altText:
//  *                                     type: object
//  *                                     properties:
//  *                                       ar:
//  *                                         type: string
//  *                                         example: الرئيسية
//  *                                       en:
//  *                                         type: string
//  *                                         example: Image
//  *                             description:
//  *                               type: object
//  *                               properties:
//  *                                 ar:
//  *                                   type: string
//  *                                   example: >-
//  *                                     التزامنا الثابت الذي يعزز الشراكات...
//  *                                 en:
//  *                                   type: string
//  *                                   example: >-
//  *                                     Our unwavering commitment that forge...
//  *                         items:
//  *                           type: array
//  *                           items:
//  *                             type: object
//  *                             required:
//  *                               - order
//  *                               - id
//  *                             properties:
//  *                               order:
//  *                                 type: integer
//  *                                 example: 1
//  *                               id:
//  *                                 type: string
//  *                                 format: uuid
//  *                                 example: cmanwipcm00fiqrj6c05xml7u
//  *               sections:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   required:
//  *                     - sectionId
//  *                     - order
//  *                     - content
//  *                   properties:
//  *                     sectionId:
//  *                       type: string
//  *                       format: uuid
//  *                       example: cmanwipwr00ukqrj6r5gd4v50
//  *                     order:
//  *                       type: integer
//  *                       example: 4
//  *                     content:
//  *                       type: object
//  *                       properties:
//  *                         cards:
//  *                           type: array
//  *                           items:
//  *                             type: object
//  *                             properties:
//  *                               icon:
//  *                                 type: string
//  *                                 example: ""
//  *                               count:
//  *                                 type: string
//  *                                 example: "123"
//  *                               order:
//  *                                 type: integer
//  *                                 example: 1
//  *                               title:
//  *                                 type: object
//  *                                 properties:
//  *                                   ar:
//  *                                     type: string
//  *                                     example: المشاريع المنجزة
//  *                                   en:
//  *                                     type: string
//  *                                     example: Projects Completed
//  *                         button:
//  *                           type: array
//  *                           items:
//  *                             type: object
//  *                             required:
//  *                               - order
//  *                               - text
//  *                             properties:
//  *                               url:
//  *                                 type: string
//  *                                 nullable: true
//  *                                 example: null
//  *                               icon:
//  *                                 type: string
//  *                                 nullable: true
//  *                                 example: null
//  *                               text:
//  *                                 type: object
//  *                                 properties:
//  *                                   ar:
//  *                                     type: string
//  *                                     example: اتصل بنا
//  *                                   en:
//  *                                     type: string
//  *                                     example: Contact Us
//  *                               order:
//  *                                 type: integer
//  *                                 example: 1
//  *                         description:
//  *                           type: object
//  *                           properties:
//  *                             ar:
//  *                               type: string
//  *                               example: كانت شركتنا رائدة...
//  *                             en:
//  *                               type: string
//  *                               example: Our company has been the leading...
//  *                         buttons:
//  *                           type: array
//  *                           items:
//  *                             type: object
//  *                             required:
//  *                               - order
//  *                               - text
//  *                             properties:
//  *                               icon:
//  *                                 type: string
//  *                                 nullable: true
//  *                               text:
//  *                                 type: object
//  *                                 properties:
//  *                                   ar:
//  *                                     type: string
//  *                                     example: عرض الكل
//  *                                   en:
//  *                                     type: string
//  *                                     example: View All
//  *                               order:
//  *                                 type: integer
//  *                                 example: 1
//  *                         sections:
//  *                           type: array
//  *                           items:
//  *                             type: object
//  *                             required:
//  *                               - sectionId
//  *                               - order
//  *                               - content
//  *                             properties:
//  *                               sectionId:
//  *                                 type: string
//  *                                 format: uuid
//  *                                 example: cmanwipx600uwqrj647aqzfw5
//  *                               order:
//  *                                 type: integer
//  *                                 example: 1
//  *                               content:
//  *                                 type: object
//  *                                 properties:
//  *                                   id:
//  *                                     type: string
//  *                                     example: projectsSlugs
//  *                                   title:
//  *                                     type: object
//  *                                     properties:
//  *                                       ar:
//  *                                         type: string
//  *                                         example: المشاريع الأخيرة
//  *                                       en:
//  *                                         type: string
//  *                                         example: Recent Projects
//  *                                   description:
//  *                                     type: object
//  *                                     properties:
//  *                                       ar:
//  *                                         type: string
//  *                                         example: تفتخر شركة شيد...
//  *                                       en:
//  *                                         type: string
//  *                                         example: Shade Corporation boasts...
//  *                     items:
//  *                       type: array
//  *                       items:
//  *                         type: object
//  *                         properties:
//  *                           order:
//  *                             type: integer
//  *                             example: 1
//  *                           id:
//  *                             type: string
//  *                             format: uuid
//  *                             example: cmanwiox7004kqrj6excs2vyo
//  *     responses:
//  *       200:
//  *         description: Resource version updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Resource version updated successfully
//  *                 resource:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: string
//  *                       format: uuid
//  *                       example: cmaw7xsgh00tdnt4val4aae3e
//  *                     titleEn:
//  *                       type: string
//  *                       example: Home Page
//  *                     titleAr:
//  *                       type: string
//  *                       example: الصفحة الرئيسية
//  *                     slug:
//  *                       type: string
//  *                       example: home
//  *                     status:
//  *                       type: string
//  *                       example: ACTIVE
//  *                     resourceType:
//  *                       type: string
//  *                       example: MAIN_PAGE
//  *                     resourceTag:
//  *                       type: string
//  *                       example: HOME
//  *                     relationType:
//  *                       type: string
//  *                       example: PARENT
//  *                     isAssigned:
//  *                       type: boolean
//  *                       example: true
//  *                     liveVersionId:
//  *                       type: string
//  *                       format: uuid
//  *                       example: cmaw7xsgk00tfnt4vxpnwe62i
//  *                     newVersionEditModeId:
//  *                       type: string
//  *                       format: uuid
//  *                       example: cmaw88umy000ant7zeqovh5w6
//  *                     scheduledVersionId:
//  *                       type: string
//  *                       format: uuid
//  *                       nullable: true
//  *                       example: null
//  *                     parentId:
//  *                       type: string
//  *                       format: uuid
//  *                       nullable: true
//  *                       example: null
//  *                     createdAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: 2025-05-20T07:54:44.946Z
//  *                     updatedAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: 2025-05-20T08:07:54.203Z
//  *                     resourceVersion:
//  *                       type: object
//  *                       properties:
//  *                         id:
//  *                           type: string
//  *                           format: uuid
//  *                           example: cmaw88umy000ant7zeqovh5w6
//  *                         versionNumber:
//  *                           type: integer
//  *                           example: 2
//  *                         versionStatus:
//  *                           type: string
//  *                           example: DRAFT
//  *                         notes:
//  *                           type: string
//  *                           example: Initial version created
//  *                         referenceDoc:
//  *                           type: string
//  *                           nullable: true
//  *                           example: null
//  *                         content:
//  *                           type: object
//  *                           description: Version-specific content payload
//  *                         icon:
//  *                           type: string
//  *                           nullable: true
//  *                           example: null
//  *                         Image:
//  *                           type: string
//  *                           nullable: true
//  *                           example: null
//  *                         lockedById:
//  *                           type: string
//  *                           format: uuid
//  *                           nullable: true
//  *                           example: null
//  *                         lockedAt:
//  *                           type: string
//  *                           format: date-time
//  *                           nullable: true
//  *                           example: null
//  *                         resourceId:
//  *                           type: string
//  *                           format: uuid
//  *                           example: cmaw7xsgh00tdnt4val4aae3e
//  *                         createdAt:
//  *                           type: string
//  *                           format: date-time
//  *                           example: 2025-05-20T08:03:20.986Z
//  *                         updatedAt:
//  *                           type: string
//  *                           format: date-time
//  *                           example: 2025-05-20T08:07:53.862Z
//  *                         scheduledAt:
//  *                           type: string
//  *                           format: date-time
//  *                           nullable: true
//  *                           example: null
//  *                         publishedAt:
//  *                           type: string
//  *                           format: date-time
//  *                           nullable: true
//  *                           example: null
//  *       400:
//  *         $ref: '#/components/schemas/ErrorResponse'
//  */

router.put(
  "/updateContent",
  //   checkPermission(requiredPermissionsForContentManagement),

  tryCatchWrap(ContentController.UpdateContent)
);

/**
 * @swagger
 * /content/directPublishContent:
 *   post:
 *     summary: Directly publish content (super-admin/managers only)
 *     tags: [Content]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Full content payload, including draft mode and structured sections
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resourceId
 *               - titleEn
 *               - titleAr
 *               - slug
 *               - newVersionEditMode
 *               - sections
 *             properties:
 *               resourceId:
 *                 type: string
 *                 format: uuid
 *                 example: cmanwipvc00toqrj6zytmop4d
 *               titleEn:
 *                 type: string
 *                 example: Home Page
 *               titleAr:
 *                 type: string
 *                 example: الصفحة الرئيسية
 *               slug:
 *                 type: string
 *                 example: home
 *               newVersionEditMode:
 *                 type: object
 *                 required:
 *                   - comments
 *                   - sections
 *                 properties:
 *                   comments:
 *                     type: string
 *                     example: Initial version created
 *                   referenceDoc:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *                   icon:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *                   image:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *                   sections:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - sectionId
 *                         - order
 *                         - content
 *                       properties:
 *                         sectionId:
 *                           type: string
 *                           format: uuid
 *                           example: cmanwipvr00tsqrj6nkmm7080
 *                         order:
 *                           type: integer
 *                           example: 1
 *                         content:
 *                           type: object
 *                           properties:
 *                             title:
 *                               type: object
 *                               properties:
 *                                 ar:
 *                                   type: string
 *                                   example: بناء مستقبل أقوى
 *                                 en:
 *                                   type: string
 *                                   example: Building a Stronger Future
 *                             button:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 required:
 *                                   - order
 *                                   - text
 *                                 properties:
 *                                   url:
 *                                     type: string
 *                                     nullable: true
 *                                     example: null
 *                                   icon:
 *                                     type: string
 *                                     nullable: true
 *                                     example: null
 *                                   text:
 *                                     type: object
 *                                     properties:
 *                                       ar:
 *                                         type: string
 *                                         example: أعمالنا
 *                                       en:
 *                                         type: string
 *                                         example: View Our Work
 *                                   order:
 *                                     type: integer
 *                                     example: 1
 *                             images:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 required:
 *                                   - order
 *                                   - altText
 *                                 properties:
 *                                   url:
 *                                     type: string
 *                                     example: ""
 *                                   order:
 *                                     type: integer
 *                                     example: 1
 *                                   altText:
 *                                     type: object
 *                                     properties:
 *                                       ar:
 *                                         type: string
 *                                         example: الرئيسية
 *                                       en:
 *                                         type: string
 *                                         example: Image
 *                             description:
 *                               type: object
 *                               properties:
 *                                 ar:
 *                                   type: string
 *                                   example: >-
 *                                     التزامنا الثابت الذي يعزز الشراكات...
 *                                 en:
 *                                   type: string
 *                                   example: >-
 *                                     Our unwavering commitment that forge...
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             required:
 *                               - order
 *                               - id
 *                             properties:
 *                               order:
 *                                 type: integer
 *                                 example: 1
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                                 example: cmanwipcm00fiqrj6c05xml7u
 *               sections:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - sectionId
 *                     - order
 *                     - content
 *                   properties:
 *                     sectionId:
 *                       type: string
 *                       format: uuid
 *                       example: cmanwipwr00ukqrj6r5gd4v50
 *                     order:
 *                       type: integer
 *                       example: 4
 *                     content:
 *                       type: object
 *                       properties:
 *                         cards:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               icon:
 *                                 type: string
 *                                 example: ""
 *                               count:
 *                                 type: string
 *                                 example: "123"
 *                               order:
 *                                 type: integer
 *                                 example: 1
 *                               title:
 *                                 type: object
 *                                 properties:
 *                                   ar:
 *                                     type: string
 *                                     example: المشاريع المنجزة
 *                                   en:
 *                                     type: string
 *                                     example: Projects Completed
 *                         button:
 *                           type: array
 *                           items:
 *                             type: object
 *                             required:
 *                               - order
 *                               - text
 *                             properties:
 *                               url:
 *                                 type: string
 *                                 nullable: true
 *                                 example: null
 *                               icon:
 *                                 type: string
 *                                 nullable: true
 *                                 example: null
 *                               text:
 *                                 type: object
 *                                 properties:
 *                                   ar:
 *                                     type: string
 *                                     example: اتصل بنا
 *                                   en:
 *                                     type: string
 *                                     example: Contact Us
 *                               order:
 *                                 type: integer
 *                                 example: 1
 *                         description:
 *                           type: object
 *                           properties:
 *                             ar:
 *                               type: string
 *                               example: كانت شركتنا رائدة...
 *                             en:
 *                               type: string
 *                               example: Our company has been the leading...
 *                         buttons:
 *                           type: array
 *                           items:
 *                             type: object
 *                             required:
 *                               - order
 *                               - text
 *                             properties:
 *                               icon:
 *                                 type: string
 *                                 nullable: true
 *                               text:
 *                                 type: object
 *                                 properties:
 *                                   ar:
 *                                     type: string
 *                                     example: عرض الكل
 *                                   en:
 *                                     type: string
 *                                     example: View All
 *                               order:
 *                                 type: integer
 *                                 example: 1
 *                         sections:
 *                           type: array
 *                           items:
 *                             type: object
 *                             required:
 *                               - sectionId
 *                               - order
 *                               - content
 *                             properties:
 *                               sectionId:
 *                                 type: string
 *                                 format: uuid
 *                                 example: cmanwipx600uwqrj647aqzfw5
 *                               order:
 *                                 type: integer
 *                                 example: 1
 *                               content:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     example: projectsSlugs
 *                                   title:
 *                                     type: object
 *                                     properties:
 *                                       ar:
 *                                         type: string
 *                                         example: المشاريع الأخيرة
 *                                       en:
 *                                         type: string
 *                                         example: Recent Projects
 *                                   description:
 *                                     type: object
 *                                     properties:
 *                                       ar:
 *                                         type: string
 *                                         example: تفتخر شركة شيد...
 *                                       en:
 *                                         type: string
 *                                         example: Shade Corporation boasts...
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           order:
 *                             type: integer
 *                             example: 1
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: cmanwiox7004kqrj6excs2vyo
 *     responses:
 *       200:
 *         description: Resource version published successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 content:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Resource version published successfully
 *                     resource:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: cmaw7xsgh00tdnt4val4aae3e
 *                         titleEn:
 *                           type: string
 *                           example: Home Page
 *                         titleAr:
 *                           type: string
 *                           example: الصفحة الرئيسية
 *                         slug:
 *                           type: string
 *                           example: home
 *                         status:
 *                           type: string
 *                           example: ACTIVE
 *                         resourceType:
 *                           type: string
 *                           example: MAIN_PAGE
 *                         resourceTag:
 *                           type: string
 *                           example: HOME
 *                         relationType:
 *                           type: string
 *                           example: PARENT
 *                         isAssigned:
 *                           type: boolean
 *                           example: true
 *                         liveVersionId:
 *                           type: string
 *                           format: uuid
 *                           example: cmawb9jm30001nt9wne52ghzc
 *                         newVersionEditModeId:
 *                           type: string
 *                           format: uuid
 *                           example: cmaw88umy000ant7zeqovh5w6
 *                         scheduledVersionId:
 *                           type: string
 *                           format: uuid
 *                           nullable: true
 *                           example: null
 *                         parentId:
 *                           type: string
 *                           format: uuid
 *                           nullable: true
 *                           example: null
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-05-20T07:54:44.946Z
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-05-20T09:27:52.440Z
 *                         resourceVersion:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                               example: cmawb9jm30001nt9wne52ghzc
 *                             versionNumber:
 *                               type: integer
 *                               example: 4
 *                             versionStatus:
 *                               type: string
 *                               example: PUBLISHED
 *                             notes:
 *                               type: string
 *                               example: Initial version created
 *                             referenceDoc:
 *                               type: string
 *                               nullable: true
 *                               example: null
 *                             content:
 *                               type: object
 *                               description: Version-specific content payload
 *                             icon:
 *                               type: string
 *                               nullable: true
 *                               example: null
 *                             Image:
 *                               type: string
 *                               nullable: true
 *                               example: null
 *                             lockedById:
 *                               type: string
 *                               format: uuid
 *                               nullable: true
 *                               example: null
 *                             lockedAt:
 *                               type: string
 *                               format: date-time
 *                               nullable: true
 *                               example: null
 *                             resourceId:
 *                               type: string
 *                               format: uuid
 *                               example: cmaw7xsgh00tdnt4val4aae3e
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: 2025-05-20T09:27:52.203Z
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 *                               example: 2025-05-20T09:27:52.203Z
 *                             scheduledAt:
 *                               type: string
 *                               format: date-time
 *                               nullable: true
 *                               example: null
 *                             publishedAt:
 *                               type: string
 *                               format: date-time
 *                               nullable: true
 *                               example: 2025-05-20T09:27:52.194Z
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden — user not authorized to publish directly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forbidden — insufficient permissions
 */

router.post(
  "/directPublishContent",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.DirectPublishContent)
);

/**
 * @swagger
 * /content/generateRequest:
 *   put:
 *     summary: Create a new permission/resource request for the current user
 *     tags: [Content]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Full content payload, including draft mode and structured sections
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resourceId
 *               - titleEn
 *               - titleAr
 *               - slug
 *               - newVersionEditMode
 *               - sections
 *             properties:
 *               resourceId:
 *                 type: string
 *                 format: uuid
 *                 example: cmanwipvc00toqrj6zytmop4d
 *               titleEn:
 *                 type: string
 *                 example: Home Page
 *               titleAr:
 *                 type: string
 *                 example: الصفحة الرئيسية
 *               slug:
 *                 type: string
 *                 example: home
 *               newVersionEditMode:
 *                 type: object
 *                 required:
 *                   - comments
 *                   - sections
 *                 properties:
 *                   comments:
 *                     type: string
 *                     example: Initial version created
 *                   referenceDoc:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *                   icon:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *                   image:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *                   sections:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - sectionId
 *                         - order
 *                         - content
 *                       properties:
 *                         sectionId:
 *                           type: string
 *                           format: uuid
 *                           example: cmanwipvr00tsqrj6nkmm7080
 *                         order:
 *                           type: integer
 *                           example: 1
 *                         content:
 *                           type: object
 *                           properties:
 *                             title:
 *                               type: object
 *                               properties:
 *                                 ar:
 *                                   type: string
 *                                   example: بناء مستقبل أقوى
 *                                 en:
 *                                   type: string
 *                                   example: Building a Stronger Future
 *                             button:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 required:
 *                                   - order
 *                                   - text
 *                                 properties:
 *                                   url:
 *                                     type: string
 *                                     nullable: true
 *                                     example: null
 *                                   icon:
 *                                     type: string
 *                                     nullable: true
 *                                     example: null
 *                                   text:
 *                                     type: object
 *                                     properties:
 *                                       ar:
 *                                         type: string
 *                                         example: أعمالنا
 *                                       en:
 *                                         type: string
 *                                         example: View Our Work
 *                                   order:
 *                                     type: integer
 *                                     example: 1
 *                             images:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 required:
 *                                   - order
 *                                   - altText
 *                                 properties:
 *                                   url:
 *                                     type: string
 *                                     example: ""
 *                                   order:
 *                                     type: integer
 *                                     example: 1
 *                                   altText:
 *                                     type: object
 *                                     properties:
 *                                       ar:
 *                                         type: string
 *                                         example: الرئيسية
 *                                       en:
 *                                         type: string
 *                                         example: Image
 *                             description:
 *                               type: object
 *                               properties:
 *                                 ar:
 *                                   type: string
 *                                   example: >-
 *                                     التزامنا الثابت الذي يعزز الشراكات...
 *                                 en:
 *                                   type: string
 *                                   example: >-
 *                                     Our unwavering commitment that forge...
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             required:
 *                               - order
 *                               - id
 *                             properties:
 *                               order:
 *                                 type: integer
 *                                 example: 1
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                                 example: cmanwipcm00fiqrj6c05xml7u
 *               sections:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - sectionId
 *                     - order
 *                     - content
 *                   properties:
 *                     sectionId:
 *                       type: string
 *                       format: uuid
 *                       example: cmanwipwr00ukqrj6r5gd4v50
 *                     order:
 *                       type: integer
 *                       example: 4
 *                     content:
 *                       type: object
 *                       properties:
 *                         cards:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               icon:
 *                                 type: string
 *                                 example: ""
 *                               count:
 *                                 type: string
 *                                 example: "123"
 *                               order:
 *                                 type: integer
 *                                 example: 1
 *                               title:
 *                                 type: object
 *                                 properties:
 *                                   ar:
 *                                     type: string
 *                                     example: المشاريع المنجزة
 *                                   en:
 *                                     type: string
 *                                     example: Projects Completed
 *                         button:
 *                           type: array
 *                           items:
 *                             type: object
 *                             required:
 *                               - order
 *                               - text
 *                             properties:
 *                               url:
 *                                 type: string
 *                                 nullable: true
 *                                 example: null
 *                               icon:
 *                                 type: string
 *                                 nullable: true
 *                                 example: null
 *                               text:
 *                                 type: object
 *                                 properties:
 *                                   ar:
 *                                     type: string
 *                                     example: اتصل بنا
 *                                   en:
 *                                     type: string
 *                                     example: Contact Us
 *                               order:
 *                                 type: integer
 *                                 example: 1
 *                         description:
 *                           type: object
 *                           properties:
 *                             ar:
 *                               type: string
 *                               example: كانت شركتنا رائدة...
 *                             en:
 *                               type: string
 *                               example: Our company has been the leading...
 *                         buttons:
 *                           type: array
 *                           items:
 *                             type: object
 *                             required:
 *                               - order
 *                               - text
 *                             properties:
 *                               icon:
 *                                 type: string
 *                                 nullable: true
 *                               text:
 *                                 type: object
 *                                 properties:
 *                                   ar:
 *                                     type: string
 *                                     example: عرض الكل
 *                                   en:
 *                                     type: string
 *                                     example: View All
 *                               order:
 *                                 type: integer
 *                                 example: 1
 *                         sections:
 *                           type: array
 *                           items:
 *                             type: object
 *                             required:
 *                               - sectionId
 *                               - order
 *                               - content
 *                             properties:
 *                               sectionId:
 *                                 type: string
 *                                 format: uuid
 *                                 example: cmanwipx600uwqrj647aqzfw5
 *                               order:
 *                                 type: integer
 *                                 example: 1
 *                               content:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     example: projectsSlugs
 *                                   title:
 *                                     type: object
 *                                     properties:
 *                                       ar:
 *                                         type: string
 *                                         example: المشاريع الأخيرة
 *                                       en:
 *                                         type: string
 *                                         example: Recent Projects
 *                                   description:
 *                                     type: object
 *                                     properties:
 *                                       ar:
 *                                         type: string
 *                                         example: تفتخر شركة شيد...
 *                                       en:
 *                                         type: string
 *                                         example: Shade Corporation boasts...
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           order:
 *                             type: integer
 *                             example: 1
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: cmanwiox7004kqrj6excs2vyo
 *     responses:
 *       200:
 *         description: Update request generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 content:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Update request generated successfully
 *                     resource:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: cmaw7xsgh00tdnt4val4aae3e
 *                         titleEn:
 *                           type: string
 *                           example: Home Page
 *                         titleAr:
 *                           type: string
 *                           example: الصفحة الرئيسية
 *                         slug:
 *                           type: string
 *                           example: home
 *                         status:
 *                           type: string
 *                           example: ACTIVE
 *                         resourceType:
 *                           type: string
 *                           example: MAIN_PAGE
 *                         resourceTag:
 *                           type: string
 *                           example: HOME
 *                         relationType:
 *                           type: string
 *                           example: PARENT
 *                         isAssigned:
 *                           type: boolean
 *                           example: true
 *                         liveVersionId:
 *                           type: string
 *                           format: uuid
 *                           example: cmawb9jm30001nt9wne52ghzc
 *                         newVersionEditModeId:
 *                           type: string
 *                           format: uuid
 *                           example: cmaw88umy000ant7zeqovh5w6
 *                         scheduledVersionId:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         parentId:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-05-20T07:54:44.946Z
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-05-20T10:24:41.088Z
 *                         resourceVersion:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                               example: cmaw88umy000ant7zeqovh5w6
 *                             versionNumber:
 *                               type: integer
 *                               example: 2
 *                             versionStatus:
 *                               type: string
 *                               example: VERIFICATION_PENDING
 *                             notes:
 *                               type: string
 *                               example: Initial version created
 *                             referenceDoc:
 *                               type: string
 *                               nullable: true
 *                               example: null
 *                             content:
 *                               type: object
 *                               description: Version-specific content payload
 *                             icon:
 *                               type: string
 *                               nullable: true
 *                               example: null
 *                             Image:
 *                               type: string
 *                               nullable: true
 *                               example: null
 *                             lockedById:
 *                               type: string
 *                               format: uuid
 *                               nullable: true
 *                               example: null
 *                             lockedAt:
 *                               type: string
 *                               format: date-time
 *                               nullable: true
 *                               example: null
 *                             resourceId:
 *                               type: string
 *                               format: uuid
 *                               example: cmaw7xsgh00tdnt4val4aae3e
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: 2025-05-20T08:03:20.986Z
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 *                               example: 2025-05-20T10:24:40.785Z
 *                             scheduledAt:
 *                               type: string
 *                               format: date-time
 *                               nullable: true
 *                               example: null
 *                             publishedAt:
 *                               type: string
 *                               format: date-time
 *                               nullable: true
 *                               example: null
 *                         requests:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                               example: 2e9a5b25-856c-4e68-8888-619e36a18b6c
 *                             status:
 *                               type: string
 *                               example: PENDING
 *                             type:
 *                               type: string
 *                               example: VERIFICATION
 *                             editorComments:
 *                               type: string
 *                               example: Initial version created
 *                             resourceVersionId:
 *                               type: string
 *                               format: uuid
 *                               example: cmaw88umy000ant7zeqovh5w6
 *                             senderId:
 *                               type: string
 *                               format: uuid
 *                               example: cmaw86nhq0000nt7zpozrm6vh
 *                             previousRequestId:
 *                               type: string
 *                               nullable: true
 *                               example: null
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: 2025-05-20T10:24:41.100Z
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 *                               example: 2025-05-20T10:24:41.100Z
 *                             approvals:
 *                               type: object
 *                               properties:
 *                                 publisher:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                       format: uuid
 *                                       example: d26d6017-33e8-42b1-8aeb-02b9d8e8c0ec
 *                                     stage:
 *                                       type: integer
 *                                       nullable: true
 *                                     status:
 *                                       type: string
 *                                       example: PENDING
 *                                     comments:
 *                                       type: string
 *                                       nullable: true
 *                                     requestId:
 *                                       type: string
 *                                       format: uuid
 *                                     approverId:
 *                                       type: string
 *                                       format: uuid
 *                                     isApproverActive:
 *                                       type: boolean
 *                                       example: true
 *                                     createdAt:
 *                                       type: string
 *                                       format: date-time
 *                                     updatedAt:
 *                                       type: string
 *                                       format: date-time
 *                                 verifiers:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       id:
 *                                         type: string
 *                                         format: uuid
 *                                       stage:
 *                                         type: integer
 *                                       status:
 *                                         type: string
 *                                         example: PENDING
 *                                       comments:
 *                                         type: string
 *                                         nullable: true
 *                                       requestId:
 *                                         type: string
 *                                         format: uuid
 *                                       approverId:
 *                                         type: string
 *                                         format: uuid
 *                                       isApproverActive:
 *                                         type: boolean
 *                                         example: true
 *                                       createdAt:
 *                                         type: string
 *                                         format: date-time
 *                                       updatedAt:
 *                                         type: string
 *                                         format: date-time
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */

router.put(
  "/generateRequest",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GenerateRequest)
);

/**
 * @swagger
 * /content/getRequests:
 *   get:
 *     summary: Get permission/resource requests with filters and pagination
 *     tags: [Content]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: roleId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter requests by a specific role ID
 *       - in: query
 *         name: permission
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter requests by permission name
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search term to filter request details
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by request status (e.g., "PENDING", "APPROVED", "REJECTED")
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of items per page
 *       - in: query
 *         name: resourceId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter requests by a specific resource ID
 *     responses:
 *       200:
 *         description: Requests fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 requests:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: 640e0fb7-9954-4400-9e02-5965df39fc46
 *                           status:
 *                             type: string
 *                             example: PENDING
 *                           type:
 *                             type: string
 *                             example: VERIFICATION
 *                           editorComments:
 *                             type: string
 *                             example: Initial version created
 *                           resourceVersionId:
 *                             type: string
 *                             format: uuid
 *                             example: cmaw88umy000ant7zeqovh5w6
 *                           senderId:
 *                             type: string
 *                             format: uuid
 *                             example: cmaw86nhq0000nt7zpozrm6vh
 *                           previousRequestId:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-05-20T10:16:28.752Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-05-20T10:16:28.752Z
 *                           resourceVersion:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                                 example: cmaw88umy000ant7zeqovh5w6
 *                               versionNumber:
 *                                 type: integer
 *                                 example: 2
 *                               versionStatus:
 *                                 type: string
 *                                 example: VERIFICATION_PENDING
 *                               notes:
 *                                 type: string
 *                                 example: Initial version created
 *                               referenceDoc:
 *                                 type: string
 *                                 nullable: true
 *                                 example: null
 *                               content:
 *                                 type: object
 *                                 description: Version content payload
 *                               icon:
 *                                 type: string
 *                                 nullable: true
 *                                 example: null
 *                               Image:
 *                                 type: string
 *                                 nullable: true
 *                                 example: null
 *                               lockedById:
 *                                 type: string
 *                                 format: uuid
 *                                 nullable: true
 *                                 example: null
 *                               lockedAt:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                                 example: null
 *                               resourceId:
 *                                 type: string
 *                                 format: uuid
 *                                 example: cmaw7xsgh00tdnt4val4aae3e
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: 2025-05-20T08:03:20.986Z
 *                               updatedAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: 2025-05-20T10:16:28.465Z
 *                               scheduledAt:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                                 example: null
 *                               publishedAt:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                                 example: null
 *                               resource:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     format: uuid
 *                                     example: cmaw7xsgh00tdnt4val4aae3e
 *                                   titleEn:
 *                                     type: string
 *                                     example: Home Page
 *                                   titleAr:
 *                                     type: string
 *                                     example: الصفحة الرئيسية
 *                                   resourceType:
 *                                     type: string
 *                                     example: MAIN_PAGE
 *                                   resourceTag:
 *                                     type: string
 *                                     example: HOME
 *                                   roles:
 *                                     type: array
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         id:
 *                                           type: string
 *                                           format: uuid
 *                                         resourceId:
 *                                           type: string
 *                                           format: uuid
 *                                         userId:
 *                                           type: string
 *                                           format: uuid
 *                                         role:
 *                                           type: string
 *                                         status:
 *                                           type: string
 *                                         createdAt:
 *                                           type: string
 *                                           format: date-time
 *                                         user:
 *                                           type: object
 *                                           properties:
 *                                             id:
 *                                               type: string
 *                                               format: uuid
 *                                             name:
 *                                               type: string
 *                                   verifiers:
 *                                     type: array
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         id:
 *                                           type: string
 *                                           format: uuid
 *                                         stage:
 *                                           type: integer
 *                                         status:
 *                                           type: string
 *                                         resourceId:
 *                                           type: string
 *                                           format: uuid
 *                                         userId:
 *                                           type: string
 *                                           format: uuid
 *                                         createdAt:
 *                                           type: string
 *                                           format: date-time
 *                                         user:
 *                                           type: object
 *                                           properties:
 *                                             id:
 *                                               type: string
 *                                               format: uuid
 *                                             name:
 *                                               type: string
 *                           sender:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                                 format: email
 *                           approvals:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   format: uuid
 *                                 status:
 *                                   type: string
 *                                   example: PENDING
 *                                 stage:
 *                                   type: integer
 *                                   nullable: true
 *                                 comments:
 *                                   type: string
 *                                   nullable: true
 *                                 approver:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                       format: uuid
 *                                     name:
 *                                       type: string
 *                                     email:
 *                                       type: string
 *                                       format: email
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 1
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 100
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  "/getRequests",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetRequest)
);

/**
 * @swagger
 * /content/getRequestInfo/{requestId}:
 *   get:
 *     summary: Get detailed information for a single request
 *     tags: [Content]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the request to retrieve
 *     responses:
 *       200:
 *         description: Detailed request information fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 requestInfo:
 *                   type: object
 *                   properties:
 *                     details:
 *                       type: object
 *                       properties:
 *                         resource:
 *                           type: string
 *                           example: Home Page
 *                         resourceType:
 *                           type: string
 *                           example: MAIN_PAGE
 *                         resourceTag:
 *                           type: string
 *                           example: HOME
 *                         slug:
 *                           type: string
 *                           example: home
 *                         status:
 *                           type: string
 *                           example: PENDING
 *                         assignedUsers:
 *                           type: object
 *                           properties:
 *                             manager:
 *                               type: string
 *                               example: Not assigned
 *                             editor:
 *                               type: string
 *                               example: Deepanshu Kataria
 *                             verifiers:
 *                               type: object
 *                               properties:
 *                                 level 1:
 *                                   type: string
 *                                   example: Editor
 *                             publisher:
 *                               type: string
 *                               example: User3
 *                         submittedDate:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-05-20T10:24:41.100Z
 *                         comment:
 *                           type: string
 *                           example: Initial version created
 *                         submittedBy:
 *                           type: string
 *                           example: Deepanshu Kataria
 *                         submittedTo:
 *                           type: string
 *                           example: User3
 *                         versionNo.:
 *                           type: string
 *                           example: V 2
 *                         referenceDocument:
 *                           type: string
 *                           example: No document
 *                         requestType:
 *                           type: string
 *                           example: VERIFICATION
 *                         requestNo.:
 *                           type: string
 *                           example: 2E9A
 *                         previousRequest:
 *                           type: string
 *                           example: None
 *                         approvalStatus:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               role:
 *                                 type: string
 *                                 example: PUBLISHER
 *                               stage:
 *                                 type: integer
 *                                 nullable: true
 *                                 example: null
 *                               status:
 *                                 type: string
 *                                 example: PENDING
 *                               comment:
 *                                 type: string
 *                                 example: No comments
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  "/getRequestInfo/:requestId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.GetRequestInfo)
);

/**
 * @swagger
 * /content/approveRequest/{requestId}:
 *   post:
 *     summary: Approve a pending request
 *     tags: [Content]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the request to approve
 *     responses:
 *       200:
 *         description: Request approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 request:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 640e0fb7-9954-4400-9e02-5965df39fc46
 *                     status:
 *                       type: string
 *                       example: PENDING
 *                     type:
 *                       type: string
 *                       example: VERIFICATION
 *                     editorComments:
 *                       type: string
 *                       example: Initial version created
 *                     resourceVersionId:
 *                       type: string
 *                       format: uuid
 *                       example: cmaw88umy000ant7zeqovh5w6
 *                     senderId:
 *                       type: string
 *                       format: uuid
 *                       example: cmaw86nhq0000nt7zpozrm6vh
 *                     previousRequestId:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-20T10:16:28.752Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-20T10:16:28.752Z
 *                     approvals:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: 6e81af9b-ad59-40c0-b772-e8941b77b83a
 *                           stage:
 *                             type: integer
 *                             nullable: true
 *                             example: 1
 *                           status:
 *                             type: string
 *                             example: APPROVED
 *                           comments:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           requestId:
 *                             type: string
 *                             format: uuid
 *                             example: 640e0fb7-9954-4400-9e02-5965df39fc46
 *                           approverId:
 *                             type: string
 *                             format: uuid
 *                             example: cmaw8880w0008nt7zpq5a71qm
 *                           isApproverActive:
 *                             type: boolean
 *                             example: true
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-05-20T10:16:28.764Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-05-21T09:20:59.776Z
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */

router.post(
  "/approveRequest/:requestId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.ApproveRequest)
);

/**
 * @swagger
 * /content/rejectRequest/{requestId}:
 *   post:
 *     summary: Reject a pending request with a reason
 *     tags: [Content]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the request to reject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectReason
 *             properties:
 *               rejectReason:
 *                 type: string
 *                 description: Explanation for rejecting the request
 *                 example: "Content does not meet quality standards."
 *     responses:
 *       200:
 *         description: Request rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request rejected successfully
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */

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

/**
 * @swagger
 * /content/getVersionsList/{resourceId}:
 *   get:
 *     summary: Get list of resource versions with optional filters and pagination
 *     tags: [Content]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the resource to list versions for
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Text to search within version notes or content metadata
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by version status (e.g., DRAFT, PUBLISHED, ARCHIVED)
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Versions list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 content:
 *                   type: object
 *                   properties:
 *                     versions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: cmawb9jm30001nt9wne52ghzc
 *                           versionNumber:
 *                             type: integer
 *                             example: 4
 *                           versionStatus:
 *                             type: string
 *                             example: PUBLISHED
 *                           notes:
 *                             type: string
 *                             example: Initial version created
 *                           referenceDoc:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           content:
 *                             type: object
 *                             description: Version-specific content payload
 *                           icon:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           Image:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           lockedById:
 *                             type: string
 *                             format: uuid
 *                             nullable: true
 *                             example: null
 *                           lockedAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                             example: null
 *                           resourceId:
 *                             type: string
 *                             format: uuid
 *                             example: cmaw7xsgh00tdnt4val4aae3e
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-05-20T09:27:52.203Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-05-20T09:27:52.203Z
 *                           scheduledAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                             example: null
 *                           publishedAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                             example: 2025-05-20T09:27:52.194Z
 *                           isLive:
 *                             type: boolean
 *                             example: true
 *                           isUnderEditing:
 *                             type: boolean
 *                             example: false
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalVersions:
 *                           type: integer
 *                           example: 4
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 100
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */

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

/**
 * @swagger
 * /content/inactiveResource/{resourceId}:
 *   get:
 *     summary: Get list of inactive versions for a specific resource
 *     tags: [Content]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the resource to retrieve inactive versions for
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Text to search within version notes or content metadata
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by version status (e.g., ARCHIVED, DEPRECATED)
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Inactive versions list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 versions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       versionNumber:
 *                         type: integer
 *                       versionStatus:
 *                         type: string
 *                       notes:
 *                         type: string
 *                         nullable: true
 *                       referenceDoc:
 *                         type: string
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       scheduledAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       publishedAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */

router.post(
  "/inactiveResource/:resourceId",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(ContentController.InactiveResource)
);

/**
 * @swagger
 * /content/deleteAllContentData:
 *   delete:
 *     summary: Delete all content data (dangerous operation)
 *     tags: [Content]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All content data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All content data deleted successfully
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */

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

export default router;
