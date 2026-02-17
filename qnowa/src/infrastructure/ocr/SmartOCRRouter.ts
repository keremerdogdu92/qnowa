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

    async parseFromText(text: string, buffer?: Buffer, fileSize?: number): Promise<ExtractedData> {
        console.log("Processing Client-Side Text...");

        // 1. Basic Extraction (Regex) & Heuristics
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        let totalAmount: number | undefined;
        let totalTaxAmount: number | undefined; // For backward compatibility accumulation if needed
        let date: Date | undefined;
        let invoiceNo: string | undefined;
        let senderName: string | undefined;

        // Comprehensive Check: Arrays to store all findings
        const foundTaxes: { rate: number; amount: number }[] = [];

        // Pattern Definitions
        const dateRegex = /(\d{2}[./]\d{2}[./]\d{4})/;
        const amountRegex = /[\d]+[.,]\d{2}$/; // Not strictly used but good reference
        const companyKeywords = ["LTD", "ŞTİ", "STI", "A.Ş", "A.S", "SAN", "TİC", "TIC", "GIDA", "RESTORAN", "LOKANTA", "PAZARLAMA", "HİZMET", "INS", "İNŞ", "YAPI", "TEKSTİL", "TURİZM", "PETROL", "OTOMOTİV", "ECZANE"];

        // Common unwanted lines at start (Tesseract artifacts)
        const skipPatterns = ["T.C.", "TC ", "MERSIS", "NO:", "SAYI:", "KONU:"];

        // Variables for best candidates
        let bestSenderNameScore = 0;
        let bestSenderNameLineIndex = -1;
        let detectedDocTypeFromLabel: 'FATURA' | 'FIS' | undefined;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const upperLine = line.toUpperCase();

            // 1. Sender Name Logic
            if (!senderName || bestSenderNameScore < 15) {
                const isSkipped = skipPatterns.some(p => upperLine.startsWith(p)) || line.length < 4 || /^\d+$/.test(line);
                if (!isSkipped) {
                    let currentScore = 1;
                    if (companyKeywords.some(k => upperLine.includes(k))) currentScore += 10;
                    if (upperLine.includes("MAH.") || upperLine.includes("CAD.") || upperLine.includes("SOK.") || upperLine.includes("ANTALYA") || upperLine.includes("TEL:")) currentScore -= 5;
                    if (i < 5) currentScore += 2;

                    if (currentScore > bestSenderNameScore) {
                        bestSenderNameScore = currentScore;
                        bestSenderNameLineIndex = i;
                        senderName = line;
                    }
                }
            }

            // 2. Invoice/Receipt No
            if (!invoiceNo) {
                const explicitMatch = line.match(/(FATURA|FİŞ|FIS|BELGE|ARSIV|ARŞİV)\s*(?:NO|NUMARASI)\s*[:.]?\s*(\S+)/i);
                if (explicitMatch) {
                    invoiceNo = explicitMatch[2];
                    const label = explicitMatch[1].toUpperCase();
                    if (label.includes("FATURA") || label.includes("ARSIV") || label.includes("ARŞİV")) {
                        detectedDocTypeFromLabel = 'FATURA';
                    } else if (label.includes("FİŞ") || label.includes("FIS") || label.includes("BELGE")) {
                        detectedDocTypeFromLabel = 'FIS';
                    }
                }
            }
            if (!invoiceNo) {
                const isAddress = upperLine.includes("CAD") || upperLine.includes("MAH") || upperLine.includes("SOK");
                if (!isAddress) {
                    const genericMatch = line.match(/(?<!VD\s)(?<!V\.D\s)(?<!VERGİ DAİRESİ\s)\bNO\s*[:.]\s*(\S+)/i);
                    if (genericMatch) invoiceNo = genericMatch[1];
                }
            }

            // 3. Amount Extraction
            if (upperLine.includes("TOPLAM") || upperLine.includes("ODENECEK") || upperLine.includes("ÖDENECEK") || upperLine.includes("GENEL TUTAR")) {
                const numbers = line.match(/[\d.,]+/g);
                if (numbers) {
                    const lastNum = numbers[numbers.length - 1];
                    const val = this.parseCurrency(lastNum);
                    if (val) totalAmount = val;
                }
            }

            // 4. Tax (KDV) Extraction - Multi-Tax Support
            if ((upperLine.includes("KDV") || upperLine.includes("VAT") || upperLine.includes("%")) && !upperLine.includes("DAHİL") && !upperLine.includes("HARİÇ")) {
                let currentRate: number | undefined;
                let currentTaxAmount: number | undefined;

                // Logic: Find rate if possible
                const rateMatch = line.match(/% ?(\d{1,2})/);
                if (rateMatch) {
                    currentRate = parseInt(rateMatch[1]);
                } else if (upperLine.includes("KDV") || upperLine.includes("VAT")) {
                    const commonRates = [1, 8, 10, 18, 20];
                    const potentialRates = line.match(/\b(\d{1,2})\b/g);
                    if (potentialRates) {
                        const foundRate = potentialRates.find(r => commonRates.includes(parseInt(r)));
                        if (foundRate) currentRate = parseInt(foundRate);
                    }
                }

                // Fallback for *10
                if (!currentRate) {
                    const starMatch = line.match(/\*\s?(\d{1,2})/);
                    if (starMatch && [1, 8, 10, 12, 18, 20].includes(parseInt(starMatch[1]))) {
                        currentRate = parseInt(starMatch[1]);
                    }
                }

                // Find Amount
                const numbers = line.match(/[\d.,]+/g);
                if (numbers) {
                    const lastNum = numbers[numbers.length - 1];
                    const val = this.parseCurrency(lastNum);
                    if (val) currentTaxAmount = val;
                }

                // If valid tax line
                if (currentRate && currentTaxAmount) {
                    // Check if totalAmount exists. If Tax > Total, ignore (likely noise).
                    // Or if !totalAmount, accept it.
                    if (!totalAmount || currentTaxAmount < totalAmount) {
                        // Check duplicates.
                        const existing = foundTaxes.find(t => t.rate === currentRate);
                        if (existing) {
                            if (currentTaxAmount > existing.amount) {
                                existing.amount = currentTaxAmount;
                            }
                        } else {
                            foundTaxes.push({ rate: currentRate, amount: currentTaxAmount });
                        }
                    }
                }
            }

            // 5. Date
            if (!date) {
                const match = line.match(dateRegex);
                if (match) {
                    const parts = match[1].split(/[./]/);
                    const d = parseInt(parts[0]);
                    const m = parseInt(parts[1]);
                    const y = parseInt(parts[2]);
                    if (d > 0 && d <= 31 && m > 0 && m <= 12 && y > 2000 && y < 2100) {
                        date = new Date(`${y}-${m}-${d}`);
                    }
                }
            }
        } // End of For Loop

        // Post-Processing: Improve Sender Name
        if (senderName && bestSenderNameLineIndex > 0) {
            const prevLine = lines[bestSenderNameLineIndex - 1];
            const prevUpper = prevLine.toUpperCase();
            const isPrevSkipped = skipPatterns.some(p => prevUpper.startsWith(p)) || /\d/.test(prevLine);
            if (!isPrevSkipped && prevLine.length > 3 && !prevUpper.includes("MAH.") && !prevUpper.includes("CAD.")) {
                senderName = prevLine + " " + senderName;
            }
        }

        // Finalize Tax Data
        let calculatedTotalTax = 0;
        let dominantRate = 0;
        let maxTaxAmount = 0;

        for (const t of foundTaxes) {
            calculatedTotalTax += t.amount;
            if (t.amount > maxTaxAmount) {
                maxTaxAmount = t.amount;
                dominantRate = t.rate;
            }
        }

        const result: ExtractedData = {
            rawText: text,
            totalAmount,
            taxAmount: calculatedTotalTax > 0 ? calculatedTotalTax : undefined,
            taxRate: dominantRate > 0 ? dominantRate : undefined,
            taxes: foundTaxes,
            date,
            invoiceNo,
            senderName,
            currency: 'TRY', // Default
            confidence: 0.7,
            source: 'tesseract',
            lines: []
        };

        // Auto-Detect Document Type
        if (detectedDocTypeFromLabel) {
            result.documentType = detectedDocTypeFromLabel;
        } else {
            result.documentType = this.detectDocumentType(text);
        }

        // 2. Evaluate Quality & Fallback
        if (buffer && fileSize) {
            const score = this.calculateQualityScore(result, fileSize);
            console.log(`Client OCR Quality Score: ${score.total}/5`, score.details);
            const criticalMissing = !result.totalAmount || !result.date;

            if (score.total < 3 || criticalMissing) {
                console.warn(`⚠️ Client OCR Result Incomplete. Escalating to Azure AI...`);
                try {
                    const base64 = buffer.toString('base64');
                    const azureResult = await parseInvoiceWithAzure(base64);
                    return azureResult;
                } catch (error) {
                    console.error("Azure failed too, returning Client result as last resort.");
                    return result;
                }
            } else {
                console.log("✅ Client OCR result accepted.");
            }
        }

        return result;
    }

    private parseCurrency(str: string): number | undefined {
        if (!str) return undefined;
        let valueString = str;
        // 1.250,50 -> 1250.50
        if (valueString.includes(',') && valueString.includes('.')) {
            valueString = valueString.replace(/\./g, '').replace(',', '.');
        } else if (valueString.includes(',')) {
            valueString = valueString.replace(',', '.');
        }
        const val = parseFloat(valueString);
        return isNaN(val) ? undefined : val;
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
        // Use word boundaries or spacing to avoid partial matches like 'GERÇEK' -> 'CEK' or 'ÖNCEKİ' -> 'CEK'

        if (t.includes("İRSALİYE") || t.includes("IRSALIYE") || t.includes("SEVK")) return 'IRSALIYE';

        // ÇEK / SENET validation needs to be stricter
        if (/\bÇEK\b/.test(t) || /\bCEK\b/.test(t) || t.includes("SENET")) return 'CEK';

        if (t.includes("FİŞ") || t.includes("FIS") || t.includes("KASİYER") || t.includes("KDV NO") || t.includes("MALİ DEĞERİ YOKTUR")) return 'FIS';

        if (t.includes("FATURA") || t.includes("EARSIV") || t.includes("E-ARŞİV")) return 'FATURA';

        return 'DIGER';
    }
}
