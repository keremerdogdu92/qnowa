'use client';

import { createFatura } from '@/infrastructure/actions/fatura.actions';
import { CariDTO } from '@/infrastructure/actions/cari.actions';
import { useFormStatus } from 'react-dom';
import { useState, useEffect, useRef, useActionState } from 'react'; // Updated import
import { useRouter } from 'next/navigation';

import { FaturaTipi } from '@/domain/invoice/Fatura';

import { Product } from '@/domain/stock/Product';
import { ExtractedData } from '@/domain/ocr/OCRInterfaces';

interface FaturaFormProps {
    parties: CariDTO[];
    products?: Product[];
    defaultType?: FaturaTipi;
    fixedType?: boolean;
    ocrData?: ExtractedData | null; // Added ocrData
}

const initialState = {
    message: '',
    errors: {},
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
            {pending ? 'Kaydediliyor...' : 'Faturayı Kaydet'}
        </button>
    );
}

export function FaturaForm({ parties, products = [], defaultType = FaturaTipi.SATIS, fixedType = false, ocrData }: FaturaFormProps) {
    const [type, setType] = useState(defaultType); // Track type state for price selection
    const [state, formAction, isPending] = useActionState(createFatura, initialState); // Updated hook usage
    const [lines, setLines] = useState([
        { productId: '', description: '', quantity: 1, unitPrice: 0, taxRate: 20, total: 0 }
    ]);
    const [totals, setTotals] = useState({ subTotal: 0, taxTotal: 0, grandTotal: 0 });

    // Inputs refs for uncontrolled components
    const faturaNoRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);

    // Auto-fill from OCR
    useEffect(() => {
        if (ocrData) {
            console.log("Auto-filling form with OCR data:", ocrData);

            if (faturaNoRef.current && ocrData.invoiceNo) {
                faturaNoRef.current.value = ocrData.invoiceNo;
            }
            if (dateRef.current && ocrData.date) {
                // Format Date to YYYY-MM-DD
                const d = new Date(ocrData.date);
                if (!isNaN(d.getTime())) {
                    dateRef.current.value = d.toISOString().split('T')[0];
                }
            }

            // Map OCR Lines to Form Lines
            if (ocrData.lines && ocrData.lines.length > 0) {
                const newLines = ocrData.lines.map((l: any) => ({ // Fix implicit any
                    productId: '',
                    description: l.description,
                    quantity: l.quantity,
                    unitPrice: l.unitPrice,
                    taxRate: l.taxRate || 20,
                    total: l.total
                }));
                setLines(newLines);
            }
        }
    }, [ocrData]);


    useEffect(() => {
        // ... calculation logic same ...
        const subTotal = lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0);
        const taxTotal = lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice * line.taxRate / 100), 0);
        setTotals({
            subTotal,
            taxTotal,
            grandTotal: subTotal + taxTotal
        });
    }, [lines]);

    const addLine = () => {
        setLines([...lines, { productId: '', description: '', quantity: 1, unitPrice: 0, taxRate: 20, total: 0 }]);
    };

    // ... removeLine same ...
    const removeLine = (index: number) => {
        if (lines.length > 1) {
            const newLines = [...lines];
            newLines.splice(index, 1);
            setLines(newLines);
        }
    };

    const updateLine = (index: number, field: string, value: any) => {
        const newLines = [...lines];
        let line = { ...newLines[index], [field]: value };

        // Product Selection Logic
        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            if (product) {
                line.description = product.name;
                line.unitPrice = type === FaturaTipi.SATIS ? product.sellPrice : product.buyPrice;
                line.taxRate = product.vatRate;
            }
        }

        line.total = line.quantity * line.unitPrice * (1 + line.taxRate / 100);
        newLines[index] = line;
        setLines(newLines);
    };

    return (
        <form action={formAction} className="bg-white p-6 rounded-lg shadow space-y-6">
            {/* ... header and messages ... */}
            <h2 className="text-xl font-bold mb-4">Yeni Fatura</h2>

            {state.message && (
                <div className="p-4 bg-red-100 text-red-700 rounded-md">
                    {state.message}
                </div>
            )}

            {/* Use isPending from hook if desired, but SubmitButton inside can still use useFormStatus. 
                However, useActionState provides isPending at top level which is nice. 
                Let's pass isPending to button or just let the button handle itself. 
                Existing code uses SubmitButton component with useFormStatus which works fine inside <form>.
                Unchanged.
            */}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ... existing fields ... */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fatura No</label>
                    <input
                        name="faturaNo"
                        ref={faturaNoRef} // Add ref
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    />
                    {state.errors?.faturaNo && <p className="text-red-500 text-sm">{state.errors.faturaNo}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tarih</label>
                    <input
                        name="date"
                        ref={dateRef} // Add ref
                        type="date"
                        required
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Cari / Müşteri</label>
                    <select
                        name="cariId"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    >
                        <option value="">Seçiniz...</option>
                        {parties.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                        ))}
                    </select>
                    {state.errors?.cariId && <p className="text-red-500 text-sm">{state.errors.cariId}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Fatura Tipi</label>
                    {fixedType ? (
                        <>
                            <input type="hidden" name="type" value={defaultType} />
                            <div className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500">
                                {defaultType === FaturaTipi.SATIS ? 'Satış Faturası' : 'Alış Faturası'}
                            </div>
                        </>
                    ) : (
                        <select
                            name="type"
                            required
                            value={type}
                            onChange={(e) => setType(e.target.value as FaturaTipi)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        >
                            <option value="SATIS">Satış Faturası</option>
                            <option value="ALIS">Alış Faturası</option>
                        </select>
                    )}
                </div>

                <input type="hidden" name="currency" value="TRY" />
            </div>

            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Kalemler</h3>
                    <button type="button" onClick={addLine} className="text-blue-600 hover:text-blue-800 text-sm font-medium">+ Satır Ekle</button>
                </div>

                <div className="space-y-2">
                    {lines.map((line, index) => (
                        <div key={index} className="flex gap-2 items-end bg-gray-50 p-3 rounded flex-wrap md:flex-nowrap">
                            <div className="w-full md:w-48">
                                <label className="block text-xs text-gray-500">Ürün / Hizmet Seç</label>
                                <select
                                    value={line.productId || ''}
                                    onChange={(e) => updateLine(index, 'productId', e.target.value)}
                                    className="w-full text-sm border-gray-300 rounded p-1 border"
                                >
                                    <option value="">Seçiniz...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-grow min-w-[150px]">
                                <label className="block text-xs text-gray-500">Açıklama</label>
                                <input
                                    value={line.description}
                                    onChange={(e) => updateLine(index, 'description', e.target.value)}
                                    type="text"
                                    className="w-full text-sm border-gray-300 rounded p-1 border"
                                    placeholder="Hizmet / Ürün"
                                />
                            </div>
                            <div className="w-20">
                                <label className="block text-xs text-gray-500">Miktar</label>
                                <input
                                    value={line.quantity}
                                    onChange={(e) => updateLine(index, 'quantity', parseFloat(e.target.value) || 0)}
                                    type="number"
                                    step="0.01"
                                    className="w-full text-sm border-gray-300 rounded p-1 border"
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-xs text-gray-500">Birim Fiyat</label>
                                <input
                                    value={line.unitPrice}
                                    onChange={(e) => updateLine(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                    type="number"
                                    step="0.01"
                                    className="w-full text-sm border-gray-300 rounded p-1 border"
                                />
                            </div>
                            <div className="w-16">
                                <label className="block text-xs text-gray-500">KDV</label>
                                <input
                                    value={line.taxRate}
                                    onChange={(e) => updateLine(index, 'taxRate', parseFloat(e.target.value) || 0)}
                                    type="number"
                                    className="w-full text-sm border-gray-300 rounded p-1 border"
                                />
                            </div>
                            <div className="w-24 text-right">
                                <label className="block text-xs text-gray-500">Tutar</label>
                                <div className="text-sm font-medium py-1">
                                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(line.quantity * line.unitPrice)}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeLine(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                            >
                                Sil
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hidden Input for Lines JSON */}
            <input type="hidden" name="lines" value={JSON.stringify(lines)} />

            <div className="border-t pt-4 flex justify-end">
                <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Ara Toplam:</span>
                        <span>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totals.subTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>KDV Toplam:</span>
                        <span>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totals.taxTotal)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Genel Toplam:</span>
                        <span>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totals.grandTotal)}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <SubmitButton />
            </div>
        </form>
    );
}
