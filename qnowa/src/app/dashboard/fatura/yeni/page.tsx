import { getParties } from '@/infrastructure/actions/cari.actions';
import { FaturaForm } from '@/presentation/components/fatura/FaturaForm';

export const dynamic = 'force-dynamic';

export default async function NewFaturaPage() {
    const parties = await getParties();

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Fatura Oluştur</h1>
            <FaturaForm parties={parties} />
        </div>
    );
}
