import prismaClient from "../src/config/dbConnection.js"; // Updated import to match default export
import bcrypt from "bcryptjs";

const email = process.env.SUPER_ADMIN_EMAIL;
const pass = process.env.SUPER_ADMIN_PASSWORD;

const seedDB = async () => {
  try {
    const permissions = [
      {
        name: "CREATE",
        description: "Allows the user to create new resources.",
      },
      {
        name: "READ",
        description: "Grants the user read-only access to resources.",
      },
      {
        name: "UPDATE",
        description: "Enables the user to modify existing resources.",
      },
      { name: "DELETE", description: "Permits the user to remove resources." },
      { name: "PUBLISH", description: "Allows the user to publish resources." },
      {
        name: "REJECT",
        description: "Grants the user the ability to reject resources.",
      },
    ];

    const roles = [
      { name: "SUPER_ADMIN" },
      { name: "TASK_INITIATOR" },
      { name: "PMO" },
      { name: "DESIGNER" },
    ];

    // Create or update permissions
    // =====================================================================================
    for (const permission of permissions) {
      await prismaClient.permission.upsert({
        where: { name: permission.name },
        update: { description: permission.description }, // Update description during update
        create: permission,
      });
      console.log(`Ensured permission: ${permission.name}`);
    }

    // Create or update roles
    // =====================================================================================

    for (const role of roles) {
      await prismaClient.role.upsert({
        where: { name: role.name },
        update: {}, // No changes during update
        create: role,
      });
      console.log(`Ensured role: ${role.name}`);
    }

    // Assign all permissions to SUPER_ADMIN role
    // =====================================================================================

    const superAdminRole = await prismaClient.role.findUnique({
      where: { name: "SUPER_ADMIN" },
    });

    const allPermissions = await prismaClient.permission.findMany();
    for (const permission of allPermissions) {
      await prismaClient.rolePermission.upsert({
        where: {
          role_id_permission_id: {
            role_id: superAdminRole.id,
            permission_id: permission.id,
          },
        },
        update: {}, // No changes during update
        create: {
          role_id: superAdminRole.id,
          permission_id: permission.id,
        },
      });
      console.log(`Ensured rolePermission: ${permission.name}`);
    }

    // Check if super admin already exists
    // =====================================================================================

    // Hash the password
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Use upsert for super admin user
    await prismaClient.user.upsert({
      where: { email },
      update: {
        // Update fields if the user already exists
        password: hashedPassword, // Update password if needed
        isSuperUser: true,
        // roles: {
        //   create: [{ role: { connect: { name: "SUPER_ADMIN" } } }],
        // },
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
  }
};

seedDB()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });

export default seedDB;
