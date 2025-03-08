/*
  Warnings:

  - The values [DRAFT,REVIEW,REJECTED,HOLD] on the enum `PageStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `created_at` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Role` table. All the data in the column will be lost.
  - The primary key for the `RolePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `permission_id` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `RolePermission` table. All the data in the column will be lost.
  - The primary key for the `UserRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_id` on the `UserRole` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserRole` table. All the data in the column will be lost.
  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPageRole` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roleTypeId` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleTypeId` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permissionId` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `UserRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserRole` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "logOutcome" AS ENUM ('Success', 'Failure', 'Unknown');

-- AlterEnum
BEGIN;
CREATE TYPE "PageStatus_new" AS ENUM ('PUBLISHED', 'ARCHIVED', 'TRASHED');
ALTER TYPE "PageStatus" RENAME TO "PageStatus_old";
ALTER TYPE "PageStatus_new" RENAME TO "PageStatus";
DROP TYPE "PageStatus_old";
COMMIT;

-- DropIndex
DROP INDEX "Page_name_idx";

-- DropIndex
DROP INDEX "RolePermission_permission_id_idx";

-- DropIndex
DROP INDEX "RolePermission_role_id_idx";

-- DropIndex
DROP INDEX "UserRole_role_id_idx";

-- DropIndex
DROP INDEX "UserRole_user_id_idx";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "created_at",
DROP COLUMN "status",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "status",
ADD COLUMN     "roleTypeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "description",
ADD COLUMN     "roleTypeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_pkey",
DROP COLUMN "permission_id",
DROP COLUMN "role_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "permissionId" TEXT NOT NULL,
ADD COLUMN     "roleId" TEXT NOT NULL,
ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "permissionId");

-- AlterTable
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_pkey",
DROP COLUMN "role_id",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "roleId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId", "roleId");

-- DropTable
DROP TABLE "Log";

-- DropTable
DROP TABLE "PageRole";

-- DropTable
DROP TABLE "UserPageRole";

-- DropEnum
DROP TYPE "Stage";

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "browserInfo" TEXT,
    "outcome" "logOutcome" NOT NULL DEFAULT 'Unknown',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubPermission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SubPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuditLog" (
    "auditLogId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAuditLog_pkey" PRIMARY KEY ("auditLogId","userId")
);

-- CreateTable
CREATE TABLE "PermissionSubPermission" (
    "permissionId" TEXT NOT NULL,
    "subPermissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PermissionSubPermission_pkey" PRIMARY KEY ("permissionId","subPermissionId")
);

-- CreateTable
CREATE TABLE "ResourceManager" (
    "resourceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceManager_pkey" PRIMARY KEY ("resourceId","userId")
);

-- CreateTable
CREATE TABLE "ResourceEditor" (
    "resourceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceEditor_pkey" PRIMARY KEY ("resourceId","userId")
);

-- CreateTable
CREATE TABLE "ResourceVerifier" (
    "resourceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stage" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceVerifier_pkey" PRIMARY KEY ("resourceId","userId")
);

-- CreateTable
CREATE TABLE "ResourcePublisher" (
    "resourceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourcePublisher_pkey" PRIMARY KEY ("resourceId","userId")
);

-- CreateTable
CREATE TABLE "ResourceType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ResourceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ResourceTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageResource" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,

    CONSTRAINT "PageResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RoleType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_id_idx" ON "AuditLog"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuditLog_auditLogId_key" ON "UserAuditLog"("auditLogId");

-- CreateIndex
CREATE INDEX "UserAuditLog_auditLogId_idx" ON "UserAuditLog"("auditLogId");

-- CreateIndex
CREATE INDEX "UserAuditLog_userId_idx" ON "UserAuditLog"("userId");

-- CreateIndex
CREATE INDEX "PermissionSubPermission_permissionId_idx" ON "PermissionSubPermission"("permissionId");

-- CreateIndex
CREATE INDEX "PermissionSubPermission_subPermissionId_idx" ON "PermissionSubPermission"("subPermissionId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceManager_resourceId_key" ON "ResourceManager"("resourceId");

-- CreateIndex
CREATE INDEX "ResourceManager_resourceId_idx" ON "ResourceManager"("resourceId");

-- CreateIndex
CREATE INDEX "ResourceManager_userId_idx" ON "ResourceManager"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceEditor_resourceId_key" ON "ResourceEditor"("resourceId");

-- CreateIndex
CREATE INDEX "ResourceEditor_resourceId_idx" ON "ResourceEditor"("resourceId");

-- CreateIndex
CREATE INDEX "ResourceEditor_userId_idx" ON "ResourceEditor"("userId");

-- CreateIndex
CREATE INDEX "ResourceVerifier_resourceId_idx" ON "ResourceVerifier"("resourceId");

-- CreateIndex
CREATE INDEX "ResourceVerifier_userId_idx" ON "ResourceVerifier"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourcePublisher_resourceId_key" ON "ResourcePublisher"("resourceId");

-- CreateIndex
CREATE INDEX "ResourcePublisher_resourceId_idx" ON "ResourcePublisher"("resourceId");

-- CreateIndex
CREATE INDEX "ResourcePublisher_userId_idx" ON "ResourcePublisher"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceType_name_key" ON "ResourceType"("name");

-- CreateIndex
CREATE INDEX "Resource_id_idx" ON "Resource"("id");

-- CreateIndex
CREATE INDEX "Resource_ResourceTypeId_idx" ON "Resource"("ResourceTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleType_name_key" ON "RoleType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Page_name_key" ON "Page"("name");

-- CreateIndex
CREATE INDEX "Permission_roleTypeId_idx" ON "Permission"("roleTypeId");

-- CreateIndex
CREATE INDEX "Role_roleTypeId_idx" ON "Role"("roleTypeId");

-- CreateIndex
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE INDEX "UserRole_userId_idx" ON "UserRole"("userId");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");
