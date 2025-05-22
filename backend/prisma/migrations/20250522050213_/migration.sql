/*
  Warnings:

  - You are about to drop the column `isApproverActive` on the `RequestApproval` table. All the data in the column will be lost.
  - You are about to drop the column `previousRequestId` on the `ResourceVersioningRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[requestId,approverId,approverStatus,stage]` on the table `RequestApproval` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ResourceVersioningRequest_previousRequestId_idx";

-- AlterTable
ALTER TABLE "RequestApproval" DROP COLUMN "isApproverActive",
ADD COLUMN     "approverStatus" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "ResourceVersioningRequest" DROP COLUMN "previousRequestId";

-- CreateIndex
CREATE UNIQUE INDEX "RequestApproval_requestId_approverId_approverStatus_stage_key" ON "RequestApproval"("requestId", "approverId", "approverStatus", "stage");
