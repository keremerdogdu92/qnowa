-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ACCOUNTANT', 'USER');

-- CreateEnum
CREATE TYPE "FaturaStatus" AS ENUM ('DRAFT', 'FINALIZED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FaturaType" AS ENUM ('SATIS', 'ALIS');

-- CreateEnum
CREATE TYPE "CariType" AS ENUM ('CUSTOMER', 'SUPPLIER', 'BOTH');

-- CreateEnum
CREATE TYPE "JournalStatus" AS ENUM ('DRAFT', 'POSTED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "orgId" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taxNumber" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fatura" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "faturaNo" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "FaturaStatus" NOT NULL DEFAULT 'DRAFT',
    "type" "FaturaType" NOT NULL DEFAULT 'SATIS',
    "partyId" TEXT NOT NULL,
    "subTotal" DECIMAL(18,2) NOT NULL,
    "taxTotal" DECIMAL(18,2) NOT NULL,
    "grandTotal" DECIMAL(18,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaturaSatir" (
    "id" TEXT NOT NULL,
    "faturaId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "unitPrice" DECIMAL(18,2) NOT NULL,
    "taxRate" INTEGER NOT NULL,
    "total" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "FaturaSatir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cari" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taxNumber" TEXT,
    "type" "CariType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YevmiyeFisi" (
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

    CONSTRAINT "YevmiyeFisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YevmiyeSatir" (
    "id" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "description" TEXT,
    "debit" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "credit" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "YevmiyeSatir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HesapPlani" (
    "id" TEXT NOT NULL,
    "orgId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentCode" TEXT,

    CONSTRAINT "HesapPlani_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outbox" (
    "id" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "Outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_taxNumber_key" ON "Organization"("taxNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Fatura_orgId_faturaNo_key" ON "Fatura"("orgId", "faturaNo");

-- CreateIndex
CREATE UNIQUE INDEX "YevmiyeFisi_orgId_journalNo_periodYear_key" ON "YevmiyeFisi"("orgId", "journalNo", "periodYear");

-- CreateIndex
CREATE UNIQUE INDEX "HesapPlani_orgId_code_key" ON "HesapPlani"("orgId", "code");

-- CreateIndex
CREATE INDEX "Outbox_processedAt_idx" ON "Outbox"("processedAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fatura" ADD CONSTRAINT "Fatura_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fatura" ADD CONSTRAINT "Fatura_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Cari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaturaSatir" ADD CONSTRAINT "FaturaSatir_faturaId_fkey" FOREIGN KEY ("faturaId") REFERENCES "Fatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cari" ADD CONSTRAINT "Cari_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YevmiyeFisi" ADD CONSTRAINT "YevmiyeFisi_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YevmiyeSatir" ADD CONSTRAINT "YevmiyeSatir_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "YevmiyeFisi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YevmiyeSatir" ADD CONSTRAINT "YevmiyeSatir_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "HesapPlani"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HesapPlani" ADD CONSTRAINT "HesapPlani_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
