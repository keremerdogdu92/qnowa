'use client';

import { createSafe } from '@/infrastructure/actions/finance.actions';
import { useActionState } from 'react';
import { getAccountPlan } from '@/infrastructure/actions/accounting.actions';
import { useEffect, useState } from 'react';

export default function NewSafePage() {
    const [state, dispatch] = useActionState(createSafe, undefined);
    const [accounts, setAccounts] = useState<{ id: string, code: string, name: string }[]>([]);

    useEffect(() => {
        // Fetch accounts starting with 100
        getAccountPlan().then(plan => {
            setAccounts(plan.filter(a => a.code.startsWith('100')));
        });
    }, []);

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Yeni Kasa</h1>

            <form action={dispatch} className="flex flex-col space-y-4">
                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Kasa Adı</label>
                    <input className="p-2 border rounded" type="text" name="name" required placeholder="Örn: Merkez TL Kasa" />
                    {state?.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Döviz</label>
                    <select className="p-2 border rounded" name="currency">
                        <option value="TRY">TRY</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Muhasebe Hesabı</label>
                    <select className="p-2 border rounded" name="accountId">
                        <option value="">Seçiniz</option>
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                        ))}
                    </select>
                    <span className="text-xs text-gray-400 mt-1">Muhasebe entegrasyonu için 100 Kasa hesabından bir alt hesap seçiniz.</span>
                </div>

                {state?.message && <p className={`text-center ${state.success ? 'text-green-500' : 'text-red-500'}`}>{state.message}</p>}

                <button className="p-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold" type="submit">
                    Kaydet
                </button>
            </form>
        </div>
    );
}
