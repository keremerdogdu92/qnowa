/*
  Warnings:

  - You are about to drop the `YevmiyeFisi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `YevmiyeSatir` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "YevmiyeFisi" DROP CONSTRAINT "YevmiyeFisi_orgId_fkey";

-- DropForeignKey
ALTER TABLE "YevmiyeSatir" DROP CONSTRAINT "YevmiyeSatir_accountId_fkey";

-- DropForeignKey
ALTER TABLE "YevmiyeSatir" DROP CONSTRAINT "YevmiyeSatir_journalId_fkey";

-- DropTable
DROP TABLE "YevmiyeFisi";

-- DropTable
DROP TABLE "YevmiyeSatir";

-- CreateTable
CREATE TABLE "MuhasebeFisi" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "journalNo" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "status" "JournalStatus" NOT NULL DEFAULT 'DRAFT',
    "periodMonth" INTEGER NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MuhasebeFisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuhasebeFisiSatir" (
    "id" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "description" TEXT,
    "debit" DECIMAL(18,2) NOT NULL,
    "credit" DECIMAL(18,2) NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "MuhasebeFisiSatir_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MuhasebeFisi_orgId_date_idx" ON "MuhasebeFisi"("orgId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MuhasebeFisi_orgId_periodYear_journalNo_key" ON "MuhasebeFisi"("orgId", "periodYear", "journalNo");

-- CreateIndex
CREATE INDEX "MuhasebeFisiSatir_journalId_idx" ON "MuhasebeFisiSatir"("journalId");

-- CreateIndex
CREATE INDEX "MuhasebeFisiSatir_accountId_idx" ON "MuhasebeFisiSatir"("accountId");

-- AddForeignKey
ALTER TABLE "MuhasebeFisi" ADD CONSTRAINT "MuhasebeFisi_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuhasebeFisiSatir" ADD CONSTRAINT "MuhasebeFisiSatir_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "MuhasebeFisi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuhasebeFisiSatir" ADD CONSTRAINT "MuhasebeFisiSatir_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "HesapPlani"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
