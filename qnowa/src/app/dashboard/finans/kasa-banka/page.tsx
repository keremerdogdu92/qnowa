import { auth } from '@/auth';
import { prisma } from '@/infrastructure/database/prisma-client';
import Link from 'next/link';

export default async function FinanceAccountsPage() {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) return <div>Yetkisiz Erişim</div>;
    const orgId = (session.user as any).orgId;

    const banks = await prisma.bank.findMany({ where: { orgId } });
    const safes = await prisma.safe.findMany({ where: { orgId } });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Kasa & Banka Yönetimi</h1>

            <div className="flex gap-4 mb-6">
                <Link href="/dashboard/finans/kasa-banka/yeni-banka" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    + Yeni Banka Hesabı
                </Link>
                <Link href="/dashboard/finans/kasa-banka/yeni-kasa" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    + Yeni Kasa
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Banks */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Banka Hesapları</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b text-gray-500 text-sm">
                                <th className="pb-2">Banka Adı</th>
                                <th className="pb-2">IBAN</th>
                                <th className="pb-2">Döviz</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banks.map(bank => (
                                <tr key={bank.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="py-2">{bank.name} <span className="text-xs text-gray-400">({bank.branch})</span></td>
                                    <td className="py-2 font-mono text-sm">{bank.iban}</td>
                                    <td className="py-2">{bank.currency}</td>
                                </tr>
                            ))}
                            {banks.length === 0 && <tr><td colSpan={3} className="py-4 text-center text-gray-400">Kayıtlı banka hesabı yok.</td></tr>}
                        </tbody>
                    </table>
                </div>

                {/* Safes */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Kasalar</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b text-gray-500 text-sm">
                                <th className="pb-2">Kasa Adı</th>
                                <th className="pb-2">Döviz</th>
                            </tr>
                        </thead>
                        <tbody>
                            {safes.map(safe => (
                                <tr key={safe.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="py-2">{safe.name}</td>
                                    <td className="py-2">{safe.currency}</td>
                                </tr>
                            ))}
                            {safes.length === 0 && <tr><td colSpan={2} className="py-4 text-center text-gray-400">Kayıtlı kasa yok.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
