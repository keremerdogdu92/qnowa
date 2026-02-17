
import { prisma } from '@/infrastructure/database/prisma-client';
import { Cheque, ChequeStatus, ChequeType, InstrumentType } from '@/domain/finance/Cheque';
import { Money } from '@/domain/shared/value-objects/Money';

export class PrismaChequeRepository {
    async findById(id: string): Promise<Cheque | null> {
        const data = await prisma.cheque.findUnique({
            where: { id }
        });

        if (!data) return null;

        return this.mapToDomain(data);
    }

    async findAll(orgId: string, status?: ChequeStatus): Promise<Cheque[]> {
        const data = await prisma.cheque.findMany({
            where: {
                orgId,
                ...(status ? { status } : {})
            },
            orderBy: { dueDate: 'asc' }
        });

        return data.map(this.mapToDomain);
    }

    async save(cheque: Cheque): Promise<void> {
        await prisma.cheque.upsert({
            where: { id: cheque.id },
            update: {
                status: cheque.status,
                updatedAt: new Date(),
                // Updates
                instrument: cheque.instrument
            },
            create: {
                id: cheque.id,
                orgId: cheque.orgId,
                chequeNo: cheque.chequeNo,
                bankName: (cheque as any).props.bankName,
                branchName: (cheque as any).props.branchName,
                accountNo: (cheque as any).props.accountNo,
                drawer: (cheque as any).props.drawer,
                amount: cheque.amount.amount,
                currency: cheque.amount.currency,
                issueDate: (cheque as any).props.issueDate,
                dueDate: cheque.dueDate,
                type: cheque.type,
                instrument: cheque.instrument, // Added
                status: cheque.status,
                cariId: cheque.cariId,
            }
        });
    }

    private mapToDomain(data: any): Cheque {
        return Cheque.create({
            orgId: data.orgId,
            chequeNo: data.chequeNo,
            bankName: data.bankName,
            branchName: data.branchName,
            accountNo: data.accountNo,
            drawer: data.drawer,
            amount: Money.create(data.amount.toNumber(), data.currency),
            issueDate: data.issueDate,
            dueDate: data.dueDate,
            type: data.type as ChequeType,
            instrument: (data.instrument as InstrumentType) || InstrumentType.CEK, // Fallback
            status: data.status as ChequeStatus,
            cariId: data.cariId || undefined,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }, data.id);
    }
}
