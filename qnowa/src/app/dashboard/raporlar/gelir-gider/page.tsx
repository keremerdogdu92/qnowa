import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getMonthlyBreakdown } from '@/infrastructure/actions/report.actions';
import { ProfitLossReport } from '@/presentation/components/reports/ProfitLossReport';
import { FilterDateRange } from '@/presentation/components/FilterDateRange';

export const dynamic = 'force-dynamic';

export default async function ProfitLossPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const session = await auth();
    if (!session?.user) {
        redirect('/giris');
    }

    const startDate = typeof searchParams?.startDate === 'string' ? new Date(searchParams.startDate) : undefined;
    const endDate = typeof searchParams?.endDate === 'string' ? new Date(searchParams.endDate) : undefined;

    const data = await getMonthlyBreakdown(startDate, endDate);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Gelir / Gider Raporları</h1>

            <FilterDateRange />

            <ProfitLossReport data={data} />
        </div>
    );
}
