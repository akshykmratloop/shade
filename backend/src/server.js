import { createApp, finishApp } from "./app.js";
import { useModules } from "./config/init.js";
(async () => {
  const app = createApp();

  // Initialize all modules
  useModules(app);

  // Add middleware for errors and 404
  finishApp(app);

  app.listen(process.env.BACKEND_PORT, async () => {
    console.log(
      `Server running in ${process.env.MODE} mode on port ${process.env.BACKEND_PORT}`
    );
    await import("./config/dbConnection.js"); // Ensure DB connection is logged
    // await import('../prisma/seed.js'); // Call the seed function after DB connection
  });
})();
