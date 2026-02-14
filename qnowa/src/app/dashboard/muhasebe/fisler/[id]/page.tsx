import { getJournalById } from '@/infrastructure/actions/accounting.actions';
import { JournalDetail } from '@/presentation/components/accounting/JournalDetail';
import { notFound } from 'next/navigation';

interface PageProps {
    params: { id: string };
}

export const dynamic = 'force-dynamic';

export default async function JournalDetailPage({ params }: PageProps) {
    const journal = await getJournalById(params.id);

    if (!journal) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <JournalDetail journal={journal} />
        </div>
    );
}
