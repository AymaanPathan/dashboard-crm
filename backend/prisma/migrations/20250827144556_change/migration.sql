/*
  Warnings:

  - You are about to drop the column `statuses` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Organization" DROP COLUMN "statuses",
ADD COLUMN     "stages" JSONB NOT NULL DEFAULT '[]';
