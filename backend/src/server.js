import {createServer} from "http";
import {createApp, finishApp} from "./app.js";
import {useModules} from "./config/index.js";
import {Server} from "socket.io";
import {
  removeUserSocket,
  setUserSocket,
} from "./helper/socketConnectionID.js";
import {scheduleCronJobs} from "./helper/cronJobs.js";

(async () => {
  const app = createApp();
  const server = createServer(app);

  // Initialize all modules
  useModules(app);

  // Call your cron job scheduler
  scheduleCronJobs();

  // Add middleware for errors and 404
  finishApp(app);

  // Initialize Socket.io
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3001", // your frontend URL
      credentials: true, // allow credentials
    },
  });

  // Function to send notifications in real-time
  app.locals.io = io;

  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
      socket.userId = userId;
      setUserSocket(userId, socket.id);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.id);
      removeUserSocket(socket.userId);
    });
  });

  server.listen(process.env.BACKEND_PORT, async () => {
    console.log(
      `Server running in ${process.env.MODE} mode on port ${process.env.BACKEND_PORT}`
    );
    await import("./config/dbConfig.js"); // Ensure DB connection is logged
  });
})();
