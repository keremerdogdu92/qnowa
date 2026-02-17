
'use server';

import { auth } from '@/auth';
import { prisma } from '@/infrastructure/database/prisma-client';
import { revalidatePath } from 'next/cache';
import { PermissionService } from '@/domain/security/PermissionService';

const permissionService = new PermissionService();

export async function getRoles() {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) return [];

    // Check permission
    const hasPerm = await permissionService.checkPermission(session.user.id!, 'SETTINGS_MANAGE');
    if (!hasPerm) return [];

    const orgId = (session.user as any).orgId;
    return await prisma.role.findMany({
        where: { orgId }
    });
}

export async function getRoleWithPermissions(roleId: string) {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) return null;

    const hasPerm = await permissionService.checkPermission(session.user.id!, 'SETTINGS_MANAGE');
    if (!hasPerm) return null;

    return await prisma.role.findUnique({
        where: { id: roleId },
        include: { permissions: true }
    });
}

export async function getAllPermissions() {
    return await prisma.permission.findMany({
        orderBy: { group: 'asc' }
    });
}

export async function createRole(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) return { message: 'Unauthorized' };

    const hasPerm = await permissionService.checkPermission(session.user.id!, 'SETTINGS_MANAGE');
    if (!hasPerm) return { message: 'Forbidden' };

    const orgId = (session.user as any).orgId;
    const name = formData.get('name') as string;

    if (!name) return { message: 'Role name required' };

    try {
        await prisma.role.create({
            data: {
                orgId,
                name
            }
        });
    } catch (e: any) {
        return { message: 'Failed to create role: ' + e.message };
    }

    revalidatePath('/dashboard/settings/roles');
    return { success: true };
}

export async function updateRolePermissions(roleId: string, permissionIds: string[]) {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) throw new Error('Unauthorized');

    const hasPerm = await permissionService.checkPermission(session.user.id!, 'SETTINGS_MANAGE');
    if (!hasPerm) throw new Error('Forbidden');

    // Security check: Ensure role belongs to user's org
    const orgId = (session.user as any).orgId;
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role || role.orgId !== orgId) throw new Error('Role not found or access denied');

    if (role.isSystem && role.name === 'Patron') {
        // Prevent editing Patron permissions to avoid lockout? Or maybe allow expanding but not reducing criticals?
        // For now, let's allow it but warn.
    }

    // Transaction: Delete all existing, add new
    await prisma.$transaction([
        prisma.rolePermission.deleteMany({ where: { roleId } }),
        prisma.rolePermission.createMany({
            data: permissionIds.map(pid => ({ roleId, permissionId: pid }))
        })
    ]);

    revalidatePath(`/dashboard/settings/roles/${roleId}`);
    revalidatePath('/dashboard/settings/roles');
}

export async function deleteRole(roleId: string) {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) throw new Error('Unauthorized');

    const hasPerm = await permissionService.checkPermission(session.user.id!, 'SETTINGS_MANAGE');
    if (!hasPerm) throw new Error('Forbidden');

    const orgId = (session.user as any).orgId;
    const role = await prisma.role.findUnique({ where: { id: roleId } });

    if (!role || role.orgId !== orgId) throw new Error('Access denied');
    if (role.isSystem) throw new Error('Cannot delete system role');

    await prisma.role.delete({ where: { id: roleId } });
    revalidatePath('/dashboard/settings/roles');
}
