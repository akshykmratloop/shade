import prismaClient from "../config/dbConfig.js";

export const findPermissions = async () => {
  return await prismaClient.permission.findMany();
};

export const findRoleById = async (id) => {
  const role = await prismaClient.role.findUnique({
    where: {
      id: id,
    },
  });
  // Check if the role is "SUPER_ADMIN"
  if (role && role.name === "SUPER_ADMIN") return null; // Return null if the role is "SUPER_ADMIN"
  return role; // Otherwise, return the role
};

export const createNewRoles = async (name, description) => {
  // making the query to create role
  const roles = await prismaClient.role.create({
    data: {
      name,
      description,
    },
  });

  if (!roles) return false; // for handling the assert through false

  return { roles };
};

export const roleActivation = async (id) => {
  const role = await prismaClient.role.update({
    where: {
      id: id,
    },
    data: {
      status: "ACTIVE",
    },
  });

  return role;
};

export const roleDeactivation = async (id) => {
  const role = await prismaClient.role.update({
    where: {
      id: id,
    },
    data: {
      status: "INACTIVE",
    },
  });

  return role;
};

export const updateRoleinDB = async (id, updateObj) => {
  // confirming the for the role to exist
  const confirmRole = await findRoleById(id);

  if (!confirmRole) return false;

  console.log(updateObj);
  const role = prismaClient.role.update({
    where: { id: id },
    data: updateObj,
  });

  return role;
};
