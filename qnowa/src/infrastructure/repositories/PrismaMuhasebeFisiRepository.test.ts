import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaMuhasebeFisiRepository } from './PrismaMuhasebeFisiRepository';
import { MuhasebeFisi, JournalStatus } from '../../domain/accounting/MuhasebeFisi';
import { prisma } from '../database/prisma-client';
import { MuhasebeFisiSatir } from '../../domain/accounting/MuhasebeFisiSatir';
import { Money } from '../../domain/shared/value-objects/Money';

describe('PrismaMuhasebeFisiRepository Integration', () => {
    const repo = new PrismaMuhasebeFisiRepository();
    const testOrgId = 'test-org-seq-' + Date.now();
    const testYear = 2024;

    beforeAll(async () => {
        // Create Organization
        await prisma.organization.create({
            data: {
                id: testOrgId,
                name: 'Test Org for Sequence',
                taxNumber: '1111111111',
            }
        });

        // Create Account Plan
        await prisma.hesapPlani.createMany({
            data: [
                { id: testOrgId + '-100', orgId: testOrgId, code: '100', name: 'Kasa' },
                { id: testOrgId + '-300', orgId: testOrgId, code: '300', name: 'Banka Kredileri' }
            ]
        });
    });

    afterAll(async () => {
        // cleanup
        await prisma.journalSequence.deleteMany({ where: { orgId: testOrgId } });
        await prisma.muhasebeFisiSatir.deleteMany({ where: { journal: { orgId: testOrgId } } });
        await prisma.muhasebeFisi.deleteMany({ where: { orgId: testOrgId } });
        await prisma.hesapPlani.deleteMany({ where: { orgId: testOrgId } });
        await prisma.organization.delete({ where: { id: testOrgId } });
    });

    it('should assign sequential numbers to posted journals', async () => {
        const createJournal = () => {
            const journal = MuhasebeFisi.create({
                orgId: testOrgId,
                journalNo: 0,
                date: new Date(),
                periodMonth: 1,
                periodYear: testYear,
                description: 'Test Journal',
            });

            journal.addLine(MuhasebeFisiSatir.create({
                journalId: journal.id,
                accountId: testOrgId + '-100',
                debit: Money.create(100),
                credit: Money.create(0),
                sequence: 1
            }));

            journal.addLine(MuhasebeFisiSatir.create({
                journalId: journal.id,
                accountId: testOrgId + '-300',
                debit: Money.create(0),
                credit: Money.create(100),
                sequence: 2
            }));

            journal.post();
            return journal;
        };

        const journal1 = createJournal();
        const journal2 = createJournal();
        const journal3 = createJournal();

        // Save them concurrently
        await Promise.all([
            repo.save(journal1),
            repo.save(journal2),
            repo.save(journal3)
        ]);

        // Fetch and check numbers
        const saved1 = await repo.findById(journal1.id);
        const saved2 = await repo.findById(journal2.id);
        const saved3 = await repo.findById(journal3.id);

        const numbers = [saved1?.journalNo, saved2?.journalNo, saved3?.journalNo].sort((a, b) => (a || 0) - (b || 0));

        expect(numbers).toEqual([1, 2, 3]);
    });
});
