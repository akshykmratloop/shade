import prismaClient from "../config/dbConfig.js";

export const findRoles = async () => {
  return await prismaClient.role.findMany({
    where: {
      name: {
        not: "SUPER_ADMIN", // Exclude SUPER_ADMIN
      },
    },
    include: {
      _count: {
        select: {
          permissions: true, // Count of permissions per role
        },
      },
      // permissions: {
      //   include: {
      //     permission: {
      //       select: {
      //         _count: {
      //           select: {
      //             permissionSubPermission: true, // Count of subpermissions per permission
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    },
  });
};

export const findRoleById = async (id) => {
  const role = await prismaClient.role.findUnique({
    where: {
      id: id,
    },
    include: {
      permissions: {
        include: {
          permission: {
            select: {subPermissions: {select: {subPermission: true}}},
          },
        },
      },
      users: {select: {user: true}},
    },
  });
  // Check if the role is "SUPER_ADMIN"
  if (role && role.name === "SUPER_ADMIN") return null; // Return null if the role is "SUPER_ADMIN"
  return role; // Otherwise, return the role
};

export const findRoleType = async () => {
  return await prismaClient.roleType.findMany({
    where: {},
  });
};

export const createNewRoles = async (name, roleTypeId, permissionsArray) => {
  const roles = await prismaClient.role.create({
    data: {
      name,
      roleTypeId,
      permissions: {
        // Ensure relation name is correct
        create: permissionsArray.map((permissionId) => ({
          permissionId: permissionId,
        })),
      },
    },
    // include: {permissions: true},
  });

  if (!roles) return false; // for handling the assert through false

  return {roles};
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
    where: {id: id},
    data: updateObj,
  });

  return role;
};
