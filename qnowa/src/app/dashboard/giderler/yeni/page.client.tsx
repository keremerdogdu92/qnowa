'use client';

import { FaturaForm } from '@/presentation/components/fatura/FaturaForm';
import { CariDTO } from '@/infrastructure/actions/cari.actions';
import { FaturaTipi } from '@/domain/invoice/Fatura';
import { ExpenseUploader } from '@/presentation/components/expense/ExpenseUploader';
import { useState } from 'react';
import { ExtractedData } from '@/domain/ocr/OCRInterfaces';

interface NewExpensePageClientProps {
    parties: CariDTO[];
}

export default function NewExpensePageClient({ parties }: NewExpensePageClientProps) {
    const [ocrData, setOcrData] = useState<ExtractedData | null>(null);

    const handleExtract = (data: ExtractedData) => {
        setOcrData(data);
    };

    return (
        <div className="max-w-4xl mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Yeni Gider (Alış Faturası)</h1>

            <ExpenseUploader onExtract={handleExtract} />

            <FaturaForm
                parties={parties}
                defaultType={FaturaTipi.ALIS}
                fixedType={true}
                ocrData={ocrData}
            />
        </div>
    );
}
