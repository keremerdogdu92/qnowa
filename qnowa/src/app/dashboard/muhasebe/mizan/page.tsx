import { getTrialBalance } from '@/infrastructure/actions/accounting.actions';
import { TrialBalanceTable } from '@/presentation/components/accounting/TrialBalanceTable';

export const dynamic = 'force-dynamic';

export default async function TrialBalancePage({ searchParams }: { searchParams: { year?: string } }) {
    const year = searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear();
    const items = await getTrialBalance(year);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Mizan Raporu</h1>

            <div className="mb-4">
                <form className="flex gap-2 items-center">
                    <label className="text-sm font-medium">Yıl:</label>
                    <input
                        type="number"
                        name="year"
                        defaultValue={year}
                        className="border rounded px-2 py-1 w-24"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        Getir
                    </button>
                </form>
            </div>

            <TrialBalanceTable items={items} year={year} />
        </div>
    );
}
