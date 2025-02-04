import cron from "node-cron";
import {
  resetUserOtpAttempts,
  sendNotifications,
} from "../repository/user.repository.js";

// Global cron scheduler function
const scheduleCronJobs = () => {
  // Reset OTP attempts for users after 24 hours (runs every 1 minute to check)
  // Every * represents following (left to right)
  // Seconds (optional): 0 – 59
  // Minute: 0 – 59
  // Hour: 0 – 23
  // Day of the Month: 1 – 31
  // Month: 1 – 12
  // Day of the week: 0 – 7 (0 and 7 both represent Sunday)
  cron.schedule("* * 24 * *", async () => {
    await resetUserOtpAttempts();
    console.log("Checked for OTP attempt resets.");
  });

  // Example: Send notifications every day at midnight
  // cron.schedule("0 0 * * *", async () => {
  //   await sendNotifications();
  //   console.log("Sent daily notifications.");
  // });
};

export { scheduleCronJobs };
