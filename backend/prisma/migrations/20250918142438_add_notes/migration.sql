/*
  Warnings:

  - You are about to drop the column `notes` on the `Lead` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Lead" DROP COLUMN "notes";

-- CreateTable
CREATE TABLE "public"."LeadNotes" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadNotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadNotes_leadId_timestamp_idx" ON "public"."LeadNotes"("leadId", "timestamp");

-- AddForeignKey
ALTER TABLE "public"."LeadNotes" ADD CONSTRAINT "LeadNotes_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
