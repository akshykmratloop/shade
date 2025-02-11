import prisma from '../../helper/db';

const createPage = async (data) => {
    return prisma.page.create({ data });
};

export { createPage };
