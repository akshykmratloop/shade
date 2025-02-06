import prismaClient from "../config/dbConfig.js";


export const findRoles = async () => {
    const roles = await prismaClient.role.findMany(); // to bring the roles

    if (!roles) return false; // for handling the assert through false

    return { roles }
}

export const createNewRoles = async (name, description) => {
    // making the query to create role
    const roles = await prismaClient.role.create({
        data: {
            name, description
        }
    });

    if (!roles) return false; // for handling the assert through false

    return { roles }
}