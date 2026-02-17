
'use client';

import { registerCheque } from '@/infrastructure/actions/cheque.actions';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { CariDTO } from '@/infrastructure/actions/cari.actions';

const initialState = {
    message: '',
    errors: {} as Record<string, string[]>,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
            {pending ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
    );
}

interface ChequeFormProps {
    parties: CariDTO[];
}

export function ChequeForm({ parties }: ChequeFormProps) {
    const [state, formAction] = useActionState(registerCheque, initialState);

    return (
        <form action={formAction} className="space-y-6 bg-white p-6 rounded-lg shadow">
            {state.message && (
                <div className={`p-4 rounded-md ${state.errors ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {state.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Evrak Tipi</label>
                    <div className="mt-1 flex space-x-4">
                        <label className="inline-flex items-center">
                            <input type="radio" name="instrument" value="CEK" defaultChecked className="form-radio text-blue-600" />
                            <span className="ml-2">Çek</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="radio" name="instrument" value="SENET" className="form-radio text-blue-600" />
                            <span className="ml-2">Senet</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Çek/Senet Numarası</label>
                    <input
                        type="text"
                        name="chequeNo"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {state.errors?.chequeNo && <p className="mt-1 text-sm text-red-600">{state.errors.chequeNo}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Müşteri (Cari)</label>
                    <select
                        name="cariId"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Seçiniz...</option>
                        {parties.map((party) => (
                            <option key={party.id} value={party.id}>
                                {party.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Keşideci</label>
                    <input
                        type="text"
                        name="drawer"
                        required
                        placeholder="Evrak üzerindeki isim"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {state.errors?.drawer && <p className="mt-1 text-sm text-red-600">{state.errors.drawer}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Banka Adı</label>
                    <input
                        type="text"
                        name="bankName"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Şube Adı</label>
                    <input
                        type="text"
                        name="branchName"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Hesap No</label>
                    <input
                        type="text"
                        name="accountNo"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tutar</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="number"
                            name="amount"
                            required
                            step="0.01"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md py-2 px-3"
                            placeholder="0.00"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">TRY</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Para Birimi</label>
                    <select
                        name="currency"
                        defaultValue="TRY"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="TRY">TRY</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Keşide Tarihi</label>
                    <input
                        type="date"
                        name="issueDate"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Vade Tarihi</label>
                    <input
                        type="date"
                        name="dueDate"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="pt-5">
                <SubmitButton />
            </div>
        </form>
    );
}
