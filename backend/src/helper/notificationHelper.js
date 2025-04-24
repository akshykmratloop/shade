import prismaClient from "../config/dbConfig.js";
import {createNotification} from "../repository/notification.repository.js";

export const handleEntityCreationNotification = async ({
  io,
  userId,
  entity,
  newValue,
}) => {
  try {
    const creator = await prismaClient.user.findUnique({
      where: {id: userId},
      include: {roles: {select: {roleId: true}}},
    });

    if (!creator) {
      console.warn("creator not found: ", userId);
      return;
    }

    let recipients = [];

    let message = `A new ${entity} '${
      newValue.name || newValue.email || newValue.title || newValue.id
    }' has been created`;

    switch (entity) {
      case "role": {
        // Step 1: Get creator's permission IDs
        const creatorPermissions = await prismaClient.rolePermission.findMany({
          where: {
            roleId: {
              in: creator.roles.map((r) => r.roleId),
            },
          },
          select: {permissionId: true},
        });

        const permissionIds = creatorPermissions.map((p) => p.permissionId);

        if (permissionIds.length === 0) return;

        // Step 2: Find users who have any of these permissions (excluding creator)
        const matchingUsers = await prismaClient.user.findMany({
          where: {
            id: {not: creator.id},
            roles: {
              some: {
                role: {
                  permissions: {
                    some: {
                      permissionId: {in: permissionIds},
                    },
                  },
                },
              },
            },
          },
        });

        // Step 3: Recipients are those matching users
        recipients = matchingUsers;
        break;
      }

      case "user": {
        const creatorRoleIds = creator.roles.map((r) => r.roleId);
        recipients = await prismaClient.user.findMany({
          where: {
            id: {not: creator.id},
            roles: {
              some: {
                roleId: {in: creatorRoleIds},
              },
            },
          },
        });
        break;
      }

      default: {
        // General case: just notify the super admins or the creator themselves
        recipients = await prismaClient.user.findMany({
          where: {
            OR: [
              {isSuperUser: true},
              {id: userId}, // Creator always receives
            ],
          },
        });
        break;
      }
    }

    const eventName = `${entity}_created`;

    for (const recipient of recipients) {
      io.emit(eventName, {
        userId: recipient.id,
        message,
      });

      await createNotification({
        userId: recipient.id,
        message,
      });
    }
  } catch (error) {
    console.error("Error in handleEntityCreationNotification:", error);
  }
};
