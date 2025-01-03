import prisma from '../../helper/db';

const createRole = async (data) => {
    return prisma.role.create({ data });
};

const getRoles = async () => {
    return prisma.role.findMany();
};

export { createRole, getRoles };
