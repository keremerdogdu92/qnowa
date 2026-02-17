import { useState } from 'react';
import { TesseractService } from '@/infrastructure/ocr/TesseractService';
import { parseInvoiceWithAzure } from '@/infrastructure/ocr/AzureOCRService';
import { ExtractedData } from '@/domain/ocr/OCRInterfaces';

export function useOCR() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<string>('');

    const processFile = async (file: File): Promise<ExtractedData | null> => {
        setIsProcessing(true);
        setStatus('Scanning locally...');
        setProgress(10);

        try {
            // 1. Try Client-Side Tesseract
            const tesseractService = new TesseractService();
            const localResult = await tesseractService.parse(file);

            setProgress(40);

            // Simple logic: Is local result "confident"?
            // We can refine this. For now, if we found a total > 0 and confidence > 0.8
            const isConfident = localResult.confidence > 0.8 && (localResult.totalAmount || 0) > 0;

            if (isConfident) {
                setStatus('Local scan successful!');
                setProgress(100);
                setIsProcessing(false);
                return localResult;
            }

            // 2. Fallback to Azure (Server Side)
            setStatus('Local scan low confidence. Uploading for AI analysis...');
            setProgress(60);

            // Convert File to Base64 for Server Action
            const base64 = await toBase64(file);
            const base64Data = base64.split(',')[1];

            const azureResult = await parseInvoiceWithAzure(base64Data);

            setProgress(100);
            setStatus('AI analysis complete!');
            setIsProcessing(false);
            return azureResult;

        } catch (error) {
            console.error("OCR Error:", error);
            setStatus('Error during processing.');
            setIsProcessing(false);
            return null;
        }
    };

    return { processFile, isProcessing, progress, status };
}

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});
