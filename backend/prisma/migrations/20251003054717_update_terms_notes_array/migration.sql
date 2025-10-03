/*
  Warnings:

  - The `termsAndConditions` column on the `QuotationTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `defaultNotes` column on the `QuotationTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."QuotationTemplate" DROP COLUMN "termsAndConditions",
ADD COLUMN     "termsAndConditions" TEXT[],
DROP COLUMN "defaultNotes",
ADD COLUMN     "defaultNotes" TEXT[];
