
import { describe, it, expect } from 'vitest';
import { Fatura, FaturaStatus, FaturaType } from './Fatura';
import { FaturaSatir } from './FaturaSatir';
import { Money } from '../shared/value-objects/Money';

describe('Fatura Aggregate', () => {
    const createMoney = (amount: number) => Money.create(amount, 'TRY');
    const createLine = (price: number, qty: number): FaturaSatir => {
        return FaturaSatir.create({
            description: 'Test Item',
            quantity: qty,
            unitPrice: createMoney(price),
            taxRate: 18,
            // total calculated inside
        });
    };

    it('should create a draft fatura', () => {
        const fatura = Fatura.create({
            orgId: 'org-1',
            faturaNo: 'FAT-001',
            date: new Date(),
            type: FaturaType.SATIS,
            partyId: 'party-1',
            currency: 'TRY',
        });

        expect(fatura.status).toBe(FaturaStatus.DRAFT);
        expect(fatura.lines).toHaveLength(0);
        expect(fatura.total.amount).toBe(0);
    });

    it('should add lines and calculate totals correctly', () => {
        const fatura = Fatura.create({
            orgId: 'org-1',
            faturaNo: 'GIB2024000000001',
            date: new Date(),
            type: FaturaType.SATIS,
            partyId: 'cust-1',
            currency: 'TRY',
        });

        const line1 = FaturaSatir.create({
            description: 'Item 1',
            quantity: 2,
            unitPrice: createMoney(100), // 2 * 100 = 200
            taxRate: 20 // 20% tax = 40
        });

        fatura.addLine(line1);

        // Subtotal: 200
        // Tax: 40
        // Total: 240
        expect(fatura.total.amount).toBe(240);
    });

    it('should prevent finalizing empty fatura', () => {
        const fatura = Fatura.create({
            orgId: 'org-1',
            faturaNo: 'GIB2024000000001',
            date: new Date(),
            type: FaturaType.SATIS,
            partyId: 'cust-1',
            currency: 'TRY',
        });

        expect(() => fatura.finalize()).toThrow('Cannot finalize an empty invoice');
    });

    it('should finalize valid fatura', () => {
        const fatura = Fatura.create({
            orgId: 'org-1',
            faturaNo: 'GIB2024000000001',
            date: new Date(),
            type: FaturaType.SATIS,
            partyId: 'cust-1',
            currency: 'TRY',
        });

        const line1 = FaturaSatir.create({
            description: 'Item 1',
            quantity: 1,
            unitPrice: createMoney(100),
            taxRate: 18
        });

        fatura.addLine(line1);
        fatura.finalize();

        expect(fatura.status).toBe(FaturaStatus.FINALIZED);
    });
});
