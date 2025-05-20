-- AlterTable
ALTER TABLE "RequestApproval" ADD COLUMN     "isApproverActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "parentId" TEXT;

-- CreateTable
CREATE TABLE "Filters" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Filters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FiltersToResource" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FiltersToResource_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FiltersToResource_B_index" ON "_FiltersToResource"("B");

-- CreateIndex
CREATE INDEX "Resource_parentId_idx" ON "Resource"("parentId");
