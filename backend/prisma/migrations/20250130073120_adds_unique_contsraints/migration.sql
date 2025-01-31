/*
  Warnings:

  - A unique constraint covering the columns `[userId,deviceId,otpOrigin]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Otp_userId_deviceId_otpOrigin_key" ON "Otp"("userId", "deviceId", "otpOrigin");
