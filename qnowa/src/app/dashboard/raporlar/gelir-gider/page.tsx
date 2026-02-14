import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getMonthlyBreakdown } from '@/infrastructure/actions/report.actions';
import { ProfitLossReport } from '@/presentation/components/reports/ProfitLossReport';

export const dynamic = 'force-dynamic';

export default async function ProfitLossPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/giris');
    }

    const data = await getMonthlyBreakdown();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Gelir / Gider Raporları</h1>
            <ProfitLossReport data={data} />
        </div>
    );
}
