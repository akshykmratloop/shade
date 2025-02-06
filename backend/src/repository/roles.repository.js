import prismaClient from "../config/dbConfig.js";


export const findRoles = async () => {
    const roles = await prismaClient.role.findMany();

    if(!roles) return false;

    return {roles}
}