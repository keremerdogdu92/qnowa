import { describe, it, expect } from 'vitest';
import { MuhasebeFisi, JournalStatus } from './MuhasebeFisi';
import { MuhasebeFisiSatir } from './MuhasebeFisiSatir';
import { Money } from '../shared/value-objects/Money';

describe('MuhasebeFisi Aggregate', () => {
    const createMoney = (amount: number) => Money.create(amount, 'TRY');

    const createLine = (debit: number, credit: number, accountId: string): MuhasebeFisiSatir => {
        return MuhasebeFisiSatir.create({
            journalId: 'journal-1',
            accountId,
            debit: createMoney(debit),
            credit: createMoney(credit),
            sequence: 1,
            description: 'Test Line'
        });
    };

    it('should create a draft journal', () => {
        const journal = MuhasebeFisi.create({
            orgId: 'org-1',
            journalNo: 1001,
            date: new Date(),
            periodMonth: 1,
            periodYear: 2024,
        });

        expect(journal.status).toBe(JournalStatus.DRAFT);
        expect(journal.lines).toHaveLength(0);
    });

    it('should allow adding lines to draft journal', () => {
        const journal = MuhasebeFisi.create({
            orgId: 'org-1',
            journalNo: 1001,
            date: new Date(),
            periodMonth: 1,
            periodYear: 2024,
        });

        const line = createLine(100, 0, '100');
        journal.addLine(line);

        expect(journal.lines).toHaveLength(1);
    });

    it('should not allow posting an empty journal', () => {
        const journal = MuhasebeFisi.create({
            orgId: 'org-1',
            journalNo: 1001,
            date: new Date(),
            periodMonth: 1,
            periodYear: 2024,
        });

        expect(() => journal.post()).toThrow('Cannot post an empty journal');
    });

    it('should not allow posting an unbalanced journal', () => {
        const journal = MuhasebeFisi.create({
            orgId: 'org-1',
            journalNo: 1001,
            date: new Date(),
            periodMonth: 1,
            periodYear: 2024,
        });

        journal.addLine(createLine(100, 0, '100')); // Debit 100
        journal.addLine(createLine(0, 50, '120'));  // Credit 50

        expect(() => journal.post()).toThrow('Journal entry is not balanced');
    });

    it('should allow posting a balanced journal', () => {
        const journal = MuhasebeFisi.create({
            orgId: 'org-1',
            journalNo: 1001,
            date: new Date(),
            periodMonth: 1,
            periodYear: 2024,
        });

        journal.addLine(createLine(100, 0, '100')); // Debit 100
        journal.addLine(createLine(0, 100, '300')); // Credit 100

        journal.post();
        expect(journal.status).toBe(JournalStatus.POSTED);
    });

    it('should prevent adding lines to posted journal', () => {
        const journal = MuhasebeFisi.create({
            orgId: 'org-1',
            journalNo: 1001,
            date: new Date(),
            periodMonth: 1,
            periodYear: 2024,
        });

        journal.addLine(createLine(100, 0, '100'));
        journal.addLine(createLine(0, 100, '300'));
        journal.post();

        expect(() => journal.addLine(MuhasebeFisiSatir.create({ journalId: 'journal-1', accountId: '102', debit: createMoney(50), credit: createMoney(0), sequence: 1 }))).toThrow('Cannot add lines to a posted journal');
    });
});
