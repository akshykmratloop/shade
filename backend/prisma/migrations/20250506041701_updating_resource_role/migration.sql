/*
  Warnings:

  - A unique constraint covering the columns `[resourceId,role,userId,status]` on the table `ResourceRole` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resourceId,stage,userId,status]` on the table `ResourceVerifier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resourceVersionId,role,userId,status]` on the table `ResourceVersionRole` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resourceVersionId,stage,userId,status]` on the table `ResourceVersionVerifier` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ResourceRole_resourceId_role_status_key";

-- DropIndex
DROP INDEX "ResourceRole_resourceId_userId_status_key";

-- DropIndex
DROP INDEX "ResourceVerifier_resourceId_stage_status_key";

-- DropIndex
DROP INDEX "ResourceVersionRole_resourceVersionId_role_status_key";

-- DropIndex
DROP INDEX "ResourceVersionRole_resourceVersionId_userId_status_key";

-- DropIndex
DROP INDEX "ResourceVersionVerifier_resourceVersionId_stage_status_key";

-- DropIndex
DROP INDEX "ResourceVersionVerifier_resourceVersionId_userId_status_key";

-- CreateIndex
CREATE UNIQUE INDEX "ResourceRole_resourceId_role_userId_status_key" ON "ResourceRole"("resourceId", "role", "userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVerifier_resourceId_stage_userId_status_key" ON "ResourceVerifier"("resourceId", "stage", "userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVersionRole_resourceVersionId_role_userId_status_key" ON "ResourceVersionRole"("resourceVersionId", "role", "userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVersionVerifier_resourceVersionId_stage_userId_stat_key" ON "ResourceVersionVerifier"("resourceVersionId", "stage", "userId", "status");
