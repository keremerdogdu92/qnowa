
import { describe, it, expect } from 'vitest';
import { User } from './User';
import { UserRole } from './value-objects/UserRole';

describe('User Aggregate', () => {
    it('should create a user with valid props', () => {
        const user = User.create({
            email: 'test@example.com',
            name: 'Test User',
            role: UserRole.create('USER'),
        });

        expect(user.id).toBeDefined();
        expect(user.email).toBe('test@example.com');
        expect(user.name).toBe('Test User');
        expect(user.role.value).toBe('USER');
    });

    it('should allow changing role', () => {
        const user = User.create({
            email: 'test@example.com',
            role: UserRole.create('USER'),
        });

        user.changeRole('ADMIN');
        expect(user.role.value).toBe('ADMIN');
    });

    it('should fail when setting organization twice', () => {
        const user = User.create({
            email: 'test@example.com',
            role: UserRole.create('USER'),
        });

        user.setOrganization('org-123');
        expect(user.orgId).toBe('org-123');

        expect(() => user.setOrganization('org-456')).toThrow('User already belongs to an organization');
    });

    it('should accept passwordHash', () => {
        const user = User.create({
            email: 'test@example.com',
            role: UserRole.create('USER'),
            passwordHash: 'hashed-secret',
        });

        expect(user.passwordHash).toBe('hashed-secret');
    });
});
