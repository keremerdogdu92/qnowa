/*
  Warnings:

  - You are about to drop the `FiscalPeriod` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "FiscalPeriod";

-- CreateTable
CREATE TABLE "MaliDonem" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "status" "PeriodStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaliDonem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MaliDonem_orgId_year_month_key" ON "MaliDonem"("orgId", "year", "month");
