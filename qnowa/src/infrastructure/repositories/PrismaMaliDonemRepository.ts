import { PrismaClient, Prisma } from '@prisma/client';
import { prisma } from '../database/prisma-client';
import { IMaliDonemRepository } from '../../domain/accounting/repositories/IMaliDonemRepository';
import { MaliDonem, DonemDurumu } from '../../domain/accounting/MaliDonem';

export class PrismaMaliDonemRepository implements IMaliDonemRepository {
    async save(period: MaliDonem): Promise<void> {
        const data = {
            orgId: (period as any).props.orgId,
            year: (period as any).props.year,
            month: (period as any).props.month,
            status: (period as any).props.status as any,
            updatedAt: new Date(),
        };

        await prisma.maliDonem.upsert({
            where: { orgId_year_month: { orgId: data.orgId, year: data.year, month: data.month } },
            update: data,
            create: {
                ...data,
                createdAt: new Date()
            }
        });
    }

    async findByMonth(orgId: string, year: number, month: number): Promise<MaliDonem | null> {
        const row = await prisma.maliDonem.findUnique({
            where: {
                orgId_year_month: {
                    orgId,
                    year,
                    month
                }
            }
        });

        if (!row) return null;

        return this.toDomain(row);
    }

    private toDomain(row: any): MaliDonem {
        return MaliDonem.fromSnapshot({
            orgId: row.orgId,
            year: row.year,
            month: row.month,
            status: row.status as DonemDurumu,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        }, row.id);
    }
}
