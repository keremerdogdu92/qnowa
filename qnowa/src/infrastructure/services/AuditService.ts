import { AuditLog } from '@/domain/security/AuditLog';
import { PrismaAuditLogRepository } from '@/infrastructure/repositories/PrismaAuditLogRepository';
import { headers } from 'next/headers';

const auditRepo = new PrismaAuditLogRepository();

export async function logAction(
    orgId: string,
    userId: string | undefined, // undefined for system actions
    action: string,
    entityType: string,
    entityId: string,
    details?: any
) {
    try {
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        const log = AuditLog.create({
            orgId,
            userId,
            action,
            entityType,
            entityId,
            details,
            ipAddress: ip,
            userAgent
        });

        await auditRepo.save(log);
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Fail-safe: Don't block main flow if logging fails? 
        // Or throw depending on security requirement. For now, log error and continue.
    }
}
