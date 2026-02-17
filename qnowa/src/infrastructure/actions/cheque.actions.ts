
'use server';

import { auth } from '@/auth';
import { Cheque, ChequeStatus, ChequeType } from '@/domain/finance/Cheque';
import { ChequeService } from '@/domain/finance/services/ChequeService';
import { Money } from '@/domain/shared/value-objects/Money';
import { PrismaChequeRepository } from '@/infrastructure/repositories/PrismaChequeRepository';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const chequeRepo = new PrismaChequeRepository();
const chequeService = new ChequeService();

// Schemas
const RegisterChequeSchema = z.object({
    chequeNo: z.string().min(1, 'Çek numarası gereklidir'),
    bankName: z.string().min(1, 'Banka adı gereklidir'),
    branchName: z.string().optional(),
    accountNo: z.string().optional(),
    drawer: z.string().min(1, 'Keşideci gereklidir'),
    amount: z.number().min(0.01, 'Tutar 0 dan büyük olmalıdır'),
    currency: z.string().default('TRY'),
    issueDate: z.string().transform(str => new Date(str)),
    dueDate: z.string().transform(str => new Date(str)),
    cariId: z.string().optional(),
});

export async function getChequeList(status?: ChequeStatus) {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        throw new Error('Unauthorized');
    }
    const orgId = (session.user as any).orgId;

    const cheques = await chequeRepo.findAll(orgId, status);

    // Check DTO mapping if needed or return plain objects
    return cheques.map(c => ({
        id: c.id,
        chequeNo: c.chequeNo,
        bankName: (c as any).props.bankName,
        drawer: (c as any).props.drawer,
        amount: c.amount.amount,
        currency: c.amount.currency,
        dueDate: c.dueDate,
        status: c.status,
        cariId: c.cariId
    }));
}

export async function registerCheque(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        return { message: 'Oturum açmanız gerekiyor.' };
    }
    const orgId = (session.user as any).orgId;

    const rawData = Object.fromEntries(formData.entries());

    // Handle numeric conversion
    if (rawData.amount) rawData.amount = parseFloat(rawData.amount as string) as any;

    const validated = RegisterChequeSchema.safeParse(rawData);

    if (!validated.success) {
        return { errors: validated.error.flatten().fieldErrors, message: 'Form hatalı.' };
    }

    const { chequeNo, bankName, branchName, accountNo, drawer, amount, currency, issueDate, dueDate, cariId } = validated.data;

    try {
        const cheque = Cheque.create({
            orgId,
            chequeNo,
            bankName,
            branchName,
            accountNo,
            drawer,
            amount: Money.create(amount, currency),
            issueDate,
            dueDate,
            type: ChequeType.GELEN, // Default to Inbound for now
            status: ChequeStatus.PORTFOY,
            cariId
        });

        await chequeService.registerInbound(cheque);

    } catch (e: any) {
        return { message: e.message || 'Çek kaydedilirken hata oluştu.' };
    }

    revalidatePath('/dashboard/finance/cheques');
    return { success: true, message: 'Çek başarıyla kaydedildi.' };
}

export async function collectCheque(id: string, targetAccountId: string) {
    // ... Auth check
    try {
        await chequeService.collect(id, targetAccountId);
        revalidatePath('/dashboard/finance/cheques');
        return { success: true, message: 'Çek tahsil edildi.' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}
