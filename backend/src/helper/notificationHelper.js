import prismaClient from "../config/dbConfig.js";
import {createNotification} from "../repository/notification.repository.js";

export const handleRoleCreationNotification = async ({io, userId, newRole}) => {
  const message = `A new role '${newRole.name}' has been created`;

  try {
    // Step 1: Get all permissions for the new role
    const rolePermissions = await prismaClient.rolePermission.findMany({
      where: {roleId: newRole.id},
      select: {permissionId: true},
    });

    const permissionIds = rolePermissions.map((p) => p.permissionId);

    if (permissionIds.length === 0) {
      console.warn("No permissions associated with new role:", newRole.name);
      return;
    }

    // Step 2: Check if creator is super admin
    const creator = await prismaClient.user.findUnique({
      where: {id: userId},
    });

    if (!creator) {
      console.warn("Creator not found:", userId);
      return;
    }

    let recipients = [];

    if (creator.isSuperUser) {
      // Super admin created the role — notify only super admin
      recipients.push(creator);
    } else {
      // Manager created the role — notify other users with same permissions
      const matchingUsers = await prismaClient.user.findMany({
        where: {
          // isSuperUser: false,
          id: {
            not: creator.id, // Don't notify the creator again
          },
          roles: {
            some: {
              role: {
                permissions: {
                  some: {
                    permissionId: {
                      in: permissionIds,
                    },
                  },
                },
              },
            },
          },
        },
      });

      recipients = matchingUsers;
    }

    // Step 3: Send notifications
    for (const recipient of recipients) {
      io.emit("role_created", {
        userId: recipient.id,
        message,
      });

      await createNotification({
        userId: recipient.id,
        message,
      });
    }
  } catch (err) {
    console.error("handleRoleCreationNotification error:", err);
  }
};
