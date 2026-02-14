# QNOWA - Implementation Plan v3 (Agentic)

## Goal Description
Build a robust, secure, and scalable Accounting/ERP SaaS platform ("Qnowa") for Turkey, featuring e-invoicing, bank integration, and AI-driven document processing. The system must adhere to strict accounting principles (GAAP/VUK), Domain-Driven Design (DDD), and Security-First architecture.

**Primary Objectives:**
1.  **Strict Consistency:** Implement Outbox Pattern for eventual consistency reliability.
2.  **Compliance:** Guarantee gap-less journal sequencing (Yevmiye Numarası).
3.  **Human-in-the-Loop:** Mandatory review step for OCR results.
4.  **Security:** RLS, Encryption, Audit Trails.

## User Review Required
> [!IMPORTANT]
> **Outbox Pattern Implementation:** We will introduce an `Outbox` table and a background worker to process domain events reliably. This adds complexity but ensures data integrity.

> [!WARNING]
> **Gap-less Sequencing:** To ensure gap-less journal numbers, we will use a strict database locking mechanism (`SELECT FOR UPDATE`) during the finalization of accounting periods. This may impact high-concurrency performance during closing periods but is mandatory for compliance.

> [!NOTE]
> **OCR Workflow:** The system will NOT auto-book invoices from OCR. A "Draft & Review" state is mandatory.

## Proposed Changes (Phased Rollout)

### Phase 0: Foundation (Weeks 1-2)
**Goal:** Establish the technical skeleton, DDD architecture, and DevSecOps pipeline.

#### [NEW] [docker-compose.yml](file:///docker-compose.yml)
- PostgreSQL 16 (with custom config for sequencing)
- Redis 7 (Event Bus & Cache)
- MinIO (Object Storage)

#### [NEW] [src/domain](file:///src/domain)
- `AggregateRoot`, `Entity`, `ValueObject`, `DomainEvent` base classes.
- `Money`, `VergiNumarasi`, `Donem` (Period) value objects.

#### [NEW] [src/infrastructure](file:///src/infrastructure)
- Prisma Setup with RLS Extensions.
- **Outbox Pattern Implementation** (`OutboxRepository`, `OutboxWorker`).

### Phase 1: Identity & Access (Weeks 3-4)
**Goal:** Secure multi-tenancy and user management.

#### [NEW] [src/modules/identity](file:///src/modules/identity)
- `Organization` & `User` Aggregates.
- RLS Policies (Row Level Security) SQL migrations.
- Auth.js (NextAuth) Integration.

### Phase 2: Core Domain - Accounting (Weeks 5-8)
**Goal:** The heart of the system - Journals, Ledger, and Financial Reports.

#### [NEW] [src/modules/accounting](file:///src/modules/accounting)
- **Account Chart (Tek Düzen Hesap Planı):** Seed data & management.
- **Journal Entry (Yevmiye Fişi) Aggregate:**
    - Strict balancing rules (Debit = Credit).
    - **Gap-less Sequence Generator** service.
- **Fiscal Period (Dönem) Management:**
    - `Soft Close` / `Hard Close` logic.

### Phase 3: Core Domain - Invoicing (Weeks 9-11)
**Goal:** E-Invoice generation and integration.

#### [NEW] [src/modules/invoice](file:///src/modules/invoice)
- `Invoice` Aggregate.
- **Outbox Integration:** `InvoiceFinalized` event -> Outbox -> Accounting Journal.
- E-Invoice Integrator Client (QNB e-Finans adaptation).

### Phase 4: Intelligence & OCR (Weeks 12-14)
**Goal:** AI-assisted data entry with human verification.

#### [NEW] [src/modules/ocr](file:///src/modules/ocr)
- OCR Service (Tesseract.js + Azure Fallback).
- **Verification UI:** Side-by-side view (Original Image vs Extracted Data).
- "Human-in-the-Loop" workflow state machine.

### Phase 5: Automation (Weeks 15+)
**Goal:** DBYS Robot and Advanced features.
- Playwright-based DBYS robot (Standard Docker for MVP).

## Verification Plan

### Automated Tests
- **Unit Tests:** Vitest for all Domain Logic (Money calculations, Tax rules).
- **Integration Tests:** test-containers for Repository & RLS verification.
- **E2E Tests:** Playwright for critical flows (Login -> Create Invoice -> Verify Accounting Impact).

### Manual Verification
- **Sequence Test:** Generate 1000 concurrent journal entries and verify no gaps in numbering.
- **Outbox Test:** Kill the worker process mid-transaction, restart, and verify eventual consistency.
