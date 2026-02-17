'use server';

import { SmartOCRRouter } from '../ocr/SmartOCRRouter';
import { ExtractedData } from '@/domain/ocr/OCRInterfaces';
import { auth } from '@/auth';

export async function parseInvoiceAction(formData: FormData): Promise<{ success: boolean; data?: ExtractedData; message?: string }> {
    const session = await auth();
    if (!session?.user) return { success: false, message: 'Unauthorized' };

    const file = formData.get('file') as File;
    if (!file) return { success: false, message: 'Dosya yüklenmedi/bulunamadı.' };

    try {
        // 1. Prepare file buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Initialise Router
        const router = new SmartOCRRouter();

        // 3. Check if client already did the OCR
        const clientText = formData.get('clientText') as string;

        let result;
        if (clientText) {
            console.log(`Using Client-Side OCR Result (${clientText.length} chars)`);
            result = await router.parseFromText(clientText, buffer, file.size);
        } else {
            // Fallback to Server-Side OCR
            console.log(`Processing file on Server: ${file.name}, Size: ${file.size} bytes`);
            result = await router.routeAndParse(buffer, file.size);
        }

        return { success: true, data: result };

    } catch (error: any) {
        console.error("OCR Action Error:", error);
        return { success: false, message: 'OCR işleminde hata oluştu: ' + error.message };
    }
}
