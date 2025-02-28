import { logger } from "../../config/index.js";
import { assert, assertEvery } from "../../errors/assertError.js";
import {
  findPermissions,
  findSubPermissions,

  findPermissionById,
  findSubPermissionById,

  addPermission,
  addSubPermission,

  editPermission,
  editSubPermission,
} from "../../repository/permission.repository.js";








const getPermissions = async () => {
  const  permissions = await findPermissions(); // to bring the roles
  logger.info({ response: "Permissions fetched successfully", permissions: permissions });
  return { message: "Permissions fetched successfully", permissions };
};

const getSubPermissions = async () => {
  const { roles } = await findRoles(); // to bring the roles
  logger.info({ response: "roles fetched successfully", roles: roles });
  return { message: "Roles fetched successfully", roles };
};

const getPermissionById = async (id) => {
  const  role  = await findRoleById(id); // to bring the roles
  assert(role, "NOT_FOUND", "Role not found");
  logger.info({ response: "roles fetched successfully", role: role });
  return { message: "Role fetched successfully", role };
};

const getSubPermissionById = async (id) => {
  const  role  = await findRoleById(id); // to bring the roles
  assert(role, "NOT_FOUND", "Role not found");
  logger.info({ response: "roles fetched successfully", role: role });
  return { message: "Role fetched successfully", role };
};

const createPermission = async (data) => {
  const newRole = await createNewRoles(data.name, data.description);

  // if response is empty the throw error with assert
  assert(newRole, "CREATION_FAILED", "something went wrong");

  //log information
  logger.info({ response: "logged in successfully" });

  return { message: "Role created successfully", newRole, ok: true }; // if everything goes fine
};

const createSubPermission = async (data) => {
  const newRole = await createNewRoles(data.name, data.description);

  // if response is empty the throw error with assert
  assert(newRole, "CREATION_FAILED", "something went wrong");

  //log information
  logger.info({ response: "logged in successfully" });

  return { message: "Role created successfully", newRole, ok: true }; // if everything goes fine
};


const updatePermission = async (id, updateObject) => {
  const role = await updateRoleinDB(id, updateObject);

  assert(role, "ROLE_INVALID", "Role not found");

  logger.info({ response: `role ${id} is inactive now` });

  return { message: "Role updated successfully", role, ok: true };
};


const updateSubPermission = async (id, updateObject) => {
  const role = await updateRoleinDB(id, updateObject);

  assert(role, "ROLE_INVALID", "Role not found");

  logger.info({ response: `role ${id} is inactive now` });

  return { message: "Role updated successfully", role, ok: true };
};

export {
  // Permissions

  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,

  // SubPermissions

  getSubPermissions,
  getSubPermissionById,
  createSubPermission,
  updateSubPermission,
};
