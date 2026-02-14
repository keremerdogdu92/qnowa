import { getFaturaList } from '@/infrastructure/actions/fatura.actions';
import { FaturaList } from '@/presentation/components/fatura/FaturaList';
import { FaturaTipi } from '@/domain/invoice/Fatura';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GiderPage() {
    const { data: faturas } = await getFaturaList(1, 20, undefined, FaturaTipi.ALIS);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gider Yönetimi (Alış Faturaları)</h1>
                <Link
                    href="/dashboard/giderler/yeni"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Yeni Gider Fişi / Fatura
                </Link>
            </div>

            {/* Reuse FaturaList for now, maybe customize columns later */}
            <FaturaList faturas={faturas} />
        </div>
    );
}
