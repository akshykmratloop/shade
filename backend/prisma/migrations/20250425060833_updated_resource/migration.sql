/*
  Warnings:

  - You are about to drop the column `title` on the `Resource` table. All the data in the column will be lost.
  - Added the required column `titleAr` to the `Resource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleEn` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "title",
ADD COLUMN     "titleAr" TEXT NOT NULL,
ADD COLUMN     "titleEn" TEXT NOT NULL;
