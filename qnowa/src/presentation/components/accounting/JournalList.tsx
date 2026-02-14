'use client';

import { JournalDTO } from '@/infrastructure/actions/accounting.actions';
import Link from 'next/link';

interface JournalListProps {
    journals: JournalDTO[];
}

export function JournalList({ journals }: JournalListProps) {
    if (journals.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">Henüz muhasebe fişi bulunmamaktadır.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yevmiye No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Borç Toplam</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Alacak Toplam</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {journals.map((journal) => (
                        <tr key={journal.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(journal.date).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {journal.yevmiyeNo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {journal.description || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                                {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(journal.totalDebit)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                                {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(journal.totalCredit)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${journal.status === 'ONAYLI' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {journal.status === 'TASLAK' ? 'Taslak' : 'Onaylı'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                    href={`/dashboard/muhasebe/fisler/${journal.id}`}
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
