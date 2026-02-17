import { TesseractService } from './TesseractService';
import { parseInvoiceWithAzure } from './AzureOCRService';
import { ExtractedData } from '@/domain/ocr/OCRInterfaces';

export class SmartOCRRouter {
    private tesseractService: TesseractService;

    constructor() {
        this.tesseractService = new TesseractService();
    }

    async routeAndParse(buffer: Buffer, fileSize: number): Promise<ExtractedData> {
        console.log("Starts Smart OCR Routing...");
        const base64 = buffer.toString('base64');

        // 1. Run Tesseract (Fast & Free)
        const tesseractResult = await this.tesseractService.parse(buffer);

        // 2. Evaluate Quality (Score 0-5)
        const score = this.calculateQualityScore(tesseractResult, fileSize);
        console.log(`OCR Quality Score: ${score.total}/5`, score.details);

        // 3. Decision Matrix
        // If Score >= 3 (Good enough), return Tesseract
        if (score.total >= 3) {
            console.log("✅ Tesseract result accepted.");
            return tesseractResult;
        }

        // 4. Fallback to Azure (Paid & Robust)
        console.warn("⚠️ Quality too low, escalating to Azure AI...");
        try {
            const azureResult = await parseInvoiceWithAzure(base64);
            return azureResult;
        } catch (error) {
            console.error("Azure failed too, returning Tesseract result as last resort.");
            return tesseractResult;
        }
    }

    private calculateQualityScore(data: ExtractedData, fileSize: number): { total: number, details: any } {
        let points = 0;
        const details: any = {};

        // Criteria 1: Resolution/File Size (Proxy)
        // Assuming proper image > 50KB. Very small files usually mean thumbnails or bad quality.
        if (fileSize > 50 * 1024) {
            points++;
            details.fileSize = true;
        }

        // Criteria 2: Confidence
        if (data.confidence > 60) {
            points++;
            details.confidence = true;
        }

        // Criteria 3: Critical Keywords (Currency, Total, Date labels)
        const text = data.rawText?.toUpperCase() || "";
        const keywords = ["TOPLAM", "GENEL TOPLAM", "TARİH", "FİŞ", "FATURA", "KDV", "MAL", "HİZMET"];
        const foundKeywords = keywords.filter(k => text.includes(k));
        if (foundKeywords.length >= 2) {
            points++;
            details.keywords = foundKeywords.length;
        }

        // Criteria 4: Data Extraction Success (Did we actually find a Total and Date?)
        if (data.totalAmount && data.date) {
            points += 2; // Strong indicator
            details.dataFound = true;
        } else if (data.totalAmount || data.date) {
            points++;
            details.dataFound = "partial";
        }

        // Auto-Detect Document Type if not already set
        if (!data.documentType) {
            data.documentType = this.detectDocumentType(data.rawText || "");
            if (data.documentType !== 'DIGER') {
                points++; // Bonus point for knowing what it is
                details.typeDetected = data.documentType;
            }
        }

        return { total: points, details };
    }

    private detectDocumentType(text: string): 'FATURA' | 'FIS' | 'IRSALIYE' | 'CEK' | 'DIGER' {
        const t = text.toUpperCase();
        if (t.includes("İRSALİYE") || t.includes("IRSALIYE") || t.includes("SEVK")) return 'IRSALIYE';
        if (t.includes("ÇEK") || t.includes("CEK") || t.includes("SENET")) return 'CEK';
        if (t.includes("FİŞ") || t.includes("FIS") || t.includes("KASİYER") || t.includes("KDV NO")) return 'FIS';
        if (t.includes("FATURA") || t.includes("EARSIV") || t.includes("E-ARŞİV")) return 'FATURA';
        return 'DIGER';
    }
}
