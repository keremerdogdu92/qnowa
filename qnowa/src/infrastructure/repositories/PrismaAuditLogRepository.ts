import { prisma } from '@/infrastructure/database/prisma-client';
import { AuditLog } from '@/domain/security/AuditLog';

export class PrismaAuditLogRepository {
    async save(log: AuditLog): Promise<void> {
        await prisma.auditLog.create({
            data: {
                id: log.id,
                orgId: log.orgId,
                userId: log.userId,
                action: log.action,
                entityId: log.entityId,
                entityType: log.entityType,
                details: log.details ?? undefined,
                ipAddress: log.ipAddress,
                userAgent: log.userAgent,
                createdAt: log.createdAt
            }
        });
    }

    async findLatestByOrg(orgId: string, limit = 50): Promise<AuditLog[]> {
        const rows = await prisma.auditLog.findMany({
            where: { orgId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: { user: { select: { name: true, email: true } } }
        });

        // Mapping to domain, preserving user info in details if needed, 
        // or we can extend Domain Entity to include userName optional.
        // For now, simple mapping.
        return rows.map(r => new AuditLog(
            r.id,
            r.orgId,
            r.action,
            r.entityId,
            r.entityType,
            r.createdAt,
            r.userId || undefined,
            r.details,
            r.ipAddress || undefined,
            r.userAgent || undefined
        ));
    }
}
