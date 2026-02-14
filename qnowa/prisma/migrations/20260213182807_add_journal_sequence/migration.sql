-- CreateTable
CREATE TABLE "JournalSequence" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lastNo" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalSequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JournalSequence_orgId_year_key" ON "JournalSequence"("orgId", "year");
