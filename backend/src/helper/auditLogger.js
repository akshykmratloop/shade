import prismaClient from "../config/dbConfig.js";
// import {createNotification} from "../repository/notification.repository.js";
import {handleEntityCreationNotification} from "./notificationHelper.js";

// Middleware to log user actions in the database
export const auditLogger = async (req, res, next) => {
  const {user, method} = req; // User info from authentication middleware
  const entity = req.baseUrl.split("/").pop(); // Extract entity name from route
  let entityId = req.params.id || req.body.id || null; // Extract entity ID if available
  const ipAddress = req.ip;
  const browserInfo = req.headers["user-agent"];

  let oldValue = null;
  let newValue = null;

  let actionType;
  let action_performed;
  switch (method) {
    case "POST":
      actionType = "CREATE";
      action_performed =
        entity === "auth" ? `${entityId} logged in` : `${entity} created`;
      break;
    case "PUT":
    case "PATCH":
      actionType = "UPDATE";
      action_performed = `${entity} updated`;
      break;
    case "DELETE":
      actionType = "DELETE";
      action_performed = `${entityId} Deleted`;
      break;
    default:
      actionType = "ACCESS";
  }

  // Capture old record for UPDATE/DELETE actions
  if (["UPDATE", "DELETE"].includes(actionType) && entityId) {
    const oldRecord = await prismaClient[entity]?.findUnique({
      where: {id: entityId},
    });

    if (oldRecord) {
      oldValue = oldRecord;
    }
  }

  res.on("finish", async () => {
    const io = req.app.locals.io; // ✅ Add this

    if (actionType === "CREATE" && !entityId) {
      entityId = res.locals.entityId || null;
    }

    // Fetch the latest data from the DB after update
    if (res.statusCode >= 400) {
      console.log("Update failed, newValue remains unchanged.");
      newValue = req.body; // Since the update didn't go through, no change happened
    } else if (["CREATE", "UPDATE"].includes(actionType) && entityId) {
      // Fetch latest data from the database only if the update was successful
      newValue = await prismaClient[entity]?.findUnique({
        where: {id: entityId},
      });
    }

    try {
      await prismaClient.auditLog.create({
        data: {
          actionType,
          action_performed,
          entity,
          entityId,
          oldValue: oldValue ? oldValue : null,
          newValue: newValue ? newValue : null, // Fetch new value from DB
          ipAddress,
          browserInfo,
          outcome:
            res.statusCode >= 200 && res.statusCode < 300
              ? "Success"
              : "Failure",
          timestamp: new Date(),
          user: {
            create: entity === "auth" ? {userId: entityId} : {userId: user?.id},
          },
        },
      });

      // if (actionType === "CREATE" && ["role", "user"].includes(entity)) {
      //   // let message;

      //   // if (["user", "role"].includes(entity)) {
      //   //   if (entity === "role" && newValue?.name) {
      //   //     message = `A new role '${newValue.name}' has been created`;
      //   //   } else if (entity === "user" && newValue?.email) {
      //   //     message = `A new user '${newValue.email}' has been created`;
      //   //   } else {
      //   //     message = `${entity} '${entityId}' has been created`;
      //   //   }

      //   //   io.emit("role_created", {
      //   //     userId: user?.id,
      //   //     message,
      //   //   });
      //   //   // ✅ Create Notification
      //   //   await createNotification({
      //   //     userId: user?.id,
      //   //     message,
      //   //   });
      //   // }
      //   await handleRoleCreationNotification({
      //     io,
      //     userId: user?.id,
      //     newRole: newValue,
      //   });
      // }

      if (actionType === "CREATE" && newValue) {
        await handleEntityCreationNotification({
          io,
          userId: user?.id,
          entity,
          newValue,
        });
      }
    } catch (err) {
      console.error("Audit logging failed:", err);
    }
  });

  next();
};

export default auditLogger;

// import prismaClient from "../config/dbConfig.js";

// // This middleware will capture the action and store it in the database
// export const auditLogger = async (req, res, next) => {
//   const {user} = req; // Assuming user info is attached to the request (e.g. via authentication)
//   const actionType = req.method; // GET, POST, PUT, DELETE
//   const entity = req.baseUrl.split("/").pop(); // Extract the entity name from the route
//   let entityId = req.params.id; // Extract from params if needed
//   const ipAddress = req.ip;
//   const browserInfo = req.headers["user-agent"]; // Browser info (optional)
//   // Capture old and new values only if needed (for example on UPDATE or DELETE)
//   let oldValue = null;
//   let newValue = req.body;

//   // Example of capturing changes for a PUT or DELETE request (for resource modification)
//   if (
//     actionType === "POST" ||
//     actionType === "PUT" ||
//     actionType === "DELETE"
//   ) {
//     const entityData = req.body; // Assuming the new data is in the request body (POST or PUT)
//     newValue = JSON.stringify(entityData);

//     // Capture the response after next() to check if entityId is available
//     res.on("finish", async () => {
//       // For POST requests, attempt to retrieve the new entity's ID from res.locals
//       if (actionType === "POST" && !entityId) {
//         entityId = res.locals.entityId || null;
//       }
//     });

//     if (actionType === "PUT" && entityId) {
//       const oldRecord = await prismaClient[entity]?.findUnique({
//         where: {id: entityId},
//       });
//       if (oldRecord) {
//         // Log the whole record if you want to see all old values
//         oldValue = JSON.stringify(oldRecord);

//         // Optionally compute a diff for only changed fields:
//         const diff = {};
//         Object.keys(req.body).forEach((key) => {
//           if (oldRecord[key] !== req.body[key]) {
//             diff[key] = {old: oldRecord[key], new: req.body[key]};
//           }
//         });
//         if (Object.keys(diff).length > 0) {
//           newValue = JSON.stringify(
//             Object.fromEntries(
//               Object.entries(diff).map(([key, change]) => [key, change.new])
//             )
//           );
//           // You could log the diff in addition to the full record if needed
//         } else {
//           // If no diff is found, but you're still updating, you may want to log the entire request
//           newValue = JSON.stringify(req.body);
//         }
//       }
//     }

//     if (actionType === "DELETE") {
//       const entityBeforeDeletion = await prismaClient[entity]?.findUnique({
//         where: {id: entityId},
//       });
//       oldValue = JSON.stringify(entityBeforeDeletion);
//     }
//   }

//   // Now, we can store this log in the database after the action
//   const log = await prismaClient.auditLog.create({
//     data: {
//       actionType,
//       action_performed: `User ${entityId} performed ${actionType} on ${entity}`, // You can modify this based on the action
//       entity,
//       entityId,
//       oldValue: oldValue ? oldValue : null,
//       newValue: newValue ? newValue : null,
//       ipAddress,
//       browserInfo,
//       outcome: "Success", // You can modify this based on the result of the action
//       timestamp: new Date(),
//       user: {
//         create: {userId: user.id}, // Use the correct field name as defined in your schema
//       },
//     },
//   });

//   // Proceed to the next middleware or handler
//   next();
//   console.log(res, "res");
// };

// export default auditLogger;
