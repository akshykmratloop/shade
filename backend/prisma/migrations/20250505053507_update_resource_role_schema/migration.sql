/*
  Warnings:

  - A unique constraint covering the columns `[resourceId,role,status]` on the table `ResourceRole` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resourceId,userId,status]` on the table `ResourceRole` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resourceId,stage,status]` on the table `ResourceVerifier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resourceId,userId,status]` on the table `ResourceVerifier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resourceVersionId,role,status]` on the table `ResourceVersionRole` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resourceVersionId,userId,status]` on the table `ResourceVersionRole` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resourceVersionId,stage,status]` on the table `ResourceVersionVerifier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resourceVersionId,userId,status]` on the table `ResourceVersionVerifier` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ResourceRole_resourceId_userId_key";

-- DropIndex
DROP INDEX "ResourceVerifier_resourceId_stage_userId_key";

-- DropIndex
DROP INDEX "ResourceVersionRole_resourceVersionId_userId_key";

-- DropIndex
DROP INDEX "ResourceVersionVerifier_resourceVersionId_stage_userId_key";

-- AlterTable
ALTER TABLE "ResourceRole" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "ResourceVerifier" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "ResourceVersionRole" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "ResourceVersionVerifier" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "ResourceRole_resourceId_role_status_key" ON "ResourceRole"("resourceId", "role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceRole_resourceId_userId_status_key" ON "ResourceRole"("resourceId", "userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVerifier_resourceId_stage_status_key" ON "ResourceVerifier"("resourceId", "stage", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVerifier_resourceId_userId_status_key" ON "ResourceVerifier"("resourceId", "userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVersionRole_resourceVersionId_role_status_key" ON "ResourceVersionRole"("resourceVersionId", "role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVersionRole_resourceVersionId_userId_status_key" ON "ResourceVersionRole"("resourceVersionId", "userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVersionVerifier_resourceVersionId_stage_status_key" ON "ResourceVersionVerifier"("resourceVersionId", "stage", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVersionVerifier_resourceVersionId_userId_status_key" ON "ResourceVersionVerifier"("resourceVersionId", "userId", "status");
