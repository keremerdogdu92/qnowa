'use client';

import { MonthlyStatsDTO } from '@/infrastructure/actions/report.actions';

interface ProfitLossReportProps {
    data: MonthlyStatsDTO[];
}

export function ProfitLossReport({ data }: ProfitLossReportProps) {
    const totalSales = data.reduce((acc, curr) => acc + curr.sales, 0);
    const totalExpenses = data.reduce((acc, curr) => acc + curr.expenses, 0);
    const netProfit = totalSales - totalExpenses;

    return (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <h2 className="text-xl font-bold mb-4">Gelir / Gider Raporu (Son 6 Ay)</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dönem</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gelirleri (Satış)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Giderleri (Alış)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Kar/Zarar</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.month}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(row.sales)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(row.expenses)}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${row.sales - row.expenses >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(row.sales - row.expenses)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">TOPLAM</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-700">
                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalSales)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-700">
                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalExpenses)}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${netProfit >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(netProfit)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
