# Phase 3: Invoicing Domain
**Status:** Completed

## 1. Context
Implementation of the core Invoicing logic and its integration with accounting.

## 2. Key Deliverables
- **Schema:** `Invoice` (now `Fatura`) and `InvoiceLine` models added.
- **Logic:**
    - Sequence generation for Invoice Numbers.
    - Status workflow (`DRAFT` -> `FINALIZED` -> `SENT`).
- **Integration:** Mock E-Invoice Integrator (Stub) created.
- **Action:** Manual trigger to convert finalized Invoice to Journal Entry.

## 3. Architecture snapshot
- **Aggregate:** `Invoice` (Fatura).
- **Service:** `InvoiceAccountingService` (now `FaturaMuhasebeService`).
