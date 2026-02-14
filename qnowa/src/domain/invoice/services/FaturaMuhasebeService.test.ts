
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FaturaMuhasebeService } from './FaturaMuhasebeService';
import { IFaturaRepository } from '../repositories/IFaturaRepository';
import { IMuhasebeFisiRepository } from '../../accounting/repositories/IMuhasebeFisiRepository';
import { Fatura, FaturaStatus, FaturaType } from '../Fatura';
import { MuhasebeFisi, JournalStatus } from '../../accounting/MuhasebeFisi';
import { Money } from '../../shared/value-objects/Money';

describe('FaturaMuhasebeService', () => {
    let service: FaturaMuhasebeService;
    let mockFaturaRepo: IFaturaRepository;
    let mockJournalRepo: IMuhasebeFisiRepository;

    beforeEach(() => {
        mockFaturaRepo = {
            findById: vi.fn(),
            save: vi.fn(),
            findAllByStatus: vi.fn(),
        };
        mockJournalRepo = {
            save: vi.fn(),
            findById: vi.fn(),
            findByJournalNo: vi.fn(),
        };
        service = new FaturaMuhasebeService(mockFaturaRepo, mockJournalRepo);
    });

    const createMockFatura = (status = FaturaStatus.FINALIZED) => {
        const fatura = Fatura.create({
            orgId: 'org-1',
            faturaNo: 'FAT-100',
            date: new Date('2024-01-15'),
            type: FaturaType.SATIS,
            partyId: 'cust-1',
            currency: 'TRY',
        });

        // Mock properties that are normally set by internal logic or persistence
        (fatura as any).props.status = status;
        (fatura as any).props.grandTotal = Money.create(118, 'TRY');
        (fatura as any).props.subTotal = Money.create(100, 'TRY');
        (fatura as any).props.taxTotal = Money.create(18, 'TRY');

        return fatura;
    };

    it('should throw error if fatura not found', async () => {
        (mockFaturaRepo.findById as any).mockResolvedValue(null);

        await expect(service.muhasebelestir('inv-1'))
            .rejects.toThrow('Invoice not found');
    });

    it('should throw error if fatura is not finalized', async () => {
        const fatura = createMockFatura(FaturaStatus.DRAFT);
        (mockFaturaRepo.findById as any).mockResolvedValue(fatura);

        await expect(service.muhasebelestir('inv-1'))
            .rejects.toThrow('Invoice must be Finalized');
    });

    it('should create and save a journal entry for a finalized sales fatura', async () => {
        const fatura = createMockFatura(FaturaStatus.FINALIZED);
        (mockFaturaRepo.findById as any).mockResolvedValue(fatura);

        const saveSpy = vi.spyOn(mockJournalRepo, 'save');

        await service.muhasebelestir('inv-1');

        expect(saveSpy).toHaveBeenCalledTimes(1);
        const savedJournal = saveSpy.mock.calls[0][0] as MuhasebeFisi;

        expect(savedJournal).toBeInstanceOf(MuhasebeFisi);
        expect((savedJournal as any).props.description).toContain('Fatura Muhasebeleşmesi');
        // Sales Invoice: Debit 120, Credit 600, Credit 391
        // 1. Debit 120 (1200)
        // 2. Credit 600 (1000)
        // 3. Credit 391 (200)
        expect(savedJournal.lines).toHaveLength(3);
        expect(savedJournal.isBalanced()).toBe(true);
        expect(savedJournal.lines[0].debit.amount).toBe(118); // Receivables
        expect(savedJournal.lines[1].credit.amount).toBe(100); // Sales
        expect(savedJournal.lines[2].credit.amount).toBe(18); // VAT
    });
});
