
'use server';

import { auth } from '@/auth';
import { prisma } from '@/infrastructure/database/prisma-client';
import { InstrumentType, ChequeStatus, ChequeType } from '@prisma/client';

/**
 * Returns a high-level financial snapshot for the Dashboard.
 */
export async function getFinancialSnapshot() {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) throw new Error('Unauthorized');
    const orgId = (session.user as any).orgId;

    // 1. LIQUIDITY (Kasa + Banka + Portföydeki Çekler/Senetler)
    const safes = await prisma.safe.findMany({ where: { orgId } }); // We'd need to sum aggregations or trust Payment sums. For now let's query raw payments if needed or rely on balance if valid.
    // Actually, Phase 12 didn't strictly add specific "Balance" fields to Safe/Bank, it relies on Payment summation.
    // Let's do a quick summation of Payments for now.

    const payments = await prisma.payment.findMany({
        where: { orgId },
        select: { type: true, amount: true, bankId: true, safeId: true }
    });

    let safeTotal = 0;
    let bankTotal = 0;

    payments.forEach(p => {
        const val = Number(p.amount);
        if (p.safeId) {
            safeTotal += (p.type === 'TAHSILAT' ? val : -val);
        } else if (p.bankId) {
            bankTotal += (p.type === 'TAHSILAT' ? val : -val);
        }
    });

    // Portfolio Cheques (Checks we hold)
    const portfolioCheques = await prisma.cheque.aggregate({
        where: { orgId, type: 'GELEN', status: 'PORTFOY' },
        _sum: { amount: true }
    });
    const portfolioTotal = Number(portfolioCheques._sum.amount || 0);

    const liquidityTotal = safeTotal + bankTotal + portfolioTotal;


    // 2. RECEIVABLES (Alacaklar) - Open Sales Invoices + Cheques (already in portfolio is kind of receivable liquid, but let's stick to Open Invoices)
    const openInvoices = await prisma.fatura.findMany({
        where: { orgId, type: 'SATIS', status: { in: ['ONAYLI', 'GONDERILDI'] } },
        include: { payments: true }
    });

    let receivablesTotal = 0;
    openInvoices.forEach(inv => {
        const total = Number(inv.grandTotal);
        const paid = inv.payments.reduce((acc, p) => acc + Number(p.amount), 0);
        receivablesTotal += (total - paid);
    });

    // 3. PAYABLES (Borçlar) - Open Purchase Invoices + Issued Cheques (Own Cheques not paid yet)
    const openBills = await prisma.fatura.findMany({
        where: { orgId, type: 'ALIS', status: { in: ['ONAYLI'] } },
        include: { payments: true }
    });

    let payablesTotal = 0;
    openBills.forEach(bill => {
        const total = Number(bill.grandTotal);
        const paid = bill.payments.reduce((acc, p) => acc + Number(p.amount), 0);
        payablesTotal += (total - paid);
    });

    // Own Cheques pending payment
    const ownCheques = await prisma.cheque.aggregate({
        where: {
            orgId,
            type: 'GIDEN',
            status: { notIn: ['ODENDI', 'IADE'] }
        },
        _sum: { amount: true }
    });
    payablesTotal += Number(ownCheques._sum.amount || 0);


    return {
        liquidity: liquidityTotal,
        receivables: receivablesTotal,
        payables: payablesTotal,
        details: {
            safe: safeTotal,
            bank: bankTotal,
            chequePortfolio: portfolioTotal
        }
    };
}

/**
 * Returns estimated tax liabilities.
 */
export async function getTaxEstimates() {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) throw new Error('Unauthorized');
    const orgId = (session.user as any).orgId;

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // KDV (VAT) Estimate for Current Month
    // Sales VAT
    const sales = await prisma.fatura.findMany({
        where: {
            orgId,
            type: 'SATIS',
            date: { gte: firstDay, lte: lastDay }
        },
        select: { taxTotal: true }
    });
    const totalSalesVAT = sales.reduce((acc, inv) => acc + Number(inv.taxTotal), 0);

    // Expenses VAT
    const expenses = await prisma.fatura.findMany({
        where: {
            orgId,
            type: 'ALIS',
            date: { gte: firstDay, lte: lastDay }
        },
        select: { taxTotal: true }
    });
    const totalExpenseVAT = expenses.reduce((acc, inv) => acc + Number(inv.taxTotal), 0);

    const kdvPayment = Math.max(0, totalSalesVAT - totalExpenseVAT);


    // Income Tax Estimate (Approx %20 of Net Profit)
    // Profit = (Sales Grand Total - VAT) - (Expense Grand Total - VAT)  ~= (Sales Subtotal - Expense Subtotal)
    const salesSub = await prisma.fatura.aggregate({
        where: { orgId, type: 'SATIS', date: { gte: firstDay, lte: lastDay } },
        _sum: { subTotal: true }
    });
    const expenseSub = await prisma.fatura.aggregate({
        where: { orgId, type: 'ALIS', date: { gte: firstDay, lte: lastDay } },
        _sum: { subTotal: true }
    });

    const netProfit = Number(salesSub._sum.subTotal || 0) - Number(expenseSub._sum.subTotal || 0);
    const incomeTax = Math.max(0, netProfit * 0.20);

    return {
        kdv: kdvPayment,
        incomeTax: incomeTax,
        period: `${now.getMonth() + 1}/${now.getFullYear()}`
    };
}

/**
 * Returns operational alerts.
 */
export async function getAlerts() {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) throw new Error('Unauthorized');
    const orgId = (session.user as any).orgId;

    const alerts: { type: 'DANGER' | 'WARNING', message: string, actionUrl?: string, actionLabel?: string }[] = [];

    // 1. Missing Z-Report for Yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // Check if Z-Report exists
    // We need to match date range or strict date. Let's assume strict date match for simplicity or range of that day.
    const zReport = await prisma.zReport.findFirst({
        where: {
            orgId,
            date: {
                gte: yesterday,
                lt: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000)
            }
        }
    });

    if (!zReport) {
        alerts.push({
            type: 'DANGER',
            message: 'Dün için Z Raporu yüklenmedi! (Eksik Beyan Riski)',
            actionLabel: 'Z Raporu Yükle',
            // actionUrl: will be handled by UI modal
        });
    }

    // 2. Critical Stock
    const criticalProducts = await prisma.product.findMany({
        where: { orgId, stockQuantity: { lte: 5 } }, // Hardcoded 5 for now
        take: 3
    });

    if (criticalProducts.length > 0) {
        alerts.push({
            type: 'WARNING',
            message: `${criticalProducts.length} ürün kritik stok seviyesinin altında.`,
            actionLabel: 'Stokları İncele',
            actionUrl: '/dashboard/stock'
        });
    }

    // 3. Overdue Receivables
    const now = new Date();
    const overdueInvoices = await prisma.fatura.count({
        where: {
            orgId,
            type: 'SATIS',
            status: { in: ['ONAYLI', 'GONDERILDI'] },
            dueDate: { lt: now }
        }
    });

    if (overdueInvoices > 0) {
        alerts.push({
            type: 'WARNING',
            message: `${overdueInvoices} adet vadesi geçmiş satış faturası var.`,
            actionLabel: 'Faturaları Gör',
            actionUrl: '/dashboard/fatura?status=OVERDUE'
        });
    }

    return alerts;
}

export async function uploadZReport(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) return { message: 'Unauthorized' };
    const orgId = (session.user as any).orgId;

    const dateStr = formData.get('date') as string;
    const file = formData.get('file') as File;

    if (!dateStr || !file) return { message: 'Tarih ve Dosya gereklidir.' };

    const date = new Date(dateStr);

    try {
        // Mock upload for Phase 18 - just save DB record
        // In real app we upload to blob storage
        const mockUrl = `/uploads/zreports/${file.name}`;

        await prisma.zReport.create({
            data: {
                orgId,
                date,
                imageUrl: mockUrl,
                status: 'PENDING'
            }
        });
    } catch (e: any) {
        if (e.code === 'P2002') return { message: 'Bu tarih için zaten Z Raporu var.' };
        return { message: 'Hata: ' + e.message };
    }

    return { success: true };
}

/**
 * Returns monthly breakdown of Sales vs Expenses for the current year.
 * Used for the main Dashboard Chart.
 */
export async function getMonthlyBreakdown() {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) return [];
    const orgId = (session.user as any).orgId;

    const year = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const result = [];
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

    for (const month of months) {
        // Start/End of month
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);

        const sales = await prisma.fatura.aggregate({
            where: {
                orgId,
                type: 'SATIS',
                date: { gte: start, lte: end }
            },
            _sum: { grandTotal: true }
        });

        const expenses = await prisma.fatura.aggregate({
            where: {
                orgId,
                type: 'ALIS',
                date: { gte: start, lte: end }
            },
            _sum: { grandTotal: true }
        });

        result.push({
            month: monthNames[month - 1],
            sales: Number(sales._sum.grandTotal || 0),
            expenses: Number(expenses._sum.grandTotal || 0)
        });
    }

    return result;
}

export type MonthlyStatsDTO = {
    month: string;
    sales: number;
    expenses: number;
};
