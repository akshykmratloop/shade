/*
  Warnings:

  - You are about to drop the column `autoApprovalTome` on the `Resource` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "autoApprovalTome",
ADD COLUMN     "autoApprovalTime" INTEGER;
