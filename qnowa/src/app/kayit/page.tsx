
'use client';

import { useActionState } from 'react';
import { register } from '@/presentation/actions';
// import { useFormState } from 'react-dom'; // NextJS 14/15 changes, sticking to useActionState from react which Next.js 15 uses or useFormState pending deprecation naming. 
// Actually in Next.js 15 it calls useActionState.

export default function RegisterPage() {
    const [state, dispatch] = useActionState(register, undefined);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">Kayıt Ol (Qnowa)</h1>
            <form action={dispatch} className="flex flex-col space-y-4 w-full max-w-md">

                <div className="flex flex-col">
                    <input className="p-2 border rounded" type="text" name="companyName" placeholder="Firma Ünvanı" required />
                    {state?.errors?.companyName && <p className="text-red-500 text-sm">{state.errors.companyName}</p>}
                </div>

                <div className="flex flex-col">
                    <input className="p-2 border rounded" type="text" name="taxNumber" placeholder="Vergi No / TCKN" required maxLength={11} />
                    {state?.errors?.taxNumber && <p className="text-red-500 text-sm">{state.errors.taxNumber}</p>}
                </div>

                <div className="flex flex-col">
                    <input className="p-2 border rounded" type="text" name="name" placeholder="Ad Soyad" required />
                    {state?.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
                </div>

                <div className="flex flex-col">
                    <input className="p-2 border rounded" type="email" name="email" placeholder="Email" required />
                    {state?.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
                </div>

                <div className="flex flex-col">
                    <input className="p-2 border rounded" type="password" name="password" placeholder="Şifre" required minLength={6} />
                    {state?.errors?.password && <p className="text-red-500 text-sm">{state.errors.password}</p>}
                </div>

                {state?.message && <p className="text-red-500 text-center">{state.message}</p>}

                <button className="p-2 bg-green-500 text-white rounded hover:bg-green-600" type="submit">
                    Kayıt Ol
                </button>
            </form>
        </div>
    );
}
