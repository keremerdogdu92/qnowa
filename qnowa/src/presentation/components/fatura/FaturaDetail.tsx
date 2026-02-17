'use client';

import { FaturaDetailDTO, finalizeFatura, downloadFaturaXML } from '@/infrastructure/actions/fatura.actions';
import { Permission } from '@/domain/security/permissions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FaturaDetailProps {
    fatura: FaturaDetailDTO;
    userRole?: string;
    permissions?: string[];
}

export function FaturaDetail({ fatura, userRole, permissions = [] }: FaturaDetailProps) {
    const router = useRouter();
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // ... (rest of state)

    // Permission checks
    const canFinalize = fatura.status === 'TASLAK' && permissions.includes('INVOICE_APPROVE');
    const canSend = fatura.status === 'ONAYLI' && permissions.includes('INVOICE_APPROVE'); // Or separate permission if needed

    const handleFinalize = async () => {
        if (!confirm('Faturayı muhasebeleştirmek üzeresiniz. Bu işlem geri alınamaz. Onaylıyor musunuz?')) return;

        setIsFinalizing(true);
        try {
            const result = await finalizeFatura(fatura.id);
            if (!result.success) {
                alert('Hata: ' + result.message);
            } else {
                router.refresh();
            }
        } catch (e) {
            alert('Bir hata oluştu.');
        } finally {
            setIsFinalizing(false);
        }
    };

    const handleDownloadXML = async () => {
        setIsDownloading(true);
        try {
            const result = await downloadFaturaXML(fatura.id);
            if (result.success && result.xml) {
                const blob = new Blob([result.xml], { type: 'application/xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${fatura.faturaNo}.xml`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert('XML indirilemedi: ' + result.message);
            }
        } catch (e) {
            console.error(e);
            alert('Bir hata oluştu.');
        } finally {
            setIsDownloading(false);
        }
    };

    const [isSending, setIsSending] = useState(false);

    const handleSendIntegrator = async () => {
        if (!confirm('Fatura GİB/Entegratöre gönderilecek. Onaylıyor musunuz?')) return;

        setIsSending(true);
        try {
            // Dynamically import action to avoid server-code leakage issues in some setups, but here we import top level
            const { sendFaturaToIntegrator } = await import('@/infrastructure/actions/fatura.actions');
            const result = await sendFaturaToIntegrator(fatura.id);

            if (!result.success) {
                alert('Hata: ' + result.message);
            } else {
                alert('Fatura başarıyla gönderildi!');
                router.refresh();
            }
        } catch (e: any) {
            console.error(e);
            alert('Entegrasyon hatası: ' + e.message);
        } finally {
            setIsSending(false);
        }
    };

    // Role check logic (basic client-side check for UI)
    // Server action protects the actual operation.
    // const canFinalize = fatura.status === 'TASLAK' &&
    //    ['ADMIN', 'ACCOUNTANT', 'USER'].includes(userRole || '');

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Fatura Detayı</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{fatura.faturaNo}</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleDownloadXML}
                        disabled={isDownloading}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-200 disabled:opacity-50 border border-gray-300"
                    >
                        {isDownloading ? 'İndiriliyor...' : 'XML İndir (UBL)'}
                    </button>

                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${fatura.status === 'ONAYLI' ? 'bg-green-100 text-green-800' :
                            fatura.status === 'GONDERILDI' ? 'bg-blue-100 text-blue-800' :
                                fatura.status === 'IPTAL' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'}`}>
                        {fatura.status}
                    </span>

                    {canFinalize && (
                        <button
                            onClick={handleFinalize}
                            disabled={isFinalizing}
                            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                            {isFinalizing ? 'İşleniyor...' : 'Muhasebeleştir'}
                        </button>
                    )}

                    {canSend && (
                        <button
                            onClick={handleSendIntegrator}
                            disabled={isSending}
                            className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                        >
                            {isSending ? 'Gönderiliyor...' : "GİB'e Gönder (QNB)"}
                        </button>
                    )}
                </div>
            </div>
            <div className="border-t border-gray-200">
                <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Tarih</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {new Date(fatura.date).toLocaleDateString('tr-TR')}
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Cari</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{fatura.cariId}</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Toplam Tutar</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-bold">
                            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: fatura.currency }).format(fatura.grandTotal)}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Kalemler</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Miktar</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Birim Fiyat</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">KDV %</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {fatura.lines.map((line) => (
                                <tr key={line.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{line.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{line.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(line.unitPrice)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">% {line.taxRate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                                        {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(line.total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
