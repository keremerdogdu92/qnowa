-- CreateEnum
CREATE TYPE "InstrumentType" AS ENUM ('CEK', 'SENET');

-- AlterTable
ALTER TABLE "Cheque" ADD COLUMN     "instrument" "InstrumentType" NOT NULL DEFAULT 'CEK';
