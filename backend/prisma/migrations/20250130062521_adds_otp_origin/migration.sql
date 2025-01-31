-- CreateEnum
CREATE TYPE "otpOrigin" AS ENUM ('MFA_Login', 'forgot_Pass', 'NULL');

-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "otpOrigin" "otpOrigin" NOT NULL DEFAULT 'NULL';
