-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otpExpiry" TIMESTAMP(3),
ADD COLUMN     "otpString" TEXT;
