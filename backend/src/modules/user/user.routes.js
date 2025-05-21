import {Router} from "express";
import UserController from "./user.controller.js";
import {authenticateUser} from "../../helper/authMiddleware.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import validate from "../../validation/validator.js";
import {updateUserSchema, userSchema} from "../../validation/userSchema.js";
import {checkPermission} from "../../helper/roleBasedAccess.js";
import auditLogger from "../../helper/auditLogger.js";

const router = Router();

const requiredPermissionsForUser = ["USER_MANAGEMENT"];

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: User creation payload
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *               - roles
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Akshay7053@"
 *               phone:
 *                 type: string
 *                 example: "2345678902"
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["cmaourrft0001pc0wlb9tpfu8"]
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user created successfully"
 *                 user:
 *                   type: object
 *                   decription: details of the created user
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: cmaqdzhx00001pcgjv8wbkgw9
 *                     name:
 *                       type: string
 *                       example: John Doe Jr.
 *                     image:
 *                       type: string
 *                       example: "/adfe54ef4e5f4e54f/image.png"
 *                     email:
 *                       type: string
 *                       example: "johndoejr@gmail.com"
 *                     password:
 *                       type: string
 *                       example: $2b$10$diTJGWz421djKOcGza1HFuQmpr1kbG8rt40/U.vTDCNHvIKQ9fWdy
 *                     isSuperUser:
 *                       type: boolean
 *                       example: false
 *                     status:
 *                       type: string
 *                       example: "ACTIVE"
 *                     phone:
 *                       type: string
 *                       example: 2345678901
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-15T11:38:39.953Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-15T11:38:39.953Z"
 *                     roles:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                           example: cmaqeu06m0000pcjnboo9yt1x
 *                         roleId:
 *                           type: string
 *                           example: cmaourrft0001pc0wlb9tpfu8
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-05-15T11:38:39.953Z"
 *                         role:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: cmaourrft0001pc0wlb9tpfu8
 *                             name:
 *                               type: string
 *                               example: Role Manager
 *                             status:
 *                               type: string
 *                               example: ACTIVE
 *                             roleTypeId:
 *                               type: string
 *                               example: 3a9f6f26-95a7-4f28-97da-cc17dbcccc3e
 *                             created_at:
 *                               type: string
 *                               format: date-time
 *                               example: "2025-05-15T11:38:39.953Z"
 *                             updated_at:
 *                               type: string
 *                               format: date-time
 *                               example: "2025-05-15T11:38:39.953Z"
 *       400:
 *         description: Bad request – invalid input
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
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post(
  "/create",
  checkPermission(requiredPermissionsForUser),
  validate(userSchema),
  auditLogger,
  tryCatchWrap(UserController.CreateUserHandler)
);

/**
 * @swagger
 * /user/getRolesForUser:
 *   get:
 *     summary: Retrieve all available roles for users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: user roles fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user roles fetched successfully"
 *                 roles:
 *                   type: object
 *                   properties:
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "cmaourrft0001pc0wlb9tpfu8"
 *                           name:
 *                             type: string
 *                             example: "Role Manager"
 *                           status:
 *                             type: string
 *                             enum: [ACTIVE, INACTIVE]
 *                             example: "ACTIVE"
 *                           roleTypeId:
 *                             type: string
 *                             format: uuid
 *                             example: "3a9f6f26-95a7-4f28-97da-cc17dbcccc3e"
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-05-15T04:11:45.449Z"
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-05-15T04:11:45.449Z"
 *                           _count:
 *                             type: object
 *                             properties:
 *                               permissions:
 *                                 type: integer
 *                                 example: 1
 *                               users:
 *                                 type: integer
 *                                 example: 5
 *       500:
 *         description: Server error retrieving roles for users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get("/getRolesForUser", tryCatchWrap(UserController.GetRolesForUser));

/**
 * @swagger
 * /user/getAllUserByRoleId/{roleId}:
 *   get:
 *     summary: Retrieve all users assigned to a specific role
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the role
 *         example: "cmaov27ni000spc0w9oxjpdd6"
 *     responses:
 *       201:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "users fetched successfully"
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "cmaov27ni000spc0w9oxjpdd6"
 *                       name:
 *                         type: string
 *                         example: "Bhavnesh Sharma"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "bhavnesh@sharma.com"
 *                       isSuperUser:
 *                         type: boolean
 *                         example: false
 *                       phone:
 *                         type: string
 *                         example: "7878787878"
 *                       status:
 *                         type: string
 *                         example: "ACTIVE"
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             role:
 *                               type: string
 *                             roleType:
 *                               type: string
 *                             status:
 *                               type: string
 *                             permissions:
 *                               type: array
 *                               items:
 *                                 type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *               example:
 *                 message: "users fetched successfully"
 *                 users:
 *                   - id: "cmaov27ni000spc0w9oxjpdd6"
 *                     name: "Bhavnesh Sharma"
 *                     email: "bhavnesh@sharma.com"
 *                     isSuperUser: false
 *                     phone: "7878787878"
 *                     status: "ACTIVE"
 *                     roles:
 *                       - id: "cmaourrft0001pc0wlb9tpfu8"
 *                         role: "Role Manager"
 *                         roleType: "MANAGER"
 *                         status: "ACTIVE"
 *                         permissions:
 *                           - "ROLES_PERMISSION_MANAGEMENT"
 *                     createdAt: "2025-05-15T04:19:53.022Z"
 *                     updatedAt: "2025-05-15T04:19:53.022Z"
 *       400:
 *         description: Bad request (invalid roleId)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No users found for the specified role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error retrieving users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  "/getAllUserByRoleId/:roleId",
  tryCatchWrap(UserController.GetAllUsersByRoleId)
);

/**
 * @swagger
 * /user/getAllUsers:
 *   get:
 *     summary: Retrieve a paginated list of users with optional filters
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by user name (partial match)
 *         example: "Deepanshu"
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: Filter by user email (exact match)
 *         example: "dkataria576@gmail.com"
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Filter by user phone number
 *         example: "8307690758"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["ACTIVE", "INACTIVE"]
 *         description: Filter by user account status
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
 *         example: 40
 *     responses:
 *       201:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user fetched successfully"
 *                 users:
 *                   type: object
 *                   properties:
 *                     allUsers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "cmaoux1f1000qpc0w5vlqhgjx"
 *                           name:
 *                             type: string
 *                             example: "Deepanshu Kataria"
 *                           image:
 *                             type: string
 *                             example: ""
 *                           email:
 *                             type: string
 *                             format: email
 *                             example: "dkataria576@gmail.com"
 *                           phone:
 *                             type: string
 *                             example: "8307690758"
 *                           status:
 *                             type: string
 *                             example: "ACTIVE"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-05-15T04:15:51.661Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-05-15T07:21:56.707Z"
 *                           roles:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 userId:
 *                                   type: string
 *                                 roleId:
 *                                   type: string
 *                                 createdAt:
 *                                   type: string
 *                                   format: date-time
 *                                 role:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                     name:
 *                                       type: string
 *                                     status:
 *                                       type: string
 *                                     roleTypeId:
 *                                       type: string
 *                                     created_at:
 *                                       type: string
 *                                       format: date-time
 *                                     updated_at:
 *                                       type: string
 *                                       format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalUser:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 40
 *       400:
 *         description: Bad request (invalid query parameters)
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
 *         description: Server error retrieving users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  "/getAllUsers",
  checkPermission(requiredPermissionsForUser),
  tryCatchWrap(UserController.GetAllUsers)
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retrieve a single user by their ID
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *         example: "cmaoux1f1000qpc0w5vlqhgjx"
 *     responses:
 *       200:
 *         description: A user object matching the given ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user fetched successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     image:
 *                       type: string
 *                     email:
 *                       type: string
 *                     password:
 *                       type: string
 *                       description: Hashed password (for internal use)
 *                     isSuperUser:
 *                       type: boolean
 *                     status:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                           roleId:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           role:
 *                             type: object
 *                             properties:
 *                               id: { type: string }
 *                               name: { type: string }
 *                               status: { type: string }
 *                               roleTypeId: { type: string }
 *                               created_at:
 *                                 type: string
 *                                 format: date-time
 *                               updated_at:
 *                                 type: string
 *                                 format: date-time
 *                               permissions:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     permission:
 *                                       type: object
 *                                       properties:
 *                                         id: { type: string }
 *                                         name: { type: string }
 *                                         description: { type: string }
 *                                         roleTypeId: { type: string }
 *                                         created_at:
 *                                           type: string
 *                                           format: date-time
 *                                         updated_at:
 *                                           type: string
 *                                           format: date-time
 *                               roleType:
 *                                 type: object
 *                                 properties:
 *                                   id: { type: string }
 *                                   name: { type: string }
 *                     resourceRoles:
 *                       type: array
 *                       items: { type: object }
 *                     resourceVerifiers:
 *                       type: array
 *                       items: { type: object }
 *               example:
 *                 message: "user fetched successfully"
 *                 user:
 *                   id: "cmaoux1f1000qpc0w5vlqhgjx"
 *                   name: "Deepanshu Kataria"
 *                   image: ""
 *                   email: "dkataria576@gmail.com"
 *                   password: "$2b$10$Sy28VkrspOaa3Wz8uQd.i.0AGM5tmEbqXLLpvv0mhyTCX36FydqUe"
 *                   isSuperUser: false
 *                   status: "ACTIVE"
 *                   phone: "8307690758"
 *                   createdAt: "2025-05-15T04:15:51.661Z"
 *                   updatedAt: "2025-05-15T07:21:56.707Z"
 *                   roles:
 *                     - userId: "cmaoux1f1000qpc0w5vlqhgjx"
 *                       roleId: "cmaouuwue000lpc0w6ggct7j4"
 *                       createdAt: "2025-05-15T04:15:51.661Z"
 *                       role:
 *                         id: "cmaouuwue000lpc0w6ggct7j4"
 *                         name: "User manager"
 *                         status: "ACTIVE"
 *                         roleTypeId: "3a9f6f26-95a7-4f28-97da-cc17dbcccc3e"
 *                         created_at: "2025-05-15T04:14:12.423Z"
 *                         updated_at: "2025-05-15T04:14:12.423Z"
 *                         permissions:
 *                           - permission:
 *                               id: "cmanxch6v000lpc49m888yza4"
 *                               name: "USER_MANAGEMENT"
 *                               description: "Manager can manage all users and their roles."
 *                               roleTypeId: "3a9f6f26-95a7-4f28-97da-cc17dbcccc3e"
 *                               created_at: "2025-05-14T12:36:04.999Z"
 *                               updated_at: "2025-05-14T12:36:04.999Z"
 *                         roleType:
 *                           id: "3a9f6f26-95a7-4f28-97da-cc17dbcccc3e"
 *                           name: "MANAGER"
 *                   resourceRoles: []
 *                   resourceVerifiers: []
 *       403:
 *         description: Forbidden – insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error retrieving the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  "/:id",
  checkPermission(requiredPermissionsForUser),
  auditLogger,
  tryCatchWrap(UserController.GetUserById)
);

/**
 * @swagger
 * /user/updateUser/{id}:
 *   put:
 *     summary: Update details of an existing user and notify them in real time
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user to update
 *         example: "cmaoux1f1000qpc0w5vlqhgjx"
 *     requestBody:
 *       description: Payload containing the updated user fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *               - phone
 *               - roles
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Deepanshu Kataria"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Akshay7053@"
 *               phone:
 *                 type: string
 *                 example: "8307690758"
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["cmaourrft0001pc0wlb9tpfu8"]
 *     responses:
 *       201:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *             example:
 *               message: "User updated Successfully"
 *               result:
 *                 id: "cmaoux1f1000qpc0w5vlqhgjx"
 *                 name: "Deepanshu Kataria"
 *                 image: ""
 *                 email: "dkataria576@gmail.com"
 *                 password: "$2b$10$C9TcvzJBMNn7JBe0A8nesuTZ78V.fLS/tYfaBg0SAf8CQLQtYyqvy"
 *                 isSuperUser: false
 *                 status: "ACTIVE"
 *                 phone: "8307690752"
 *                 createdAt: "2025-05-15T04:15:51.661Z"
 *                 updatedAt: "2025-05-16T09:23:00.134Z"
 *                 roles:
 *                   - id: "cmaouuwue000lpc0w6ggct7j4"
 *                     role: "User manager"
 *                     roleType: "MANAGER"
 *                     status: "ACTIVE"
 *                     permissions:
 *                       - "USER_MANAGEMENT"
 *                   - id: "cmaourrft0001pc0wlb9tpfu8"
 *                     role: "Role Manager"
 *                     roleType: "MANAGER"
 *                     status: "ACTIVE"
 *                     permissions:
 *                       - "ROLES_PERMISSION_MANAGEMENT"
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error updating the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.put(
  "/updateUser/:id",
  checkPermission(requiredPermissionsForUser),
  validate(updateUserSchema),
  auditLogger,
  tryCatchWrap(UserController.EditUserDetails)
);

/**
 * @swagger
 * /user/activate:
 *   put:
 *     summary: Activate a specific user account
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: User activation payload
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
 *                 description: The unique identifier of the user to activate
 *                 example: "cmaoux1f1000qpc0w5vlqhgjx"
 *     responses:
 *       200:
 *         description: User successfully activated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User activated successfully"
 *                 ok:
 *                   type: boolean
 *                   example: true
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error during user activation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.put(
  "/activate",
  checkPermission(requiredPermissionsForUser),
  auditLogger,
  tryCatchWrap(UserController.ActivateUser)
);

/**
 * @swagger
 * /user/deactivate:
 *   put:
 *     summary: Deactivate a specific user account
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: User deactivation payload
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
 *                 description: The unique identifier of the user to deactivate
 *                 example: "cmaoux1f1000qpc0w5vlqhgjx"
 *     responses:
 *       200:
 *         description: User successfully deactivated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deactivated successfully"
 *                 ok:
 *                   type: boolean
 *                   example: true
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error during user activation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.put(
  "/deactivate",
  checkPermission(requiredPermissionsForUser),
  auditLogger,
  tryCatchWrap(UserController.DeactivateUser)
);

/**
 * @swagger
 * /user/userRoleType/{id}:
 *   get:
 *     summary: Get the role type of a specific user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the user
 *         schema:
 *           type: string
 *           example: "user-abc123"
 *     responses:
 *       200:
 *         description: Successfully retrieved user's role type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roleType:
 *                   type: string
 *                   example: "Admin"
 *       404:
 *         description: User not found or role type not assigned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error while fetching user role type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  "/userRoleType/:id",
  auditLogger,
  tryCatchWrap(UserController.UserRoleType)
);

export default router;
