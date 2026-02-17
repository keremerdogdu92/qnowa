'use client';

import React, { useRef } from 'react';
import { useOCR } from '@/presentation/hooks/useOCR';
import { ExtractedData } from '@/domain/ocr/OCRInterfaces';
import { Camera, Upload, RefreshCw } from 'lucide-react';

interface ExpenseUploaderProps {
    onExtract: (data: ExtractedData) => void;
}

export function ExpenseUploader({ onExtract }: ExpenseUploaderProps) {
    const { processFile, isProcessing, progress, status } = useOCR();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await processFile(file);
        if (result) {
            onExtract(result);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                className="hidden"
            />

            {!isProcessing ? (
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex gap-4">
                        <button
                            onClick={triggerFileSelect}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <Upload size={18} />
                            Fiş/Fatura Yükle
                        </button>
                        <button
                            onClick={triggerFileSelect} // Mobile often treats file input as camera if capture prop used, but simple file is safer for PWA
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                        >
                            <Camera size={18} />
                            Fotoğraf Çek
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">
                        PNG, JPG veya PDF (max 5MB)
                    </p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="animate-spin text-blue-600" size={24} />
                    <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {status || 'İşleniyor...'}
                    </p>
                </div>
            )}
        </div>
    );
}
