/*
  Warnings:

  - The `status` column on the `Fatura` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `Fatura` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `MaliDonem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `journalNo` on the `MuhasebeFisi` table. All the data in the column will be lost.
  - The `status` column on the `MuhasebeFisi` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `JournalSequence` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orgId,periodYear,yevmiyeNo]` on the table `MuhasebeFisi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `yevmiyeNo` to the `MuhasebeFisi` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FaturaDurumu" AS ENUM ('TASLAK', 'ONAYLI', 'GONDERILDI', 'IPTAL');

-- CreateEnum
CREATE TYPE "FaturaTipi" AS ENUM ('SATIS', 'ALIS');

-- CreateEnum
CREATE TYPE "FisDurumu" AS ENUM ('TASLAK', 'ONAYLI');

-- CreateEnum
CREATE TYPE "DonemDurumu" AS ENUM ('ACIK', 'GECICI_KAPALI', 'KESIN_KAPALI');

-- DropIndex
DROP INDEX "MuhasebeFisi_orgId_periodYear_journalNo_key";

-- AlterTable
ALTER TABLE "Fatura" DROP COLUMN "status",
ADD COLUMN     "status" "FaturaDurumu" NOT NULL DEFAULT 'TASLAK',
DROP COLUMN "type",
ADD COLUMN     "type" "FaturaTipi" NOT NULL DEFAULT 'SATIS';

-- AlterTable
ALTER TABLE "MaliDonem" DROP COLUMN "status",
ADD COLUMN     "status" "DonemDurumu" NOT NULL DEFAULT 'ACIK';

-- AlterTable
ALTER TABLE "MuhasebeFisi" DROP COLUMN "journalNo",
ADD COLUMN     "yevmiyeNo" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "FisDurumu" NOT NULL DEFAULT 'TASLAK';

-- DropTable
DROP TABLE "JournalSequence";

-- DropEnum
DROP TYPE "FaturaStatus";

-- DropEnum
DROP TYPE "FaturaType";

-- DropEnum
DROP TYPE "JournalStatus";

-- DropEnum
DROP TYPE "PeriodStatus";

-- CreateTable
CREATE TABLE "YevmiyeSequence" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lastNo" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YevmiyeSequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YevmiyeSequence_orgId_year_key" ON "YevmiyeSequence"("orgId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "MuhasebeFisi_orgId_periodYear_yevmiyeNo_key" ON "MuhasebeFisi"("orgId", "periodYear", "yevmiyeNo");
