/*
  Warnings:

  - You are about to drop the column `amount` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `paymentProofUrl` on the `Payment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Payment_orderId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amount",
DROP COLUMN "paymentProofUrl",
ADD COLUMN     "amountPaid" DOUBLE PRECISION,
ADD COLUMN     "method" TEXT,
ADD COLUMN     "paymentProofUrls" TEXT[],
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");
