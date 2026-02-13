
Review existing plan in folder

şimdi bu klasöre sanki bir plan hazırlayıp yazmıştık onu görebiliyor musun?



Mevcut çalışma dizinindeki dosyaları kontrol edeyim.


Read README.md and checked project structure
Show more

Ana repo dizininde de bir plan dosyası var mı kontrol edeyim.


Checked git worktree structure and commit history
Show more

Maalesef bu worktree'de herhangi bir plan dosyası bulamadım. Mevcut durum:

elegant-bartik worktree: Sadece bir README.md (içeriği # qnowa) ve boş bir .claude klasörü var.
Git geçmişi: Tek bir commit var (59d629c Initial commit), ekstra bir şey yok.
Diğer worktree (fervent-pare): Benzer şekilde sadece README.md ve .claude klasörü.
Bu repo şu an neredeyse boş. Daha önce bir plan hazırladıysanız, muhtemelen farklı bir konuşmada (conversation) veya farklı bir dizinde yapılmış olabilir. Planı tekrar paylaşırsanız buraya yazabilirim, ya da hatırladığınız detayları söylerseniz birlikte yeniden oluşturabiliriz.

daha önceki bu konuda mesajlarımız silinmiş mi yine plan kısmından yapmıştım buradan



Evet, maalesef önceki konuşma geçmişi bu oturumda mevcut değil. Claude Code'daki her conversation bağımsızdır - önceki oturumlardaki mesajlar bu oturuma taşınmaz. Plan dosyaları da o conversation'a özgüydü.

Ama sorun değil, planı tekrar oluşturabiliriz. Hatırladığınız kadarıyla önceki planın ne hakkında olduğunu anlatabilir misiniz?


Clarified previous planning context for Qnowa project

Anladım, bir PRD (Product Requirements Document) vermiştiniz ve ondan plan çıkarmıştık. Maalesef o PRD ve plan bu oturumda kayıp.


Asked user to provide PRD document source method

Tamam, PRD'yi buraya yapıştırın, ben de okuyup tekrar plan çıkaralım. Bekliyorum!

QNOWA - Product Requirements Document (PRD)
Web-Based ERP/CRM + e-Accounting Platform
Version: 2.0  
Last Updated: 10 Şubat 2026  
Status: Technical Architecture Finalized  
Owner: Kerem Erdoğdu  
Domain: qnowa.com.tr
📋 İçindekiler
Executive Summary
Product Vision & Goals
Target Users & Personas
Core Features & Requirements
Technical Architecture
Tech Stack (Finalized)
Domain-Driven Design (DDD)
Security & Compliance
OCR System
Event-Driven Architecture
Database Schema
Deployment Strategy
Cost Analysis
Implementation Roadmap
Success Metrics
Risks & Mitigations
Appendix
1. Executive Summary
1.1 Ürün Özeti
Qnowa, Türkiye'deki mükellefler (işletmeler) ve mali müşavirler için tek platformda e-fatura, e-arşiv, defter-beyan ve muhasebe süreçlerini yöneten web-based SaaS ERP/CRM platformudur.
Temel Değer Önerisi:

🚀 Hız: OCR ile fiş/fatura otomatik okuma (saniyeler içinde)
🤖 Otomasyon: DBYS (Defter Beyan) otomatik doldurma + gönderim
💰 Maliyet: Rakiplerden %30-50 daha ucuz (kontör bazlı fiyatlandırma)
🔒 Güvenlik: GİB uyumlu, Türkiye'de hosting, KVKK sertifikalı
📱 Erişilebilirlik: Web + mobil responsive, her yerden erişim
1.2 Pazar Konumlandırma
Rakipler:

Paraşüt, Logo, Zirve, Mikro, Netsis
Qnowa'nın Farkı:
✅ OCR client-side (rakiplerde server-side → yavaş + pahalı)
✅ Template-based OCR (kullanıcılar katkıda bulunur → sürekli gelişir)
✅ Kontör bazlı fiyat (kullandığın kadar öde, sabit ücret yok)
✅ On-premise ready (bankalar için → büyük anlaşmalar)
✅ Modern tech stack (Next.js, React, TypeScript → hızlı UX)
1.3 Hedef Pazar
Primary:

KOBİ'ler (1-50 çalışan)
Serbest meslek erbabı (avukat, doktor, mühendis vs)
E-ticaret işletmeleri
Secondary:
Mali müşavirler (ofisler)
Muhasebe firmaları
Enterprise (Gelecek):
Bankalar (on-premise deployment)
Holding'ler
Pazar Büyüklüğü (Türkiye):
~3.5M aktif mükellef
~50K mali müşavir
TAM (Total Addressable Market): ~₺2.5B/yıl
2. Product Vision & Goals
2.1 Vizyon
"Türkiye'deki her mükellefin mali süreçlerini tek tıkla yönetebileceği, yapay zeka destekli, kullanıcı dostu platform olmak."

2.2 Misyon
Mali süreçlerin karmaşıklığını ortadan kaldırarak, işletmelerin asıl işlerine odaklanmalarını sağlamak.
2.3 Ürün Hedefleri (12 Ay)
Metrik	Hedef	Gerçekleşme
Aktif Mükellef	2,000	-
Aylık Fatura Hacmi	200,000 adet	-
OCR Başarı Oranı	%90+	-
DBYS Otomasyon	%95+	-
Müşteri Memnuniyeti (NPS)	50+	-
Churn Rate	<5%	-
MRR (Monthly Recurring Revenue)	₺100,000	-
3. Target Users & Personas
3.1 Persona 1: Mükellef (İşletme Sahibi)
Profil:

İsim: Ahmet Yılmaz
Yaş: 35
Meslek: E-ticaret işletmesi sahibi (tekstil)
Firma: 5 çalışan, aylık ~200 fatura
Sorunları:
├─ Fatura kesmek çok zaman alıyor (manuel giriş)
├─ Muhasebeci'ye her ay dosya göndermek zahmetli
├─ DBYS'yi anlamıyor, muhasebeci hallediyor
└─ Mevcut yazılımlar pahalı (₺500-1,000/ay)
Qnowa'dan Beklentileri:
├─ Hızlı fatura kesme (OCR ile)
├─ Otomatik muhasebe entegrasyonu
├─ Uygun fiyat (₺200-300/ay)
└─ Kolay kullanım (teknik bilgi gerektirmemeli)

3.2 Persona 2: Mali Müşavir
Profil:

İsim: Ayşe Demir
Yaş: 42
Meslek: Bağımsız mali müşavir
Müşteri sayısı: 25 mükellef
Sorunları:
├─ Müşterilerden gelen belgeler dağınık (WhatsApp, email)
├─ Her müşteri için ayrı DBYS girişi (tekrar eden iş)
├─ Manuel muhasebe kaydı zaman alıyor
└─ Müşteri takibi zor (hangi müşteri eksik belge gönderdi?)
Qnowa'dan Beklentileri:
├─ Müşterilerin belgelerini tek platformda toplama
├─ DBYS otomasyonu (%90+ hazır paket)
├─ Otomatik hatırlatmalar (eksik belge uyarısı)
└─ Toplu işlem desteği (25 müşterinin DBYS'sini tek tıkla)

4. Core Features & Requirements
4.1 Feature Listesi (Priority Order)
P0 - Critical (MVP - 0-3 ay)
1. E-Fatura Kesme
   ├─ Manuel fatura girişi
   ├─ OCR ile fiş okuma (client-side Tesseract + Azure fallback)
   ├─ Entegratör gönderimi (API)
   └─ PDF indirme
2. E-Arşiv Fatura
   ├─ E-fatura ile aynı flow
   └─ Müşteri SMS/email gönderimi
3. Cari Hesap Yönetimi
   ├─ Müşteri/tedarikçi ekleme
   ├─ Cari detay (bakiye, hareketler)
   └─ Vergi numarası doğrulama (GİB API)
4. Basit Muhasebe
   ├─ Fatura → Otomatik muhasebe kaydı
   ├─ Cari hesap hareketleri
   └─ Borç-alacak raporu
5. User Management
   ├─ Email + Password login
   ├─ Magic Link login
   ├─ Org (organizasyon) yönetimi
   └─ Role-based access (admin, user, accountant)

P1 - Important (Beta - 3-6 ay)
6. DBYS Otomasyonu (Prototype)
   ├─ Fatura → DBYS mapping (otomatik)
   ├─ Playwright agent ile form doldurma
   ├─ Doğruluk kontrolü (%95+)
   └─ Manuel override (gerekirse)
7. Gelişmiş OCR
   ├─ Template sistemi (Migros, BİM, Carrefour vs)
   ├─ User-contributed templates
   ├─ Guided camera mode
   └─ Auto-capture
8. Banka Eşleştirme (Prototype)
   ├─ Banka ekstresi yükleme (Excel)
   ├─ Otomatik eşleştirme (tutar + tarih matching)
   ├─ Manuel eşleştirme UI
   └─ Öğrenen AI (pattern recognition)
9. Vergi Hesaplama
   ├─ Tahmini vergi (aylık)
   ├─ KDV, Gelir Vergisi, Stopaj
   └─ Dashboard widget
10. Bildirim Sistemi
    ├─ Email notifications (Resend)
    ├─ In-app notifications
    └─ Eksik belge uyarıları

P2 - Nice to Have (Production - 6-12 ay)
11. DBYS Full Automation
    ├─ %95+ otomasyon
    ├─ Hata yönetimi (retry logic)
    ├─ Başarı logları
    └─ Raporlama
12. Stok Yönetimi
    ├─ Ürün tanımlama
    ├─ Giriş-çıkış takibi
    └─ Fatura ile entegrasyon
13. Mobil App (React Native)
    ├─ iOS + Android
    ├─ OCR (kamera)
    └─ Push notifications
14. Advanced Analytics
    ├─ Satış trendleri
    ├─ Karlılık analizi
    └─ Tahmine dayalı raporlar (AI)
15. API & Integrations
    ├─ REST API (public)
    ├─ Webhooks
    └─ 3rd party integrations (Shopify, WooCommerce)

5. Technical Architecture
5.1 High-Level Architecture
┌─────────────────────────────────────────────────┐
│  QNOWA System Architecture                      │
│  (Hexagonal Architecture + DDD)                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │   PRESENTATION LAYER                    │   │
│  │   (UI + API)                            │   │
│  ├─────────────────────────────────────────┤   │
│  │  - Next.js App Router (SSR)             │   │
│  │  - React Components (Client)            │   │
│  │  - tRPC API (Type-safe)                 │   │
│  │  - REST API (Public)                    │   │
│  └─────────────────────────────────────────┘   │
│                      ↓                          │
│  ┌─────────────────────────────────────────┐   │
│  │   APPLICATION LAYER                     │   │
│  │   (Use Cases / Services)                │   │
│  ├─────────────────────────────────────────┤   │
│  │  - FaturaService                        │   │
│  │  - MuhasebeService                      │   │
│  │  - DBYSService                          │   │
│  │  - VergiHesaplamaService                │   │
│  │  - OCRService (Orchestrator)            │   │
│  └─────────────────────────────────────────┘   │
│                      ↓                          │
│  ┌─────────────────────────────────────────┐   │
│  │   DOMAIN LAYER                          │   │
│  │   (Business Logic)                      │   │
│  ├─────────────────────────────────────────┤   │
│  │  Aggregates:                            │   │
│  │  ├─ Fatura (Root)                       │   │
│  │  ├─ Cari                                │   │
│  │  ├─ MuhasebeKaydi                       │   │
│  │  └─ DefterBeyanPaketi                   │   │
│  │                                         │   │
│  │  Value Objects:                         │   │
│  │  ├─ Money                               │   │
│  │  ├─ VergiNumarasi                       │   │
│  │  ├─ FaturaNumarasi                      │   │
│  │  └─ Donem                               │   │
│  │                                         │   │
│  │  Domain Events:                         │   │
│  │  ├─ FaturaKesildi                       │   │
│  │  ├─ DocumentBooked                      │   │
│  │  └─ SubmissionCompleted                 │   │
│  └─────────────────────────────────────────┘   │
│                      ↓                          │
│  ┌─────────────────────────────────────────┐   │
│  │   INFRASTRUCTURE LAYER                  │   │
│  ├─────────────────────────────────────────┤   │
│  │  - PostgreSQL (Prisma ORM)              │   │
│  │  - Redis (Event Bus + Cache)            │   │
│  │  - MinIO (File Storage)                 │   │
│  │  - Playwright (DBYS Agent)              │   │
│  │  - Tesseract.js (Client OCR)            │   │
│  │  - Azure AI (Server OCR)                │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘

5.2 Deployment Architecture
SaaS Deployment (Multi-tenant)
┌─────────────────────────────────────────────────┐
│  PRODUCTION DEPLOYMENT                          │
│  Türkiye VPS (İstanbul)                         │
├─────────────────────────────────────────────────┤
│                                                 │
│  Nginx (Reverse Proxy + SSL)                    │
│      ↓                                          │
│  Docker Compose:                                │
│    ├─ Next.js App (3 replicas)                  │
│    ├─ PostgreSQL 16                             │
│    ├─ Redis 7                                   │
│    ├─ MinIO                                     │
│    └─ Playwright Agent (queue worker)           │
│                                                 │
│  External Services:                             │
│  ├─ Resend (Email)                              │
│  ├─ Azure AI (OCR fallback)                     │
│  ├─ Uptime Robot (Monitoring)                   │
│  └─ Sentry (Error tracking)                     │
│                                                 │
└─────────────────────────────────────────────────┘

On-Premise Deployment (Banks)
┌─────────────────────────────────────────────────┐
│  ON-PREMISE DEPLOYMENT                          │
│  Customer's Server                              │
├─────────────────────────────────────────────────┤
│                                                 │
│  docker-compose up -d (single command!)         │
│                                                 │
│  All services included:                         │
│  ├─ Next.js                                     │
│  ├─ PostgreSQL                                  │
│  ├─ Redis                                       │
│  ├─ MinIO                                       │
│  └─ Nginx                                       │
│                                                 │
│  No external dependencies!                      │
│  Works offline ✅                               │
│                                                 │
└─────────────────────────────────────────────────┘

6. Tech Stack (Finalized)
6.1 Backend
Category	Technology	Version	Reason
Runtime	Node.js	20 LTS	Modern, performant, ecosystem
Framework	Next.js	15 (App Router)	SSR, React Server Components, API routes
Language	TypeScript	5+	Type safety, developer experience
ORM	Prisma ORM	Latest	Type-safe queries, migrations, portable
Database	PostgreSQL	16	Reliable, JSONB support, RLS, mature
Cache	Redis	7	Event bus, session store, cache
File Storage	MinIO	Latest	S3-compatible, self-hosted, portable
Email	Resend	Latest	Developer-friendly API, React Email
Auth	NextAuth.js	5+	Flexible, self-hosted, integrations
6.2 Frontend
Category	Technology	Reason
Framework	React	18
UI Library	Tailwind CSS	Latest
State Management	React Query (TanStack)	Latest
Forms	React Hook Form	Latest
API Client	tRPC	Latest
OCR (Client)	Tesseract.js	Latest
6.3 Infrastructure
Category	Technology	Reason
Containerization	Docker + Docker Compose	Latest
Reverse Proxy	Nginx	Latest
CI/CD	GitHub Actions	-
Monitoring	Uptime Robot + Sentry	-
Browser Automation	Playwright	Latest
OCR (Server)	Azure Document Intelligence	Latest
6.4 External Services
Service	Purpose	Cost (MVP)
Resend	Email delivery	₺0 (3,000 emails/month free)
Azure AI Document	OCR fallback	₺0 (10,000 pages/month free)
Uptime Robot	Uptime monitoring	₺0 (50 monitors free)
Sentry	Error tracking	₺0 (5,000 errors/month free)
Let's Encrypt	SSL certificates	₺0
7. Domain-Driven Design (DDD)
7.1 Bounded Contexts
┌──────────────────────────────────────────────┐
│  ACCOUNTING DOMAIN (Core Domain)             │
├──────────────────────────────────────────────┤
│                                              │
│  Subdomains:                                 │
│  ├─ Document Management                      │
│  │   └─ Fatura, İrsaliye, Gider Pusulası    │
│  │                                           │
│  ├─ Accounting                               │
│  │   └─ Muhasebe Kayıtları, Hesap Planı     │
│  │                                           │
│  ├─ Tax Compliance                           │
│  │   └─ DBYS, Vergi Hesaplama               │
│  │                                           │
│  └─ Party Management                         │
│      └─ Cari Hesaplar, Müşteri/Tedarikçi    │
│                                              │
└──────────────────────────────────────────────┘
┌──────────────────────────────────────────────┐
│  DOCUMENT INTELLIGENCE (Supporting Domain)   │
├──────────────────────────────────────────────┤
│                                              │
│  - OCR Processing                            │
│  - Template Management                       │
│  - Image Recognition                         │
│                                              │
│  Events:                                     │
│  ├─ ImageUploaded                            │
│  ├─ ExtractionCompleted                      │
│  └─ DocumentDataReady                        │
│                                              │
└──────────────────────────────────────────────┘

7.2 Core Aggregates
Fatura (Invoice) Aggregate
// domain/aggregates/Fatura.ts
class Fatura {
  // Aggregate Root
  id: string;
  orgId: string; // Multi-tenancy
  
  // Value Objects
  faturaNo: FaturaNumarasi;
  faturaTarihi: Date;
  vadeGunu: number;
  durum: FaturaDurum; // TASLAK | KESILDI | IPTAL
  
  // Entities (part of aggregate)
  satirlar: FaturaSatir[];
  
  // Calculated fields
  araToplam: Money;
  kdvToplami: Money;
  genelToplam: Money;
  
  // Business rules
  static olustur(command: FaturaKesCommand): Fatura {
    // Validation
    // Business rules
    // Create fatura
    return fatura;
  }
  
  satirEkle(satir: FaturaSatir): void {
    this.satirlar.push(satir);
    this.hesapla(); // Recalculate totals
  }
  
  kes(entegrator: Entegrator): void {
    // Change state
    // Emit event: FaturaKesildi
  }
  
  iptalEt(): void {
    if (this.durum === 'KESILDI') {
      throw new Error('Kesilmiş fatura iptal edilemez');
    }
    this.durum = 'IPTAL';
  }
  
  private hesapla(): void {
    // Recalculate araToplam, kdvToplami, genelToplam
  }
}

7.3 Value Objects
// domain/value-objects/Money.ts
class Money {
  readonly tutar: number;
  readonly parabirimi: string;
  
  constructor(tutar: number, parabirimi: string = 'TRY') {
    if (tutar < 0) throw new Error('Tutar negatif olamaz');
    this.tutar = tutar;
    this.parabirimi = parabirimi;
  }
  
  topla(other: Money): Money {
    if (this.parabirimi !== other.parabirimi) {
      throw new Error('Farklı para birimleri toplanamaz');
    }
    return new Money(this.tutar + other.tutar, this.parabirimi);
  }
  
  carpla(katsayi: number): Money {
    return new Money(this.tutar * katsayi, this.parabirimi);
  }
  
  equals(other: Money): boolean {
    return this.tutar === other.tutar && 
           this.parabirimi === other.parabirimi;
  }
}
// domain/value-objects/VergiNumarasi.ts
class VergiNumarasi {
  readonly deger: string;
  
  constructor(deger: string) {
    if (!this.validate(deger)) {
      throw new Error('Geçersiz vergi numarası');
    }
    this.deger = deger;
  }
  
  private validate(vn: string): boolean {
    // 10 veya 11 haneli
    // Algoritmik kontrol
    return /^\d{10,11}$/.test(vn);
  }
  
  equals(other: VergiNumarasi): boolean {
    return this.deger === other.deger;
  }
}

7.4 Domain Events
// domain/events/FaturaKesildi.ts
export class FaturaKesildi extends DomainEvent {
  constructor(
    public readonly faturaId: string,
    public readonly orgId: string,
    public readonly cariId: string,
    public readonly genelToplam: Money,
    public readonly kdvToplami: Money
  ) {
    super();
  }
}
// Event Handlers
eventBus.subscribe(FaturaKesildi, async (event) => {
  // 1. Vergi hesaplamayı güncelle
  await vergiHesaplamaService.tahminiVergiGuncelle(event.orgId);
  
  // 2. Cari hesap bakiyesini güncelle
  await cariService.bakiyeGuncelle(event.cariId, event.genelToplam);
  
  // 3. Notification gönder
  await bildirimService.faturaKesildiEmail(event.faturaId);
});

7.5 Repository Pattern
// repositories/IFaturaRepository.ts
export interface IFaturaRepository {
  findById(orgId: string, id: string): Promise<Fatura | null>;
  findAll(orgId: string, filters?: FaturaFilters): Promise<Fatura[]>;
  save(orgId: string, fatura: Fatura): Promise<void>;
  delete(orgId: string, id: string): Promise<void>;
}
// repositories/PrismaFaturaRepository.ts
export class PrismaFaturaRepository implements IFaturaRepository {
  
  async findById(orgId: string, id: string): Promise<Fatura | null> {
    const row = await prisma.fatura.findUnique({
      where: { 
        id,
        orgId // Explicit org filtering
      },
      include: {
        satirlar: true,
        cari: true
      }
    });
    
    if (!row) return null;
    
    return this.toDomain(row);
  }
  
  async save(orgId: string, fatura: Fatura): Promise<void> {
    await prisma.fatura.upsert({
      where: { id: fatura.id },
      create: this.toDatabase(orgId, fatura),
      update: this.toDatabase(orgId, fatura)
    });
  }
  
  private toDomain(row: any): Fatura {
    // Database row → Domain model
  }
  
  private toDatabase(orgId: string, fatura: Fatura): any {
    // Domain model → Database row
  }
}

7.6 Ubiquitous Language
Domain-Specific Terms (Turkish):

Turkish Term	English	Usage in Code
Mükellef	Taxpayer	Mukellef (class/table)
Mali Müşavir	Accountant	MaliMusavir
Fatura	Invoice	Fatura
Cari	Party (Customer/Supplier)	Cari
Muhasebeleştirme	Bookkeeping	muhasebelesstirildi (status)
Defter Beyan	Tax Declaration	DefterBeyan
KDV	VAT	kdv
Gelir Vergisi	Income Tax	gelirVergisi
Code follows domain language:		
// ✅ Good (Turkish domain terms)
class Mukellef {
  firmaUnvani: string;
  vergiNumarasi: VergiNumarasi;
  cariHesaplar: Cari[];
}
// ❌ Bad (English translation loses meaning)
class Taxpayer {
  companyTitle: string;
  taxNumber: TaxNumber;
  parties: Party[];
}

8. Security & Compliance
8.1 Row Level Security (RLS)
Multi-tenant isolation (organization level):

-- PostgreSQL RLS Policy
-- Enable RLS on all tables
ALTER TABLE faturalar ENABLE ROW LEVEL SECURITY;
ALTER TABLE cari_hesaplar ENABLE ROW LEVEL SECURITY;
ALTER TABLE muhasebe_kayitlari ENABLE ROW LEVEL SECURITY;
-- Policy: Users can only see their own organization's data
CREATE POLICY faturalar_isolation ON faturalar
  USING (org_id = current_setting('app.current_org_id')::uuid);
CREATE POLICY cari_isolation ON cari_hesaplar
  USING (org_id = current_setting('app.current_org_id')::uuid);

Middleware sets org context:

// middleware.ts
export async function middleware(req: NextRequest) {
  const session = await getServerSession();
  
  if (session?.user) {
    // Set PostgreSQL session variable
    await prisma.$executeRaw`
      SELECT set_config('app.current_org_id', ${session.user.orgId}, true);
    `;
  }
  
  return NextResponse.next();
}

Defense in Depth:

DB Level: PostgreSQL RLS (failsafe)
Application Level: Repository explicit orgId parameter
API Level: Session validation
8.2 Data Encryption
At Rest:

PostgreSQL TLS/SSL
MinIO encryption at rest
Disk encryption (LUKS)
In Transit:
HTTPS (Let's Encrypt SSL)
API TLS 1.3
Database connections encrypted
8.3 KVKK Compliance
Data Storage:

Personal data stored in Turkey (GİB requirement)
Email masking in audit logs
Soft delete with 30-day grace period
Data export API for portability
Documentation:
KVKK Aydınlatma Metni (Privacy Notice)
Açık Rıza Beyanı (Consent Form)
Veri İşleme Envanteri (Data Processing Inventory)
8.4 GİB Compliance
Requirements:

Data must be stored in Turkey ✅
DBYS API requires Turkish datacenter ✅
E-invoice integrator approval needed ✅
Financial records kept for 10 years ✅
Implementation:
Hosting: İstanbul datacenter
Soft delete: 10-year retention
Audit log: All changes logged
9. OCR System
9.1 Smart OCR Architecture
┌─────────────────────────────────────────────────┐
│  HYBRID OCR SYSTEM                              │
│  (Template-Based + Client-Side First)           │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. User uploads image (fiş/fatura)             │
│      ↓                                          │
│  2. Image Normalization (800×1200)              │
│      ↓                                          │
│  3. Template Matcher (client-side)              │
│     ├─ Known template? (Migros fiş)             │
│     │   ├─ YES → Tesseract.js (zone-based) ✅   │
│     │   └─ NO → Azure Document Intelligence ⚠️ │
│      ↓                                          │
│  4. Field Extraction                            │
│     ├─ Header zone (tarih, fiş no)              │
│     ├─ Footer zone (toplam, KDV)                │
│     └─ Keyword matching                         │
│      ↓                                          │
│  5. Validation & Confidence Scoring             │
│     ├─ Required fields filled?                  │
│     └─ Confidence < 85% → User review           │
│      ↓                                          │
│  6. Template Learning (new format)              │
│     ├─ Azure full OCR                           │
│     ├─ User marks regions (optional)            │
│     └─ Template saved → Next time client! ✅    │
│                                                 │
└─────────────────────────────────────────────────┘

9.2 Template System
Template Structure:

interface DocumentTemplate {
  id: string;
  name: string; // "Migros Market Fişi"
  type: 'e_fatura' | 'fiş' | 'z_rapor' | 'custom';
  
  // Template matching
  fingerprint: {
    keywords: string[]; // ["MİGROS", "TOPLAM"]
    logo_position?: BoundingBox;
    layout_hash: string;
  };
  
  // Zone-based extraction
  zones: DocumentZone[];
  
  // Metadata
  source: 'system' | 'user_contributed';
  usage_count: number;
  success_rate: number;
}
interface DocumentZone {
  name: string; // "header", "footer"
  area: {
    startY: number; // % (0-100)
    endY: number;
    startX: number;
    endX: number;
  };
  targetFields: ZoneField[];
}
interface ZoneField {
  name: string; // "toplam", "tarih"
  keywords: string[]; // ["TOPLAM", "TOTAL"]
  pattern: RegExp; // /\d+[,\.]\d{2}/
  extractionRule: 'after_keyword' | 'before_keyword';
}

9.3 Zone-Based Extraction Example
Migros Fişi Template:

const migrosTemplate: DocumentTemplate = {
  name: 'Migros Market Fişi',
  type: 'fiş',
  
  fingerprint: {
    keywords: ['MİGROS', 'MARKET', 'FİŞ NO'],
    layout_hash: 'a3f5b2c1...'
  },
  
  zones: [
    {
      name: 'header',
      area: { 
        startY: 0, endY: 30,   // Top 30% of image
        startX: 0, endX: 100 
      },
      targetFields: [
        {
          name: 'tarih',
          keywords: ['TARİH', 'DATE'],
          pattern: /\d{2}\.\d{2}\.\d{4}/,
          extractionRule: 'after_keyword'
        },
        {
          name: 'fiş_no',
          keywords: ['FİŞ NO', 'RECEIPT'],
          pattern: /\d{8,12}/,
          extractionRule: 'after_keyword'
        }
      ]
    },
    {
      name: 'footer',
      area: { 
        startY: 70, endY: 100,  // Bottom 30% of image
        startX: 0, endX: 100 
      },
      targetFields: [
        {
          name: 'toplam',
          keywords: ['TOPLAM', 'TOTAL', 'GENEL TOPLAM'],
          pattern: /\d+[,\.]\d{2}/,
          extractionRule: 'after_keyword'
        },
        {
          name: 'kdv',
          keywords: ['KDV', 'VAT'],
          pattern: /\d+[,\.]\d{2}/,
          extractionRule: 'after_keyword'
        }
      ]
    }
  ],
  
  source: 'system',
  usage_count: 15420,
  success_rate: 0.94
};

9.4 Guided Camera Experience
// components/GuidedCamera.tsx
export function GuidedCamera({ documentType }) {
  return (
    <div className="camera-container">
      {/* Camera preview */}
      <video ref={videoRef} autoPlay />
      
      {/* Guide overlay */}
      <div className="guide-overlay">
        <div className="guide-frame">
          <p>Fişi çerçeveye hizalayın</p>
        </div>
      </div>
      
      {/* Auto-capture (rectangle detection) */}
      <AutoCapture 
        onDetect={() => capturePhoto()}
        minStableTime={1000} // 1 second stable
      />
      
      <button onClick={manualCapture}>
        📷 Fotoğraf Çek
      </button>
    </div>
  );
}

9.5 Cost Optimization Strategy
Smart Routing (Template Coverage Over Time):

Month 1 (MVP - 10,000 belge):
├─ Template coverage: 30%
├─ Client (Tesseract): 3,000 belge → ₺0
├─ Server (Azure): 7,000 belge → ₺0 (free tier)
└─ TOTAL: ₺0 ✅
Month 6 (Beta - 50,000 belge):
├─ Template coverage: 70%
├─ Client: 35,000 belge → ₺0
├─ Server: 15,000 belge
│   ├─ First 10,000: ₺0
│   └─ Remaining 5,000: ₺165
└─ TOTAL: ₺165/ay ✅
Month 12 (Production - 200,000 belge):
├─ Template coverage: 90%
├─ Client: 180,000 belge → ₺0
├─ Server: 20,000 belge
│   ├─ First 10,000: ₺0
│   └─ Remaining 10,000: ₺330
└─ TOTAL: ₺330/ay (vs ₺10,000 without templates!) 🎉

10. Event-Driven Architecture
10.1 Event Bus (Redis Pub/Sub)
// infrastructure/event-bus/RedisEventBus.ts
import Redis from 'ioredis';
import { DomainEvent } from '@/domain/events/DomainEvent';
export class RedisEventBus {
  private publisher: Redis;
  private subscriber: Redis;
  private handlers = new Map<string, EventHandler<any>[]>();
  
  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.publisher = new Redis(redisUrl);
    this.subscriber = new Redis(redisUrl);
    this.setupSubscriber();
  }
  
  async publish<T extends DomainEvent>(event: T) {
    // 1. Persist to DB (audit log)
    await this.persistEvent(event);
    
    // 2. Publish to Redis
    await this.publisher.publish(
      event.constructor.name,
      JSON.stringify({ event, attemptCount: 0 })
    );
  }
  
  subscribe<T extends DomainEvent>(
    eventClass: new (...args: any[]) => T,
    handler: (event: T) => Promise<void>,
    options: { maxRetries?: number } = {}
  ) {
    const eventType = eventClass.name;
    
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
      this.subscriber.subscribe(eventType);
    }
    
    this.handlers.get(eventType)!.push({
      handler,
      maxRetries: options.maxRetries ?? 3
    });
  }
  
  private async persistEvent(event: DomainEvent) {
    await prisma.eventLog.create({
      data: {
        eventType: event.constructor.name,
        payload: JSON.stringify(event),
        occurredAt: event.occurredAt
      }
    });
  }
  
  private async retryEvent(eventType: string, event: any, attemptCount: number) {
    const delaySeconds = Math.pow(2, attemptCount); // Exponential backoff
    
    setTimeout(async () => {
      await this.publisher.publish(
        eventType,
        JSON.stringify({ event, attemptCount })
      );
    }, delaySeconds * 1000);
  }
  
  private async moveToDeadLetterQueue(eventType: string, event: any, error: any) {
    await prisma.failedEvent.create({
      data: {
        eventType,
        payload: JSON.stringify(event),
        error: error.message,
        stackTrace: error.stack,
        occurredAt: new Date()
      }
    });
    
    // Alert admin
    await alertService.sendAlert({
      type: 'failed_event',
      eventType,
      error: error.message
    });
  }
}

10.2 Event Catalog
Document Lifecycle:

DocumentCreated
DocumentIssued
DocumentCancelled
DocumentBooked
Accounting:
AccountingEntryCreated
PackageValidated
SubmissionQueued
SubmissionCompleted
SubmissionFailed
Tax:
EstimatedTaxCalculated
FinalizedTaxCalculated
OCR:
ImageUploaded
ExtractionCompleted
UserVerified
DocumentDataReady
Banking:
BankStatementUploaded
AutoMatchingCompleted
ManualMatchRequired
10.3 Event Handler Example
// Setup event handlers (app startup)
import { eventBus } from '@/infrastructure/event-bus';
import { FaturaKesildi, DocumentBooked } from '@/domain/events';
export function setupEventHandlers() {
  
  // Fatura kesildi → Update estimated tax
  eventBus.subscribe(FaturaKesildi, async (event) => {
    await vergiHesaplamaService.tahminiVergiGuncelle(event.orgId);
  }, { maxRetries: 3 });
  
  // Fatura kesildi → Add to accounting queue
  eventBus.subscribe(FaturaKesildi, async (event) => {
    await muhasebeService.kuyruğaEkle(event.faturaId);
  }, { maxRetries: 3 });
  
  // Document booked → Finalize tax calculation
  eventBus.subscribe(DocumentBooked, async (event) => {
    await vergiHesaplamaService.finalizedVergiGuncelle(event.orgId);
  }, { maxRetries: 5 }); // More retries for critical operation
  
  // Submission completed → Send notification
  eventBus.subscribe(SubmissionCompleted, async (event) => {
    await bildirimService.dbysBasariliEmail(event.packageId);
  }, { maxRetries: 1 }); // Email can fail, not critical
}

11. Database Schema
11.1 Core Tables (Prisma Schema)
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
// ============= AUTH & USERS =============
model Organization {
  id              String   @id @default(uuid())
  firmaUnvani     String   @map("firma_unvani")
  vergiNumarasi   String   @unique @map("vergi_numarasi")
  vergiDairesi    String?  @map("vergi_dairesi")
  adres           String?
  telefon         String?
  email           String?
  
  users           User[]
  faturalar       Fatura[]
  cariHesaplar    Cari[]
  templates       DocumentTemplate[]
  
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  @@map("organizations")
}
model User {
  id              String    @id @default(uuid())
  email           String?   @unique
  emailVerified   DateTime? @map("email_verified")
  hashedPassword  String?   @map("hashed_password")
  name            String?
  image           String?
  
  orgId           String    @map("org_id")
  org             Organization @relation(fields: [orgId], references: [id])
  role            String    @default("user") // admin, accountant, user
  
  accounts        Account[]
  sessions        Session[]
  
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  @@map("users")
}
model Account {
  id                String  @id @default(uuid())
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@map("accounts")
}
model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("sessions")
}
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
  @@map("verification_tokens")
}
// ============= DOMAIN MODELS =============
model Fatura {
  id              String   @id @default(uuid())
  orgId           String   @map("org_id")
  org             Organization @relation(fields: [orgId], references: [id])
  
  faturaNo        String   @map("fatura_no")
  seri            String?
  sira            Int?
  faturaTarihi    DateTime @map("fatura_tarihi")
  vadeGunu        Int      @default(0) @map("vade_gunu")
  
  cariId          String   @map("cari_id")
  cari            Cari     @relation(fields: [cariId], references: [id])
  
  tip             String   // satis, alis
  durum           String   @default("taslak") // taslak, kesildi, iptal
  
  araToplam       Decimal  @map("ara_toplam") @db.Decimal(18, 2)
  kdvToplami      Decimal  @map("kdv_toplami") @db.Decimal(18, 2)
  genelToplam     Decimal  @map("genel_toplam") @db.Decimal(18, 2)
  
  satirlar        FaturaSatir[]
  
  // Soft delete
  deletedAt       DateTime? @map("deleted_at")
  
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  @@index([orgId])
  @@index([faturaTarihi])
  @@index([durum])
  @@map("faturalar")
}
model FaturaSatir {
  id              String   @id @default(uuid())
  faturaId        String   @map("fatura_id")
  fatura          Fatura   @relation(fields: [faturaId], references: [id], onDelete: Cascade)
  
  siraNo          Int      @map("sira_no")
  urunAdi         String   @map("urun_adi")
  miktar          Decimal  @db.Decimal(18, 4)
  birim           String   @default("Adet")
  birimFiyat      Decimal  @map("birim_fiyat") @db.Decimal(18, 2)
  kdvOrani        Int      @map("kdv_orani")
  
  tutar           Decimal  @db.Decimal(18, 2)
  kdvTutari       Decimal  @map("kdv_tutari") @db.Decimal(18, 2)
  genelToplam     Decimal  @map("genel_toplam") @db.Decimal(18, 2)
  
  @@map("fatura_satirlari")
}
model Cari {
  id              String   @id @default(uuid())
  orgId           String   @map("org_id")
  org             Organization @relation(fields: [orgId], references: [id])
  
  tip             String   // musteri, tedarikci, her_ikisi
  unvan           String
  vergiNumarasi   String?  @map("vergi_numarasi")
  vergiDairesi    String?  @map("vergi_dairesi")
  
  telefon         String?
  email           String?
  adres           String?
  
  bakiye          Decimal  @default(0) @db.Decimal(18, 2)
  
  faturalar       Fatura[]
  
  deletedAt       DateTime? @map("deleted_at")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  @@index([orgId])
  @@map("cari_hesaplar")
}
// ============= OCR TEMPLATES =============
model DocumentTemplate {
  id              String   @id @default(uuid())
  name            String
  type            String   // fiş, e_fatura, z_rapor, custom
  
  layoutHash      String   @map("layout_hash")
  keywords        String[]
  logoPosition    Json?    @map("logo_position")
  
  // Zone definitions (JSON)
  zones           Json
  
  source          String   @default("system") // system | user_contributed
  usageCount      Int      @default(0) @map("usage_count")
  successRate     Float    @default(0) @map("success_rate")
  
  // Optional: org-specific template
  orgId           String?  @map("org_id")
  org             Organization? @relation(fields: [orgId], references: [id])
  
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  @@index([type])
  @@index([layoutHash])
  @@map("document_templates")
}
// ============= EVENT SOURCING =============
model EventLog {
  id              String   @id @default(uuid())
  eventType       String   @map("event_type")
  payload         Json
  occurredAt      DateTime @map("occurred_at")
  createdAt       DateTime @default(now()) @map("created_at")
  
  @@index([eventType])
  @@index([occurredAt])
  @@map("event_logs")
}
model FailedEvent {
  id              String    @id @default(uuid())
  eventType       String    @map("event_type")
  payload         Json
  error           String
  stackTrace      String?   @map("stack_trace")
  occurredAt      DateTime  @map("occurred_at")
  resolved        Boolean   @default(false)
  resolvedAt      DateTime? @map("resolved_at")
  createdAt       DateTime  @default(now()) @map("created_at")
  
  @@index([eventType])
  @@index([resolved])
  @@map("failed_events")
}

11.2 Row Level Security Policies
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE faturalar ENABLE ROW LEVEL SECURITY;
ALTER TABLE fatura_satirlari ENABLE ROW LEVEL SECURITY;
ALTER TABLE cari_hesaplar ENABLE ROW LEVEL SECURITY;
-- Organizations: Users see only their own org
CREATE POLICY organizations_isolation ON organizations
  FOR ALL
  USING (id = current_setting('app.current_org_id', true)::uuid);
-- Users: See only users in their org
CREATE POLICY users_isolation ON users
  FOR ALL
  USING (org_id = current_setting('app.current_org_id', true)::uuid);
-- Faturalar: Multi-tenant isolation
CREATE POLICY faturalar_isolation ON faturalar
  FOR ALL
  USING (org_id = current_setting('app.current_org_id', true)::uuid);
-- Fatura satirlari: Through parent fatura
CREATE POLICY fatura_satirlari_isolation ON fatura_satirlari
  FOR ALL
  USING (
    fatura_id IN (
      SELECT id FROM faturalar 
      WHERE org_id = current_setting('app.current_org_id', true)::uuid
    )
  );
-- Cari hesaplar: Multi-tenant isolation
CREATE POLICY cari_isolation ON cari_hesaplar
  FOR ALL
  USING (org_id = current_setting('app.current_org_id', true)::uuid);

12. Deployment Strategy
12.1 SaaS Deployment (docker-compose.yml)
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: qnowa-db
    environment:
      POSTGRES_DB: qnowa
      POSTGRES_USER: qnowa
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U qnowa"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
  redis:
    image: redis:7-alpine
    container_name: qnowa-redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
  minio:
    image: minio/minio:latest
    container_name: qnowa-storage
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_USER:-qnowa}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3
    restart: unless-stopped
  app:
    build: .
    container_name: qnowa-app
    environment:
      DATABASE_URL: postgresql://qnowa:${DB_PASSWORD}@postgres:5432/qnowa
      REDIS_URL: redis://redis:6379
      MINIO_ENDPOINT: minio:9000
      MINIO_ACCESS_KEY: ${MINIO_USER}
      MINIO_SECRET_KEY: ${MINIO_PASSWORD}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      RESEND_API_KEY: ${RESEND_API_KEY}
      AZURE_ENDPOINT: ${AZURE_ENDPOINT}
      AZURE_KEY: ${AZURE_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      minio:
        condition: service_healthy
    ports:
      - "3000:3000"
    restart: unless-stopped
  nginx:
    image: nginx:alpine
    container_name: qnowa-nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - app
    restart: unless-stopped
volumes:
  postgres_data:
  redis_data:
  minio_data:

12.2 On-Premise Installation
One-command setup for banks:

# 1. Clone repository
git clone https://github.com/qnowa/qnowa-on-premise.git
cd qnowa-on-premise
# 2. Configure environment
cp .env.example .env
nano .env
# Set:
# - DB_PASSWORD
# - MINIO_PASSWORD
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
# 3. Start all services
docker-compose up -d
# 4. Run migrations
docker-compose exec app npx prisma migrate deploy
# 5. Create admin user
docker-compose exec app npm run seed:admin
# Done! Access at https://your-server.local

Files included in on-premise package:

docker-compose.yml
.env.example
nginx.conf
README.md (Turkish installation guide)
backup.sh (automated backup script)
update.sh (update script)
12.3 Backup Strategy
Daily Automated Backups:

#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/qnowa"
# 1. PostgreSQL backup
docker-compose exec -T postgres pg_dump -U qnowa qnowa > \
  "$BACKUP_DIR/db_$DATE.sql"
# 2. MinIO backup (files)
docker-compose exec -T minio mc mirror \
  /data "$BACKUP_DIR/files_$DATE"
# 3. Compress
tar -czf "$BACKUP_DIR/qnowa_backup_$DATE.tar.gz" \
  "$BACKUP_DIR/db_$DATE.sql" \
  "$BACKUP_DIR/files_$DATE"
# 4. Keep last 30 days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete
# 5. Upload to remote (optional)
# rclone copy "$BACKUP_DIR/qnowa_backup_$DATE.tar.gz" remote:backups/

3-2-1 Backup Rule:

3 copies of data
2 different storage types (local + cloud)
1 offsite copy
13. Cost Analysis
13.1 MVP Phase (0-6 months, 100 mükellef)
Item	Provider	Cost/Month
Hosting	DedicatedSolutions (4vCPU, 8GB RAM, 100GB SSD)	₺899
Domain	qnowa.com.tr	₺12
SSL	Let's Encrypt	₺0
Email	Resend (3K emails/month free)	₺0
OCR	Azure AI Document (10K pages/month free)	₺0
Monitoring	Uptime Robot + Sentry (free tiers)	₺0
Redis	Self-hosted	₺0
MinIO	Self-hosted	₺0
Total		₺911
Revenue Projection:		
Users: 100 mükellef
ARPU: ₺50/month
MRR: ₺5,000
Profit Margin: 82%
13.2 Beta Phase (6-12 months, 500 mükellef)
Item	Provider	Cost/Month
Hosting	Netinternet (4vCPU, 8GB RAM, 100GB SSD)	₺1,200
Domain	qnowa.com.tr	₺12
Email	Resend (free tier sufficient)	₺0
OCR	Azure AI (50K pages: 10K free + 40K paid)	₺1,330
Monitoring	Uptime Robot + Sentry	₺0
Other	Self-hosted services	₺0
Total		₺2,542
Revenue Projection:		
Users: 500 mükellef
ARPU: ₺50/month
MRR: ₺25,000
Profit Margin: 90%
13.3 Production Phase (12+ months, 2,000 mükellef)
Item	Provider	Cost/Month
Hosting	Netinternet (4vCPU, 8GB RAM, 100GB SSD)	₺1,200
Domain	qnowa.com.tr	₺12
Email	Resend ($20/month = 50K emails)	₺650
OCR	Azure AI (20K pages: 90% template coverage)	₺330
Backup Storage	External backup (100GB)	₺200
Monitoring	Uptime Robot + Sentry	₺0
Total		₺2,392
Revenue Projection:		
Users: 2,000 mükellef
ARPU: ₺50/month
MRR: ₺100,000
Profit Margin: 97.6% 🎉
13.4 Cost Optimization Notes
OCR Cost Reduction Over Time:

Month 1:  30% template coverage → ₺0 (free tier)
Month 6:  70% template coverage → ₺165/month
Month 12: 90% template coverage → ₺330/month
Without templates: ₺10,000/month
With templates: ₺330/month
SAVINGS: 96.7% 💰

Scaling Strategy:

MVP: DedicatedSolutions (₺899/ay)
Beta+: Netinternet (₺1,200/ay)
Enterprise: Multi-server setup if needed
14. Implementation Roadmap
14.1 Phase 1: MVP (Weeks 1-12)
Week 1-2: Foundation & Setup
 Project initialization (Next.js 15 + TypeScript)
 Docker Compose setup (local development)
 Prisma schema design (core tables)
 PostgreSQL + Redis + MinIO containers
 NextAuth.js integration (Email + Password)
 Basic UI components library (Tailwind)
 Git repository + GitHub Actions CI
Week 3-4: Document Management
 Fatura model (Prisma schema)
 Fatura CRUD operations
 Cari hesap yönetimi
 Dynamic form (fatura satırları)
 Calculation logic (KDV, totals)
 PDF generation (basic)
Week 5-6: E-Fatura Integration
 Entegratör API client
 Fatura gönderimi (test environment)
 Status tracking (sent → issued → cancelled)
 Error handling & retry logic
 GİB test environment integration
Week 7-8: OCR Prototype
 Image upload component
 Tesseract.js client-side setup
 Zone-based extraction (basic)
 Form auto-fill from OCR data
 User review & correction UI
Week 9-10: Auth & Multi-tenancy
 Organization model & onboarding
 RLS policies (PostgreSQL)
 Role-based access control
 Resend email integration
 Magic Link authentication
Week 11-12: Polish & Deploy
 UI/UX improvements
 E2E testing (Playwright)
 Production deployment (DedicatedSolutions)
 SSL + domain setup (qnowa.com.tr)
 Monitoring setup (Uptime Robot + Sentry)
 Beta user onboarding (10-20 test users)
Milestone: Working MVP with 100 test users
14.2 Phase 2: Beta (Weeks 13-24)
Week 13-15: OCR Enhancement
 Template database schema
 Azure Document Intelligence integration
 Template matcher algorithm
 Guided camera mode
 Auto-capture (rectangle detection)
 Template editor UI (basic)
Week 16-18: DBYS Prototype
 Playwright browser automation setup
 DBYS form mapping (manual)
 Auto-fill logic
 Validation & preview
 Error handling
Week 19-21: Event System
 Redis Pub/Sub setup
 Event bus implementation
 Retry logic + exponential backoff
 Dead letter queue
 Event-driven workflows (tax calculation)
Week 22-24: Accounting & Tax
 Muhasebe kaydı (otomatik)
 Vergi hesaplama servisi
 Dashboard widgets
 Reporting (basic)
 Beta launch (500 users)
Milestone: Beta with 500 paying users
14.3 Phase 3: Production (Weeks 25-48)
Week 25-30: DBYS Full Automation
 %95+ otomasyon hedefi
 Advanced error recovery
 Success metrics & analytics
 Admin panel (failed submissions)
Week 31-36: Advanced Features
 Banka eşleştirme (AI-powered)
 Stok yönetimi (basic)
 Advanced analytics dashboard
 Mobil responsive improvements
 Performance optimization
Week 37-42: Scale & Optimize
 Database query optimization
 Caching strategy (Redis)
 Load testing (10K concurrent users)
 CDN setup (static assets)
 Horizontal scaling preparation
Week 43-48: Enterprise Ready
 On-premise Docker Compose package
 Bank pilot program
 Public API documentation
 Webhook system
 Production launch (2,000+ users)
Milestone: Production-ready with enterprise features
15. Success Metrics
15.1 Product KPIs
Metric	Target (12 months)	How to Measure
Monthly Active Users (MAU)	2,000	Unique users logged in per month
Invoice Volume	200,000/month	Total invoices issued
OCR Accuracy	>90%	Correct fields / Total fields
Template Coverage	>80%	Client-side OCR / Total OCR
DBYS Automation Rate	>95%	Auto-filled fields / Total fields
Net Promoter Score (NPS)	>50	User survey
Monthly Churn Rate	<5%	Cancelled users / Total users
15.2 Technical KPIs
Metric	Target	How to Measure
API Response Time (p95)	<200ms	Server logs
Uptime	99.9%	Uptime Robot
Error Rate	<0.1%	Sentry
OCR Processing Time (Client)	<5s	Client-side timing
OCR Processing Time (Server)	<10s	Server logs
DBYS Submission Time	<30s	Playwright agent logs
Database Query Time (p95)	<50ms	Prisma logs
15.3 Business KPIs
Metric	Target (12 months)	How to Measure
Monthly Recurring Revenue (MRR)	₺100,000	Stripe/payment data
Average Revenue Per User (ARPU)	₺50/month	MRR / Active users
Customer Acquisition Cost (CAC)	<₺100	Marketing spend / New users
Lifetime Value (LTV)	>₺1,000	ARPU × Average customer lifetime
LTV:CAC Ratio	>10:1	LTV / CAC
Profit Margin	>90%	(Revenue - Costs) / Revenue
Payback Period	<2 months	CAC / ARPU
16. Risks & Mitigations
16.1 Technical Risks
Risk	Impact	Probability	Mitigation
OCR accuracy below expectations	High	Medium	Template system + Azure fallback + user feedback loop
DBYS agent failures	High	Medium	Retry logic + manual override + error monitoring + alerts
RLS policy bypass	Critical	Low	Dual-layer security (DB + App) + penetration testing + security audits
Data loss	Critical	Low	3-2-1 backup strategy + daily automated backups + disaster recovery plan
Performance degradation	Medium	Medium	Database indexing + Redis caching + load testing + horizontal scaling prep
Template matching failures	Medium	Low	Fallback to Azure + User can manually select template type
16.2 Business Risks
Risk	Impact	Probability	Mitigation
GİB regulation changes	High	Medium	Monitor official announcements + flexible architecture + quick adaptation cycle
Competitor price war	Medium	High	Differentiate on features (OCR, automation, UX) + focus on value over price
Low user adoption	High	Medium	Free tier + referral program + content marketing + accountant partnerships
Single hosting provider dependency	Medium	Low	Docker portability + multi-datacenter strategy (Phase 2)
Bank deal doesn't materialize	Medium	Medium	Focus on SMB market + multiple revenue streams
16.3 Legal & Compliance Risks
Risk	Impact	Probability	Mitigation
KVKK violation	Critical	Low	Legal compliance review + KVKK certification + privacy audit
Data breach	Critical	Low	Encryption (rest + transit) + penetration testing + cyber insurance
Tax calculation errors	High	Medium	Disclaimer + require accountant review + limit liability in ToS
E-invoice integrator license issues	High	Low	Choose licensed integrator + backup integrator option
GİB API access revoked	Critical	Very Low	Maintain good standing + follow all regulations + backup manual process
Appendix
A. Glossary
Turkish Accounting Terms:

Turkish	English	Definition
Mükellef	Taxpayer	Business or individual liable for tax
Mali Müşavir	CPA / Accountant	Certified public accountant
E-Fatura	E-Invoice	Electronic invoice (B2B)
E-Arşiv	E-Archive	Electronic archive invoice (B2C)
DBYS	Tax Declaration System	Defter Beyan Sistemi - online tax filing
GİB	Revenue Administration	Gelir İdaresi Başkanlığı
KVKK	GDPR (Turkey)	Personal Data Protection Law
Entegratör	Integrator	E-invoice integration provider
Cari	Party	Customer or supplier
KDV	VAT	Value Added Tax
Gelir Vergisi	Income Tax	Personal/corporate income tax
Stopaj	Withholding Tax	Tax withheld at source
Muhasebe	Accounting	Bookkeeping and accounting
Muhasebeleştirme	Booking	Recording in accounting system
B. References
Official Documentation:

GİB E-Fatura: https://ebelge.gib.gov.tr
DBYS API: https://ivd.gib.gov.tr
KVKK Law: https://kvkk.gov.tr
Technology Documentation:
Next.js: https://nextjs.org/docs
Prisma: https://prisma.io/docs
Playwright: https://playwright.dev
Tesseract.js: https://tesseract.projectnaptha.com
Azure Document Intelligence: https://learn.microsoft.com/azure/ai-services/document-intelligence
C. Change Log
Version	Date	Changes	Author
1.0	2026-01-15	Initial draft	Kerem Erdoğdu
2.0	2026-02-10	Tech stack finalized, DDD architecture added, OCR system detailed, Event-driven architecture, Cost analysis updated, Implementation roadmap expanded	Kerem Erdoğdu
Document Status: FINALIZED ✅  
Next Review: March 2026  
Approved By: Kerem Erdoğdu
END OF DOCUMENT

Burda sen bana 15 yıllık muhasebe yazılımları üzerine çalışmış ddd konusunda da uzman bir yazılım mühendisi gibi düşünüp çalışarak plan yapmamız için netleştirmemiz gereken yerleri sor netleştirelim planı yapalım projeye planı ekleyelim

Hem ddd yöntemini kullanalım istiyorum hem ocr + azure gibi bir planım vardı evrak okumak için hem dbys için bir robot planımız vardı

sen bir prd yi incele sonra üzerine konuşalım

Show more


Bu çok kapsamlı ve iyi hazırlanmış bir PRD. Detaylı inceleyeceğim - hem teknik mimari hem de domain açısından. Önce birkaç kritik noktayı netleştirmem gerekiyor.


Gathered e-invoicing integration requirements from user

Çok iyi, cevaplarınız önemli noktaları netleştirdi. Birkaç kritik soru daha sormam gerekiyor - özellikle entegratör ve DBYS konularında.


Collected user preferences for e-invoice integrator selection

Mükemmel, artık çok net bir resim oluştu. Şimdi 15 yıllık muhasebe yazılımı deneyimiyle ve DDD uzmanlığıyla bu PRD'yi derinlemesine analiz edip planı hazırlıyorum.


Searched the web, updated todo list, ran an agent
Show more
Show more

Şimdi plan ajanının tasarımını ve PRD'yi birleştirerek kapsamlı planı yazıyorum.

planımız hazır mı ne durumdayız?



Created implementation plan for QNOWA accounting platform

Plan hazir! Ozetlememe izin ver:

12 haftalik MVP plani:

Hafta	Icerik
1-2	Temel altyapi: Next.js + DDD iskeleti + Docker + Auth + Prisma + RLS
3-4	Auth + Organization + Kullanici yonetimi
5-6	Cari Hesap yonetimi (fatura icin on kosul)
7-9	Fatura yonetimi (core domain - en kritik kisim) + Event Bus
10	Basit muhasebe (FaturaKesildi → otomatik yevmiye kaydi)
11	OCR prototype (Tesseract.js + Azure fallback)
12	QNB e-Finans entegrasyonu + production deployment
Mimari kararlar:

Tek Next.js repo (DDD katmanlari klasor yapisinda)
Prisma Client Extension ile otomatik RLS
Redis Pub/Sub event bus (domain event'ler)
DBYS robotu ayri worker process (BullMQ + Playwright)
OCR: client-first (Tesseract.js) → server fallback (Azure)
Plan dosyasini yukarida gorebilirsiniz. Onaylarsan implementation'a baslayalim.


Reviewed and rejected comprehensive implementation plan for QNOWA SaaS platform

Haklisiniz, server ve database konusunu atladim. Onceki planda VPS + self-hosted PostgreSQL karari verilmis ama detaylarini konusmamiz gerekiyor.


Clarified database preference and integration requirements with stakeholder

Cok onemli bir soru sordunuz - guvenlik aciklari. Bunu bir hacker goruyle analiz edip plana ekleyecegim. Once mevcut plani okuyayim, sonra guncelleyeyim.


Read a file

Simdi plani tamamen yeniden yapilandiriyorum: Phase'lere boluyorum, guvenlik analizini ekliyorum, server/database kararlarini netlestiriyorum.

Tamamlayınca bu halini proje içinde uygun bir klasör yapısı oluşturup yazar mısın



Created QNOWA implementation plan document for Turkish accounting platform

Plan tamamlandi. Iste ozet:

7 Phase, 24 hafta:

Phase	Hafta	Icerik
0: Foundation	1-2	Proje iskeleti, Docker, DDD base, guvenlik temelleri
1: Identity	3-4	Auth, org, roller, RLS, multi-tenancy
2: Core Domain	5-9	Cari (5-6) → Fatura (7-8) → Muhasebe (9)
3: Intelligence	10-11	OCR: Tesseract.js + Azure fallback
4: Integration	12-14	QNB e-Finans + Production deploy + On-premise paket
5: Automation	15-18	DBYS robot + Template sistemi + Bildirimler
6: Scale	19-24	Banka eslestirme, analytics, pentest
Guvenlik analizi: 10 kritik acik tanimlandi, her biri icin "bastan yapilacak" onlemler plana islendi.

Server/DB karari: Self-hosted PostgreSQL (Docker) - Supabase degil, cunku QNB on-premise istegi var.

Plani onaylarsan, projeye uygun bir klasor yapisi olusturup icerisine yazacagim (plan mode'dan cikmam gerekiyor bunun icin).


Approved implementation plan for QNOWA ERP/CRM platform project

Plan onaylandi. Simdi plani proje icine uygun bir klasor yapisiyla yaziyorum.


You've hit your limit · resets Feb 17, 5pm (Europe/Istanbul)
Update Todos
 Proje icinde docs/ klasoru olusturup plani yaziyor

You've hit your limit · resets Feb 17, 5pm (Europe/Istanbul)

QNOWA - Implementation Plan v2

Context
Qnowa, Turkiye'deki mukellefler ve mali musavirler icin e-fatura, e-arsiv, defter-beyan ve muhasebe sureclerini tek platformda yoneten web-based SaaS ERP/CRM platformudur. Proje sifirdan basliyor. Bu plan PRD v2.0'dan turetilmistir.

Kritik Kararlar:

Entegrator: QNB e-Finans (QNB Dijital Kopru ile gorusme halinde)
DBYS: Playwright full otomasyon (mali musavir tetikler, robot doldurur/gonderir)
On-premise ready: QNB kendi serverlarinda da calistirmak istiyor → Docker Compose portable
Database: Self-hosted PostgreSQL (Docker icinde, on-premise uyumlu)
Hosting: Turkiye'de VPS (provider MVP yakininda sesilecek)
Repo: Tek Next.js repo, DDD katman ayrimini klasor yapisiyla saglariz
GUVENLIK ANALIZI (Hacker Perspektifi)
10 yillik ERP/muhasebe sistemlerinden veri sizdirmis bir hacker olarak bu sisteme baktigimda su aciklari goruyorum:

KRITIK ACIKLAR & ONLEMLER
1. IDOR (Insecure Direct Object Reference) - YUKSEK RISK
Saldiri: /api/fatura/[id] endpoint'ine baska org'un fatura ID'sini gonderme Neden tehlikeli: Mali veri sizintisi, fatura bilgileri rakiplere gider Onlem (Bastan yapilacak):

PostgreSQL RLS her tabloda ZORUNLU (tek basina yeterli degil)
Repository katmaninda EXPLICIT orgId kontrolu (defense in depth)
tRPC middleware'de orgId injection (kullanicidan ASLA orgId almiyoruz)
Fatura ID'leri UUID (tahmin edilemez), asla sequential integer degil
2. MALI MUSAVIR CREDENTIAL STORAGE - KRITIK RISK
Saldiri: DB'ye erisim → mali musavirin GIB sifresini ele gecirme → DBYS'de sahte beyanname Neden tehlikeli: Devlet portalina erisim, mali suc, cok buyuk hukuki sorumluluk Onlem (Bastan yapilacak):

GIB sifreleri DB'de ASLA plain text saklanmaz
AES-256-GCM ile sifreleme, encryption key .env'de (DB'de degil)
On-premise'de: key HSM veya vault'ta
Sifre cozme SADECE DBYS worker icinde, sadece kullanim aninda
Audit log: Kim, ne zaman, hangi mukellef icin DBYS'ye girdi
Session token'lar short-lived (max 1 saat)
3. TENANT ISOLATION BYPASS - KRITIK RISK
Saldiri: RLS policy hatasi veya Prisma raw query ile baska org'un verisine erisim Neden tehlikeli: Tum musteri verisi tek DB'de, bir gedik = tum veriler Onlem (Bastan yapilacak):

RLS policy'leri AYRI migration dosyasi, code review zorunlu
$queryRaw ve $executeRaw YASAKLI (lint rule ile enforce)
Her raw SQL zorunlu olursa security review gerekir
Integration testlerde: "Org A, Org B'nin verisini goremez" testi ZORUNLU
Prisma middleware: orgId olmadan query BLOKLA
4. SESSION HIJACKING / AUTH BYPASS - YUKSEK RISK
Saldiri: Session token calma, CSRF, session fixation Onlem (Bastan yapilacak):

NextAuth.js session strategy: JWT (stateless, server-side validation)
HttpOnly + Secure + SameSite=Strict cookie'ler
CSRF token her mutating request'te
Session rotation: Login sonrasi yeni session ID
Rate limiting: Login endpoint'te brute force korumasl (10 deneme/5dk)
IP-based suspicious activity detection (farkli ulkeden giris → email uyari)
5. FATURA MANIPULASYONU - YUKSEK RISK
Saldiri: Kesilmis faturayi DB'den degistirme, tutar manipulasyonu Neden tehlikeli: Vergi kacirma, hukuki sorumluluk Onlem (Bastan yapilacak):

Fatura kesildi → IMMUTABLE (domain rule: durum KESILDI ise UPDATE YASAK)
Audit log: Fatura uzerindeki her degisiklik event olarak kaydedilir
Event log tablosu: APPEND-ONLY (DELETE/UPDATE yok, DB seviyesinde trigger)
Fatura hash'i: genelToplam + faturaNo + tarih → SHA256 hash sakla
Dogrulama: hash uyusmazligi → ALERT
6. OCR/FILE UPLOAD SALDIRISI - ORTA RISK
Saldiri: Malicious file upload (PHP shell, SVG XSS, zip bomb) Onlem (Bastan yapilacak):

File type validation: SADECE JPEG, PNG, PDF, WEBP (magic bytes kontrolu, extension yetmez)
Max file size: 10MB (zip bomb korumasl)
MinIO'da ayri bucket, public erisim YOK
Dosya adi: UUID ile yeniden adlandir (path traversal onlemi)
OCR sonucu sanitization: HTML/script injection temizle
Content-Type header dogrulama
7. REDIS EVENT BUS INJECTION - ORTA RISK
Saldiri: Redis'e erisim → sahte event publish → sahte fatura/muhasebe kaydi Onlem (Bastan yapilacak):

Redis AUTH zorunlu (sifresiz Redis = acik kapi)
Redis sadece internal network'ten erisilebilir (Docker network izolasyonu)
Event payload'da orgId + userId dogrulama
Event handler'larda domain validation tekrar calistirilir (trust but verify)
8. SQL INJECTION (Prisma ile azaltilmis ama...) - ORTA RISK
Saldiri: Raw query kullanimi varsa, parametre injection Onlem (Bastan yapilacak):

Prisma ORM ZORUNLU, raw query YASAKLI
Eger raw SQL zorunluysa: SADECE parameterized query ($1, $2...)
tRPC input validation: zod schema'lar ile her input dogrulanir
ASLA string concatenation ile SQL olusturma
9. API RATE LIMITING EKSIKLIGI - ORTA RISK
Saldiri: Brute force login, API abuse, scraping Onlem (Bastan yapilacak):

Rate limiter middleware (upstash/ratelimit veya redis-based)
Login: 10 deneme/5dk, sonra CAPTCHA veya gecici kilit
API: 100 req/dk per user
OCR endpoint: 20 req/dk (Azure maliyeti korumasI)
tRPC mutation'lar icin ayri limit
10. DBYS ROBOT GÜVENLIGI - YUKSEK RISK
Saldiri: Worker process'e erisim → tum mali musavirlerin GIB giris bilgileri Onlem (Bastan yapilacak):

DBYS worker ayri Docker container, minimal network erisimi
Worker sadece BullMQ queue'dan job alir, disariya baglanamaz (GIB harici)
Her job tamamlandiginda credential memory'den silinir
Worker container'da file system read-only
Playwright browser --no-sandbox KULLANILMAZ (sandbox zorunlu)
GUVENLIK CHECKLIST (Her Phase'de)
 Yeni endpoint → orgId kontrolu var mi?
 Yeni tablo → RLS policy eklendi mi?
 Yeni input → zod validation var mi?
 Yeni file upload → type + size check var mi?
 Hassas veri → sifrelenmis mi?
 Yeni event → handler'da domain validation var mi?
PHASE YAPISI
Phase 0: Foundation (Hafta 1-2)
Proje iskeleti, dev ortami, guvenlik temelleri

Phase 1: Identity & Access (Hafta 3-4)
Auth, organization, roller, RLS - her seyin temeli

Phase 2: Core Domain (Hafta 5-9)
Cari + Fatura + Muhasebe - is mantigi

Phase 3: Intelligence (Hafta 10-11)
OCR sistemi - fark yaratan ozellik

Phase 4: Integration & Deploy (Hafta 12-14)
QNB e-Finans + production deployment + guvenlik hardening

Phase 5: Automation (Hafta 15-18) [Post-MVP]
DBYS robot, template sistemi, bildirimler

Phase 6: Scale (Hafta 19-24) [Beta]
Banka eslestirme, advanced analytics, performans optimizasyonu

Phase 0: Foundation (Hafta 1-2)
Amac: Projeyi ayaga kaldir, DDD iskeletini kur, guvenlik temellerini at.

Server & Database:

Docker Compose (dev): PostgreSQL 16 + Redis 7 + MinIO
PostgreSQL: Docker container icinde, docker-compose.dev.yml'den ayaga kalkar
On-premise uyumlu: Tum servisler Docker'da, dis bagimlilk YOK
Production'da da ayni Docker Compose, sadece volume'lar persistent
Yapilacaklar:

 npx create-next-app@latest qnowa --typescript --tailwind --app --src-dir
 DDD klasor yapisi olustur (domain/, application/, infrastructure/, presentation/)
 Docker Compose (dev): PostgreSQL 16 + Redis 7 (AUTH enabled) + MinIO
 Prisma setup: schema.prisma (Organization, User, Account, Session)
 DDD base class'lari: AggregateRoot, Entity, ValueObject, DomainEvent
 Shared value object'ler: Money, VergiNumarasi, Donem
 Prisma Client Extension (RLS - SET app.current_org_id)
 tRPC kurulumu (server + client + context with orgId injection)
 Temel UI shell: layout, sidebar, header (Tailwind)
 Guvenlik temelleri:
 Rate limiter middleware (Redis-based)
 CSRF protection setup
 Security headers (Helmet.js veya Next.js config)
 ESLint rule: $queryRaw ve $executeRaw yasakla
 .env.example (hassas degerler icin placeholder)
 ESLint + Prettier + Vitest config
 GitHub Actions: lint + type-check + test
 Domain katmani icin ilk unit testler (Money, VergiNumarasi)
Kritik dosyalar:

src/domain/shared/base/AggregateRoot.ts
src/domain/shared/value-objects/Money.ts
src/infrastructure/database/prisma-client.ts (RLS extension)
docker-compose.dev.yml
.env.example
Dogrulama:

docker-compose up → PostgreSQL, Redis, MinIO ayakta
npm run test → Money, VergiNumarasi testleri geciyor
npm run type-check → TypeScript hata yok
Phase 1: Identity & Access (Hafta 3-4)
Amac: Kullanici girisi, organizasyon, roller, multi-tenancy guvenligin temeli.

Yapilacaklar:

 NextAuth.js 5 kurulumu (Email/Password + Magic Link)
 Sifre hashleme: bcrypt (min 12 rounds)
 Kayit sayfasi: Org olustur + admin user
 Giris sayfasi: Email/sifre + Magic Link
 Organization domain aggregate
 User role sistemi (ADMIN, USER, ACCOUNTANT)
 Middleware: Auth guard (session dogrulama, HttpOnly cookie)
 Middleware: Org context (orgId'yi Prisma'ya set et)
 RLS policy'leri (SQL migration) - TUM tablolar
 Rate limiting: Login 10 deneme/5dk
 Session config: Secure + SameSite=Strict + HttpOnly
 Ayarlar sayfasi: Org bilgileri guncelleme
 Kullanici davet sistemi (email ile)
 Resend email entegrasyonu (magic link + davet)
 Seed script: Test org + test kullanici
 Integration test: Org A, Org B izolasyonu
Guvenlik testleri (bu phase'de zorunlu):

 Test: Org A kullanicisi, Org B verisine erisemiyor (RLS)
 Test: Gecersiz session token → 401
 Test: Rate limit asildiktan sonra login bloklanir
 Test: CSRF token olmadan mutation → 403
Kritik dosyalar:

src/infrastructure/auth/next-auth.config.ts
src/presentation/app/(auth)/giris/page.tsx
src/presentation/app/(auth)/kayit/page.tsx
prisma/migrations/XXXX_rls_policies.sql
Dogrulama:

Kayit → Giris → Dashboard gorunuyor
Farkli org'lar birbirinin verisini goremiyor (RLS test)
Yanlis sifre 10 kez → gecici kilit
Phase 2: Core Domain (Hafta 5-9)
Amac: Is mantigi: Cari hesap, fatura, muhasebe - sistemin kalbi.

Phase 2a: Cari Hesap (Hafta 5-6)
Yapilacaklar:

 Cari domain aggregate: tip, unvan, vergiNo, bakiye
 CariTip value object: MUSTERI | TEDARIKCI | HER_IKISI
 Cari repository interface + Prisma implementation
 Application layer: CariOlustur, CariGuncelle, CariListele, CariGetir
 tRPC router: cariRouter (input validation: zod)
 UI: Cari listesi (tablo, arama, filtreleme)
 UI: Cari ekleme/duzenleme formu
 UI: Cari detay sayfasi
 Vergi numarasi format kontrolu (domain VO'da)
 Soft delete implementasyonu
 Unit test: Cari aggregate business rules
 Integration test: CRUD + RLS
Phase 2b: Fatura (Hafta 7-8)
Yapilacaklar:

 Fatura domain aggregate: Fatura.ts
satirEkle(), satirSil(), hesapla()
kes() → TASLAK → KESILDI + FaturaKesildi event
iptalEt() → validation
 FaturaSatir entity: miktar * birimFiyat, KDV
 FaturaDurum value object: TASLAK | KESILDI | IPTAL
 FaturaNumarasi value object: Seri + Sira (org bazli otomatik artan)
 Fatura repository + Prisma implementation
 Redis Event Bus implementation (ioredis, AUTH enabled)
 FaturaKesildi event handler → cari bakiye guncelle
 Application layer: FaturaOlustur, FaturaKes, FaturaIptal, FaturaListele
 tRPC router: faturaRouter (zod validation)
 UI: Fatura listesi (durum filtreleme, tarih araligi)
 UI: Fatura olusturma formu (dinamik satirlar, canli hesaplama)
 UI: Fatura detay + onizleme
 PDF olusturma (basit)
 Guvenlik: Kesilmis fatura immutable (domain + DB trigger)
 Guvenlik: Fatura hash (SHA256) sakla
 Audit log: Fatura degisiklikleri event_logs'a
 Unit test: Fatura hesaplama, durum gecisleri
 Integration test: Event bus, cari bakiye guncelleme
Phase 2c: Muhasebe (Hafta 9)
Yapilacaklar:

 YevmiyeKaydi aggregate: borc/alacak satirlari
 YevmiyeSatir entity: hesapKodu, tutar, borcAlacak
 Hesap Plani tablosu (Tek Duzen Hesap Plani seed data)
 FaturaKesildi → Otomatik yevmiye kaydi (event handler)
Satis: 120 Alicilar / 600 Satislar + 391 KDV
Alis: 153 Ticari Mallar + 191 KDV / 320 Saticilar
 tRPC router: muhasebeRouter
 UI: Yevmiye kayitlari listesi
 UI: Borc-alacak raporu
 Guvenlik: Yevmiye kayitlari append-only (silme/degistirme yok)
 Unit test: Borc = Alacak kontrolu (muhasebe kurali)
Phase 2 Dogrulama:

Cari ekle → Fatura olustur (o cariye) → Fatura kes → Otomatik yevmiye kaydi olusur
Cari bakiyesi otomatik guncellenir
Kesilmis fatura degistirilemez
Farkli org'lar birbirinin faturalarini goremiyor
Phase 3: Intelligence (Hafta 10-11)
Amac: OCR ile gorsel okuma - sistemin fark yaratan ozelligi.

Yapilacaklar:

 Gorsel yukleme component'i (drag & drop + kamera)
 File upload guvenlik:
 Magic bytes kontrolu (sadece JPEG/PNG/PDF/WEBP)
 Max 10MB
 Dosya adi UUID ile yeniden adlandir
 MinIO'da private bucket
 Tesseract.js Web Worker setup
 Basit zone-based extraction (header: tarih/no, footer: toplam/KDV)
 Keyword matching (TOPLAM, KDV, TARIH, vb.)
 Confidence scoring
 Azure Document Intelligence API entegrasyonu (fallback)
 Client confidence < 70% → Server'a otomatik yonlendirme
 OCR sonucu sanitization (XSS temizle)
 Sonuclari fatura formuna doldurma
 Kullanici duzeltme/onay UI
 MinIO'ya gorsel kaydetme
 OCR rate limiting: 20 req/dk per user
 Unit test: Zone extraction, keyword matching
 E2E test: Upload → OCR → Form doldurma
Dogrulama:

Migros fisi yukle → tarih, toplam, KDV okunuyor
Dusuk kaliteli gorsel → Azure'a fallback calisıyor
Malicious file (PHP, SVG) → reddediliyor
Phase 4: Integration & Deploy (Hafta 12-14)
Amac: QNB e-Finans entegrasyonu + production'a cikis + guvenlik hardening.

Phase 4a: QNB e-Finans (Hafta 12-13)
Yapilacaklar:

 QNB e-Finans API client (test ortami)
 Fatura → UBL-TR XML donusumu
 Fatura gonderim flow'u (gonder → durum takibi)
 Hata yonetimi + retry (exponential backoff)
 QNB API key'leri: sifrelenmis saklama (AES-256-GCM)
 Integration test: Test fatura gonderimi
Phase 4b: Production Deploy (Hafta 13-14)
Server Yapisi:

Turkiye VPS (Istanbul datacenter)
├── Nginx (reverse proxy + SSL termination)
├── Docker Compose:
│   ├── Next.js App (app container)
│   ├── PostgreSQL 16 (db container, persistent volume)
│   ├── Redis 7 (cache container, AUTH enabled, persistent)
│   └── MinIO (storage container, persistent volume)
└── Certbot (Let's Encrypt auto-renewal)
Yapilacaklar:

 Dockerfile (multi-stage build: deps → build → runtime)
 docker-compose.yml (production)
 docker-compose.on-premise.yml (QNB icin, tum servisler dahil)
 nginx.conf (reverse proxy, SSL, security headers, rate limit)
 Production .env template
 SSL setup (Let's Encrypt / Certbot)
 Guvenlik hardening:
 Docker container'lar non-root user ile calisir
 PostgreSQL: sadece app container'dan erisim (Docker network)
 Redis: AUTH + bind 127.0.0.1 (Docker network icinden)
 MinIO: internal network only, public erisim yok
 Nginx: security headers (HSTS, X-Frame-Options, CSP)
 Firewall: sadece 80/443 portu acik
 Backup script (PostgreSQL + MinIO, daily, 30 gun retention)
 Sentry error tracking
 Uptime Robot monitoring
 Health check endpoint'leri
 Beta kullanici onboarding (10-20 test user)
On-Premise Paket (QNB icin):

 docker-compose.on-premise.yml (tum servisler dahil)
 .env.example (on-premise icin)
 install.sh (tek komutla kurulum)
 backup.sh (otomatik yedekleme)
 update.sh (guncelleme script'i)
Dogrulama:

Production'da site aciliyor (HTTPS)
QNB test ortamina fatura gonderilebiliyor
Docker Compose on-premise: tek komutla ayaga kalkiyor
Sentry'de hatalar gorunuyor
Backup + restore calisiyor
Phase 5: Automation (Hafta 15-18) [Post-MVP]
Amac: DBYS robotu, gelismis OCR template sistemi, bildirimler.

DBYS Robot:

 BullMQ queue setup (Redis-backed)
 DBYS worker (ayri Docker container)
 Mali musavir GIB credential sifreleme (AES-256-GCM)
 Page Object Pattern: Login → Mukellef Sec → Form Doldur → Gonder
 CAPTCHA handler (mali musavire bildirim)
 Job status tracking (pending/running/success/failed)
 Retry logic (max 3, exponential backoff)
 Audit log: Her DBYS isleml
 Worker container guvenlik:
 Minimal network (sadece GIB + Redis)
 Read-only filesystem
 Credential memory'den hemen temizle
 Playwright sandbox MODE
OCR Template Sistemi:

 Template database schema (zones, keywords, fingerprint)
 Template matcher algorithm (keyword + layout hash)
 Template editor UI (mali musavir kendi template'ini olusturabilir)
 Guided camera mode
 Auto-capture (rectangle detection)
Bildirimler:

 In-app notification sistemi
 Email notifications (Resend)
 Eksik belge uyarilari (mali musavir icin)
Phase 6: Scale (Hafta 19-24) [Beta]
Amac: 500 kullaniciya olcekleme, gelismis ozellikler.

 Banka eslestirme (Excel yukle → otomatik match)
 Vergi hesaplama dashboard widget'i
 Advanced analytics (satis trendleri, karlilik)
 Database query optimization (index'ler, query plan analizi)
 Redis caching strategy (sik kullanilan sorgular)
 Load testing (100 concurrent user)
 CDN (static assets)
 Penetration testing (3rd party)
REPO & KLASOR YAPISI
qnowa/
├── src/
│   ├── domain/                          # DOMAIN LAYER (saf TS, 0 dependency)
│   │   ├── shared/
│   │   │   ├── base/
│   │   │   │   ├── AggregateRoot.ts
│   │   │   │   ├── Entity.ts
│   │   │   │   ├── ValueObject.ts
│   │   │   │   └── DomainEvent.ts
│   │   │   └── value-objects/
│   │   │       ├── Money.ts
│   │   │       ├── VergiNumarasi.ts
│   │   │       ├── Donem.ts
│   │   │       └── FaturaNumarasi.ts
│   │   ├── fatura/
│   │   │   ├── aggregates/Fatura.ts
│   │   │   ├── entities/FaturaSatir.ts
│   │   │   ├── value-objects/FaturaDurum.ts
│   │   │   ├── events/
│   │   │   ├── repositories/IFaturaRepository.ts
│   │   │   └── errors/FaturaErrors.ts
│   │   ├── cari/
│   │   │   ├── aggregates/Cari.ts
│   │   │   ├── value-objects/CariTip.ts
│   │   │   ├── events/
│   │   │   ├── repositories/ICariRepository.ts
│   │   │   └── errors/CariErrors.ts
│   │   ├── muhasebe/
│   │   │   ├── aggregates/YevmiyeKaydi.ts
│   │   │   ├── entities/YevmiyeSatir.ts
│   │   │   ├── events/
│   │   │   ├── repositories/IYevmiyeRepository.ts
│   │   │   └── errors/MuhasebeErrors.ts
│   │   └── identity/
│   │       ├── aggregates/Organization.ts
│   │       ├── value-objects/UserRole.ts
│   │       └── repositories/IOrganizationRepository.ts
│   │
│   ├── application/                     # APPLICATION LAYER (use cases)
│   │   ├── fatura/
│   │   │   ├── commands/ (Olustur, Kes, Iptal)
│   │   │   ├── queries/ (Getir, Listele)
│   │   │   └── handlers/
│   │   ├── cari/
│   │   ├── muhasebe/
│   │   ├── ocr/
│   │   └── dbys/
│   │
│   ├── infrastructure/                  # INFRASTRUCTURE LAYER
│   │   ├── database/
│   │   │   ├── prisma/ (schema, migrations, seed)
│   │   │   ├── repositories/ (Prisma implementations)
│   │   │   └── prisma-client.ts (singleton + RLS extension)
│   │   ├── events/ (RedisEventBus, handlers)
│   │   ├── storage/ (MinioStorageService)
│   │   ├── ocr/ (AzureOCRService, TemplateService)
│   │   ├── integrator/ (QNBEFinansClient)
│   │   ├── email/ (ResendEmailService)
│   │   ├── crypto/ (AES256Service - credential sifreleme)
│   │   └── auth/ (next-auth config)
│   │
│   ├── presentation/                    # PRESENTATION LAYER
│   │   ├── app/ (Next.js App Router pages)
│   │   ├── trpc/ (routers, server, client)
│   │   └── components/ (ui, layout, fatura, cari, ocr, shared)
│   │
│   └── lib/ (di-container, trpc-context, utils)
│
├── workers/
│   └── dbys/ (BullMQ worker, Page Objects, captcha handler)
│
├── tests/
│   ├── unit/ (domain layer tests)
│   ├── integration/ (repository + RLS tests)
│   └── e2e/ (Playwright E2E tests)
│
├── docker-compose.dev.yml
├── docker-compose.yml (production)
├── docker-compose.on-premise.yml (QNB icin)
├── Dockerfile
├── nginx.conf
├── .env.example
├── package.json
├── tsconfig.json
└── vitest.config.ts
DATABASE & SERVER KARARLARI
Database: Self-Hosted PostgreSQL 16
Neden Supabase degil?

QNB on-premise istegi: Supabase on-premise olarak kurulamaz
Tam kontrol: RLS policy'leri, extension'lar, tuning
Maliyet: Docker icinde PostgreSQL = ₺0 ek maliyet
Tasinabilirlik: Ayni Docker Compose SaaS ve on-premise'de calisir
PostgreSQL Config:

Docker volume ile persistent data
Otomatik backup (pg_dump, daily, 30 gun retention)
Connection pooling (PgBouncer - production'da eklenebilir)
SSL/TLS zorunlu (production'da)
Server: Turkiye VPS
Gereksinimler:

Istanbul datacenter (GIB uyumluluk)
Min 4 vCPU, 8GB RAM, 100GB SSD
Ubuntu 22.04 LTS
Docker + Docker Compose pre-installed
Aday Provider'lar (MVP yakininda sesilecek):

Netinternet, Turhost, Radore, DigitalOcean (Istanbul)
On-Premise (QNB icin):
Tek docker-compose.on-premise.yml ile tum servisler ayaga kalkar
Dis bagimllilik YOK (email disinda - o da opsiyonel)
Backup + update script'leri dahil
TEST STRATEJISI
Katman	Arac	Kapsam	Oncelik
Domain	Vitest	VO validation, aggregate rules, events	%90+ coverage
Application	Vitest + mock	Handler logic, command/query	Kritik path'ler
Infrastructure	Vitest + test DB	Repository, RLS, event bus	RLS testleri ZORUNLU
Guvenlik	Vitest + test DB	Tenant isolation, auth, input validation	Her phase'de
E2E	Playwright	Kayit, fatura olustur/kes, OCR	Happy path'ler
Guvenlik testleri (her phase'de zorunlu):

Org A ↔ Org B izolasyonu
Auth bypass denemeleri
Input validation (zod rejection)
Rate limit enforcement
DOGRULAMA (Son Kontrol)
Phase 0 sonu: Docker up, base class'lar test geciyor Phase 1 sonu: Kayit/giris calisiyor, RLS izolasyonu dogrulanmis Phase 2 sonu: Cari → Fatura → Muhasebe akisi end-to-end calisiyor Phase 3 sonu: OCR ile fis okunuyor, form dolduruluyor Phase 4 sonu: Production'da HTTPS ile calisiyor, QNB test fatura gidiyor, on-premise paket hazir Phase 5 sonu: DBYS robotu GIB'e giris yapip form doldurabiliyor Phase 6 sonu: 500 kullanici ile stabil, penetration test gecmis



main

claude/elegant-bartik

Create PR





C:\Users\...\worktrees\elegant-bartik

Plan

