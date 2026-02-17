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

        // 3. Route and Parse (Smart Decision: Tesseract vs Azure)
        console.log(`Processing file: ${file.name}, Size: ${file.size} bytes`);
        const result = await router.routeAndParse(buffer, file.size);

        return { success: true, data: result };

    } catch (error: any) {
        console.error("OCR Action Error:", error);
        return { success: false, message: 'OCR işleminde hata oluştu: ' + error.message };
    }
}
