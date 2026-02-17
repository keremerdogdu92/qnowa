import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import MobileSidebar from '@/presentation/components/layout/MobileSidebar';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) {
        redirect('/giris');
    }

    return (
        <MobileSidebar user={session.user}>
            {children}
        </MobileSidebar>
    );
}
