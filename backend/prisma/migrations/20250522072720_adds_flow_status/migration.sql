/*
  Warnings:

  - The values [PENDING,APPROVED,REJECTED] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "FlowStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatus_new" AS ENUM ('VERIFICATION_PENDING', 'PUBLISH_PENDING', 'PUBLISHED');
ALTER TABLE "ResourceVersioningRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ResourceVersioningRequest" ALTER COLUMN "status" TYPE "RequestStatus_new" USING ("status"::text::"RequestStatus_new");
ALTER TYPE "RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "RequestStatus_old";
ALTER TABLE "ResourceVersioningRequest" ALTER COLUMN "status" SET DEFAULT 'VERIFICATION_PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "ResourceVersioningRequest" ADD COLUMN     "flowStatus" "FlowStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "status" SET DEFAULT 'VERIFICATION_PENDING';
