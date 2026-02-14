/*
  Warnings:

  - You are about to drop the column `partyId` on the `Fatura` table. All the data in the column will be lost.
  - Added the required column `cariId` to the `Fatura` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Fatura" DROP CONSTRAINT "Fatura_partyId_fkey";

-- AlterTable
ALTER TABLE "Fatura" DROP COLUMN "partyId",
ADD COLUMN     "cariId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Fatura" ADD CONSTRAINT "Fatura_cariId_fkey" FOREIGN KEY ("cariId") REFERENCES "Cari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
