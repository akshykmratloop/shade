const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

// This middleware will capture the action and store it in the database
const auditLogger = async (req, res, next) => {
  const {user} = req; // Assuming user info is attached to the request (e.g. via authentication)
  const actionType = req.method; // GET, POST, PUT, DELETE
  const entity = req.baseUrl.split("/").pop(); // Extract the entity name from the route
  const entityId = req.params.id || null; // Get the entity ID from the route parameters
  const ipAddress = req.ip;
  const browserInfo = req.headers["user-agent"]; // Browser info (optional)

  // Capture old and new values only if needed (for example on UPDATE or DELETE)
  let oldValue = null;
  let newValue = null;

  // Example of capturing changes for a PUT or DELETE request (for resource modification)
  if (actionType === "PUT" || actionType === "DELETE") {
    const entityData = req.body; // Assuming the new data is in the request body (POST or PUT)
    newValue = JSON.stringify(entityData);

    if (actionType === "DELETE") {
      const entityBeforeDeletion = await prisma[entity].findUnique({
        where: {id: entityId},
      });
      oldValue = JSON.stringify(entityBeforeDeletion);
    }
  }

  // Now, we can store this log in the database after the action
  const log = await prisma.auditLog.create({
    data: {
      userId: user.id, // Assuming user is authenticated and you have user info
      actionType: actionType,
      entity: entity,
      entityId: entityId,
      oldValue: oldValue ? oldValue : null,
      newValue: newValue ? newValue : null,
      ipAddress: ipAddress,
      browserInfo: browserInfo,
      outcome: "Success", // You can modify this based on the result of the action
      timestamp: new Date(),
    },
  });

  // Proceed to the next middleware or handler
  next();
};

module.exports = auditLogger;
