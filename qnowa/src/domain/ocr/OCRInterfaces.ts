export interface DocumentZone {
    name: string; // "header", "footer", "total_area"
    area: {
        x: number; // percentage 0-100
        y: number; // percentage 0-100
        width: number; // percentage 0-100
        height: number; // percentage 0-100
    };
    expectedFields: string[]; // ["tarih", "toplam", "kdv"]
}

export interface DocumentTemplate {
    id: string;
    name: string; // "Migros Fişi", "BİM Fişi"
    keywords: string[]; // ["MİGROS", "KDV", "TOPKAPI"] - used for identification
    zones: DocumentZone[];

    // For Tesseract fallback/optimization
    language?: string; // 'tur', 'eng'
}

export interface ExtractedData {
    senderName?: string;
    date?: Date;
    invoiceNo?: string;
    totalAmount?: number;
    taxAmount?: number;
    taxRate?: number; // %1, %10, %20 (Dominant rate)
    taxes?: { rate: number; amount: number }[]; // All found tax lines
    currency?: string;
    lines?: {
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
        taxRate: number;
    }[];
    rawText?: string;
    confidence: number; // 0-1
    source: 'azure' | 'tesseract' | 'manual';
    documentType?: 'FATURA' | 'FIS' | 'IRSALIYE' | 'CEK' | 'DIGER';
}

export interface OCRService {
    parse(fileBuffer: Buffer, mimeType: string): Promise<ExtractedData>;
}
