import { logger } from "../../config/index.js";
import { assert, assertEvery } from "../../errors/assertError.js";
import { findRoles, createNewRoles } from "../../repository/roles.repository.js";

const createRole = async (data) => {
    const newRole = await createNewRoles(data.name, data.description)

    // if response is empty the throw error with assert
    assert(newRole, "CREATION_FAILED", "something went wrong")

    //log information
    logger.info({ response: "logged in successfully" });

    return { message: "Role created successfully", newRole } // if everything goes fine
};

const getRoles = async () => {
    const roles = await findRoles(); // to bring the roles

    // if response is empty the throw error with assert
    assert(roles, "NOT_FOUND", "no roles found in database")

    // log info
    logger.info({ response: "roles fetched successfully! through get roles" });

    return roles // if everything goes fine
};

export { createRole, getRoles };
