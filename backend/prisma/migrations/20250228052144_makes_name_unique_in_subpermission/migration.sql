/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `SubPermission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SubPermission_name_key" ON "SubPermission"("name");
