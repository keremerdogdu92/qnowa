import { FaturaForm } from '@/presentation/components/fatura/FaturaForm';
import { getParties } from '@/infrastructure/actions/cari.actions';
import { FaturaTipi } from '@/domain/invoice/Fatura';

export default async function NewExpensePage() {
    const parties = await getParties();

    return (
        <div className="max-w-4xl mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Yeni Gider (Alış Faturası)</h1>
            <FaturaForm
                parties={parties}
                defaultType={FaturaTipi.ALIS}
                fixedType={true}
            />
        </div>
    );
}
