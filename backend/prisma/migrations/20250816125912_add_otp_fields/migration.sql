/*
  Warnings:

  - You are about to drop the column `otpString` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "otpString",
ADD COLUMN     "otp" TEXT;
