/*
  Warnings:

  - You are about to drop the column `SectionType` on the `Section` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Section` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sectionTypeId` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ResourceTag" ADD VALUE 'SAFETY_RESPONSIBILITY';

-- DropIndex
DROP INDEX "Section_SectionType_idx";

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "SectionType",
ADD COLUMN     "sectionTypeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SectionVersion" ADD COLUMN     "icon" TEXT,
ADD COLUMN     "parentVersionId" TEXT;

-- DropEnum
DROP TYPE "SectionType";

-- CreateTable
CREATE TABLE "SectionType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SectionType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SectionType_name_key" ON "SectionType"("name");

-- CreateIndex
CREATE INDEX "SectionType_name_idx" ON "SectionType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Section_title_key" ON "Section"("title");

-- CreateIndex
CREATE INDEX "Section_sectionTypeId_idx" ON "Section"("sectionTypeId");

-- CreateIndex
CREATE INDEX "SectionVersion_parentVersionId_idx" ON "SectionVersion"("parentVersionId");
