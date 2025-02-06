import { logger } from "../../config/index.js";
import { assert, assertEvery } from "../../errors/assertError.js";
import { findRoles } from "../../repository/roles.repository.js";

const createRole = async (data) => {
    return prisma.role.create({ data });
};

const getRoles = async () => {
    const roles = await findRoles(); // to bring the roles
    // if response is empty the throw error with assert
    
    assert(roles, "NOT_FOUND", "no roles found in database")

    return roles // if everything goes fine
};

export { createRole, getRoles };
