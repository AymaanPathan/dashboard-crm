/*
  Warnings:

  - You are about to drop the column `status` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `stages` on the `Organization` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Lead_organizationId_status_position_idx";

-- AlterTable
ALTER TABLE "public"."Lead" DROP COLUMN "status",
ADD COLUMN     "stageId" TEXT;

-- AlterTable
ALTER TABLE "public"."Organization" DROP COLUMN "stages";

-- CreateTable
CREATE TABLE "public"."Stage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_organizationId_stageId_position_idx" ON "public"."Lead"("organizationId", "stageId", "position");

-- AddForeignKey
ALTER TABLE "public"."Stage" ADD CONSTRAINT "Stage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "public"."Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
