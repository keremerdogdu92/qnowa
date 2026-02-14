'use client';

import { JournalDetailDTO } from '@/infrastructure/actions/accounting.actions';

interface JournalDetailProps {
    journal: JournalDetailDTO;
}

export function JournalDetail({ journal }: JournalDetailProps) {
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Muhasebe Fişi Detayı</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Fiş No: {journal.yevmiyeNo} | Tarih: {new Date(journal.date).toLocaleDateString('tr-TR')}
                </p>
                <div className="mt-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${journal.status === 'ONAYLI' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {journal.status === 'TASLAK' ? 'Taslak' : 'Onaylı'}
                    </span>
                </div>
                {journal.description && (
                    <p className="mt-2 text-sm text-gray-600 italic">
                        {journal.description}
                    </p>
                )}
            </div>

            <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hesap Kodu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hesap Adı</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Borç</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Alacak</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {journal.lines.map((line) => (
                                <tr key={line.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{line.accountCode}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{line.accountName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{line.description || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                                        {line.debit > 0 ? new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(line.debit) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                                        {line.credit > 0 ? new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(line.credit) : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold">
                            <tr>
                                <td colSpan={3} className="px-6 py-3 text-right text-xs uppercase tracking-wider">Toplam</td>
                                <td className="px-6 py-3 text-right text-sm text-gray-900">
                                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(journal.totalDebit)}
                                </td>
                                <td className="px-6 py-3 text-right text-sm text-gray-900">
                                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(journal.totalCredit)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
