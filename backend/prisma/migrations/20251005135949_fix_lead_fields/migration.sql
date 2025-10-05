-- Fix existing NULL company values
UPDATE "Lead"
SET "company" = 'Unknown'
WHERE "company" IS NULL;

-- Fix existing NULL leadType values
UPDATE "Lead"
SET "leadType" = 'Hot'
WHERE "leadType" IS NULL;

/*
  Warnings:

  - You are about to drop the column `budget` on the `Lead` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `source` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `leadType` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactPersonName` on table `Lead` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Lead" DROP COLUMN "budget",
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "company" SET NOT NULL,
ALTER COLUMN "company" SET DEFAULT 'Unknown',
ALTER COLUMN "source" SET NOT NULL,
ALTER COLUMN "leadType" SET NOT NULL,
ALTER COLUMN "leadType" SET DEFAULT 'Hot',
ALTER COLUMN "contactPersonName" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "public"."Lead"("email");
