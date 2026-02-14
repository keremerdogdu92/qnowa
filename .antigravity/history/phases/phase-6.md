# Phase 6: Domain Refactoring & Turkish Terminology
**Date:** 2026-02-14
**Status:** Completed

## 1. Context
Refactored the core domain (Invoicing and Accounting) to use Turkish Ubiquitous Language. This aligns the codebase with the business language of Turkish accountants ("Müşavir").

## 2. Key Changes
- **Terminology:**
    - `Invoice` -> `Fatura`
    - `Journal` -> `MuhasebeFisi`
    - `FiscalPeriod` -> `MaliDonem`
- **Schema:**
    - Renamed fields: `journalNo` -> `yevmiyeNo`.
    - Added `hashedPassword` to `User`.
- **Logic:**
    - Standardized Status Enums (`FisDurumu`, `FaturaDurumu`).
    - Implemented `MaliDonemService` for period validation.

## 3. Architecture snapshot
- **Aggregate Roots:** `Fatura`, `MuhasebeFisi`, `MaliDonem`, `User`, `Organization`.
- **Repository Pattern:** Applied strictly. Repositories handle data mapping to Turkish schema fields.
- **DTOs:** Updated to reflect Turkish terminology for Frontend consumption.

## 4. Security
- **RLS:** All repositories (`PrismaFaturaRepository`, `PrismaMuhasebeFisiRepository`, etc.) enforce `orgId` isolation.
- **Auth:** Added password hashing support for Credentials provider.
