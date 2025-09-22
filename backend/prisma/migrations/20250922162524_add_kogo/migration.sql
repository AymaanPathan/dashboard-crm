/*
  Warnings:

  - You are about to drop the column `companyPhone` on the `QuotationTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."QuotationTemplate" DROP COLUMN "companyPhone",
ADD COLUMN     "brandColor" TEXT,
ADD COLUMN     "headerFont" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "signatureUrl" TEXT;
