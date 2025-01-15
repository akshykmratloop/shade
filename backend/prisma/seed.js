
import prismaClient from "../src/config/dbConnection.js"; // Updated import to match default export
import bcrypt from "bcryptjs";

const email = process.env.SUPER_ADMIN_EMAIL;
const pass = process.env.SUPER_ADMIN_PASSWORD;

const seedDB = async () => {
  try {
    // Permission array holds all the permissions
    const permissions = [
      { name: "CREATE", description: "Grants the user to create new resources." },
      { name: "READ", description: "Grants the user read-only access to view resources." },
      { name: "UPDATE", description: "Grants the user permission to modify existing resources." },
      { name: "DISCARD", description: "Permits the user to discard (soft delete or move to trash) resources." },
      { name: "PUBLISH", description: "Allows the user to publish resources, making them publicly accessible." },
      { name: "RESTORE", description: "Grants the user the ability to restore previously version of resources." },
      { name: "EDIT_REQUEST", description: "Grants the user the ability to view and modify requests." },
      { name: "ARCHIVE", description: "Grants the user the ability to archive resources, making them inactive but preserved." },
    ];

    const roles = [
      { name: "SUPER_ADMIN" },
      { name: "TASK_INITIATOR" },
      { name: "PMO" },
      { name: "DESIGNER" },
    ];

    const rolePermissionsMap = {
      SUPER_ADMIN: ["CREATE", "READ", "UPDATE", "DISCARD", "PUBLISH", "RESTORE", "EDIT_REQUEST", "ARCHIVE"],
      TASK_INITIATOR: ["CREATE", "READ", "UPDATE", "DISCARD"],
      PMO: ["READ", "DISCARD", "EDIT_REQUEST"],
      DESIGNER: ["READ", "DISCARD", "PUBLISH", "RESTORE", "EDIT_REQUEST", "ARCHIVE"],
    };

    // Create or update permissions
    for (const permission of permissions) {
      await prismaClient.permission.upsert({
        where: { name: permission.name },
        update: { description: permission.description },
        create: permission,
      });
      console.log(`Ensured permission: ${permission.name}`);
    }

    // Create or update roles
    for (const role of roles) {
      await prismaClient.role.upsert({
        where: { name: role.name },
        update: {},
        create: role,
      });
      console.log(`Ensured role: ${role.name}`);
    }

    // Fetch all permissions from the database
    const allPermissions = await prismaClient.permission.findMany();

    // Function to seed role-permission relationships
    const seedRolePermissions = async (roleName, permissionsList) => {
      const role = await prismaClient.role.findUnique({
        where: { name: roleName },
      });

      if (!role) {
        console.error(`Role not found: ${roleName}`);
        return;
      }

      for (const permissionName of permissionsList) {
        const permission = allPermissions.find((perm) => perm.name === permissionName);

        if (permission) {
          await prismaClient.rolePermission.upsert({
            where: {
              role_id_permission_id: {
                role_id: role.id,
                permission_id: permission.id,
              },
            },
            update: {},
            create: {
              role_id: role.id,
              permission_id: permission.id,
            },
          });
          console.log(`Ensured rolePermission for ${roleName}: ${permissionName}`);
        } else {
          console.warn(`Permission not found: ${permissionName}`);
        }
      }
    };

    // Seed role-permission relationships for all roles
    for (const [roleName, permissionsList] of Object.entries(rolePermissionsMap)) {
      await seedRolePermissions(roleName, permissionsList);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Use upsert for super admin user
    await prismaClient.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        isSuperUser: true,
      },
      create: {
        name: "Super Admin",
        username: "super_Admin",
        email: email,
        password: hashedPassword,
        isSuperUser: true,
        roles: {
          create: [{ role: { connect: { name: "SUPER_ADMIN" } } }],
        },
      },
    });
    console.log("Super admin user ensured successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
};

seedDB().catch((e) => {
  console.error(e);
  process.exit(1);
});

export default seedDB;
