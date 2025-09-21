-- CreateTable
CREATE TABLE "public"."QuotationTemplate" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "templateType" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "headerFont" TEXT,
    "brandColor" TEXT,
    "signatureUrl" TEXT,
    "termsAndConditions" TEXT,
    "bankDetails" JSONB,
    "defaultNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "previewUrl" TEXT,

    CONSTRAINT "QuotationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quotation" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "templateId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerCompany" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "items" JSONB NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "quoteNumber" TEXT NOT NULL,
    "isOrder" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."QuotationTemplate" ADD CONSTRAINT "QuotationTemplate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quotation" ADD CONSTRAINT "Quotation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quotation" ADD CONSTRAINT "Quotation_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."QuotationTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
