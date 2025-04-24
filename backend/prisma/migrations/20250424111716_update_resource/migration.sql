/*
  Warnings:

  - You are about to drop the column `icon` on the `Resource` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "icon";

-- AlterTable
ALTER TABLE "ResourceVersion" ADD COLUMN     "Image" TEXT,
ADD COLUMN     "icon" TEXT;
