/*
  Warnings:

  - The values [VISION_MISSION] on the enum `ResourceTag` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ResourceTag_new" AS ENUM ('HOME', 'ABOUT', 'SOLUTION', 'SERVICE', 'MARKET', 'PROJECT', 'CAREER', 'NEWS', 'TESTIMONIAL', 'CONTACT', 'HEADER', 'FOOTER', 'HISTORY', 'SAFETY_RESPONSIBILITY', 'VISION', 'NULL');
ALTER TABLE "Resource" ALTER COLUMN "resourceTag" DROP DEFAULT;
ALTER TABLE "Resource" ALTER COLUMN "resourceTag" TYPE "ResourceTag_new" USING ("resourceTag"::text::"ResourceTag_new");
ALTER TYPE "ResourceTag" RENAME TO "ResourceTag_old";
ALTER TYPE "ResourceTag_new" RENAME TO "ResourceTag";
DROP TYPE "ResourceTag_old";
ALTER TABLE "Resource" ALTER COLUMN "resourceTag" SET DEFAULT 'NULL';
COMMIT;
