
import { PrismaClient, Prisma } from '@prisma/client';
import { prisma } from '../database/prisma-client';
import { IFaturaRepository } from '../../domain/invoice/repositories/IFaturaRepository';
import { Fatura, FaturaDurumu, FaturaTipi } from '../../domain/invoice/Fatura';
import { FaturaSatir } from '../../domain/invoice/FaturaSatir';
import { Money } from '../../domain/shared/value-objects/Money';

type PrismaTx = Prisma.TransactionClient;

export class PrismaFaturaRepository implements IFaturaRepository {
    async save(invoice: Fatura): Promise<void> {
        const data = {
            orgId: (invoice as any).props.orgId,
            faturaNo: (invoice as any).props.faturaNo,
            date: (invoice as any).props.date,
            status: (invoice as any).props.status as any,
            type: (invoice as any).props.type as any,
            cariId: (invoice as any).props.cariId,
            subTotal: (invoice as any).props.subTotal.amount,
            taxTotal: (invoice as any).props.taxTotal.amount,
            grandTotal: (invoice as any).props.grandTotal.amount,
            currency: (invoice as any).props.currency,
            updatedAt: new Date(),
        };

        await prisma.$transaction(async (tx: PrismaTx) => {
            await tx.fatura.upsert({
                where: { id: invoice.id },
                create: {
                    id: invoice.id,
                    ...data,
                    createdAt: new Date(),
                },
                update: data,
            });

            await tx.faturaSatir.deleteMany({
                where: { faturaId: invoice.id }
            });

            if (invoice.lines.length > 0) {
                await tx.faturaSatir.createMany({
                    data: invoice.lines.map((line) => ({
                        id: line.id,
                        faturaId: invoice.id,
                        description: line.description,
                        quantity: line.quantity,
                        unitPrice: line.unitPrice.amount,
                        taxRate: line.taxRate,
                        total: line.total.amount
                    }))
                });
            }
        });
    }

    async findById(id: string): Promise<Fatura | null> {
        const row = await prisma.fatura.findUnique({
            where: { id },
            include: { lines: true }
        });

        if (!row) return null;

        return this.toDomain(row);
    }

    async findAllByStatus(orgId: string, status: FaturaDurumu, type?: FaturaTipi): Promise<Fatura[]> {
        const where: any = {
            orgId,
            status: status as any
        };
        if (type) {
            where.type = type;
        }

        const rows = await prisma.fatura.findMany({
            where,
            include: { lines: true },
            orderBy: { createdAt: 'desc' }
        });

        return rows.map((row) => this.toDomain(row));
    }

    async findAll(orgId: string, type?: FaturaTipi): Promise<Fatura[]> {
        const where: any = { orgId };
        if (type) {
            where.type = type;
        }

        const rows = await prisma.fatura.findMany({
            where,
            include: { lines: true },
            orderBy: { createdAt: 'desc' }
        });

        return rows.map((row) => this.toDomain(row));
    }

    private toDomain(row: any): Fatura {
        const lines = row.lines.map((l: any) =>
            FaturaSatir.create({
                description: l.description,
                quantity: l.quantity.toNumber(),
                unitPrice: Money.create(l.unitPrice.toNumber(), row.currency),
                taxRate: l.taxRate,
            }, l.id)
        );

        const invoice = Fatura.create({
            orgId: row.orgId,
            faturaNo: row.faturaNo,
            date: row.date,
            dueDate: row.dueDate || undefined,
            type: row.type as FaturaTipi,
            cariId: row.cariId,
            currency: row.currency,
        }, row.id);

        (invoice as any).props.status = row.status as FaturaDurumu;
        (invoice as any).props.subTotal = Money.create(row.subTotal.toNumber(), row.currency);
        (invoice as any).props.taxTotal = Money.create(row.taxTotal.toNumber(), row.currency);
        (invoice as any).props.grandTotal = Money.create(row.grandTotal.toNumber(), row.currency);
        (invoice as any).props.lines = lines;
        (invoice as any).props.createdAt = row.createdAt;
        (invoice as any).props.updatedAt = row.updatedAt;

        return invoice;
    }
}
