import { auth, signOut } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-600">QNB Finans</h1>
                    <p className="text-xs text-gray-500 mt-1">Muhasebe & Fatura</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavLink href="/dashboard">Ana Sayfa</NavLink>

                    <div className="pt-4 pb-1">
                        <p className="px-2 text-xs font-semibold text-gray-400 uppercase">Fatura Yönetimi</p>
                    </div>
                    <NavLink href="/dashboard/fatura">Satış Faturaları</NavLink>
                    <NavLink href="/dashboard/giderler">Giderler (Alış)</NavLink>

                    <div className="pt-4 pb-1">
                        <p className="px-2 text-xs font-semibold text-gray-400 uppercase">Muhasebe</p>
                    </div>
                    <NavLink href="/dashboard/muhasebe/fisler">Fiş İşlemleri</NavLink>
                    <NavLink href="/dashboard/muhasebe/hesap-plani">Hesap Planı</NavLink>
                    <NavLink href="/dashboard/muhasebe/mizan">Mizan Raporu</NavLink>

                    <div className="pt-4 pb-1">
                        <p className="px-2 text-xs font-semibold text-gray-400 uppercase">Raporlar</p>
                    </div>
                    <NavLink href="/dashboard/raporlar/gelir-gider">Gelir / Gider (P&L)</NavLink>
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {session.user.name?.[0] || 'U'}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{session.user.name}</p>
                            <p className="text-xs text-gray-500 truncate w-32">{session.user.email}</p>
                        </div>
                    </div>
                    <form
                        action={async () => {
                            'use server';
                            await signOut();
                        }}
                    >
                        <button className="w-full text-left text-sm text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50">
                            Çıkış Yap
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
        >
            {children}
        </Link>
    );
}
