
'use client';

import { collectCheque } from '@/infrastructure/actions/cheque.actions';
import { ChequeStatus } from '@/domain/finance/Cheque';
import { useState } from 'react';

interface ChequeActionModalProps {
    chequeId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    actionType: 'COLLECT' | 'ENDORSE';
    currentStatus: ChequeStatus;
}

export function ChequeActionModal({ chequeId, isOpen, onClose, onSuccess, actionType }: ChequeActionModalProps) {
    const [targetId, setTargetId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleAction = async () => {
        setLoading(true);
        setError('');

        try {
            let result;
            if (actionType === 'COLLECT') {
                // targetId should be Account ID (Kasa/Banka)
                // For MVP we might just pass a string or select from dropdown
                // Assuming targetId is valid account ID
                result = await collectCheque(chequeId, targetId);
            } else {
                // Endorse
                // result = await endorseCheque(chequeId, targetId);
                result = { success: false, message: 'Ciro işlemi henüz aktif değil.' };
            }

            if (result.success) {
                onSuccess();
                onClose();
            } else {
                setError(result.message || 'İşlem başarısız');
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h3 className="text-lg font-bold mb-4">
                    {actionType === 'COLLECT' ? 'Çek Tahsilat' : 'Çek Ciro'}
                </h3>

                {error && <div className="bg-red-50 text-red-600 p-2 text-sm mb-4 rounded">{error}</div>}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {actionType === 'COLLECT' ? 'Hesap (Kasa/Banka)' : 'Tedarikçi (Cari)'}
                    </label>
                    <input
                        type="text"
                        value={targetId}
                        onChange={e => setTargetId(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder={actionType === 'COLLECT' ? 'Hedef Hesap ID' : 'Cari ID'}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        * MVP: ID giriniz. (İleride seçim listesi olacak)
                    </p>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        disabled={loading}
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleAction}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={loading || !targetId}
                    >
                        {loading ? 'İşleniyor...' : 'Onayla'}
                    </button>
                </div>
            </div>
        </div>
    );
}
