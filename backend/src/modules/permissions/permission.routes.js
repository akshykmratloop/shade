import {Router} from "express";
import PermissionController from "./permission.controller.js";
import validator from "../../validation/validator.js";
import {
  createPermissionSchema,
  createSubPermissionSchema,
} from "../../validation/permissionSchema.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";

const router = Router();

/**
 * @swagger
 * /permission/permissions:
 *   get:
 *     summary: Retrieve a list of all available permissions
 *     tags:
 *       - Permissions
 *     responses:
 *       200:
 *         description: An array of permission objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "perm-1234abcd"
 *                   name:
 *                     type: string
 *                     description: Permission key
 *                     example: "CREATE_USER"
 *                   description:
 *                     type: string
 *                     description: Human‑readable description of the permission
 *                     example: "Allows creating new users"
 *                   roleTypeId:
 *                     type: string
 *                     description: "ID of the role type"
 *                   created_at:
 *                     type: string
 *                     description: time of the permission creation
 *
 *       500:
 *         description: Server error retrieving permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get("/permissions", tryCatchWrap(PermissionController.GetPermissions));

/**
 * @swagger
 * /permission/subPermissions:
 *   get:
 *     summary: Retrieve a list of all sub‑permissions
 *     tags:
 *       - Permissions
 *     responses:
 *       200:
 *         description: An array of sub‑permission objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "5b9aaf20-9e3f-4a92-98a7-7e6d7bbc1a13"
 *                   name:
 *                     type: string
 *                     description: Sub‑permission key
 *                     example: "VIEW_USER_DETAILS"
 *                   description:
 *                     type: string
 *                     description: Human‑readable description of the sub‑permission
 *                     example: "Allows viewing detailed user information"
 *       500:
 *         description: Server error retrieving sub‑permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  "/subPermissions",
  tryCatchWrap(PermissionController.GetSubPermissions)
);

/**
 * @swagger
 * /permission/{id}
 *   get:
 *     summary: Retrieve a permission by its ID
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the permission
 *         example: "cmanxch6n000jpc492hbrb8tv"
 *     responses:
 *       200:
 *         description: A permission object matching the given ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "cmanxch6n000jpc492hbrb8tv"
 *                 name:
 *                   type: string
 *                   example: "ROLES_PERMISSION_MANAGEMENT"
 *                 description:
 *                   type: string
 *                   example: "Allows creating new roles"
 *       404:
 *         description: Permission not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error retrieving the permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get("/:id", tryCatchWrap(PermissionController.GetPermissionById));

router.get(
  "/subPermission",
  tryCatchWrap(PermissionController.GetSubPermissionByPermissionId)
);

/**
 * @swagger
 * /permission/permissionsByRoleType/{id}:
 *   get:
 *     summary: Retrieve permissions for a specific role type
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier for the role type
 *         example: "roleType-5678efgh"
 *     responses:
 *       200:
 *         description: An array of permission objects associated with the given role type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "perm-1234abcd"
 *                   name:
 *                     type: string
 *                     description: Permission key
 *                     example: "CREATE_USER"
 *                   description:
 *                     type: string
 *                     description: Human‑readable description of the permission
 *                     example: "Allows creating new users"
 *                   roleTypeId:
 *                     type: string
 *                     description: "ID of the role type"
 *                   created_at:
 *                     type: string
 *                     description: time of the permission creation
 *       400:
 *         description: Bad request (invalid role type ID)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No permissions found for the specified role type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error retrieving permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  "/permissionsByRoleType/:id",
  tryCatchWrap(PermissionController.GetPermissionsByRoleType)
);

router.post(
  "/create",
  validator(createPermissionSchema),
  tryCatchWrap(PermissionController.CreatePermission)
);
router.post(
  "/subPermission/create",
  validator(createSubPermissionSchema),
  tryCatchWrap(PermissionController.CreateSubPermission)
);

router.put(
  "/:id/update",
  validator(createPermissionSchema),
  tryCatchWrap(PermissionController.UpdatePermission)
);
router.put(
  "/subPermission/:id/update",
  validator(createSubPermissionSchema),
  tryCatchWrap(PermissionController.UpdateSubPermission)
);

export default router;
