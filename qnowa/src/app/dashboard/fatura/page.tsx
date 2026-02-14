import { getFaturaList } from '@/infrastructure/actions/fatura.actions';
import { FaturaList } from '@/presentation/components/fatura/FaturaList';

export const dynamic = 'force-dynamic';

export default async function FaturaPage() {
    const { data: faturas } = await getFaturaList();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Fatura Yönetimi</h1>
            <FaturaList faturas={faturas} />
        </div>
    );
}
