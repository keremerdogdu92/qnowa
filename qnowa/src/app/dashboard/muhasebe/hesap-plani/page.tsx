import { getAccountPlan } from '@/infrastructure/actions/accounting.actions';
import { AccountPlanTree } from '@/presentation/components/accounting/AccountPlanTree';

export const dynamic = 'force-dynamic';

export default async function AccountPlanPage() {
    const accounts = await getAccountPlan();

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Hesap Planı</h1>
            <AccountPlanTree accounts={accounts} />
        </div>
    );
}
