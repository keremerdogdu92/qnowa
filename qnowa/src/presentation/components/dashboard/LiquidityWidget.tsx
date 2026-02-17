
'use client';

interface LiquidityWidgetProps {
    data: {
        liquidity: number;
        receivables: number;
        payables: number;
        details: {
            safe: number;
            bank: number;
            chequePortfolio: number;
        }
    };
}

export function LiquidityWidget({ data }: LiquidityWidgetProps) {
    const format = (n: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Liquidity Card */}
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Toplam Likidite</p>
                        <p className="text-2xl font-bold text-blue-800">{format(data.liquidity)}</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 space-y-1">
                    <div className="flex justify-between">
                        <span>Kasa + Banka:</span>
                        <span className="font-medium text-gray-700">{format(data.details.safe + data.details.bank)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Çek Portföyü:</span>
                        <span className="font-medium text-gray-700">{format(data.details.chequePortfolio)}</span>
                    </div>
                </div>
            </div>

            {/* Receivables Card */}
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <p className="text-xs font-bold text-gray-500 uppercase">Alacaklar</p>
                <p className="text-2xl font-bold text-green-800 mt-1">{format(data.receivables)}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    Vadeli Satışlar & Çekler
                </p>
            </div>

            {/* Payables Card */}
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                <p className="text-xs font-bold text-gray-500 uppercase">Borçlar</p>
                <p className="text-2xl font-bold text-red-800 mt-1">{format(data.payables)}</p>
                <p className="text-xs text-red-600 mt-2 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    Tedarikçi Ödemeleri
                </p>
            </div>
        </div>
    );
}
