'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { parseInvoiceAction } from '@/infrastructure/actions/ocr.actions';
import { getParties, CariDTO } from '@/infrastructure/actions/cari.actions';
import { createFatura } from '@/infrastructure/actions/fatura.actions';
import { ExtractedData } from '@/domain/ocr/OCRInterfaces';
import { Loader2, Upload, CheckCircle, AlertTriangle, Save, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function InvoiceOCR() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [parties, setParties] = useState<CariDTO[]>([]);

    const { register, handleSubmit, setValue, reset } = useForm<ExtractedData & { cariId: string }>();

    useEffect(() => {
        getParties().then(setParties);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setExtractedData(null);
            setError(null);
            reset();
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const result = await parseInvoiceAction(formData);

            if (result.success && result.data) {
                setExtractedData(result.data);
                // Pre-fill form
                setValue('senderName', result.data.senderName);
                setValue('invoiceNo', result.data.invoiceNo);
                // Date handling: extracted date might be Date object or string from JSON serialization
                const dateVal = result.data.date ? new Date(result.data.date).toISOString().split('T')[0] : '';
                setValue('date', dateVal as any);
                setValue('totalAmount', result.data.totalAmount);
                setValue('taxAmount', result.data.taxAmount);
                setValue('currency', result.data.currency);
                if (result.data.documentType) {
                    setValue('documentType', result.data.documentType);
                } else {
                    setValue('documentType', 'FATURA'); // Default
                }

                // Auto-match Cari
                if (result.data.senderName) {
                    const match = parties.find(p => p.name.toLowerCase().includes(result.data.senderName!.toLowerCase()));
                    if (match) {
                        setValue('cariId', match.id);
                    }
                }
            } else {
                setError(result.message || 'Analiz başarısız.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const onSave = async (data: any) => {
        if (!data.cariId) {
            alert("Lütfen bir Cari (Tedarikçi) seçin.");
            return;
        }

        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('faturaNo', data.invoiceNo);
            formData.append('date', data.date);
            formData.append('cariId', data.cariId);
            formData.append('type', 'ALIS'); // OCR genellikle Alış faturasıdır
            formData.append('currency', data.currency);

            // Create a single line item for the total (Simplified MVP)
            const lines = [{
                description: (data.documentType || 'BELGE') + ' - ' + (data.senderName || 'Oto Transfer'),
                quantity: 1,
                unitPrice: Number(data.totalAmount) - Number(data.taxAmount || 0),
                taxRate: 20, // Default VAT, should be calculated ideally
            }];
            formData.append('lines', JSON.stringify(lines));

            const result = await createFatura(null, formData);
            if (result?.message) {
                alert(result.message);
            }
        } catch (err: any) {
            // Verify if it's a redirect error (Next.js server action redirect)
            if (err.message === 'NEXT_REDIRECT' || err.digest?.startsWith('NEXT_REDIRECT')) {
                // Redirecting...
                return;
            }
            console.error("Save Error:", err);
            alert("Kaydetme hatası: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left Column: Upload & Preview */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Fatura Yükle
                </h2>

                <div className="mb-4">
                    <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                    />
                </div>

                {previewUrl && (
                    <div className="relative flex-grow border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center min-h-[400px]">
                        {file?.type.startsWith('image/') ? (
                            <img src={previewUrl} alt="Fatura Önizleme" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <div className="text-gray-500">PDF Önizleme (Şu an desteklenmiyor)</div>
                        )}
                    </div>
                )}

                <div className="mt-4">
                    <button
                        onClick={handleAnalyze}
                        disabled={!file || isAnalyzing}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="animate-spin mr-2" />
                                Analiz Ediliyor...
                            </>
                        ) : (
                            'Analiz Et (Yapay Zeka)'
                        )}
                    </button>
                    {error && (
                        <div className="mt-2 text-red-600 text-sm flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Verification Form */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Doğrulama & Kayıt
                    {extractedData && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Kaynak: {extractedData.source === 'azure' ? 'Azure AI' : 'Tesseract (Basic)'}
                        </span>
                    )}
                </h2>

                <form onSubmit={handleSubmit(onSave)} className="space-y-4">
                    {/* Document Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Belge Türü</label>
                        <select
                            {...register('documentType')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        >
                            <option value="FATURA">Fatura</option>
                            <option value="FIS">Fiş</option>
                            <option value="IRSALIYE">İrsaliye</option>
                            <option value="CEK">Çek / Senet</option>
                            <option value="DIGER">Diğer</option>
                        </select>
                        {extractedData?.documentType && extractedData.documentType !== 'DIGER' && (
                            <div className="mt-1 text-xs text-blue-600 flex items-center">
                                <span className="font-bold mr-1">AI Önerisi:</span>
                                {extractedData.documentType}
                            </div>
                        )}
                    </div>

                    {/* Cari Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cari Hesap (Tedarikçi)</label>
                        <select
                            {...register('cariId')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        >
                            <option value="">-- Seçiniz --</option>
                            {parties.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} {p.taxNumber ? `(${p.taxNumber})` : ''}
                                </option>
                            ))}
                        </select>
                        <div className="mt-1 text-xs text-gray-500">
                            Listede yoksa önce Cari modülünden ekleyiniz.
                        </div>
                    </div>

                    {/* Cari Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cari Hesap (Tedarikçi)</label>
                        <select
                            {...register('cariId')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        >
                            <option value="">-- Seçiniz --</option>
                            {parties.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} {p.taxNumber ? `(${p.taxNumber})` : ''}
                                </option>
                            ))}
                        </select>
                        <div className="mt-1 text-xs text-gray-500">
                            Listede yoksa önce Cari modülünden ekleyiniz.
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tedarikçi Adı (OCR'dan Gelen)</label>
                        <input
                            {...register('senderName')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 bg-gray-50"
                            placeholder="Otomatik Okunacak"
                            readOnly
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fatura No</label>
                            <input
                                {...register('invoiceNo')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tarih</label>
                            <input
                                type="date"
                                {...register('date')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Toplam Tutar</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('totalAmount')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">KDV</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('taxAmount')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Para Birimi</label>
                            <select
                                {...register('currency')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            >
                                <option value="TRY">TRY</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>
                    </div>

                    {/* Lines Section (Simplified for Phase 20 MVP) */}
                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Kalemler (Satırlar)</h3>
                        <div className="bg-gray-50 p-2 rounded text-xs text-gray-500 mb-2">
                            {extractedData?.lines?.length ? `${extractedData.lines.length} satır okundu.` : 'Henüz satır okunmadı.'}
                        </div>
                        {/* More complex Line Item editor to be added in Phase 21 */}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Kaydediliyor...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Taslak Olarak Kaydet
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
