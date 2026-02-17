import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getFinancialSnapshot, getTaxEstimates, getAlerts } from '@/infrastructure/actions/report.actions';
import { getMonthlyBreakdown } from '@/infrastructure/actions/report.actions';
import { DashboardChart } from '@/presentation/components/dashboard/DashboardChart';
import { LiquidityWidget } from '@/presentation/components/dashboard/LiquidityWidget';
import { TaxWidget } from '@/presentation/components/dashboard/TaxWidget';
import { AlertWidget } from '@/presentation/components/dashboard/AlertWidget';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/giris');
    }

    const [financials, taxes, alerts, monthlyData] = await Promise.all([
        getFinancialSnapshot(),
        getTaxEstimates(),
        getAlerts(),
        getMonthlyBreakdown()
    ]);

    return (
        <div className="p-4 lg:p-6">
            <div className="mb-6 lg:mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Kokpit</h1>
                    <p className="text-gray-500">Hoşgeldiniz, {session.user.name}</p>
                </div>
                <div className="text-xs lg:text-sm text-gray-400">
                    Veriler anlık olarak çekilmiştir.
                </div>
            </div>

            {/* Top Row: Financial Health */}
            <div className="mb-6 lg:mb-8">
                <LiquidityWidget data={financials} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
                {/* Main Chart (2 Cols) */}
                <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                    <DashboardChart data={monthlyData} />

                    {/* Quick Actions Panel */}
                    <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
                        <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3 lg:gap-4">
                            <a href="/dashboard/fatura/yeni" className="bg-blue-600 text-white px-3 py-3 lg:px-4 lg:py-2 rounded hover:bg-blue-700 text-sm flex flex-col lg:flex-row items-center justify-center text-center">
                                <span className="mb-1 lg:mb-0 lg:mr-2 text-lg lg:text-base">+</span> Yeni Fatura
                            </a>
                            <a href="/dashboard/fatura/ocr" className="bg-indigo-600 text-white px-3 py-3 lg:px-4 lg:py-2 rounded hover:bg-indigo-700 text-sm flex flex-col lg:flex-row items-center justify-center text-center">
                                <span className="mb-1 lg:mb-0 lg:mr-2 text-lg lg:text-base">📷</span> Fatura Okut
                            </a>
                            <a href="/dashboard/giderler/yeni" className="bg-red-600 text-white px-3 py-3 lg:px-4 lg:py-2 rounded hover:bg-red-700 text-sm flex flex-col lg:flex-row items-center justify-center text-center">
                                <span className="mb-1 lg:mb-0 lg:mr-2 text-lg lg:text-base">-</span> Yeni Gider
                            </a>
                            <a href="/dashboard/finance/cheques/new" className="bg-purple-600 text-white px-3 py-3 lg:px-4 lg:py-2 rounded hover:bg-purple-700 text-sm flex flex-col lg:flex-row items-center justify-center text-center">
                                <span className="mb-1 lg:mb-0 lg:mr-2 text-lg lg:text-base">✎</span> Çek İşlemi
                            </a>
                        </div>
                    </div>
                </div>

                {/* Side Panel (1 Col): Tax & Alerts */}
                <div className="space-y-6">
                    <AlertWidget alerts={alerts} />
                    <TaxWidget data={taxes} />
                </div>
            </div>
        </div>
    );
}
