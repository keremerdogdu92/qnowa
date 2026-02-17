
'use client';

import { ChequeStatus } from '@/domain/finance/Cheque';
import { useState } from 'react';
import { ChequeActionModal } from './ChequeActionModal';
import { useRouter } from 'next/navigation';

interface ChequeDTO {
    id: string;
    chequeNo: string;
    bankName?: string;
    drawer?: string;
    amount: number;
    currency: string;
    dueDate: Date;
    status: ChequeStatus;
    cariId?: string;
}

interface ChequeListTableProps {
    cheques: ChequeDTO[];
    permissions?: string[];
}

export function ChequeListTable({ cheques, permissions = [] }: ChequeListTableProps) {
    const canManage = permissions.includes('CHEQUE_MANAGE');
    const router = useRouter();
    const [selectedCheque, setSelectedCheque] = useState<ChequeDTO | null>(null);
    const [actionType, setActionType] = useState<'COLLECT' | 'ENDORSE'>('COLLECT');
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (cheques.length === 0) {
        return <div className="p-4 text-gray-500 text-center">Kayıtlı çek bulunamadı.</div>;
    }

    const openAction = (cheque: ChequeDTO, type: 'COLLECT' | 'ENDORSE') => {
        setSelectedCheque(cheque);
        setActionType(type);
        setIsModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keşideci / Banka</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {cheques.map((cheque) => (
                        <tr key={cheque.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(cheque.dueDate).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                {/* Fallback if instrument is missing in DTO for now, though backend sends it */}
                                {(cheque as any).instrument || 'ÇEK'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {cheque.chequeNo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="font-medium text-gray-900">{cheque.drawer}</div>
                                <div className="text-xs">{cheque.bankName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: cheque.currency }).format(cheque.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${cheque.status === 'PORTFOY' ? 'bg-blue-100 text-blue-800' :
                                        cheque.status === 'TAHSIL' ? 'bg-green-100 text-green-800' :
                                            cheque.status === 'CIRO' ? 'bg-purple-100 text-purple-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                    {cheque.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                {cheque.status === 'PORTFOY' && canManage && (
                                    <>
                                        <button
                                            onClick={() => openAction(cheque, 'COLLECT')}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            Tahsil
                                        </button>
                                        <button
                                            onClick={() => openAction(cheque, 'ENDORSE')}
                                            className="text-purple-600 hover:text-purple-900"
                                        >
                                            Ciro
                                        </button>
                                    </>
                                )}
                                <button className="text-gray-400 hover:text-gray-600">Detay</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedCheque && (
                <ChequeActionModal
                    chequeId={selectedCheque.id}
                    currentStatus={selectedCheque.status}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        router.refresh();
                    }}
                    actionType={actionType}
                />
            )}
        </div>
    );
}
