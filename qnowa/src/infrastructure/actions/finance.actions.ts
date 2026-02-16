'use server';

import { auth } from '@/auth';
import { FinanceService } from '@/domain/finance/services/FinanceService';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const BankSchema = z.object({
    name: z.string().min(2),
    currency: z.string().default('TRY'),
    iban: z.string().optional(),
    branch: z.string().optional(),
    accountId: z.string().optional()
});

const SafeSchema = z.object({
    name: z.string().min(2),
    currency: z.string().default('TRY'),
    accountId: z.string().optional()
});

export async function createBank(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) return { message: 'Unauthorized' };
    const orgId = (session.user as any).orgId;

    const validated = BankSchema.safeParse({
        name: formData.get('name'),
        currency: formData.get('currency'),
        iban: formData.get('iban'),
        branch: formData.get('branch'),
        accountId: formData.get('accountId') || undefined
    });

    if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

    try {
        await FinanceService.createBank(
            orgId,
            validated.data.name,
            validated.data.currency,
            validated.data.iban,
            validated.data.branch,
            validated.data.accountId
        );
        revalidatePath('/dashboard/finans/kasa-banka');
        return { success: true, message: 'Banka başarıyla oluşturuldu.' };
    } catch (e: any) {
        return { message: 'Hata: ' + e.message };
    }
}

export async function createSafe(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) return { message: 'Unauthorized' };
    const orgId = (session.user as any).orgId;

    const validated = SafeSchema.safeParse({
        name: formData.get('name'),
        currency: formData.get('currency'),
        accountId: formData.get('accountId') || undefined
    });

    if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

    try {
        await FinanceService.createSafe(
            orgId,
            validated.data.name,
            validated.data.currency,
            validated.data.accountId
        );
        revalidatePath('/dashboard/finans/kasa-banka');
        return { success: true, message: 'Kasa başarıyla oluşturuldu.' };
    } catch (e: any) {
        return { message: 'Hata: ' + e.message };
    }
}

const PaymentSchema = z.object({
    type: z.enum(['TAHSILAT', 'ODEME']),
    date: z.string(), // HTML date input returns string
    amount: z.coerce.number().positive(),
    description: z.string().optional(),
    cariId: z.string().optional(),
    bankId: z.string().optional(), // Either bank
    safeId: z.string().optional()  // Or safe
});

export async function createPayment(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) return { message: 'Unauthorized' };
    const orgId = (session.user as any).orgId;

    const validated = PaymentSchema.safeParse({
        type: formData.get('type'),
        date: formData.get('date'),
        amount: formData.get('amount'),
        description: formData.get('description'),
        cariId: formData.get('cariId') || undefined,
        bankId: formData.get('bankId') || undefined,
        safeId: formData.get('safeId') || undefined
    });

    if (!validated.success) return { errors: validated.error.flatten().fieldErrors, message: 'Form hatalı' };

    try {
        await FinanceService.createPayment({
            orgId,
            userId: session.user.id,
            type: validated.data.type as any,
            amount: validated.data.amount,
            date: new Date(validated.data.date),
            description: validated.data.description,
            cariId: validated.data.cariId,
            bankId: validated.data.bankId,
            safeId: validated.data.safeId
        });
        revalidatePath('/dashboard/finans');
        return { success: true, message: 'İşlem başarıyla kaydedildi.' };
    } catch (e: any) {
        return { message: 'Hata: ' + e.message };
    }
}

