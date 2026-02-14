'use server';

import { auth } from '@/auth';
import { prisma } from '@/infrastructure/database/prisma-client';
import { FaturaTipi, FaturaDurumu } from '@/domain/invoice/Fatura';

export type DashboardSummaryDTO = {
    totalSales: number;
    totalExpenses: number;
    netBalance: number;
    pendingSales: number;
    pendingExpenses: number;
};

export type MonthlyStatsDTO = {
    month: string;
    sales: number;
    expenses: number;
};

export async function getDashboardSummary(): Promise<DashboardSummaryDTO> {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        throw new Error('Unauthorized');
    }
    const orgId = (session.user as any).orgId;

    // Aggregate Sales
    const salesAgg = await prisma.fatura.aggregate({
        where: {
            orgId,
            type: FaturaTipi.SATIS as any,
            status: { not: FaturaDurumu.IPTAL as any }
        },
        _sum: { grandTotal: true }
    });

    // Aggregate Expenses
    const expensesAgg = await prisma.fatura.aggregate({
        where: {
            orgId,
            type: FaturaTipi.ALIS as any,
            status: { not: FaturaDurumu.IPTAL as any }
        },
        _sum: { grandTotal: true }
    });

    // Pending Sales (ONAYLI state, not yet GONDERILDI - assuming GONDERILDI means finalized/sent)
    // Actually ONAYLI is also valid receivable. Let's assume TASLAK is not counted in totals?
    // Wait, typical dashboard counts ONAYLI + GONDERILDI.
    // Let's count TASLAK as pending? Or ONAYLI as pending payment?
    // For now:
    // Total Sales = ONAYLI + GONDERILDI
    // Pending = TASLAK? No, TASLAK is draft.
    // Let's stick to: Total = Valid Invoices (ONAYLI + GONDERILDI).

    const totalSales = salesAgg._sum.grandTotal?.toNumber() || 0;
    const totalExpenses = expensesAgg._sum.grandTotal?.toNumber() || 0;

    return {
        totalSales,
        totalExpenses,
        netBalance: totalSales - totalExpenses,
        pendingSales: 0, // TODO: Implement pending payment logic when Payment module exists
        pendingExpenses: 0
    };
}

export async function getMonthlyBreakdown(): Promise<MonthlyStatsDTO[]> {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        return [];
    }
    const orgId = (session.user as any).orgId;

    // Fetch invoices for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const invoices = await prisma.fatura.findMany({
        where: {
            orgId,
            date: { gte: sixMonthsAgo },
            status: { not: FaturaDurumu.IPTAL as any } // count TASLAK? Maybe not.
        },
        select: {
            date: true,
            type: true,
            grandTotal: true
        }
    });

    // JS Aggregation
    const statsMap = new Map<string, MonthlyStatsDTO>();

    // Initialize last 6 months
    for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const monthName = d.toLocaleString('tr-TR', { month: 'long' });
        statsMap.set(key, { month: monthName, sales: 0, expenses: 0 });
    }

    invoices.forEach(inv => {
        const key = `${inv.date.getFullYear()}-${String(inv.date.getMonth() + 1).padStart(2, '0')}`;
        // If query returned older data (shouldn't happening due to gte), ignore
        // If map doesn't have key (could happen if we initialized only 6 months but strictly), handle it.

        // We initialized strictly current date back 6 months. 
        // Invoice date usage:
        if (statsMap.has(key)) {
            const entry = statsMap.get(key)!;
            const amount = inv.grandTotal.toNumber();
            if (inv.type === FaturaTipi.SATIS as any) {
                entry.sales += amount;
            } else {
                entry.expenses += amount;
            }
        }
    });

    // Convert to array and sort by date Asc
    return Array.from(statsMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([_, val]) => val);
}
