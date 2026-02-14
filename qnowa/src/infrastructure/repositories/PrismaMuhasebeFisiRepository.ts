
import { PrismaClient, Prisma } from '@prisma/client';
import { prisma } from '../database/prisma-client';
import { IMuhasebeFisiRepository } from '../../domain/accounting/repositories/IMuhasebeFisiRepository';
import { MuhasebeFisi, FisDurumu } from '../../domain/accounting/MuhasebeFisi';
import { MuhasebeFisiSatir } from '../../domain/accounting/MuhasebeFisiSatir';
import { Money } from '../../domain/shared/value-objects/Money';
import { PrismaJournalSequenceService } from '../services/PrismaJournalSequenceService';

type PrismaTx = Prisma.TransactionClient;

export class PrismaMuhasebeFisiRepository implements IMuhasebeFisiRepository {
    private sequenceService = new PrismaJournalSequenceService();

    async save(journal: MuhasebeFisi): Promise<void> {
        if (journal.status === FisDurumu.ONAYLI && journal.yevmiyeNo === 0) {
            await prisma.$transaction(async (tx) => {
                const nextNo = await this.sequenceService.getNextSequence(
                    (tx as any),
                    (journal as any).props.orgId,
                    (journal as any).props.periodYear
                );
                journal.yevmiyeNoAta(nextNo);

                await this.persist(tx as any, journal);
            });
        } else {
            await this.persist(prisma, journal);
        }
    }

    private async persist(tx: PrismaTx | PrismaClient, journal: MuhasebeFisi): Promise<void> {
        const data = {
            orgId: (journal as any).props.orgId,
            yevmiyeNo: (journal as any).props.yevmiyeNo,
            date: (journal as any).props.date,
            description: (journal as any).props.description,
            status: (journal as any).props.status,
            periodMonth: (journal as any).props.periodMonth,
            periodYear: (journal as any).props.periodYear,
            updatedAt: new Date(),
        };

        // Upsert Header
        await tx.muhasebeFisi.upsert({
            where: { id: journal.id },
            create: {
                id: journal.id,
                ...data,
                createdAt: new Date(),
            },
            update: data,
        });

        // Delete existing lines (primitive way, but safe for aggregate consistency)
        await tx.muhasebeFisiSatir.deleteMany({
            where: { journalId: journal.id }
        });

        // Insert Lines
        if (journal.lines.length > 0) {
            await tx.muhasebeFisiSatir.createMany({
                data: journal.lines.map((line) => ({
                    id: line.id,
                    journalId: journal.id,
                    accountId: (line as any).props.accountId,
                    description: (line as any).props.description,
                    debit: (line as any).props.debit.amount,
                    credit: (line as any).props.credit.amount,
                    sequence: (line as any).props.sequence
                }))
            });
        }
    }

    async findById(id: string): Promise<MuhasebeFisi | null> {
        const row = await prisma.muhasebeFisi.findUnique({
            where: { id },
            include: { lines: true }
        });

        if (!row) return null;

        return this.toDomain(row);
    }

    async findByJournalNo(orgId: string, year: number, no: number): Promise<MuhasebeFisi | null> {
        const row = await prisma.muhasebeFisi.findUnique({
            where: {
                orgId_periodYear_yevmiyeNo: {
                    orgId,
                    periodYear: year,
                    yevmiyeNo: no
                }
            },
            include: { lines: true }
        });

        if (!row) return null;

        return this.toDomain(row);
    }

    private toDomain(row: any): MuhasebeFisi {
        const lines = row.lines.map((l: any) =>
            MuhasebeFisiSatir.create({
                journalId: l.journalId,
                accountId: l.accountId,
                description: l.description,
                debit: Money.create(l.debit.toNumber(), 'TRY'), // Assumption: Single currency for now
                credit: Money.create(l.credit.toNumber(), 'TRY'),
                sequence: l.sequence
            }, l.id)
        );

        const journal = MuhasebeFisi.create({
            orgId: row.orgId,
            yevmiyeNo: row.yevmiyeNo,
            date: row.date,
            description: row.description,
            periodMonth: row.periodMonth,
            periodYear: row.periodYear,
        }, row.id);

        // Hydrate status and lines
        (journal as any).props.status = row.status as FisDurumu;
        (journal as any).props.lines = lines;
        (journal as any).props.createdAt = row.createdAt;
        (journal as any).props.updatedAt = row.updatedAt;

        return journal;
    }
}
