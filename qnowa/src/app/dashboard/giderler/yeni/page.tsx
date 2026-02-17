import { getParties } from '@/infrastructure/actions/cari.actions';
import NewExpensePageClient from './page.client'; // Renaming the client component file logic

export default async function NewExpensePage() {
    const parties = await getParties();

    return <NewExpensePageClient parties={parties} />;
}
