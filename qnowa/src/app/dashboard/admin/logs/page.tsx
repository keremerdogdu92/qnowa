import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PrismaAuditLogRepository } from '@/infrastructure/repositories/PrismaAuditLogRepository';

export const dynamic = 'force-dynamic';

export default async function AuditLogsPage() {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        redirect('/giris');
    }

    const orgId = (session.user as any).orgId;
    const repo = new PrismaAuditLogRepository();
    const logs = await repo.findLatestByOrg(orgId, 50);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">İşlem Geçmişi (Audit Logs)</h1>
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Varlık</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detay</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                            <tr key={log.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {log.createdAt.toLocaleString('tr-TR')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {/* User name not available in AuditLog entity yet, need repo update or join */}
                                    {/* For now, userId is logged. Repo.findLatestByOrg does include user relation but entity mapping might have missed it. */}
                                    {log.userId || 'Sistem'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {log.entityType} ({log.entityId.substring(0, 8)}...)
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <pre className="text-xs">{JSON.stringify(log.details, null, 2)}</pre>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
