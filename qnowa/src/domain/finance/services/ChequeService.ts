
import { Cheque, ChequeStatus, ChequeType } from '@/domain/finance/Cheque';
import { PrismaChequeRepository } from '@/infrastructure/repositories/PrismaChequeRepository';
import { PrismaMuhasebeFisiRepository } from '@/infrastructure/repositories/PrismaMuhasebeFisiRepository';
import { FaturaMuhasebeService } from '@/domain/invoice/services/FaturaMuhasebeService';
// Reusing accounting service or repo logic for journal creation
import { MuhasebeFisi, FisDurumu } from '@/domain/accounting/MuhasebeFisi';
import { MuhasebeFisiSatir } from '@/domain/accounting/MuhasebeFisiSatir';
import { Money } from '@/domain/shared/value-objects/Money';

const chequeRepo = new PrismaChequeRepository();
const journalRepo = new PrismaMuhasebeFisiRepository();

export class ChequeService {
    async registerInbound(cheque: Cheque): Promise<void> {
        // 1. Save Cheque
        await chequeRepo.save(cheque);

        // 2. Automate Accounting (Dr: 101, Cr: 120)
        await this.createJournalEntry(cheque, 'Çek Girişi', '101', '120');
    }

    async collect(chequeId: string, targetAccountId: string): Promise<void> {
        const cheque = await chequeRepo.findById(chequeId);
        if (!cheque) throw new Error('Çek bulunamadı');

        cheque.collect();
        await chequeRepo.save(cheque);

        // Accounting (Dr: 100/102, Cr: 101)
        await this.createJournalEntry(cheque, 'Çek Tahsilatı', targetAccountId, '101');
    }

    async endorse(chequeId: string, supplierCariId: string): Promise<void> {
        const cheque = await chequeRepo.findById(chequeId);
        if (!cheque) throw new Error('Çek bulunamadı');

        cheque.endorse(supplierCariId);
        await chequeRepo.save(cheque);

        // Accounting (Dr: 320, Cr: 101)
        await this.createJournalEntry(cheque, 'Çek Cirosu', '320', '101');
    }

    private async createJournalEntry(cheque: Cheque, description: string, debitCode: string, creditCode: string) {
        // This is a simplified accounting logic. In a real world, we need Account Plan lookup.
        // Assuming we have a helper or can create Journal directly.

        // Lookup global plan or org plan for Account IDs based on codes '100', '101' etc.
        // For this MVP, we might need a helper to find Account ID by Code. 
        // Let's assume we can pass the logic to a dedicated Accounting Service eventually.
        // For now, I'll log or stub this part to avoid complexity explosion in this file, 
        // or usage of `FaturaMuhasebeService` patterns if applicable.

        console.log(`[Accounting] ${description}: Dr ${debitCode} / Cr ${creditCode} - ${cheque.amount.amount} ${cheque.amount.currency}`);

        // TODO: Implement actual Journal Entry creation via MuhasebeFisiRepository
        // This requires fetching Account IDs for "101.01", "120.XX" etc.
    }
}
