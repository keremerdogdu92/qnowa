import { Fatura, FaturaDurumu, FaturaTipi } from '../Fatura';
import { IFaturaRepository } from '../repositories/IFaturaRepository';
import { IMuhasebeFisiRepository } from '../../accounting/repositories/IMuhasebeFisiRepository';
import { MuhasebeFisi, FisDurumu } from '../../accounting/MuhasebeFisi';
import { MuhasebeFisiSatir } from '../../accounting/MuhasebeFisiSatir';
import { Money } from '../../shared/value-objects/Money';

export class FaturaMuhasebeService {
    constructor(
        private faturaRepo: IFaturaRepository,
        private journalRepo: IMuhasebeFisiRepository
    ) { }

    async muhasebelestir(faturaId: string): Promise<string> {
        // 1. Fetch Invoice
        const fatura = await this.faturaRepo.findById(faturaId);
        if (!fatura) {
            throw new Error('Invoice not found');
        }

        // 2. Validate Status
        if (fatura.status !== FaturaDurumu.ONAYLI && fatura.status !== FaturaDurumu.GONDERILDI) {
            throw new Error('Invoice must be Finalized or Sent to be accounted');
        }

        // 3. Create Journal Entry (Yevmiye Fişi)
        // Note: yevmiyeNo is 0, will be assigned by Repo on save
        // Create Journal Header
        const journal = MuhasebeFisi.create({
            orgId: fatura.orgId,
            yevmiyeNo: 0, // Will be assigned by repo sequence strategy
            date: fatura.date,
            description: `Fatura Muhasebeleşmesi - No: ${fatura.faturaNo}`,
            periodMonth: fatura.date.getMonth() + 1,
            periodYear: fatura.date.getFullYear(),
        });

        // 4. Create Journal Lines based on Invoice Type
        // 1. Receivables (Borçlu) - 120 Alicilar
        // TODO: Get actual account code from Party or Settings
        const receivablesAccount = '120.01.001';

        journal.satirEkle(MuhasebeFisiSatir.create({
            journalId: journal.id,
            accountId: receivablesAccount,
            debit: fatura.grandTotal,
            credit: Money.zero(fatura.currency),
            sequence: 1,
            description: `Satis Faturasi - ${fatura.faturaNo}`
        }));

        // 2. Sales Revenue (Alacaklı) - 600 Yurtici Satislar
        const salesAccount = '600.01.001';

        journal.satirEkle(MuhasebeFisiSatir.create({
            journalId: journal.id,
            accountId: salesAccount,
            debit: Money.zero(fatura.currency),
            credit: fatura.subTotal,
            sequence: 2,
            description: `Mal Satis Bedeli`
        }));

        // 3. VAT (Alacaklı) - 391 Hesaplanan KDV
        if (fatura.taxTotal.amount > 0) {
            const vatAccount = '391.01.001';

            journal.satirEkle(MuhasebeFisiSatir.create({
                journalId: journal.id,
                accountId: vatAccount,
                debit: Money.zero(fatura.currency),
                credit: fatura.taxTotal,
                sequence: 3,
                description: `KDV`
            }));
        }

        // 5. Post the Journal (Triggers validation and balancing check)
        journal.onayla();

        // 6. Save (Triggers Gap-less Sequence assignment)
        await this.journalRepo.save(journal);

        return journal.id;
    }
}
