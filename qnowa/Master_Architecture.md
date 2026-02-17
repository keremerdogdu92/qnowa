# QNOWA - Master Architecture Document

**Last Updated:** 2026-02-16
**Current Phase:** Phase 20 (OCR & Intelligence) Completed

## 1. High-Level Architecture
Qnowa follows a **Domain-Driven Design (DDD)** approach with a Hexagonal Architecture style, ensuring core business logic is isolated from external dependencies.

### 1.1 Layers
*   **Domain Layer:** Pure TypeScript, no dependencies. Contains Aggregates (`Fatura`, `Cari`, `Organization`), Value Objects (`Money`, `VergiNumarasi`), and Domain Events.
*   **Application Layer:** Use Cases are currently implemented as **Server Actions** (`src/infrastructure/actions`) which orchestrate domain logic and strictly type-check inputs (Zod).
*   **Infrastructure Layer:** Implementations of interfaces.
    *   **Database:** Prisma ORM with PostgreSQL.
    *   **OCR:** `SmartOCRRouter` (Tesseract + Azure Hybrid).
    *   **Auth:** NextAuth.js v5.
*   **Presentation Layer:** Next.js App Router (`src/app`), React Components (`src/presentation/components`).

## 2. Core Modules & Status

### 2.1 Accounting (Core)
*   **Status:** ✅ Implemented
*   **Features:**
    *   Cari Hesap (Customer/Supplier) management.
    *   Fatura (Invoice) creation, listing, state management (DRAFT, FINAL).
    *   Muhasebe (Accounting) integration (automatic booking).

### 2.2 OCR & Intelligence (Phase 20)
*   **Status:** ✅ Implemented
*   **Features:**
    *   **Smart Router:** Intelligently routes to Tesseract (Free) or Azure (Paid) based on image quality scoring.
    *   **Document Classification:** Auto-detects Invoice, Receipt, Waybill, Check.
    *   **Human-in-the-Loop:** User verification UI with Supplier matching.
    *   **Tech:** Tesseract.js (Node/Browser), Azure Document Intelligence.

### 2.3 Identity & Access
*   **Status:** ✅ Implemented
*   **Features:**
    *   Multi-tenancy (Organization based).
    *   RBAC (Admin, User, Accountant roles).
    *   RLS (Row Level Security) via Prisma extension.

### 2.4 Stock Management (Phase 19)
*   **Status:** ✅ Implemented
*   **Features:**
    *   **Products:** Inventory items with buy/sell prices and VAT rates.
    *   **Stock Movements:** Tracking input/output of goods.
    *   **Aggregates:** `Product`, `StockMovement`.
    *   **Actions:** `product.actions.ts`.

### 2.5 Finance Management (Phase 19)
*   **Status:** ✅ Implemented
*   **Features:**
    *   **Cash/Bank:** Tracking Safes (`Kasa`) and Bank Accounts.
    *   **Cheques/Promissory Notes:** Tracking maturity dates and status (Portfolio, Collected, Bounced).
    *   **Aggregates:** `Safe`, `Bank`, `Cheque`.
    *   **Actions:** `finance.actions.ts`, `cheque.actions.ts`.

## 3. Data Flow (OCR)
1.  **User Upload:** Image -> `InvoiceOCR.tsx`
2.  **Server Action:** `parseInvoiceAction(FormData)`
3.  **Smart Routing:** `SmartOCRRouter.routeAndParse(buffer)`
    *   *Step A:* Tesseract quick scan.
    *   *Step B:* Quality Score calculation (Resolution, Confidence, Keywords).
    *   *Step C:* If Score >= 3 -> Return Tesseract result.
    *   *Step D:* If Score < 3 -> Call Azure AI -> Return Azure result.
4.  **Classification:** Detect `documentType` (e.g., "FATURA") based on keywords.
5.  **Response:** Return `ExtractedData` to Client.
6.  **Verification:** User verifies data, selects Supplier (`Cari`).
7.  **Persistence:** `createFatura` action saves as Draft.

## 4. Upcoming Phases
*   **Phase 21:** DBYS Automation (Playwright Robot for GİB integration).
*   **Phase 22:** Financial Intelligence (Bank Reconciliation).

## 5. Security Posture
*   **RLS:** Enforced on all sensitive tables (`Fatura`, `Cari`).
*   **Input Validation:** Zod schemas for all tRPC and Server Actions.
*   **OCR Security:** File type validation (image/pdf only), sanitized output.
