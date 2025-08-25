-- CreateTable
CREATE TABLE "public"."Status" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leadIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Status" ADD CONSTRAINT "Status_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
