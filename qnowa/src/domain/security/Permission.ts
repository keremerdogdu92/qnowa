
export const Permissions = {
    // FATURA (Invoices)
    INVOICE_VIEW: { key: 'INVOICE_VIEW', description: 'Faturaları Görüntüleme', group: 'FATURA' },
    INVOICE_CREATE: { key: 'INVOICE_CREATE', description: 'Fatura Oluşturma', group: 'FATURA' },
    INVOICE_EDIT: { key: 'INVOICE_EDIT', description: 'Fatura Düzenleme', group: 'FATURA' },
    INVOICE_DELETE: { key: 'INVOICE_DELETE', description: 'Fatura Silme', group: 'FATURA' },
    INVOICE_APPROVE: { key: 'INVOICE_APPROVE', description: 'Fatura Onaylama/Resmileştirme', group: 'FATURA' },

    // FINANS (Cheque, Cash, Bank)
    FINANCE_VIEW: { key: 'FINANCE_VIEW', description: 'Finansal Hareketleri Görüntüleme', group: 'FINANS' },
    FINANCE_MANAGE: { key: 'FINANCE_MANAGE', description: 'Tahsilat/Ödeme Yapma', group: 'FINANS' },
    CHEQUE_MANAGE: { key: 'CHEQUE_MANAGE', description: 'Çek/Senet Yönetimi (Tahsil/Ciro)', group: 'FINANS' },

    // STOK (Stock)
    STOCK_VIEW: { key: 'STOCK_VIEW', description: 'Stok Durumunu Görüntüleme', group: 'STOK' },
    STOCK_MANAGE: { key: 'STOCK_MANAGE', description: 'Stok Hareket/Düzenleme', group: 'STOK' },

    // CARI (Parties)
    CARI_VIEW: { key: 'CARI_VIEW', description: 'Carileri Görüntüleme', group: 'CARI' },
    CARI_MANAGE: { key: 'CARI_MANAGE', description: 'Cari Ekleme/Düzenleme', group: 'CARI' },

    // AYARLAR (Settings)
    SETTINGS_MANAGE: { key: 'SETTINGS_MANAGE', description: 'Genel Ayarlar ve Kullanıcılar', group: 'AYARLAR' },
} as const;

export type PermissionKey = keyof typeof Permissions;
