/*
  Warnings:

  - A unique constraint covering the columns `[nameEn]` on the table `Filters` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameAr]` on the table `Filters` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameEn,nameAr]` on the table `Filters` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Filters_nameEn_key" ON "Filters"("nameEn");

-- CreateIndex
CREATE UNIQUE INDEX "Filters_nameAr_key" ON "Filters"("nameAr");

-- CreateIndex
CREATE UNIQUE INDEX "Filters_nameEn_nameAr_key" ON "Filters"("nameEn", "nameAr");
