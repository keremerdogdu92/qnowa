-- CreateEnum
CREATE TYPE "ZReportStatus" AS ENUM ('PENDING', 'PROCESSED', 'ERROR');

-- CreateTable
CREATE TABLE "ZReport" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "totalAmount" DECIMAL(18,2),
    "vatTotal" DECIMAL(18,2),
    "status" "ZReportStatus" NOT NULL DEFAULT 'PENDING',
    "ocrData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZReport_orgId_date_key" ON "ZReport"("orgId", "date");

-- AddForeignKey
ALTER TABLE "ZReport" ADD CONSTRAINT "ZReport_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
