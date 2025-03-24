/*
  Warnings:

  - Added the required column `action_performed` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "action_performed" TEXT NOT NULL;
