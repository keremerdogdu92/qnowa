
import { describe, it, expect } from 'vitest';
import { HesapPlani } from './HesapPlani';
import { AccountCode } from './value-objects/AccountCode';

describe('AccountCode Value Object', () => {
    it('should create valid codes', () => {
        expect(AccountCode.create('100').value).toBe('100');
        expect(AccountCode.create('100.01').value).toBe('100.01');
        expect(AccountCode.create('120.01.001').value).toBe('120.01.001');
    });

    it('should reject invalid codes', () => {
        expect(() => AccountCode.create('10')).toThrow();
        expect(() => AccountCode.create('100a')).toThrow();
        expect(() => AccountCode.create('100.')).toThrow(); // Ends with dot
    });

    it('should return correct parent code', () => {
        const code = AccountCode.create('100.01');
        expect(code.getParentCode()).toBe('100');

        const root = AccountCode.create('100');
        expect(root.getParentCode()).toBeNull();
    });
});

describe('HesapPlani Aggregate', () => {
    it('should create valid account', () => {
        const account = HesapPlani.create({
            code: AccountCode.create('100'),
            name: 'Kasa Hesabı',
            orgId: 'org-1',
        });

        expect(account.id).toBeDefined();
        expect(account.name).toBe('Kasa Hesabı');
        expect(account.code.value).toBe('100');
    });

    it('should allow renaming', () => {
        const account = HesapPlani.create({
            code: AccountCode.create('100'),
            name: 'Kasa',
        });

        account.rename('Merkez Kasa');
        expect(account.name).toBe('Merkez Kasa');
    });
});
