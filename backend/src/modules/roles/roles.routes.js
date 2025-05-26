import {Router} from "express";
import RolesController from "./roles.controller.js";
import {authenticateUser} from "../../helper/authMiddleware.js";
import validator from "../../validation/validator.js";
import {createRoleSchema} from "../../validation/rolesSchema.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import {checkPermission} from "../../helper/roleBasedAccess.js";
import auditLogger from "../../helper/auditLogger.js";

const router = Router();

const requiredPermissionsForRole = ["ROLES_PERMISSION_MANAGEMENT"];

/**
 * @swagger
 * /role/roles:
 *   get:
 *     summary: Retrieve a paginated list of roles, with optional search and status filters
 *     tags:
 *       - Roles
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter roles by name
 *         example: "admin"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter roles by status
 *         example: "ACTIVE"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page
 *         example: 10
 *     responses:
 *       200:
 *         description: A paginated list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                id:
 *                  type: string
 *                  description: ID of the role
 *                  example: "cmaouukvs000jpc0wcejzuwph"
 *                name:
 *                  type: string
 *                  description: name of the role
 *                  example: "Career manager"
 *                status:
 *                  type: string
 *                  description: Status of the role
 *                  example: "ACTIVE"
 *                roleTypeId:
 *                  type: string
 *                  description: Role belong to user or manager
 *                  example: "3a9f6f26-95a7-4f28-97da-cc17dbcccc3e"
 *                created_at:
 *                  type: string
 *                  description: time of the role creation
 *                  example: 2025-05-15T04:13:56.920Z
 *                updated_at:
 *                  type: string
 *                  description: time of the role updation
 *                  example: 2025-05-15T04:13:56.920Z
 *                _count:
 *                  type: object
 *                  description: No. of permission and user assigned to that role
 *
 *       403:
 *         description: Forbidden – insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error retrieving roles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  "/roles",
  checkPermission(requiredPermissionsForRole),
  tryCatchWrap(RolesController.GetRoles)
);

/**
 * @swagger
 * /role/roleType:
 *   get:
 *     summary: Retrieve a list of all role types
 *     tags:
 *       - Roles
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Role types fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role types fetched successfully
 *                 roleType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: a6055217-8e80-40f0-9d93-f4393435c745
 *                       name:
 *                         type: string
 *                         example: USER
 *       403:
 *         description: Forbidden – insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error retrieving role types
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  "/roleType",
  checkPermission(requiredPermissionsForRole),
  tryCatchWrap(RolesController.GetRoleType)
);

/**
 * @swagger
 * /role/{id}:
 *   get:
 *     summary: Retrieve a single role by its ID
 *     tags:
 *       - Roles
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the role
 *         example: "cmaourrft0001pc0wlb9tpfu8"
 *     responses:
 *       200:
 *         description: A role object matching the given ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "role-1234abcd"
 *                 name:
 *                   type: string
 *                   example: "Administrator"
 *                 status:
 *                   type: string
 *                   example: "active"
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of permission IDs assigned to the role
 *                   example: ["perm-1234abcd", "perm-5678efgh"]
 *       403:
 *         description: Forbidden – insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error retrieving the role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  "/:id",
  checkPermission(requiredPermissionsForRole),
  tryCatchWrap(RolesController.GetRoleById)
);

/**
 * @swagger
 * /role/create:
 *   post:
 *     summary: Create a new role with a given set of permissions
 *     tags:
 *       - Roles
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Payload containing the new role's name, type, and assigned permissions
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - roleTypeId
 *               - permissions
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the new role
 *                 example: "Editor"
 *               roleTypeId:
 *                 type: string
 *                 description: The ID of the role type this role belongs to
 *                 example: "a6055217-8e80-40f0-9d93-f4393435c745"
 *               permissions:
 *                 type: array
 *                 description: Array of permission IDs to assign to this role
 *                 items:
 *                   type: string
 *                 example: ["cmanxch4k0001pc49aolvxg5a"]
 *     responses:
 *       201:
 *         description: Role created successfully
 *         headers:
 *           Location:
 *             description: URI of the newly created role
 *             schema:
 *               type: string
 *               example: "/roles/role-1234abcd"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newRole:
 *                   type: object
 *                   properties:
 *                     roles:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "role-1234abcd"
 *                         name:
 *                           type: string
 *                           example: "Editor"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request (validation errors)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden – insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error creating the role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post(
  "/create",
  checkPermission(requiredPermissionsForRole),
  validator(createRoleSchema),
  auditLogger,
  tryCatchWrap(RolesController.CreateRole)
);

/**
 * @swagger
 * /role/update/{id}:
 *   put:
 *     summary: Update an existing role and notify affected users in real time
 *     tags:
 *       - Roles
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the role to update
 *         example: "cmapaqhn80001pcwgh67hdtnl"
 *     requestBody:
 *       description: Payload containing updated role data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - roleTypeId
 *               - permissions
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Editor"
 *               roleTypeId:
 *                 type: string
 *                 example: "a6055217-8e80-40f0-9d93-f4393435c74"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["cmanxch4k0001pc49aolvxg5a", "cmanxch4v0003pc49w0d8psem"]
 *     responses:
 *       202:
 *         description: Role updated successfully and notifications emitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role updated successfully"
 *                 role:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "cmapaqhn80001pcwgh67hdtnl"
 *                         name:
 *                           type: string
 *                           example: "Editor"
 *                         status:
 *                           type: string
 *                           example: "ACTIVE"
 *                         roletypeId:
 *                           type: string
 *                           example: "a6055217-8e80-40f0-9d93-f4393435c74"
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-05-15T11:38:39.953Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-05-16T04:27:19.909Z"
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request (validation errors)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden – insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error updating the role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.put(
  "/update/:id",
  checkPermission(requiredPermissionsForRole),
  auditLogger,
  tryCatchWrap(RolesController.UpdateRole)
);

/**
 * @swagger
 * /role/activate:
 *   put:
 *     summary: Activate a specific role
 *     tags:
 *       - Roles
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Role activation payload
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The unique identifier of the role to activate
 *                 example: "cmapaqhn80001pcwgh67hdtnl"
 *     responses:
 *       200:
 *         description: Role successfully activated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role activated successfully"
 *                 ok:
 *                   type: boolean,
 *                   description: The updated role data
 *       400:
 *         description: Bad request (e.g., missing ID)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden – insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error during role activation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.put(
  "/activate",
  checkPermission(requiredPermissionsForRole),
  auditLogger,
  tryCatchWrap(RolesController.ActivateRole)
);

/**
 * @swagger
 * /role/deactivate:
 *   put:
 *     summary: Deactivate a specific role
 *     tags:
 *       - Roles
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Role deactivation payload
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The unique identifier of the role to activate
 *                 example: "cmapaqhn80001pcwgh67hdtnl"
 *     responses:
 *       200:
 *         description: Role successfully deactivated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role deactivated successfully"
 *                 ok:
 *                   type: boolen,
 *                   description: The updated role data
 *       400:
 *         description: Bad request (e.g., missing ID)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden – insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error during role activation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.put(
  "/deactivate",
  checkPermission(requiredPermissionsForRole),
  auditLogger,
  tryCatchWrap(RolesController.DeactivateRole)
);

export default router;
