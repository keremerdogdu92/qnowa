'use client';

import { FaturaDTO } from '@/infrastructure/actions/fatura.actions';
import Link from 'next/link';

interface FaturaListProps {
    faturas: FaturaDTO[];
    permissions?: string[];
}

export function FaturaList({ faturas, permissions = [] }: FaturaListProps) {
    const canCreate = permissions.includes('INVOICE_CREATE');

    if (faturas.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">Henüz hiç fatura oluşturulmamış.</p>
                {canCreate && (
                    <Link
                        href="/dashboard/fatura/yeni"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Yeni Fatura Oluştur
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Faturalar</h2>
                {canCreate && (
                    <Link
                        href="/dashboard/fatura/yeni"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Yeni Fatura
                    </Link>
                )}
            </div>
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fatura No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cari</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {faturas.map((fatura) => (
                        <tr key={fatura.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(fatura.date).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {fatura.faturaNo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {fatura.cariId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: fatura.currency }).format(fatura.total)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${fatura.status === 'ONAYLI' ? 'bg-green-100 text-green-800' :
                                        fatura.status === 'GONDERILDI' ? 'bg-blue-100 text-blue-800' :
                                            fatura.status === 'IPTAL' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                    {fatura.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                    href={`/dashboard/fatura/${fatura.id}`}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    Detay
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
