/*
  Warnings:

  - You are about to drop the column `type` on the `Section` table. All the data in the column will be lost.
  - Added the required column `SectionType` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Section_type_idx";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "type",
ADD COLUMN     "SectionType" "SectionType" NOT NULL;

-- CreateIndex
CREATE INDEX "Section_SectionType_idx" ON "Section"("SectionType");
