import { logger } from "../../config/index.js";
import { assert, assertEvery } from "../../errors/assertError.js";
import { findRoles, createNewRoles, roleActivation, roleDeactivation } from "../../repository/roles.repository.js";

const createRole = async (data) => {
    const newRole = await createNewRoles(data.name, data.description)

    // if response is empty the throw error with assert
    assert(newRole, "CREATION_FAILED", "something went wrong")

    //log information
    logger.info({ response: "logged in successfully" });

    return { message: "Role created successfully", newRole, ok: true } // if everything goes fine
};

const getRoles = async () => {
    const roles = await findRoles(); // to bring the roles

    // if response is empty the throw error with assert
    assert(roles, "NOT_FOUND", "no roles found in database")

    // log info
    logger.info({ response: "roles fetched successfully! through get roles" });

    return { message: "Role fetched successfully", roles, ok: true } // if everything goes fine
};

const activateRoles = async (id) => {
    const  role = await roleActivation(id);

    assert(role, "ROLE_INVALID", "Role not found")

    logger.info({ response: `role ${id} is active now` });

    return { message: "Role activated successfully", ok: true } // if everything goes fine
}

const deactivateRoles = async (id) => {
    const role = await roleDeactivation(id);

    assert(role, "ROLE_INVALID", "Role not found")

    logger.info({ response: `role ${id} is inactive now` });

    return { message: "Role deactivated successfully", ok: true } // if everything goes fine
}

export { createRole, getRoles, activateRoles, deactivateRoles };
