-- AlterTable
ALTER TABLE "public"."Lead" ADD COLUMN     "createdBy" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
