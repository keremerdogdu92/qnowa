
import { getCariList } from '@/infrastructure/actions/cari.actions';
import { ChequeForm } from '@/presentation/components/finance/ChequeForm';

export default async function NewChequePage() {
    const { data: parties } = await getCariList(1, 100); // Get first 100 parties for dropdown

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Yeni Çek Girişi</h1>
            <ChequeForm parties={parties} />
        </div>
    );
}
