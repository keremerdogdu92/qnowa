'use client';

import { createFatura } from '@/infrastructure/actions/fatura.actions';
import { CariDTO } from '@/infrastructure/actions/cari.actions';
import { useFormState, useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FaturaFormProps {
    parties: CariDTO[];
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

export function FaturaForm({ parties }: FaturaFormProps) {
    const [state, formAction] = useFormState(createFatura, initialState);
    const [lines, setLines] = useState([
        { description: '', quantity: 1, unitPrice: 0, taxRate: 20, total: 0 }
    ]);
    const [totals, setTotals] = useState({ subTotal: 0, taxTotal: 0, grandTotal: 0 });

    useEffect(() => {
        const subTotal = lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0);
        const taxTotal = lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice * line.taxRate / 100), 0);
        setTotals({
            subTotal,
            taxTotal,
            grandTotal: subTotal + taxTotal
        });
    }, [lines]);

    const addLine = () => {
        setLines([...lines, { description: '', quantity: 1, unitPrice: 0, taxRate: 20, total: 0 }]);
    };

    const removeLine = (index: number) => {
        if (lines.length > 1) {
            const newLines = [...lines];
            newLines.splice(index, 1);
            setLines(newLines);
        }
    };

    const updateLine = (index: number, field: string, value: any) => {
        const newLines = [...lines];
        const line = { ...newLines[index], [field]: value };
        // Recalculate line total for UI
        line.total = line.quantity * line.unitPrice * (1 + line.taxRate / 100);
        newLines[index] = line;
        setLines(newLines);
    };

    return (
        <form action={formAction} className="bg-white p-6 rounded-lg shadow space-y-6">
            <h2 className="text-xl font-bold mb-4">Yeni Fatura</h2>

            {state.message && (
                <div className="p-4 bg-red-100 text-red-700 rounded-md">
                    {state.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fatura No</label>
                    <input
                        name="faturaNo"
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
                    <select
                        name="type"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    >
                        <option value="SATIS">Satış Faturası</option>
                        <option value="ALIS">Alış Faturası</option>
                    </select>
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
                        <div key={index} className="flex gap-2 items-end bg-gray-50 p-3 rounded">
                            <div className="flex-grow">
                                <label className="block text-xs text-gray-500">Açıklama</label>
                                <input
                                    value={line.description}
                                    onChange={(e) => updateLine(index, 'description', e.target.value)}
                                    type="text"
                                    className="w-full text-sm border-gray-300 rounded p-1 border"
                                    placeholder="Hizmet / Ürün"
                                />
                            </div>
                            <div className="w-24">
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
                            <div className="w-20">
                                <label className="block text-xs text-gray-500">KDV %</label>
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
