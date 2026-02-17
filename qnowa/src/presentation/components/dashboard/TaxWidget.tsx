
'use client';

interface TaxWidgetProps {
    data: {
        kdv: number;
        incomeTax: number;
        period: string;
    };
}

export function TaxWidget({ data }: TaxWidgetProps) {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm font-medium uppercase mb-4">Vergi Tahmini ({data.period})</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ödenecek KDV</span>
                    <span className={`font-bold text-lg ${data.kdv > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(data.kdv)}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-600">Gelir Vergisi (Tahmini)</span>
                    <span className="font-bold text-lg text-orange-600">
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(data.incomeTax)}
                    </span>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
                * Bu rakamlar tahmini olup resmi beyanname yerine geçmez.
            </p>
        </div>
    );
}
