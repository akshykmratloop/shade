/*
  Warnings:

  - The values [PAGE_ITEM] on the enum `ResourceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ResourceType_new" AS ENUM ('MAIN_PAGE', 'SUB_PAGE', 'SUB_PAGE_ITEM', 'FORM', 'HEADER', 'FOOTER', 'NULL');
ALTER TABLE "Resource" ALTER COLUMN "resourceType" DROP DEFAULT;
ALTER TABLE "Resource" ALTER COLUMN "resourceType" TYPE "ResourceType_new" USING ("resourceType"::text::"ResourceType_new");
ALTER TYPE "ResourceType" RENAME TO "ResourceType_old";
ALTER TYPE "ResourceType_new" RENAME TO "ResourceType";
DROP TYPE "ResourceType_old";
ALTER TABLE "Resource" ALTER COLUMN "resourceType" SET DEFAULT 'NULL';
COMMIT;
