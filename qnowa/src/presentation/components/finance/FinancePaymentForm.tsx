'use client';

import { useActionState, useState } from 'react';
import { createPayment } from '@/infrastructure/actions/finance.actions';
import { CariDTO } from '@/infrastructure/actions/cari.actions';

type Props = {
    banks: { id: string, name: string, currency: string }[];
    safes: { id: string, name: string, currency: string }[];
    parties: CariDTO[];
};

export function FinancePaymentForm({ banks, safes, parties }: Props) {
    const [state, dispatch] = useActionState(createPayment, undefined);
    const [sourceType, setSourceType] = useState<'BANK' | 'SAFE'>('SAFE');

    return (
        <form action={dispatch} className="flex flex-col space-y-4">

            {/* Type Selection */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="TAHSILAT" defaultChecked />
                    <span className="font-semibold text-green-600">Tahsilat (Giriş)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="ODEME" />
                    <span className="font-semibold text-red-600">Ödeme (Çıkış)</span>
                </label>
            </div>

            {/* Amount & Date */}
            <div className="flex gap-4">
                <div className="flex flex-col flex-1">
                    <label className="text-sm font-semibold mb-1">Tutar</label>
                    <input className="p-2 border rounded" type="number" step="0.01" name="amount" required placeholder="0.00" />
                </div>
                <div className="flex flex-col flex-1">
                    <label className="text-sm font-semibold mb-1">Tarih</label>
                    <input className="p-2 border rounded" type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
            </div>

            {/* Source Selection */}
            <div className="flex flex-col p-4 border rounded">
                <label className="text-sm font-semibold mb-2">İşlem Yeri</label>
                <div className="flex gap-4 mb-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" checked={sourceType === 'SAFE'} onChange={() => setSourceType('SAFE')} /> Kasa
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" checked={sourceType === 'BANK'} onChange={() => setSourceType('BANK')} /> Banka
                    </label>
                </div>

                {sourceType === 'SAFE' ? (
                    <select className="p-2 border rounded" name="safeId">
                        <option value="">Kasa Seçiniz</option>
                        {safes.map(s => <option key={s.id} value={s.id}>{s.name} ({s.currency})</option>)}
                    </select>
                ) : (
                    <select className="p-2 border rounded" name="bankId">
                        <option value="">Banka Seçiniz</option>
                        {banks.map(b => <option key={b.id} value={b.id}>{b.name} ({b.currency})</option>)}
                    </select>
                )}
            </div>

            {/* Cari Selection */}
            <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Cari (Müşteri/Tedarikçi)</label>
                <select className="p-2 border rounded" name="cariId">
                    <option value="">Seçiniz (Opsiyonel)</option>
                    {parties.map(p => <option key={p.id} value={p.id}>{p.name} - {p.taxNumber}</option>)}
                </select>
            </div>

            {/* Description */}
            <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Açıklama</label>
                <textarea className="p-2 border rounded" name="description" rows={3} placeholder="İşlem açıklaması..."></textarea>
            </div>

            {state?.message && <p className={`text-center ${state.success ? 'text-green-500' : 'text-red-500'}`}>{state.message}</p>}

            <button className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold" type="submit">
                Kaydet
            </button>
        </form>
    );
}
