/*
  Warnings:

  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Status" DROP CONSTRAINT "Status_organizationId_fkey";

-- AlterTable
ALTER TABLE "public"."Organization" ADD COLUMN     "statuses" JSONB NOT NULL DEFAULT '[]';

-- DropTable
DROP TABLE "public"."Status";
