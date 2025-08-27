-- AlterTable
ALTER TABLE "public"."Lead" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Lead_organizationId_status_position_idx" ON "public"."Lead"("organizationId", "status", "position");
