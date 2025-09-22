/*
  Warnings:

  - You are about to drop the column `brandColor` on the `QuotationTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `headerFont` on the `QuotationTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `QuotationTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `signatureUrl` on the `QuotationTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."QuotationTemplate" DROP COLUMN "brandColor",
DROP COLUMN "headerFont",
DROP COLUMN "logoUrl",
DROP COLUMN "signatureUrl",
ADD COLUMN     "companyPhone" TEXT;
