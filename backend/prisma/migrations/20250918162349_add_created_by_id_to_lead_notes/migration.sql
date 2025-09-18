/*
  Warnings:

  - You are about to drop the column `userId` on the `LeadNotes` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `LeadNotes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."LeadNotes" DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
