
'use client';

import { useActionState } from 'react';
import { authenticate } from '@/presentation/actions';

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">Giriş Yap (Qnowa)</h1>
            <form
                action={dispatch}
                className="flex flex-col space-y-4 w-full max-w-md"
            >
                <input
                    className="p-2 border rounded"
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                />
                <input
                    className="p-2 border rounded"
                    type="password"
                    name="password"
                    placeholder="Şifre"
                    required
                    minLength={6}
                />
                {errorMessage && (
                    <p className="text-red-500 text-sm p-2 bg-red-50 rounded">
                        {errorMessage}
                    </p>
                )}
                <button
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    type="submit"
                >
                    Giriş Yap
                </button>
            </form>
            <div className="mt-4 text-center">
                <a href="/kayit" className="text-blue-500 hover:underline">
                    Hesabınız yok mu? Kayıt Olun
                </a>
            </div>
        </div>
    );
}
