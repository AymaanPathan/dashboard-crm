-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "currentOrganizationId" TEXT;

-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" TEXT NOT NULL,
    "organization_name" TEXT NOT NULL,
    "company_website" TEXT,
    "industry" TEXT NOT NULL,
    "company_size" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_currentOrganizationId_fkey" FOREIGN KEY ("currentOrganizationId") REFERENCES "public"."Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
