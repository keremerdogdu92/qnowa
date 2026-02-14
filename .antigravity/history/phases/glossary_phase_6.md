# Hybrid Glossary (Turkish <-> English)

## Domain: Accounting (Muhasebe)
| Turkish (Code/DB) | English (Concept) | Definition |
|-------------------|-------------------|------------|
| **YevmiyeNo**    | Journal Number    | Sequential number assigned to approved journal entries. Gapless sequence per year. |
| **FisDurumu**     | Journal Status    | Status of a journal entry (`TASLAK`=Draft, `ONAYLI`=Approved). |
| **MaliDonem**     | Fiscal Period     | Accounting period (Month/Year). Can be Open, Soft Close, or Hard Close. |
| **DonemDurumu**   | Period Status     | Status of a fiscal period (`ACIK`, `GECICI_KAPALI`, `KESIN_KAPALI`). |
| **MuhasebeFisi**  | Journal Entry     | The aggregate root for accounting entries. |
| **MuhasebeFisiSatir** | Journal Line | Individual debit/credit lines within a journal entry. |

## Domain: Invoicing (Fatura)
| Turkish (Code/DB) | English (Concept) | Definition |
|-------------------|-------------------|------------|
| **Fatura**        | Invoice           | The aggregate root for invoices. |
| **FaturaDurumu**  | Invoice Status    | Status of an invoice (`TASLAK`, `ONAYLI`, `GONDERILDI`, `IPTAL`). |
| **FaturaTipi**    | Invoice Type      | Type of invoice (`SATIS`, `ALIS`). |
| **FaturaSatir**   | Invoice Line      | Line items within an invoice. |
| **Cari**          | Party/Current Account | Customer or Supplier entity. |

## Domain: Identity
| Turkish (Code/DB) | English (Concept) | Definition |
|-------------------|-------------------|------------|
| **Kullanici** (User) | User              | System user. |
| **Organizasyon** (Organization) | Tenant | The top-level tenant for data isolation. |
