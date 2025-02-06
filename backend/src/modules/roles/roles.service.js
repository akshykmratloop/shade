import { logger } from "../../config/index.js";
import { assert, assertEvery } from "../../errors/assertError.js";
const createRole = async (data) => {
    return prisma.role.create({ data });
};

const getRoles = async () => {
    return prisma.role.findMany();
};

export default { createRole, getRoles };
