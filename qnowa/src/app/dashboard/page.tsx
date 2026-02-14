import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { getDashboardSummary, getMonthlyBreakdown } from '@/infrastructure/actions/report.actions';
import { DashboardChart } from '@/presentation/components/dashboard/DashboardChart';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/giris');
    }

    const summary = await getDashboardSummary();
    const monthlyData = await getMonthlyBreakdown();

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Hoşgeldiniz, {session.user.name}</h1>
                <p className="text-gray-500">İşletmenizin finansal durumu özetleniyor.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <SummaryCard
                    title="Toplam Satış"
                    amount={summary.totalSales}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <SummaryCard
                    title="Toplam Gider"
                    amount={summary.totalExpenses}
                    color="text-red-600"
                    bgColor="bg-red-50"
                />
                <SummaryCard
                    title="Net Durum"
                    amount={summary.netBalance}
                    color={summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}
                    bgColor={summary.netBalance >= 0 ? 'bg-green-50' : 'bg-red-50'}
                />
            </div>

            {/* Chart Section */}
            <div className="mb-8">
                <DashboardChart data={monthlyData} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Activity or other widgets could go here */}
                {/* For now, just a placeholder or list of recent invoices could be added later */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
                    <div className="flex gap-4">
                        <a href="/dashboard/fatura/yeni" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                            + Yeni Fatura
                        </a>
                        <a href="/dashboard/giderler/yeni" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
                            - Yeni Gider
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ title, amount, color, bgColor }: { title: string, amount: number, color: string, bgColor: string }) {
    return (
        <div className={`p-6 rounded-xl shadow-sm border ${bgColor}`}>
            <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
            <p className={`text-2xl font-bold mt-2 ${color}`}>
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)}
            </p>
        </div>
    );
}
