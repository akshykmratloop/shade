import prismaClient from "../config/dbConfig.js";
import { fetchContent } from "../repository/content.repository.js";
// import {createNotification} from "../repository/notification.repository.js";
import {handleEntityCreationNotification} from "./notificationHelper.js";
import transformContentForAudit from "./transformContentForAudit.js";

// --- Action Type/Performed Resolver ---
function resolveAction(req, method, entity) {
  const customActions = [
    {
      match: (req) => req.baseUrl.includes("content") && req.path === "/updateContent",
      actionType: "DRAFT",
      action_performed: "Content saved (draft)"
    },
    {
      match: (req) => (req.baseUrl.includes("content") || req.baseUrl.includes("resource")) && req.path.includes("assignUser"),
      actionType: "ASSIGN",
      action_performed: "User assigned to resource"
    },
    {
      match: (req) => (req.baseUrl.includes("content") || req.baseUrl.includes("resource")) && req.path.includes("removeAssignedUser"),
      actionType: "REMOVE",
      action_performed: "Remove user"
    },
    // Add more custom actions here as needed
  ];
  for (const ca of customActions) {
    if (ca.match(req)) return { actionType: ca.actionType, action_performed: ca.action_performed };
  }
  switch (method) {
    case "POST": return { actionType: "CREATE", action_performed: entity === "auth" ? `${entity} logged in` : `${entity} created` };
    case "PUT":
    case "PATCH": return { actionType: "UPDATE", action_performed: `${entity} updated` };
    case "DELETE": return { actionType: "DELETE", action_performed: `${entity} deleted` };
    default: return { actionType: "ACCESS", action_performed: `${entity} accessed` };
  }
}

// --- Entity Audit Value Handlers ---
async function getResourceAssignments(resourceId) {
  const resource = await prismaClient.resource.findUnique({
    where: { id: resourceId },
    select: {
      titleEn: true,
      liveVersion: { select: { versionNumber: true } },
      newVersionEditMode: { select: { versionNumber: true } },
      roles: {
        select: {
          role: true,
          status: true,
          user: { select: { name: true } },
        },
      },
      verifiers: {
        select: {
          stage: true,
          status: true,
          user: { select: { name: true } },
        },
      },
    },
  });
  if (!resource) {
    return {
      resource: null,
      liveVersionNumber: null,
      editVersionNumber: null,
      roles: [
        { role: "MANAGER", users: [] },
        { role: "EDITOR", users: [] },
        { role: "PUBLISHER", users: [] },
        { role: "VERIFIER", users: [] },
      ],
    };
  }
  const roleMap = { MANAGER: [], EDITOR: [], PUBLISHER: [] };
  for (const r of resource.roles) {
    if (!roleMap[r.role]) roleMap[r.role] = [];
    roleMap[r.role].push({ name: r.user?.name, status: r.status });
  }
  const verifiers = resource.verifiers.map(v => ({ name: v.user?.name, stage: v.stage, status: v.status }));
  return {
    resource: resource.titleEn,
    liveVersionNumber: resource.liveVersion?.versionNumber || null,
    editVersionNumber: resource.newVersionEditMode?.versionNumber || null,
    roles: [
      { role: "MANAGER", users: roleMap.MANAGER },
      { role: "EDITOR", users: roleMap.EDITOR },
      { role: "PUBLISHER", users: roleMap.PUBLISHER },
      { role: "VERIFIER", users: verifiers },
    ],
  };
}

const entityAuditHandlers = {
  role: async (id) => {
    const roleRecord = await prismaClient.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: {
              select: { name: true },
            },
          },
        },
      },
    });
    if (!roleRecord) return null;
    return {
      name: roleRecord.name,
      permissions: roleRecord.permissions.map((p) => p.permission.name),
      status: roleRecord.status,
    };
  },
  user: async (id) => {
    const userRecord = await prismaClient.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: {
                      select: { name: true },
                    },
                  },
                },
                roleType: true,
              },
            },
          },
        },
      },
    });
    if (!userRecord) return null;
    return {
      name: userRecord.name,
      status: userRecord.status,
      roles: userRecord.roles.map((r) => ({
        name: r.role.name,
        permissions: r.role.permissions.map((p) => p.permission.name),
      })),
    };
  },
  resource: getResourceAssignments,
  content: getResourceAssignments, // alias for content module
  // Add more entities as needed
};

// Middleware to log user actions in the database
const auditLogger = async (req, res, next) => {
  const {user, method} = req; // User info from authentication middleware
  const endPoint = req.baseUrl.split("/").pop(); // Extract entity name from route
  let entity = endPoint === "content" ? "resource" : endPoint;
  let entityId =
    req.params.id ||
    req.params.resourceId ||
    req.body.id ||
    req.body.resourceId ||
    res?.user?.id ||
    null;
  const ipAddress = req.ip;
  const browserInfo = req.headers["user-agent"];

  let oldValue = null;
  let newValue = null;

  // Centralized actionType/action_performed
  const { actionType, action_performed } = resolveAction(req, method, entity);

  // Handler for fetching audit values
  const fetchAuditValue = entityAuditHandlers[entity] || (async (id) => await prismaClient[entity]?.findUnique({ where: { id } }));

  // Special DRAFT (updateContent) case
  if (actionType === "DRAFT" && entity === "resource" && entityId) {
    // Fetch resource with liveVersion and newVersionEditMode
    const resource = await fetchContent(entityId)

    // Old value: edit version if exists, else live version
    let oldVersion = resource?.editModeVersionData || resource?.liveModeVersionData;
    if (oldVersion) {
      oldValue = await transformContentForAudit({
        ...resource,
        newVersionEditMode: oldVersion,
      });
    }
    // New value: transform incoming payload
      const { resourceId, ...bodyWithoutResourceId } = req.body;
      newValue = await transformContentForAudit(bodyWithoutResourceId);
  } else if (["UPDATE", "DELETE", "ASSIGN", "REMOVE"].includes(actionType) && entityId) {
    oldValue = await fetchAuditValue(entityId);
  }

  res.on("finish", async () => {
    const io = req.app.locals.io; // ✅ Add this

    if (actionType === "CREATE" && !entityId) {
      entityId =
        res.locals.entityId ||
        res.locals.createdEntity?.id ||
        res._getData?.()?.id ||
        req.body?.id ||
        req.params.id ||
        req.params.resourceId ||
        req.body.id ||
        req.body.resourceId ||
        res?.user?.id ||
        null;
    }

    // Fetch the latest data from the DB after update
    if (res.statusCode >= 400) {
      newValue = req.body
    } else if (actionType === "DRAFT" && entity === "resource" && entityId) {
      // Already set above
    } else if (["CREATE", "UPDATE", "ASSIGN", "REMOVE"].includes(actionType) && entityId) {
      newValue = await fetchAuditValue(entityId);
    }

    console.log(newValue,entityId,"newValue-----------------------")

    try {
      await prismaClient.auditLog.create({
        data: {
          actionType,
          action_performed,
          entity,
          entityId,
          oldValue: oldValue ? oldValue : null,
          newValue: newValue ? newValue : null,
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

      if (
        (actionType === "CREATE" && newValue) ||
        (actionType === "UPDATE" && newValue)
      ) {
        await handleEntityCreationNotification({
          io,
          userId: user?.id,
          entity,
          newValue,
          actionType,
        });
      }
    } catch (err) {
      console.error("Audit logging failed:", err);
    }
  });

  next();
};

export default auditLogger;
