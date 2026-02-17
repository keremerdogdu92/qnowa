
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Permissions = {
    INVOICE_VIEW: { key: 'INVOICE_VIEW', description: 'Faturaları Görüntüleme', group: 'FATURA' },
    INVOICE_CREATE: { key: 'INVOICE_CREATE', description: 'Fatura Oluşturma', group: 'FATURA' },
    INVOICE_EDIT: { key: 'INVOICE_EDIT', description: 'Fatura Düzenleme', group: 'FATURA' },
    INVOICE_DELETE: { key: 'INVOICE_DELETE', description: 'Fatura Silme', group: 'FATURA' },
    INVOICE_APPROVE: { key: 'INVOICE_APPROVE', description: 'Fatura Onaylama/Resmileştirme', group: 'FATURA' },
    FINANCE_VIEW: { key: 'FINANCE_VIEW', description: 'Finansal Hareketleri Görüntüleme', group: 'FINANS' },
    FINANCE_MANAGE: { key: 'FINANCE_MANAGE', description: 'Tahsilat/Ödeme Yapma', group: 'FINANS' },
    CHEQUE_MANAGE: { key: 'CHEQUE_MANAGE', description: 'Çek/Senet Yönetimi (Tahsil/Ciro)', group: 'FINANS' },
    STOCK_VIEW: { key: 'STOCK_VIEW', description: 'Stok Durumunu Görüntüleme', group: 'STOK' },
    STOCK_MANAGE: { key: 'STOCK_MANAGE', description: 'Stok Hareket/Düzenleme', group: 'STOK' },
    CARI_VIEW: { key: 'CARI_VIEW', description: 'Carileri Görüntüleme', group: 'CARI' },
    CARI_MANAGE: { key: 'CARI_MANAGE', description: 'Cari Ekleme/Düzenleme', group: 'CARI' },
    SETTINGS_MANAGE: { key: 'SETTINGS_MANAGE', description: 'Genel Ayarlar ve Kullanıcılar', group: 'AYARLAR' },
};

async function seed() {
    console.log('Seeding Permissions...');
    for (const p of Object.values(Permissions)) {
        await prisma.permission.upsert({
            where: { key: p.key },
            update: { description: p.description, group: p.group },
            create: { key: p.key, description: p.description, group: p.group }
        });
    }
    console.log('Permissions Seeded.');

    const users = await prisma.user.findMany({ select: { id: true, orgId: true } });
    if (users.length === 0) {
        console.log('No users found.');
        return;
    }

    const orgId = users[0].orgId;
    console.log(`Seeding Roles for Organization: ${orgId}`);

    // Helper to get permission IDs
    const getPermIDs = async (keys) => {
        const perms = await prisma.permission.findMany({
            where: { key: { in: keys } },
            select: { id: true }
        });
        return perms.map(p => p.id);
    };

    // Create Roles
    const allPerms = await prisma.permission.findMany({ select: { id: true } });

    // PATRON
    let patronRole = await prisma.role.findFirst({ where: { orgId, name: 'Patron' } });
    if (!patronRole) {
        patronRole = await prisma.role.create({
            data: { orgId, name: 'Patron', isSystem: true, permissions: { create: allPerms.map(p => ({ permissionId: p.id })) } }
        });
    }

    // MALI MÜŞAVİR
    const advisorPerms = await getPermIDs(['INVOICE_VIEW', 'INVOICE_CREATE', 'INVOICE_EDIT', 'INVOICE_APPROVE', 'FINANCE_VIEW', 'FINANCE_MANAGE', 'CHEQUE_MANAGE', 'STOCK_VIEW', 'CARI_VIEW', 'CARI_MANAGE']);
    let advisorRole = await prisma.role.findFirst({ where: { orgId, name: 'Mali Müşavir' } });
    if (!advisorRole) {
        advisorRole = await prisma.role.create({
            data: { orgId, name: 'Mali Müşavir', permissions: { create: advisorPerms.map(id => ({ permissionId: id })) } }
        });
    }

    // MÜDÜR
    const managerPerms = await getPermIDs(['INVOICE_VIEW', 'INVOICE_APPROVE', 'FINANCE_VIEW', 'STOCK_VIEW', 'CARI_VIEW']);
    let managerRole = await prisma.role.findFirst({ where: { orgId, name: 'Müdür' } });
    if (!managerRole) {
        managerRole = await prisma.role.create({
            data: { orgId, name: 'Müdür', permissions: { create: managerPerms.map(id => ({ permissionId: id })) } }
        });
    }

    // ÇALIŞAN
    const employeePerms = await getPermIDs(['INVOICE_VIEW', 'INVOICE_CREATE', 'STOCK_VIEW', 'CARI_VIEW', 'CARI_MANAGE']);
    let employeeRole = await prisma.role.findFirst({ where: { orgId, name: 'Çalışan' } });
    if (!employeeRole) {
        employeeRole = await prisma.role.create({
            data: { orgId, name: 'Çalışan', permissions: { create: employeePerms.map(id => ({ permissionId: id })) } }
        });
    }

    // Assign all existing users to 'Patron' for now to avoid lockout
    /*
    for (const u of users) {
        await prisma.user.update({
            where: { id: u.id },
            data: { roleId: patronRole.id }
        });
    }
    */
    console.log('Seeding Complete.');
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
