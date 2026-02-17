import { InvoiceOCR } from '@/presentation/components/ocr/InvoiceOCR';
import { auth } from '@/auth';
import Link from 'next/link';

export default async function OCRPage() {
    const session = await auth();

    return (
        <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Yapay Zeka Destekli Fatura Okuma</h1>
                    <p className="text-gray-500 text-sm">Fatura fotoğrafını yükleyin, yapay zeka verileri çıkarıp doğrulamanıza sunsun.</p>
                </div>
                <Link
                    href="/dashboard/fatura"
                    className="text-gray-600 hover:text-gray-900"
                >
                    &larr; Faturalara Dön
                </Link>
            </div>

            <div className="flex-grow">
                <InvoiceOCR />
            </div>
        </div>
    );
}
