
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/giris');
    }

    return (
        <div className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
            <div className="bg-white shadow-md rounded p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-semibold mb-4">Hoşgeldiniz, {session.user.name}</h2>
                <p className="text-gray-600 mb-4">Email: {session.user.email}</p>
                <p className="text-gray-600 mb-4">User ID: {session.user.id}</p>

                <form
                    action={async () => {
                        'use server';
                        await signOut();
                    }}
                >
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Çıkış Yap
                    </button>
                </form>
            </div>
        </div>
    );
}
