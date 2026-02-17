import { getFaturaList } from '@/infrastructure/actions/fatura.actions';
import { FaturaList } from '@/presentation/components/fatura/FaturaList';

export const dynamic = 'force-dynamic';

import { FaturaTipi } from '@/domain/invoice/Fatura';

import { auth } from '@/auth';

export default async function FaturaPage() {
    const session = await auth();
    const permissions = (session?.user as any)?.permissions || [];
    const { data: faturas } = await getFaturaList(1, 20, undefined, FaturaTipi.SATIS);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Fatura Yönetimi</h1>
            <FaturaList faturas={faturas} permissions={permissions} />
        </div>
    );
}
