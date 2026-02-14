import { auth } from '@/auth';
import { getFaturaById } from '@/infrastructure/actions/fatura.actions';
import { FaturaDetail } from '@/presentation/components/fatura/FaturaDetail';
import { notFound } from 'next/navigation';

interface PageProps {
    params: { id: string };
}

export const dynamic = 'force-dynamic';

export default async function FaturaDetailPage({ params }: PageProps) {
    const session = await auth();
    const fatura = await getFaturaById(params.id);

    if (!fatura) {
        notFound();
    }

    const userRole = (session?.user as any)?.role;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <FaturaDetail fatura={fatura} userRole={userRole} />
        </div>
    );
}
