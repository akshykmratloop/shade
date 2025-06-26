/*
  Warnings:

  - The values [ARCHIVED] on the enum `VersionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "ResourceTag" ADD VALUE 'BOXES';

-- AlterEnum
BEGIN;
CREATE TYPE "VersionStatus_new" AS ENUM ('EDITING', 'DRAFT', 'VERIFICATION_PENDING', 'REJECTED', 'PUBLISH_PENDING', 'SCHEDULED', 'PUBLISHED', 'LIVE', 'NULL');
ALTER TABLE "ResourceVersion" ALTER COLUMN "versionStatus" DROP DEFAULT;
ALTER TABLE "WorkflowState" ALTER COLUMN "fromState" TYPE "VersionStatus_new" USING ("fromState"::text::"VersionStatus_new");
ALTER TABLE "WorkflowState" ALTER COLUMN "toState" TYPE "VersionStatus_new" USING ("toState"::text::"VersionStatus_new");
ALTER TABLE "ResourceVersion" ALTER COLUMN "versionStatus" TYPE "VersionStatus_new" USING ("versionStatus"::text::"VersionStatus_new");
ALTER TYPE "VersionStatus" RENAME TO "VersionStatus_old";
ALTER TYPE "VersionStatus_new" RENAME TO "VersionStatus";
DROP TYPE "VersionStatus_old";
ALTER TABLE "ResourceVersion" ALTER COLUMN "versionStatus" SET DEFAULT 'NULL';
COMMIT;
