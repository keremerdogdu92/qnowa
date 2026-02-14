# Phase 7: E-Invoice XML (UBL-TR) Generation
**Status:** Completed

## 1. Context
Implementation of the official XML format (UBL-TR 2.1) required for GİB (Revenue Administration) submission.

## 2. Key Deliverables
- **Library:** `xmlbuilder2` installed for XML construction.
- **Service:** `UBLGenerator` domain service created.
    - Implemented mapping for `Invoice`, `AccountingSupplierParty`, `AccountingCustomerParty`, `InvoiceLine`, `TaxTotal`.
    - Handles ETTN (UUID) generation.
- **Actions:** `downloadFaturaXML` Server Action implemented.
    - Fetches Fatura, Organization (Supplier), and Cari (Customer).
    - Returns generated XML string.
- **UI:** `FaturaDetail` updated with "XML İndir (UBL)" button.

## 3. Architecture snapshot
- **Service Layer:** `UBLGenerator` encapsulates the complex XML structure logic from the core domain.
- **Integration:** Prepared for future Integrator API connection (Phase 8).
