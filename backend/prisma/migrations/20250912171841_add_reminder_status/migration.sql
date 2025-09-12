-- CreateEnum
CREATE TYPE "public"."ReminderStatus" AS ENUM ('pending', 'seen', 'missed');

-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "reminderStatus" "public"."ReminderStatus" NOT NULL DEFAULT 'pending';
