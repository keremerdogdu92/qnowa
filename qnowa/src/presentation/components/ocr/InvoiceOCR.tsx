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
import imageCompression from 'browser-image-compression';
import Tesseract from 'tesseract.js';

export function InvoiceOCR() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [parties, setParties] = useState<CariDTO[]>([]);

    const { register, handleSubmit, setValue, reset, watch } = useForm<ExtractedData & { cariId: string }>();
    const currentDocType = watch('documentType');

    useEffect(() => {
        getParties().then(setParties);
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            let selectedFile = e.target.files[0];

            // Preview immediately
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setExtractedData(null);
            setError(null);
            reset();

            // Compress if image
            if (selectedFile.type.startsWith('image/')) {
                setIsCompressing(true);
                try {
                    const options = {
                        maxSizeMB: 0.8, // Target slightly under 1MB to be safe
                        maxWidthOrHeight: 1920,
                        useWebWorker: true
                    };
                    const compressedFile = await imageCompression(selectedFile, options);
                    console.log(`Compressed: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

                    // Rename to original name but keep reference
                    const newFile = new File([compressedFile], selectedFile.name, { type: selectedFile.type });
                    setFile(newFile);
                } catch (error) {
                    console.error("Compression failed:", error);
                    // Fallback to original
                    setFile(selectedFile);
                } finally {
                    setIsCompressing(false);
                }
            } else {
                setFile(selectedFile);
            }
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setError(null);
        setOcrProgress(0);

        try {
            let clientText = '';

            // 1. Client-Side OCR (Only for images, not PDF yet)
            if (file.type.startsWith('image/')) {
                try {
                    console.log("Starting Client-Side OCR...");
                    const { data: { text } } = await Tesseract.recognize(
                        file,
                        'tur',
                        {
                            logger: m => {
                                if (m.status === 'recognizing text') {
                                    setOcrProgress(Math.round(m.progress * 100));
                                }
                            }
                        }
                    );
                    clientText = text;
                    console.log("Client OCR Complete:", text.substring(0, 100) + "...");
                } catch (clientError) {
                    console.error("Client OCR Failed:", clientError);
                    // Continue to server even if client fails
                }
            }

            // 2. Send to Server (with clientText if available)
            const formData = new FormData();
            formData.append('file', file);
            if (clientText) {
                formData.append('clientText', clientText);
            }

            const result = await parseInvoiceAction(formData);

            if (result.success && result.data) {
                setExtractedData(result.data);
                // Pre-fill form
                setValue('senderName', result.data.senderName);
                setValue('invoiceNo', result.data.invoiceNo || '');
                if (result.data.taxes) {
                    setValue('taxes', result.data.taxes);
                }
                if (result.data.date) {
                    const d = new Date(result.data.date);
                    const localDate = d.toLocaleDateString('en-CA'); // YYYY-MM-DD format
                    setValue('date', localDate as any);
                } else {
                    setValue('date', '' as any);
                }
                setValue('totalAmount', result.data.totalAmount);
                setValue('taxAmount', result.data.taxAmount);
                setValue('taxRate', result.data.taxRate);
                setValue('currency', result.data.currency);
                if (result.data.documentType) {
                    setValue('documentType', result.data.documentType);
                } else {
                    setValue('documentType', 'FATURA'); // Default
                }

                // Auto-match Cari
                if (result.data?.senderName) {
                    const match = parties.find(p => p.name.toLowerCase().includes(result.data!.senderName!.toLowerCase()));
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
            setOcrProgress(0);
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
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Yüklemek için dokunun</span> veya sürükleyin</p>
                            <p className="text-xs text-gray-500">PNG, JPG veya PDF</p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {previewUrl && (
                    <div className="relative flex-grow border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
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
                        disabled={!file || isAnalyzing || isCompressing}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                    >
                        {isCompressing ? (
                            <>
                                <Loader2 className="animate-spin mr-2" />
                                Optimize Ediliyor...
                            </>
                        ) : isAnalyzing ? (
                            <>
                                <Loader2 className="animate-spin mr-2" />
                                {ocrProgress > 0 && ocrProgress < 100 ? `Okunuyor... %${ocrProgress}` : 'Analiz Ediliyor...'}
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 bg-gray-50 text-gray-900 font-medium"
                            placeholder="Otomatik Okunacak"
                            readOnly
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {['FIS', 'CEK'].includes(currentDocType || '') ? 'Fiş/Belge No' : 'Fatura No'}
                            </label>
                            <input
                                {...register('invoiceNo')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-gray-900 font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tarih</label>
                            <input
                                type="date"
                                {...register('date')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-gray-900 font-medium"
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
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 font-bold text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">KDV Tutarı</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('taxAmount')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-gray-900"
                            />
                        </div>
                    </div>



                    {/* Tax Breakdown Table */}
                    {extractedData?.taxes && extractedData.taxes.length > 0 && (
                        <div className="mt-4 border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Bulunan KDV Detayları</h4>
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium text-gray-500">Oran</th>
                                        <th className="px-3 py-2 text-right font-medium text-gray-500">Tutar</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {extractedData.taxes.map((tax, index) => (
                                        <tr key={index}>
                                            <td className="px-3 py-2 text-gray-900 font-medium">%{tax.rate}</td>
                                            <td className="px-3 py-2 text-right text-gray-900">{tax.amount.toFixed(2)} ₺</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="text-xs text-gray-500 mt-1">* Bu değerler otomatik okunmuştur, lütfen kontrol ediniz.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">KDV Oranı (%)</label>
                            <input
                                type="number"
                                step="1"
                                placeholder="%1, 10, 20"
                                {...register('taxRate')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-gray-900"
                            />
                        </div>
                        <div className="hidden">
                            {/* Currency Hidden - Default TRY */}
                            <input type="hidden" {...register('currency')} value="TRY" />
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

                {/* Debug Section */}
                {
                    extractedData?.rawText && (
                        <div className="mt-8 border-t pt-4">
                            <details className="group">
                                <summary className="flex items-center cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700">
                                    <span>🔍 Geliştirici Modu: Ham OCR Metni</span>
                                    <span className="ml-2 text-xs text-gray-400">(Tesseract ne okudu?)</span>
                                </summary>
                                <div className="mt-2 p-3 bg-gray-900 text-green-400 text-xs font-mono rounded overflow-auto max-h-60 whitespace-pre-wrap">
                                    {extractedData.rawText}
                                </div>
                            </details>
                        </div>
                    )
                }
            </div >
        </div >
    );
}
