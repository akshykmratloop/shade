-- DropIndex
DROP INDEX "Otp_deviceId_key";

-- DropIndex
DROP INDEX "user_device_idx";

-- CreateIndex
CREATE INDEX "user_device_origin_idx" ON "Otp"("userId", "deviceId", "otpOrigin");
