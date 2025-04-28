/*
  Warnings:

  - You are about to drop the column `description` on the `SectionVersion` table. All the data in the column will be lost.
  - You are about to drop the column `heading` on the `SectionVersion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SectionVersion" DROP COLUMN "description",
DROP COLUMN "heading",
ADD COLUMN     "sectionVersionTitle" TEXT;
