'use client';

import { createProduct } from '@/infrastructure/actions/product.actions';
import { useFormState } from 'react-dom';
import { SubmitButton } from '@/presentation/components/SubmitButton';

const initialState = {
    message: null,
    errors: {}
};

export default function NewProductPage() {
    const [state, formAction] = useFormState(createProduct, initialState);

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Yeni Ürün / Hizmet Kartı</h1>

            <form action={formAction} className="bg-white p-6 rounded-lg shadow space-y-6">

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ürün Tipi</label>
                        <select name="type" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="GOODS">Mal (Stok Takibi Yapılır)</option>
                            <option value="SERVICE">Hizmet</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ürün Kodu / Barkod (SKU)</label>
                        <input type="text" name="code" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        {state?.error?.code && <p className="text-red-500 text-xs mt-1">{state.error.code}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Ürün / Hizmet Adı</label>
                    <input type="text" name="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    {state?.error?.name && <p className="text-red-500 text-xs mt-1">{state.error.name}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Birim</label>
                        <select name="unit" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="Adet">Adet</option>
                            <option value="KG">KG</option>
                            <option value="MT">Metre</option>
                            <option value="LT">Litre</option>
                            <option value="KOLI">Koli</option>
                            <option value="SAAT">Saat</option>
                            <option value="GUN">Gün</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">KDV Oranı (%)</label>
                        <select name="vatRate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" defaultValue="20">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Para Birimi</label>
                        <select name="currency" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="TRY">TRY</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Alış Fiyatı (KDV Hariç)</label>
                        <input type="number" step="0.01" name="buyPrice" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" defaultValue="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Satış Fiyatı (KDV Hariç)</label>
                        <input type="number" step="0.01" name="sellPrice" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" defaultValue="0" />
                    </div>
                </div>

                {state?.error && typeof state.error === 'string' && (
                    <div className="bg-red-50 text-red-700 p-3 rounded">{state.error}</div>
                )}

                {state?.success && (
                    <div className="bg-green-50 text-green-700 p-3 rounded">Ürün başarıyla oluşturuldu! Listeye dönülebilir.</div>
                )}

                <div className="flex justify-end pt-4">
                    <SubmitButton label="Kaydet" />
                </div>
            </form>
        </div>
    );
}
