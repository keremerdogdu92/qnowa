
'use client';

import { useState } from 'react';
import { uploadZReport } from '@/infrastructure/actions/report.actions';

interface AlertWidgetProps {
    alerts: {
        type: 'DANGER' | 'WARNING';
        message: string;
        actionLabel?: string;
        actionUrl?: string;
    }[];
}

export function AlertWidget({ alerts }: AlertWidgetProps) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    if (alerts.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-gray-500 text-sm font-medium uppercase mb-4">Operasyonel Uyarılar</h3>
                <div className="text-center py-4 text-green-600">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="font-medium">Her şey yolunda!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm font-medium uppercase mb-4">Dikkat Gerektirenler</h3>
            <div className="space-y-3">
                {alerts.map((alert, idx) => (
                    <div key={idx} className={`p-3 rounded-md border-l-4 flex justify-between items-start 
                        ${alert.type === 'DANGER' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'}`}>
                        <div>
                            <p className={`text-sm font-medium ${alert.type === 'DANGER' ? 'text-red-800' : 'text-yellow-800'}`}>
                                {alert.message}
                            </p>
                        </div>
                        {alert.actionLabel && (
                            <button
                                onClick={() => {
                                    if (alert.actionLabel === 'Z Raporu Yükle') {
                                        setIsUploadModalOpen(true);
                                    } else if (alert.actionUrl) {
                                        window.location.href = alert.actionUrl;
                                    }
                                }}
                                className={`text-xs font-semibold underline ml-2 whitespace-nowrap
                                    ${alert.type === 'DANGER' ? 'text-red-900 hover:text-red-700' : 'text-yellow-900 hover:text-yellow-700'}`}
                            >
                                {alert.actionLabel}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {isUploadModalOpen && (
                <ZReportUploadModal onClose={() => setIsUploadModalOpen(false)} />
            )}
        </div>
    );
}

function ZReportUploadModal({ onClose }: { onClose: () => void }) {
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const result = await uploadZReport(null, formData);
            if (result?.success) {
                alert('Z Raporu kaydedildi.');
                window.location.reload();
            } else {
                alert(result?.message || 'Hata oluştu');
            }
        } catch (err: any) {
            alert('Hata: ' + err.message);
        } finally {
            setUploading(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">Eksik Z Raporu Yükle</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                        {/* Determine yesterday's date for default */}
                        <input
                            type="date"
                            name="date"
                            defaultValue={new Date(Date.now() - 86400000).toISOString().split('T')[0]}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rapor Görseli</label>
                        <input type="file" name="file" className="w-full text-sm text-gray-500" required />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {uploading ? 'Yükleniyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
