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
        if (fatura.type === FaturaTipi.SATIS) {
            // --- SATIS FATURASI (Sales Invoice) ---
            // 1. Receivables (Borçlu) - 120 Alicilar
            const receivablesAccount = '120.01.001'; // TODO: Dynamic from Cari
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

        } else if (fatura.type === FaturaTipi.ALIS) {
            // --- ALIS FATURASI (Purchase Invoice) ---
            // 1. Payables (Alacaklı) - 320 Saticilar
            const payablesAccount = '320.01.001'; // TODO: Dynamic from Cari
            // NOTE: Payables is Credit (Alacaklı), but in double entry it balances the expense.

            // 2. Expense Cost (Borçlu) - 770 Genel Yonetim Giderleri (MVP Default)
            // Or 153 Ticari Mallar if it's inventory. For now assuming Service/General Expense.
            const expenseAccount = '770.01.001';

            journal.satirEkle(MuhasebeFisiSatir.create({
                journalId: journal.id,
                accountId: expenseAccount,
                debit: fatura.subTotal,
                credit: Money.zero(fatura.currency),
                sequence: 1,
                description: `Mal/Hizmet Alis Bedeli`
            }));

            // 3. VAT (Borçlu) - 191 Indirilecek KDV
            if (fatura.taxTotal.amount > 0) {
                const vatRecAccount = '191.01.001';
                journal.satirEkle(MuhasebeFisiSatir.create({
                    journalId: journal.id,
                    accountId: vatRecAccount,
                    debit: fatura.taxTotal,
                    credit: Money.zero(fatura.currency),
                    sequence: 2,
                    description: `Indirilecek KDV`
                }));
            }

            // 4. Payables (Alacaklı) - 320 Saticilar
            journal.satirEkle(MuhasebeFisiSatir.create({
                journalId: journal.id,
                accountId: payablesAccount,
                debit: Money.zero(fatura.currency),
                credit: fatura.grandTotal,
                sequence: 3,
                description: `Alis Faturasi - ${fatura.faturaNo}`
            }));
        }

        // 5. Post the Journal (Triggers validation and balancing check)
        journal.onayla();

        // 6. Save (Triggers Gap-less Sequence assignment)
        await this.journalRepo.save(journal);

        return journal.id;
    }
}
