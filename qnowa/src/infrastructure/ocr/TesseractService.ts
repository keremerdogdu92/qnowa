import Tesseract from 'tesseract.js';
import { DocumentTemplate, ExtractedData } from '@/domain/ocr/OCRInterfaces';

export class TesseractService {

    async parse(imageBuffer: Buffer, template?: DocumentTemplate): Promise<ExtractedData> {
        console.log("Starting Tesseract parsing...");

        // 1. Full Page Text for Keyword Matching (if no template or to validate template)
        const { data: { text } } = await Tesseract.recognize(
            imageBuffer,
            'tur', // Turkish
            { logger: m => console.log(m) }
        );

        console.log("Raw Text:", text);

        // Simple Keyword Extraction (Fallback logic if no template)
        const lines = text.split('\n');

        // Try to find "TOPLAM" or "GENEL TOPLAM"
        let totalAmount: number | undefined;
        let date: Date | undefined;
        let invoiceNo: string | undefined;

        // Very basic regex for demo purposes
        // total: matches number with comma or dot at end of line containing TOPLAM
        const totalRegex = /TOPLAM.*([\d.,]+)\s*$/i;
        const dateRegex = /(\d{2}\.\d{2}\.\d{4})/;

        for (const line of lines) {
            if (line.toUpperCase().includes("TOPLAM")) {
                const match = line.match(/(\d+[.,]\d{2})/);
                if (match) {
                    totalAmount = parseFloat(match[1].replace(',', '.'));
                }
            }
            if (!date) {
                const match = line.match(dateRegex);
                if (match) {
                    const parts = match[1].split('.');
                    date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                }
            }
        }

        return {
            rawText: text,
            totalAmount,
            date,
            confidence: 0.7, // Tesseract is usually lower confidence than Azure
            source: 'tesseract',
            lines: [] // Tesseract structure extraction is hard without template zones
        };
    }
}
