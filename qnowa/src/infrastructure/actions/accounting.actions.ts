'use server';

import { auth } from '@/auth';
import { prisma } from '@/infrastructure/database/prisma-client';
import { checkPermission, Permission } from '@/domain/security/permissions';
import { FisDurumu } from '@prisma/client';

// DTOs
export type JournalDTO = {
    id: string;
    yevmiyeNo: number;
    date: Date;
    description: string | null;
    totalDebit: number;
    totalCredit: number;
    status: FisDurumu;
};

export type JournalDetailDTO = JournalDTO & {
    lines: {
        id: string;
        accountCode: string;
        accountName: string;
        description: string | null;
        debit: number;
        credit: number;
    }[];
};

export async function getJournalList(page = 1, limit = 20): Promise<{ data: JournalDTO[]; total: number }> {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        throw new Error('Unauthorized');
    }
    const orgId = (session.user as any).orgId;
    const role = (session.user as any).role;

    try {
        checkPermission(role, Permission.VIEW_ACCOUNTING);
    } catch (e) {
        return { data: [], total: 0 };
    }

    // Prisma query
    const journals = await prisma.muhasebeFisi.findMany({
        where: { orgId },
        include: {
            lines: true // needed for totals if not stored on header
        },
        orderBy: { date: 'desc' },
        // Pagination logic would go here (skip/take)
    });

    const data = journals.map(j => {
        const totalDebit = j.lines.reduce((sum, line) => sum + line.debit.toNumber(), 0);
        const totalCredit = j.lines.reduce((sum, line) => sum + line.credit.toNumber(), 0);

        return {
            id: j.id,
            yevmiyeNo: j.yevmiyeNo,
            date: j.date,
            description: j.description,
            totalDebit,
            totalCredit,
            status: j.status
        };
    });

    return { data, total: data.length };
}

export async function getJournalById(id: string): Promise<JournalDetailDTO | null> {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        return null;
    }
    const orgId = (session.user as any).orgId;
    const role = (session.user as any).role;

    try {
        checkPermission(role, Permission.VIEW_ACCOUNTING);
    } catch (e) {
        return null;
    }

    const journal = await prisma.muhasebeFisi.findUnique({
        where: { id },
        include: {
            lines: {
                include: { account: true },
                orderBy: { sequence: 'asc' }
            }
        }
    });

    if (!journal || journal.orgId !== orgId) return null;

    const totalDebit = journal.lines.reduce((sum, line) => sum + line.debit.toNumber(), 0);
    const totalCredit = journal.lines.reduce((sum, line) => sum + line.credit.toNumber(), 0);

    return {
        id: journal.id,
        yevmiyeNo: journal.yevmiyeNo,
        date: journal.date,
        description: journal.description,
        status: journal.status,
        totalDebit,
        totalCredit,
        lines: journal.lines.map(l => ({
            id: l.id,
            accountCode: l.account.code,
            accountName: l.account.name,
            description: l.description,
            debit: l.debit.toNumber(),
            credit: l.credit.toNumber()
        }))
    };
}

export type AccountPlanDTO = {
    id: string;
    code: string;
    name: string;
    parentCode: string | null;
    level: number;
};

export async function getAccountPlan(): Promise<AccountPlanDTO[]> {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        throw new Error('Unauthorized');
    }
    const orgId = (session.user as any).orgId;

    // Fetch system accounts (orgId is null) and org-specific accounts
    const accounts = await prisma.hesapPlani.findMany({
        where: {
            OR: [
                { orgId: null },
                { orgId }
            ]
        },
        orderBy: { code: 'asc' }
    });

    return accounts.map(a => ({
        id: a.id,
        code: a.code,
        name: a.name,
        parentCode: a.parentCode,
        level: a.code.split('.').length
    }));
}

export type TrialBalanceItemDTO = {
    accountCode: string;
    accountName: string;
    totalDebit: number;
    totalCredit: number;
    balance: number;
};

export async function getTrialBalance(year: number): Promise<TrialBalanceItemDTO[]> {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        throw new Error('Unauthorized');
    }
    const orgId = (session.user as any).orgId;

    try {
        checkPermission((session.user as any).role, Permission.VIEW_ACCOUNTING);
    } catch (e) {
        return [];
    }

    // Get all journal lines for the year
    const journalLines = await prisma.muhasebeFisiSatir.findMany({
        where: {
            journal: {
                orgId: orgId,
                periodYear: year,
                status: 'ONAYLI' // Only finalized entries
            }
        },
        include: {
            account: true
        }
    });

    // Aggregate by account
    const accountBalances: Record<string, TrialBalanceItemDTO> = {};

    for (const line of journalLines) {
        const code = line.account.code;
        if (!accountBalances[code]) {
            accountBalances[code] = {
                accountCode: code,
                accountName: line.account.name,
                totalDebit: 0,
                totalCredit: 0,
                balance: 0
            };
        }

        accountBalances[code].totalDebit += line.debit.toNumber();
        accountBalances[code].totalCredit += line.credit.toNumber();
    }

    // Calculate final balance and sort
    return Object.values(accountBalances).map(item => ({
        ...item,
        balance: item.totalDebit - item.totalCredit
    })).sort((a, b) => a.accountCode.localeCompare(b.accountCode));
}
