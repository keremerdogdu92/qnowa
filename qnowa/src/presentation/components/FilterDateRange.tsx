'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function FilterDateRange() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        router.push(pathname + '?' + createQueryString(name, value));
    };

    return (
        <div className="flex gap-4 items-end bg-white p-4 rounded-lg shadow mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
                <input
                    type="date"
                    name="startDate"
                    value={startDate}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
                <input
                    type="date"
                    name="endDate"
                    value={endDate}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
            </div>
            <div className="pb-1 text-xs text-gray-500">
                Tarih aralığı seçildiğinde rapor otomatik güncellenir.
            </div>
        </div>
    );
}
