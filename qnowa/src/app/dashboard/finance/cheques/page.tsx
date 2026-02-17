
import { getChequeList } from '@/infrastructure/actions/cheque.actions';
import { ChequeListTable } from '@/presentation/components/finance/ChequeListTable';
import { ChequeStatus } from '@/domain/finance/Cheque';
import Link from 'next/link';

import { auth } from '@/auth';

export default async function ChequePage({ searchParams }: { searchParams: { status?: string } }) {
    const session = await auth();
    const permissions = (session?.user as any)?.permissions || [];
    const canCreate = permissions.includes('CHEQUE_MANAGE');

    const status = searchParams.status ? (searchParams.status as ChequeStatus) : undefined;
    const cheques = await getChequeList(status);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Çek/Senet Yönetimi</h1>
                {canCreate && (
                    <Link
                        href="/dashboard/finance/cheques/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Yeni Çek Girişi
                    </Link>
                )}
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <Link
                        href="/dashboard/finance/cheques"
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${!status ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Tümü
                    </Link>
                    <Link
                        href="/dashboard/finance/cheques?status=PORTFOY"
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${status === 'PORTFOY' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Portföy
                    </Link>
                    <Link
                        href="/dashboard/finance/cheques?status=TAHSIL"
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${status === 'TAHSIL' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Tahsil Edilen
                    </Link>
                    <Link
                        href="/dashboard/finance/cheques?status=CIRO"
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${status === 'CIRO' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Ciro Edilen
                    </Link>
                </nav>
            </div>

            <ChequeListTable cheques={cheques} permissions={permissions} />
        </div>
    );
}
