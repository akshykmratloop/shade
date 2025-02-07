import { PrismaClient } from "@prisma/client";
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

export const roleActivation = async (id) => {
    const role = await prismaClient.role.update({
        where: {
            id: id
        },
        data: {
            status: "ACTIVE"
        }
    })

    return role
}

export const roleDeactivation = async (id) => {
    const role = await prismaClient.role.update({
        where: {
            id: id
        },
        data: {
            status: "INACTIVE"
        }
    })

    return role
}

const findRoleById = async (id) => {
    const result = await PrismaClient.role.findUnique({
        where: { id: id }
    })

    return result
}

export const updateRoleinDB = async (id, updateObj) => {
    const confirmRole = await findRoleById(id);
    
    if(!confirmRole) return false;

    const role = PrismaClient.role.update({
        where: {id: id},
        data: updateObj
    })

    return role
}