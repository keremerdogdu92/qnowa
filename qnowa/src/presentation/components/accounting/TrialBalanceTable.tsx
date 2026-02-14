'use client';

import { TrialBalanceItemDTO } from '@/infrastructure/actions/accounting.actions';

interface TrialBalanceTableProps {
    items: TrialBalanceItemDTO[];
    year: number;
}

export function TrialBalanceTable({ items, year }: TrialBalanceTableProps) {
    const totalDebit = items.reduce((acc, item) => acc + item.totalDebit, 0);
    const totalCredit = items.reduce((acc, item) => acc + item.totalCredit, 0);
    const totalBalance = items.reduce((acc, item) => acc + item.balance, 0);

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Mizan Raporu ({year})</h3>
                <button
                    onClick={() => window.print()}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                    Yazdır
                </button>
            </div>

            <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hesap Kodu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hesap Adı</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Borç Toplam</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Alacak Toplam</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bakiye</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item) => (
                                <tr key={item.accountCode} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-800 font-mono">
                                        {item.accountCode}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.accountName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(item.totalDebit)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(item.totalCredit)}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold 
                                        ${item.balance > 0 ? 'text-green-600' : item.balance < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                        {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(item.balance)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-100 font-bold">
                            <tr>
                                <td colSpan={2} className="px-6 py-3 text-right text-xs uppercase tracking-wider">Genel Toplam</td>
                                <td className="px-6 py-3 text-right text-sm text-gray-900">
                                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(totalDebit)}
                                </td>
                                <td className="px-6 py-3 text-right text-sm text-gray-900">
                                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(totalCredit)}
                                </td>
                                <td className="px-6 py-3 text-right text-sm text-gray-900">
                                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(totalBalance)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
