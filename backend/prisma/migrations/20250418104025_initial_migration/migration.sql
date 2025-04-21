-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('PUBLISHED', 'ARCHIVED', 'TRASHED');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'TRASHED');

-- CreateEnum
CREATE TYPE "otpOrigin" AS ENUM ('MFA_Login', 'forgot_Pass', 'NULL');

-- CreateEnum
CREATE TYPE "logOutcome" AS ENUM ('Success', 'Failure', 'Unknown');

-- CreateEnum
CREATE TYPE "logAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'NULL');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('MAIN_PAGE', 'PAGE_ITEM', 'FORM', 'HEADER', 'FOOTER', 'NULL');

-- CreateEnum
CREATE TYPE "ResourceTag" AS ENUM ('HOME', 'ABOUT', 'SOLUTION', 'SERVICE', 'MARKET', 'PROJECT', 'CAREER', 'NEWS', 'TESTIMONIAL', 'CONTACT', 'NULL');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('PARENT', 'CHILD', 'NULL');

-- CreateEnum
CREATE TYPE "VersionStatus" AS ENUM ('EDITING', 'DRAFT', 'VERIFICATION_PENDING', 'PUBLISH_PENDING', 'ARCHIVED', 'SCHEDULED', 'PUBLISHED', 'NULL');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('HERO_BANNER', 'CARD_GRID', 'STATISTICS', 'TESTIMONIALS', 'CLIENT_LOGOS', 'CONTACT_FORM', 'MARKDOWN_CONTENT', 'SERVICE_CARDS', 'PROJECT_GRID', 'TEAM', 'CLIENTS', 'MARKETS', 'CAREER_LISTING', 'NEWS_FEED', 'FOOTER_COLUMNS', 'HEADER_NAV');

-- CreateEnum
CREATE TYPE "ResourceRoleType" AS ENUM ('MANAGER', 'EDITOR', 'PUBLISHER');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('VERIFICATION', 'PUBLICATION');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO');

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action_performed" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
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
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "altText" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resourceId" TEXT NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "role" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "otpCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "otpOrigin" "otpOrigin" NOT NULL DEFAULT 'NULL',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubPermission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "SubPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "roleTypeId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "failures" INTEGER NOT NULL DEFAULT 0,
    "lastAttempt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockUntil" TIMESTAMP(3),

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "UserAuditLog" (
    "auditLogId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAuditLog_pkey" PRIMARY KEY ("auditLogId","userId")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "PermissionSubPermission" (
    "permissionId" TEXT NOT NULL,
    "subPermissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PermissionSubPermission_pkey" PRIMARY KEY ("permissionId","subPermissionId")
);

-- CreateTable
CREATE TABLE "ResourceVersionSection" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "resourceVersionId" TEXT NOT NULL,
    "sectionVersionId" TEXT NOT NULL,

    CONSTRAINT "ResourceVersionSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionVersionItem" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "sectionVersionId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,

    CONSTRAINT "SectionVersionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceRole" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ResourceRoleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceVersionRole" (
    "id" TEXT NOT NULL,
    "role" "ResourceRoleType" NOT NULL,
    "resourceVersionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceVersionRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceVerifier" (
    "id" TEXT NOT NULL,
    "stage" INTEGER NOT NULL,
    "resourceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceVerifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceVersionVerifier" (
    "id" TEXT NOT NULL,
    "stage" INTEGER NOT NULL,
    "resourceVersionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceVersionVerifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceVersioningRequest" (
    "id" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "type" "RequestType" NOT NULL,
    "editorComments" TEXT,
    "resourceVersionId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "previousRequestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceVersioningRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestApproval" (
    "id" TEXT NOT NULL,
    "stage" INTEGER,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "requestId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowState" (
    "id" TEXT NOT NULL,
    "fromState" "VersionStatus" NOT NULL,
    "toState" "VersionStatus" NOT NULL,
    "allowedRole" "ResourceRoleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "resourceType" "ResourceType" NOT NULL DEFAULT 'NULL',
    "resourceTag" "ResourceTag" NOT NULL DEFAULT 'NULL',
    "relationType" "RelationType" NOT NULL DEFAULT 'NULL',
    "isAssigned" BOOLEAN NOT NULL DEFAULT false,
    "liveVersionId" TEXT,
    "newVersionEditModeId" TEXT,
    "scheduledVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceVersion" (
    "id" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "versionStatus" "VersionStatus" NOT NULL DEFAULT 'NULL',
    "notes" TEXT,
    "content" JSONB NOT NULL,
    "lockedById" TEXT,
    "lockedAt" TIMESTAMP(3),
    "resourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "ResourceVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RoleType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "roleTypeId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "SectionType" NOT NULL,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionVersion" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "heading" TEXT,
    "description" TEXT,
    "content" JSONB NOT NULL,
    "sectionId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "resourceVersionId" TEXT NOT NULL,

    CONSTRAINT "SectionVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SEO" (
    "id" SERIAL NOT NULL,
    "metaTitle" JSONB NOT NULL,
    "metaDescription" JSONB NOT NULL,
    "keywords" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resourceId" TEXT NOT NULL,

    CONSTRAINT "SEO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isSuperUser" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "phone" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_id_idx" ON "AuditLog"("id");

-- CreateIndex
CREATE INDEX "Media_resourceId_idx" ON "Media"("resourceId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "user_device_origin_idx" ON "Otp"("userId", "deviceId", "otpOrigin");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_userId_deviceId_otpOrigin_key" ON "Otp"("userId", "deviceId", "otpOrigin");

-- CreateIndex
CREATE UNIQUE INDEX "SubPermission_name_key" ON "SubPermission"("name");

-- CreateIndex
CREATE INDEX "SubPermission_id_idx" ON "SubPermission"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE INDEX "Permission_name_idx" ON "Permission"("name");

-- CreateIndex
CREATE INDEX "Permission_roleTypeId_idx" ON "Permission"("roleTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "RateLimit_userId_key" ON "RateLimit"("userId");

-- CreateIndex
CREATE INDEX "RateLimit_userId_idx" ON "RateLimit"("userId");

-- CreateIndex
CREATE INDEX "UserRole_userId_idx" ON "UserRole"("userId");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuditLog_auditLogId_key" ON "UserAuditLog"("auditLogId");

-- CreateIndex
CREATE INDEX "UserAuditLog_auditLogId_idx" ON "UserAuditLog"("auditLogId");

-- CreateIndex
CREATE INDEX "UserAuditLog_userId_idx" ON "UserAuditLog"("userId");

-- CreateIndex
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE INDEX "PermissionSubPermission_permissionId_idx" ON "PermissionSubPermission"("permissionId");

-- CreateIndex
CREATE INDEX "PermissionSubPermission_subPermissionId_idx" ON "PermissionSubPermission"("subPermissionId");

-- CreateIndex
CREATE INDEX "ResourceVersionSection_resourceVersionId_order_idx" ON "ResourceVersionSection"("resourceVersionId", "order");

-- CreateIndex
CREATE INDEX "ResourceVersionSection_resourceVersionId_idx" ON "ResourceVersionSection"("resourceVersionId");

-- CreateIndex
CREATE INDEX "ResourceVersionSection_sectionVersionId_idx" ON "ResourceVersionSection"("sectionVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVersionSection_resourceVersionId_sectionVersionId_key" ON "ResourceVersionSection"("resourceVersionId", "sectionVersionId");

-- CreateIndex
CREATE INDEX "SectionVersionItem_sectionVersionId_order_idx" ON "SectionVersionItem"("sectionVersionId", "order");

-- CreateIndex
CREATE INDEX "SectionVersionItem_sectionVersionId_idx" ON "SectionVersionItem"("sectionVersionId");

-- CreateIndex
CREATE INDEX "SectionVersionItem_resourceId_idx" ON "SectionVersionItem"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "SectionVersionItem_sectionVersionId_resourceId_key" ON "SectionVersionItem"("sectionVersionId", "resourceId");

-- CreateIndex
CREATE INDEX "ResourceRole_resourceId_idx" ON "ResourceRole"("resourceId");

-- CreateIndex
CREATE INDEX "ResourceRole_userId_idx" ON "ResourceRole"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceRole_resourceId_userId_key" ON "ResourceRole"("resourceId", "userId");

-- CreateIndex
CREATE INDEX "ResourceVersionRole_resourceVersionId_idx" ON "ResourceVersionRole"("resourceVersionId");

-- CreateIndex
CREATE INDEX "ResourceVersionRole_userId_idx" ON "ResourceVersionRole"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVersionRole_resourceVersionId_userId_key" ON "ResourceVersionRole"("resourceVersionId", "userId");

-- CreateIndex
CREATE INDEX "ResourceVerifier_resourceId_stage_idx" ON "ResourceVerifier"("resourceId", "stage");

-- CreateIndex
CREATE INDEX "ResourceVerifier_userId_idx" ON "ResourceVerifier"("userId");

-- CreateIndex
CREATE INDEX "ResourceVerifier_resourceId_idx" ON "ResourceVerifier"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVerifier_resourceId_stage_userId_key" ON "ResourceVerifier"("resourceId", "stage", "userId");

-- CreateIndex
CREATE INDEX "ResourceVersionVerifier_resourceVersionId_stage_idx" ON "ResourceVersionVerifier"("resourceVersionId", "stage");

-- CreateIndex
CREATE INDEX "ResourceVersionVerifier_resourceVersionId_idx" ON "ResourceVersionVerifier"("resourceVersionId");

-- CreateIndex
CREATE INDEX "ResourceVersionVerifier_userId_idx" ON "ResourceVersionVerifier"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVersionVerifier_resourceVersionId_stage_userId_key" ON "ResourceVersionVerifier"("resourceVersionId", "stage", "userId");

-- CreateIndex
CREATE INDEX "ResourceVersioningRequest_resourceVersionId_idx" ON "ResourceVersioningRequest"("resourceVersionId");

-- CreateIndex
CREATE INDEX "ResourceVersioningRequest_senderId_idx" ON "ResourceVersioningRequest"("senderId");

-- CreateIndex
CREATE INDEX "ResourceVersioningRequest_previousRequestId_idx" ON "ResourceVersioningRequest"("previousRequestId");

-- CreateIndex
CREATE INDEX "ResourceVersioningRequest_resourceVersionId_status_idx" ON "ResourceVersioningRequest"("resourceVersionId", "status");

-- CreateIndex
CREATE INDEX "ResourceVersioningRequest_status_type_idx" ON "ResourceVersioningRequest"("status", "type");

-- CreateIndex
CREATE INDEX "RequestApproval_requestId_status_idx" ON "RequestApproval"("requestId", "status");

-- CreateIndex
CREATE INDEX "RequestApproval_approverId_idx" ON "RequestApproval"("approverId");

-- CreateIndex
CREATE INDEX "RequestApproval_requestId_idx" ON "RequestApproval"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "RequestApproval_requestId_approverId_stage_key" ON "RequestApproval"("requestId", "approverId", "stage");

-- CreateIndex
CREATE INDEX "WorkflowState_fromState_idx" ON "WorkflowState"("fromState");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowState_fromState_toState_allowedRole_key" ON "WorkflowState"("fromState", "toState", "allowedRole");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_slug_key" ON "Resource"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_liveVersionId_key" ON "Resource"("liveVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_newVersionEditModeId_key" ON "Resource"("newVersionEditModeId");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_scheduledVersionId_key" ON "Resource"("scheduledVersionId");

-- CreateIndex
CREATE INDEX "Resource_resourceType_status_idx" ON "Resource"("resourceType", "status");

-- CreateIndex
CREATE INDEX "Resource_slug_idx" ON "Resource"("slug");

-- CreateIndex
CREATE INDEX "Resource_scheduledVersionId_idx" ON "Resource"("scheduledVersionId");

-- CreateIndex
CREATE INDEX "ResourceVersion_resourceId_versionStatus_idx" ON "ResourceVersion"("resourceId", "versionStatus");

-- CreateIndex
CREATE INDEX "ResourceVersion_scheduledAt_idx" ON "ResourceVersion"("scheduledAt");

-- CreateIndex
CREATE INDEX "ResourceVersion_publishedAt_idx" ON "ResourceVersion"("publishedAt");

-- CreateIndex
CREATE INDEX "ResourceVersion_lockedById_idx" ON "ResourceVersion"("lockedById");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceVersion_resourceId_versionNumber_key" ON "ResourceVersion"("resourceId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RoleType_name_key" ON "RoleType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Role_name_idx" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Role_roleTypeId_idx" ON "Role"("roleTypeId");

-- CreateIndex
CREATE INDEX "Section_type_idx" ON "Section"("type");

-- CreateIndex
CREATE INDEX "Section_isGlobal_idx" ON "Section"("isGlobal");

-- CreateIndex
CREATE INDEX "SectionVersion_sectionId_resourceId_idx" ON "SectionVersion"("sectionId", "resourceId");

-- CreateIndex
CREATE INDEX "SectionVersion_resourceVersionId_idx" ON "SectionVersion"("resourceVersionId");

-- CreateIndex
CREATE INDEX "SectionVersion_sectionId_idx" ON "SectionVersion"("sectionId");

-- CreateIndex
CREATE INDEX "SectionVersion_resourceId_idx" ON "SectionVersion"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "SectionVersion_sectionId_resourceId_version_key" ON "SectionVersion"("sectionId", "resourceId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "SEO_resourceId_key" ON "SEO"("resourceId");

-- CreateIndex
CREATE INDEX "SEO_resourceId_idx" ON "SEO"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");
