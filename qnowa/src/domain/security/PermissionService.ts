
import { prisma } from '@/infrastructure/database/prisma-client';
import { Permissions } from './Permission';

export class PermissionService {

    /**
     * Seeds all defined permissions into the database.
     * Should be run on app startup or via admin action.
     */
    async seedPermissions() {
        console.log('Seeding Permissions...');
        for (const p of Object.values(Permissions)) {
            await prisma.permission.upsert({
                where: { key: p.key },
                update: {
                    description: p.description,
                    group: p.group
                },
                create: {
                    key: p.key,
                    description: p.description,
                    group: p.group
                }
            });
        }
        console.log('Permissions Seeded.');
    }

    /**
     * Creates default roles if they don't exist for an organization.
     */
    async seedDefaultRoles(orgId: string) {
        // Helper to get permission IDs by keys
        const getPermIDs = async (keys: string[]) => {
            const perms = await prisma.permission.findMany({
                where: { key: { in: keys } },
                select: { id: true }
            });
            return perms.map(p => p.id);
        };

        // 1. PATRON (Admin) - ALL Permissions
        const allPerms = await prisma.permission.findMany({ select: { id: true } });
        await this.createRoleIfNotExists(orgId, 'Patron', allPerms.map(p => p.id), true);

        // 2. MALI MÜŞAVİR - Finance Heavy
        const advisorPerms = await getPermIDs([
            Permissions.INVOICE_VIEW.key, Permissions.INVOICE_CREATE.key, Permissions.INVOICE_EDIT.key, Permissions.INVOICE_APPROVE.key,
            Permissions.FINANCE_VIEW.key, Permissions.FINANCE_MANAGE.key, Permissions.CHEQUE_MANAGE.key,
            Permissions.STOCK_VIEW.key,
            Permissions.CARI_VIEW.key, Permissions.CARI_MANAGE.key
        ]);
        await this.createRoleIfNotExists(orgId, 'Mali Müşavir', advisorPerms);

        // 3. MÜDÜR - Approver & Viewer
        const managerPerms = await getPermIDs([
            Permissions.INVOICE_VIEW.key, Permissions.INVOICE_APPROVE.key,
            Permissions.FINANCE_VIEW.key,
            Permissions.STOCK_VIEW.key,
            Permissions.CARI_VIEW.key
        ]);
        await this.createRoleIfNotExists(orgId, 'Müdür', managerPerms);

        // 4. ÇALIŞAN - Operator
        const employeePerms = await getPermIDs([
            Permissions.INVOICE_VIEW.key, Permissions.INVOICE_CREATE.key,
            Permissions.STOCK_VIEW.key,
            Permissions.CARI_VIEW.key, Permissions.CARI_MANAGE.key
        ]);
        await this.createRoleIfNotExists(orgId, 'Çalışan', employeePerms);
    }

    private async createRoleIfNotExists(orgId: string, name: string, permissionIds: string[], isSystem = false) {
        const existing = await prisma.role.findUnique({
            where: { orgId_name: { orgId, name } }
        });

        if (!existing) {
            console.log(`Creating Role: ${name}`);
            await prisma.role.create({
                data: {
                    orgId,
                    name,
                    isSystem,
                    permissions: {
                        create: permissionIds.map(pid => ({ permissionId: pid }))
                    }
                }
            });
        }
    }

    /**
     * Checks if a user has a specific permission.
     * Can be used in Server Actions.
     */
    async checkPermission(userId: string, permissionKey: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                userRole: {
                    include: {
                        permissions: {
                            include: { permission: true }
                        }
                    }
                }
            }
        });

        if (!user || !(user as any).userRole) return false;

        // Patron gets everything (optional shortcut, or just rely on db permissions)
        if ((user as any).userRole.name === 'Patron') return true;

        return (user as any).userRole.permissions.some((rp: any) => rp.permission.key === permissionKey);
    }
}
