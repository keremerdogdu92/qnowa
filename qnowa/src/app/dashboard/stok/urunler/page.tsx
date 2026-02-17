import { ProductService } from '@/domain/stock/services/ProductService';
import { auth } from '@/auth';
import Link from 'next/link';

export default async function ProductListPage() {
    const session = await auth();
    if (!session?.user?.orgId) return null;

    const productService = new ProductService();
    const products = await productService.listProducts(session.user.orgId);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Ürün ve Hizmetler</h1>
                <Link
                    href="/dashboard/stok/urunler/yeni"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Yeni Ürün/Hizmet
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kod (SKU)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İsim</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Satış Fiyatı</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Birim</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.type === 'GOODS' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {product.type === 'GOODS' ? 'Mal (Stoklu)' : 'Hizmet'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: product.currency }).format(product.sellPrice)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-bold">
                                    {product.type === 'GOODS' ? product.stockQuantity : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{product.unit}</td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    Henüz ürün veya hizmet tanımlanmamış.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
