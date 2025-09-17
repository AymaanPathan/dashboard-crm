-- CreateTable
CREATE TABLE "public"."LeadLog" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,

    CONSTRAINT "LeadLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadLog_leadId_timestamp_idx" ON "public"."LeadLog"("leadId", "timestamp");

-- AddForeignKey
ALTER TABLE "public"."LeadLog" ADD CONSTRAINT "LeadLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
