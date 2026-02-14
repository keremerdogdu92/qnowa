# Phase 9: Expense Management (Gider Yönetimi)

## Genel Bakış
Bu fazda, alış faturalarının (Giderler) yönetimi için gerekli UI ve backend mantığı eklendi.

## Değişiklikler

### 1. Navigasyon ve Layout
- **Dashboard Layout**: `src/app/dashboard/layout.tsx` oluşturuldu. Artık tüm dashboard sayfalarında sol tarafta sabit bir sidebar var.
- **Linkler**: "Satış Faturaları", "Giderler (Alış)" ve Muhasebe linkleri eklendi.

### 2. Gider Yönetimi UI
- **Liste Sayfası**: `/dashboard/giderler` oluşturuldu. `getFaturaList` fonksiyonu güncellenerek `FaturaTipi.ALIS` filtresi ile sadece gider faturası gösterilmesi sağlandı.
- **Yeni Gider Sayfası**: `/dashboard/giderler/yeni` oluşturuldu. `FaturaForm` bileşeni güncellenerek `fixedType` ve `defaultType` özellikleri eklendi. Böylece kullanıcı sadece "Alış Faturası" girebiliyor.

### 3. Backend ve Muhasebe
- **Fatura Repository**: `findAll` ve `findAllByStatus` metodlarına `type` filtresi eklendi.
- **Muhasebe Servisi**: `FaturaMuhasebeService` güncellendi.
  - **Satış Faturası**: 120 (B) - 600 (A) - 391 (A)
  - **Alış Faturası**: 770 (B) [Gider] - 191 (B) [İnd. KDV] - 320 (A) [Satıcı]

## Doğrulama
- Build (`npm run build`) başarılı.
- Kod incelemesi ile muhasebe mantığı ve UI bağlantıları doğrulandı.
