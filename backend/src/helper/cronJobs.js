import cron from "node-cron";
import { resetUserOtpAttempts, sendNotifications } from "../repository/user.repository.js";

// Global cron scheduler function
const scheduleCronJobs = () => {
  // Reset OTP attempts for users after 24 hours (runs every 1 minute to check)
  cron.schedule("* * * * *", async () => {
    await resetUserOtpAttempts();
    console.log("Checked for OTP attempt resets.");
  });

  // Example: Send notifications every day at midnight
  cron.schedule("0 0 * * *", async () => {
    await sendNotifications();
    console.log("Sent daily notifications.");
  });
};

export { scheduleCronJobs };
