-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "autoApproval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoApprovalTome" INTEGER;
