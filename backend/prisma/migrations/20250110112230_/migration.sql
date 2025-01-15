/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Otp_deviceId_key" ON "Otp"("deviceId");
