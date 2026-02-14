# Phase 8: Refactoring - Party to Cari
**Status:** Completed

## 1. Context
Alignment with Ubiquitous Language (Turkish terminoloy). Renaming "Party" to "Cari" across the entire stack.

## 2. Key Deliverables
- **Database:** `Fatura` table column `partyId` renamed to `cariId`.
    - Migration: `rename_party_to_cari` applied.
- **Domain:**
    - `Fatura` entity updated (`partyId` -> `cariId`).
    - `UBLGenerator` service updated (`UBLParty` -> `CariBilgileri`).
- **Infrastructure:**
    - `PrismaFaturaRepository` updated mapping.
    - `fatura.actions.ts` DTOs and validation schemas updated.
- **UI:**
    - `FaturaForm`: Input name changed to `cariId`.
    - `FaturaDetail` & `FaturaList`: Display logic updated.

## 3. Impact
- Codebase now strictly follows "Cari" terminology.
- `Party` is removed from the domain language except for raw UBL internal XML node names (where UBL standard requires it).
