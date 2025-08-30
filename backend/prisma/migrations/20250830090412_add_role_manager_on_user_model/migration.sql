-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('admin', 'sales_manager', 'sales_rep', 'telecaller', 'finance', 'ops');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "managerId" TEXT,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'sales_rep';

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
