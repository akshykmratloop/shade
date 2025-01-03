import prisma from '../../helper/db';

const createUser = async (data) => {
    return prisma.user.create({ data });
};

const findUserByEmail = async (email) => {
    return prisma.user.findUnique({ where: { email } });
};

export { createUser, findUserByEmail };
