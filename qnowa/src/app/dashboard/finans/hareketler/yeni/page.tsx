import { prisma } from '@/infrastructure/database/prisma-client';
import { auth } from '@/auth';
import { FinancePaymentForm } from '@/presentation/components/finance/FinancePaymentForm';
import { getParties } from '@/infrastructure/actions/cari.actions';

export default async function NewPaymentPage() {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) return <div>Yetkisiz</div>;
    const orgId = (session.user as any).orgId;

    const banks = await prisma.bank.findMany({ where: { orgId } });
    const safes = await prisma.safe.findMany({ where: { orgId } });
    const parties = await getParties();

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Yeni Tahsilat / Ödeme</h1>
            <FinancePaymentForm
                banks={banks}
                safes={safes}
                parties={parties}
            />
        </div>
    );
}
