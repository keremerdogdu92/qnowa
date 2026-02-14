import { UserRole } from '@prisma/client';

export enum Permission {
    // Fatura
    VIEW_FATURA = 'VIEW_FATURA',
    CREATE_FATURA = 'CREATE_FATURA',
    EDIT_FATURA = 'EDIT_FATURA',
    DELETE_FATURA = 'DELETE_FATURA',
    FINALIZE_FATURA = 'FINALIZE_FATURA',

    // Accounting
    VIEW_ACCOUNTING = 'VIEW_ACCOUNTING',
    MANAGE_ACCOUNTING = 'MANAGE_ACCOUNTING', // Create manual journals

    // Admin
    MANAGE_ORGANIZATION = 'MANAGE_ORGANIZATION',
    MANAGE_USERS = 'MANAGE_USERS',
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: [
        Permission.VIEW_FATURA,
        Permission.CREATE_FATURA,
        Permission.EDIT_FATURA,
        Permission.DELETE_FATURA,
        Permission.FINALIZE_FATURA,
        Permission.VIEW_ACCOUNTING,
        Permission.MANAGE_ACCOUNTING,
        Permission.MANAGE_ORGANIZATION,
        Permission.MANAGE_USERS,
    ],
    [UserRole.ACCOUNTANT]: [
        Permission.VIEW_FATURA,
        // Accountant typically READS invoices but MANAGES accounting
        Permission.VIEW_ACCOUNTING,
        Permission.MANAGE_ACCOUNTING,
        // Maybe finalizing invoices is okay? providing flexibility.
        Permission.FINALIZE_FATURA,
    ],
    [UserRole.USER]: [
        Permission.VIEW_FATURA,
        Permission.CREATE_FATURA,
        Permission.EDIT_FATURA,
        Permission.DELETE_FATURA,
        Permission.FINALIZE_FATURA,
        // Users (Taxpayers) typically DON'T see raw accounting journals, or read-only
        // Let's say they can't see accounting menu for simplicity, or just read-only
    ],
};

export function hasPermission(role: string | undefined, permission: Permission): boolean {
    if (!role) return false;
    // Map string role to enum if necessary, usually it matches.
    const userRole = role as UserRole;
    const permissions = ROLE_PERMISSIONS[userRole];

    if (!permissions) return false;

    return permissions.includes(permission);
}

export function checkPermission(role: string | undefined, permission: Permission): void {
    if (!hasPermission(role, permission)) {
        throw new Error('Unauthorized: Insufficient permissions.');
    }
}
