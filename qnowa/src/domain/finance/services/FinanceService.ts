import { prisma } from '@/infrastructure/database/prisma-client';
import { Bank } from '../Bank';
import { Safe } from '../Safe';
import { Payment } from '../Payment';
import { PaymentType } from '@prisma/client';
import { AccountingService } from '@/domain/accounting/services/AccountingService';
import { PrismaMuhasebeFisiRepository } from '@/infrastructure/repositories/PrismaMuhasebeFisiRepository';

export class FinanceService {

    // -------------------------------------------------------------------------
    // BANK / SAFE DEFINITIONS
    // -------------------------------------------------------------------------

    static async createBank(
        orgId: string,
        name: string,
        currency: string = 'TRY',
        iban?: string,
        branch?: string,
        accountId?: string
    ) {
        let finalAccountId = accountId;

        // Logic: If accountId is not provided, verify logical consistency or auto-create in future.
        // For MVP, we respect what's passed.

        const bank = Bank.create({ orgId, name, currency, iban, branch, accountId: finalAccountId });

        await prisma.bank.create({
            data: {
                id: bank.id,
                orgId: bank.orgId,
                name: bank.name,
                currency: bank.currency,
                iban: bank.iban,
                branch: bank.branch,
                accountId: bank.accountId
            }
        });

        return bank;
    }

    static async createSafe(
        orgId: string,
        name: string,
        currency: string = 'TRY',
        accountId?: string
    ) {
        const safe = Safe.create({ orgId, name, currency, accountId });

        await prisma.safe.create({
            data: {
                id: safe.id,
                orgId: safe.orgId,
                name: safe.name,
                currency: safe.currency,
                accountId: safe.accountId
            }
        });

        return safe;
    }

    // -------------------------------------------------------------------------
    // PAYMENTS (TAHSILAT / ODEME)
    // -------------------------------------------------------------------------

    static async createPayment(props: {
        orgId: string;
        userId: string; // for audit
        type: PaymentType;
        amount: number;
        date: Date;
        description?: string;
        cariId?: string;
        faturaId?: string;
        bankId?: string;
        safeId?: string;
    }) {
        // 1. Validate
        if (!props.bankId && !props.safeId) throw new Error("Kasa veya Banka seçilmeli.");

        // 2. Create Domain Entity
        const payment = Payment.create({
            orgId: props.orgId,
            date: props.date,
            amount: props.amount,
            type: props.type,
            description: props.description,
            cariId: props.cariId,
            faturaId: props.faturaId,
            bankId: props.bankId,
            safeId: props.safeId
        });

        // 3. Save to DB
        await prisma.payment.create({
            data: {
                id: payment.id,
                orgId: payment.orgId,
                date: payment.date,
                amount: payment.amount,
                type: payment.type,
                description: payment.description,
                cariId: payment.cariId,
                faturaId: payment.faturaId,
                bankId: payment.bankId,
                safeId: payment.safeId
            }
        });

        // 4. Accounting Integration
        // We need 2 accounts:
        // A) Cash/Bank Account (100 or 102)
        // B) Cari Account (120 or 320)

        let cashAccountCode: string | null = null;
        let cashAccountName: string = '';

        if (props.safeId) {
            const safe = await prisma.safe.findUnique({ where: { id: props.safeId }, include: { account: true } });
            if (safe?.account) {
                cashAccountCode = safe.account.code;
                cashAccountName = safe.name;
            }
        } else if (props.bankId) {
            const bank = await prisma.bank.findUnique({ where: { id: props.bankId }, include: { account: true } });
            if (bank?.account) {
                cashAccountCode = bank.account.code;
                cashAccountName = bank.name;
            }
        }

        if (cashAccountCode) {
            // Determine Counter Account (Cari)
            // TODO: Cari should have `accountId`. For now assume generic 120/320 or specific.
            // We really need a way to find the account for the Cari.
            let counterAccountCode = '120.01.001'; // Default Customer

            // Logic to find real account would go here...
            // If type is ODEME -> 320.01.001 (Default Supplier)
            if (props.type === PaymentType.ODEME) {
                counterAccountCode = '320.01.001';
            }

            const accountingService = new AccountingService(new PrismaMuhasebeFisiRepository());

            const lines = [];

            if (props.type === PaymentType.TAHSILAT) {
                // Cash/Bank Debit (Borç), Customer Credit (Alacak)
                lines.push({
                    accountId: cashAccountCode,
                    description: `Tahsilat - ${cashAccountName}`,
                    debit: props.amount,
                    credit: 0
                });
                lines.push({
                    accountId: counterAccountCode,
                    description: `Tahsilat - ${props.description || ''}`,
                    debit: 0,
                    credit: props.amount
                });
            } else {
                // Supplier Debit (Borç), Cash/Bank Credit (Alacak)
                lines.push({
                    accountId: counterAccountCode,
                    description: `Ödeme - ${props.description || ''}`,
                    debit: props.amount,
                    credit: 0
                });
                lines.push({
                    accountId: cashAccountCode,
                    description: `Ödeme - ${cashAccountName}`,
                    debit: 0,
                    credit: props.amount
                });
            }

            try {
                await accountingService.createJournal({
                    orgId: props.orgId,
                    date: props.date,
                    description: `Finans İşlemi - ${props.description || 'Fiş'}`,
                    lines
                });
            } catch (e) {
                console.error("Muhasebe fişi oluşturulamadı:", e);
                // We don't rollback payment for now, but ideally we should regarding consistency
            }
        }
    }
}
