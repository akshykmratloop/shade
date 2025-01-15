import { PrismaClient } from "@prisma/client";

const isProduction = process.env.MODE === "production";

const prismaClient = new PrismaClient({
  log: isProduction ? ["warn", "error"] : ["query", "info", "warn", "error"], // Enable logging for queries, info, warnings, and errors
});

const connectDB = async () => {
  try {
    await prismaClient.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

export default prismaClient;
