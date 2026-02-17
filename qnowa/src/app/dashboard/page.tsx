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
        <div className="p-6">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kokpit</h1>
                    <p className="text-gray-500">Hoşgeldiniz, {session.user.name}</p>
                </div>
                <div className="text-sm text-gray-400">
                    Veriler anlık olarak çekilmiştir.
                </div>
            </div>

            {/* Top Row: Financial Health */}
            <div className="mb-8">
                <LiquidityWidget data={financials} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Main Chart (2 Cols) */}
                <div className="lg:col-span-2 space-y-8">
                    <DashboardChart data={monthlyData} />

                    {/* Quick Actions Panel */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
                        <div className="flex gap-4 flex-wrap">
                            <a href="/dashboard/fatura/yeni" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm flex items-center">
                                <span className="mr-2">+</span> Yeni Fatura
                            </a>
                            <a href="/dashboard/fatura/ocr" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm flex items-center">
                                <span className="mr-2">📷</span> Fatura Okut (AI)
                            </a>
                            <a href="/dashboard/giderler/yeni" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm flex items-center">
                                <span className="mr-2">-</span> Yeni Gider
                            </a>
                            <a href="/dashboard/finance/cheques/new" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm flex items-center">
                                <span className="mr-2">✎</span> Çek İşlemi
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
