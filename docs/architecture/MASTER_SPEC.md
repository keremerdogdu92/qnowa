# Qnowa Master Architecture Specification (v1.2 - Phase 9)

## 1. Overview
Qnowa is a cloud-native ERP/CRM system built with a Domain-Driven Design (DDD) approach. It features a hybrid structure where the core domain logic uses Turkish terminology (ubiquitous language of accountants) while infrastructure and systemic components use English.

## 2. Core Domains
### 2.1 Identity & Access (IAM)
- **Aggregates:** `User`, `Organization` (Tenant).
- **Authentication:** NextAuth.js v5 (Credentials + OAuth).
- **Authorization:** RBAC (Role-Based Access Control) with roles `ADMIN`, `ACCOUNTANT`, `USER`.
- **Multi-tenancy:** Strict `orgId` isolation at the database level (RLS-like application logic).

### 2.2 Invoicing (Fatura)
- **Aggregate:** `Fatura`.
- **Entities:** `FaturaSatir` (Lines).
- **Value Objects:** `Money`, `Address`.
- **Key Logic:**
    - Invoices differ by `FaturaTipi` (`SATIS`/`ALIS`).
    - **Expense Management (Giderler):** `ALIS` type invoices are treated as expenses.
    - Status flow: `TASLAK` -> `ONAYLI` -> `GONDERILDI`/`IPTAL`.
    - **XML Generation:** `UBLGenerator` service maps `Fatura` to UBL-TR 2.1 standard (GİB compliant).

### 2.3 Accounting (Muhasebe)
- **Aggregate:** `MuhasebeFisi` (Journal Entry).
- **Entities:** `MuhasebeFisiSatir`.
- **Key Logic:**
    - Double-entry bookkeeping.
    - **Sales (SATIS):** Dr: 120, Cr: 600, 391.
    - **Expenses (ALIS):** Dr: 770 (Expense) / 153 (Inventory), 191 (VAT Rec), Cr: 320 (Payables).
    - `yevmiyeNo` (Journal Number) is assigned sequentially per `MaliDonem` (Fiscal Period).
    - `MaliDonem` manages open/closed periods to prevent data modification.

### 2.4 Cari (Current Account)
- **Aggregate:** `Cari` (Customer/Supplier).
- **Key Logic:** Used in Fatura and Accounting.
- **Terminology:** `partyId` -> `cariId`.

## 3. Technical Stack
- **Backend:** Next.js 16 (App Router, Server Actions).
- **Database:** PostgreSQL with Prisma ORM.
- **Testing:** Vitest (Unit & Integration).
- **Containerization:** Docker.
- **XML Generation:** `xmlbuilder2`.

## 4. Cross-Cutting Concerns
- **Validation:** Zod schemas for all inputs.
- **Security:**
    - Password hashing with `bcryptjs`.
    - Input sanitization.
    - CSRF protection via NextAuth.
- **Logging:** Structured logging (console for now, extendable).

## 5. Directory Structure
```
src/
├── domain/             # Pure business logic (DDD)
│   ├── accounting/     # Muhasebe (Turkish terms)
│   ├── invoice/        # Fatura (Turkish terms)
│   │   ├── services/   # incl. UBLGenerator.ts
│   ├── identity/       # English terms (Systemic)
│   └── core/           # Base classes (AggregateRoot, Entity, etc.)
├── infrastructure/     # Implementation details
│   ├── database/       # Prisma client
│   ├── repositories/   # Repo implementations
│   └── actions/        # Server Actions (API)
├── presentation/       # UI Components
│   ├── components/     # React components
│   └── hooks/          # Custom hooks
```
