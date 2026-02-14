# Qnowa Master Architecture Specification (v1.0 - Phase 6)

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
    - Status flow: `TASLAK` -> `ONAYLI` -> `GONDERILDI`/`IPTAL`.
    - Integrates with E-Invoice providers (stubbed).

### 2.3 Accounting (Muhasebe)
- **Aggregate:** `MuhasebeFisi` (Journal Entry).
- **Entities:** `MuhasebeFisiSatir`.
- **Key Logic:**
    - Double-entry bookkeeping.
    - `yevmiyeNo` (Journal Number) is assigned sequentially per `MaliDonem` (Fiscal Period).
    - `MaliDonem` manages open/closed periods to prevent data modification.

## 3. Technical Stack
- **Backend:** Next.js 16 (App Router, Server Actions).
- **Database:** PostgreSQL with Prisma ORM.
- **Testing:** Vitest (Unit & Integration).
- **Containerization:** Docker.

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
│   ├── identity/       # English terms (Systemic)
│   └── core/           # Base classes (AggregateRoot, Entity, etc.)
├── infrastructure/     # Implementation details
│   ├── database/       # Prisma client
│   ├── repositories/   # Repo implementations
│   └── services/       # External integrations
├── presentation/       # UI & API
    ├── components/     # React components
    └── actions.ts      # Server Actions
```
