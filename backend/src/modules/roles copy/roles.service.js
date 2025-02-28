import { logger } from "../../config/index.js";
import { assert, assertEvery } from "../../errors/assertError.js";
import {
  findRoles,
  findRoleById,
  createNewRoles,
  roleActivation,
  roleDeactivation,
  updateRoleinDB,
} from "../../repository/role.repository.js";

const getRoles = async () => {
  const { roles } = await findRoles(); // to bring the roles
  logger.info({ response: "roles fetched successfully", roles: roles });
  return { message: "Roles fetched successfully", roles };
};

const getRoleById = async (id) => {
  const  role  = await findRoleById(id); // to bring the roles
  assert(role, "NOT_FOUND", "Role not found");
  logger.info({ response: "roles fetched successfully", role: role });
  return { message: "Role fetched successfully", role };
};

const createRole = async (data) => {
  const newRole = await createNewRoles(data.name, data.description);

  // if response is empty the throw error with assert
  assert(newRole, "CREATION_FAILED", "something went wrong");

  //log information
  logger.info({ response: "logged in successfully" });

  return { message: "Role created successfully", newRole, ok: true }; // if everything goes fine
};

const activateRoles = async (id) => {
  const role = await roleActivation(id);

  assert(role, "ROLE_INVALID", "Role not found");

  logger.info({ response: `role ${id} is active now` });

  return { message: "Role activated successfully", ok: true }; // if everything goes fine
};

const deactivateRoles = async (id) => {
  const role = await roleDeactivation(id);

  assert(role, "ROLE_INVALID", "Role not found");

  logger.info({ response: `role ${id} is inactive now` });

  return { message: "Role deactivated successfully", ok: true }; // if everything goes fine
};

const updateRole = async (id, updateObject) => {
  const role = await updateRoleinDB(id, updateObject);

  assert(role, "ROLE_INVALID", "Role not found");

  logger.info({ response: `role ${id} is inactive now` });

  return { message: "Role updated successfully", role, ok: true };
};

export {
  getRoles,
  getRoleById,
  createRole,
  activateRoles,
  deactivateRoles,
  updateRole,
};
