-- AlterTable
ALTER TABLE "SubPermission" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "SubPermission_id_idx" ON "SubPermission"("id");
