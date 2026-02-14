import { getJournalList } from '@/infrastructure/actions/accounting.actions';
import { JournalList } from '@/presentation/components/accounting/JournalList';

export const dynamic = 'force-dynamic';

export default async function JournalsPage() {
    const { data: journals } = await getJournalList();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Muhasebe Fişleri</h1>
            <JournalList journals={journals} />
        </div>
    );
}
