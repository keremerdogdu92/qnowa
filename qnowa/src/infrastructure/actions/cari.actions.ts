'use server';

import { auth } from '@/auth';
import { prisma } from '@/infrastructure/database/prisma-client';

export type CariDTO = {
    id: string;
    name: string;
    taxNumber: string | null;
    type: 'CUSTOMER' | 'SUPPLIER' | 'BOTH';
};

export async function getParties(): Promise<CariDTO[]> {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        return [];
    }
    const orgId = (session.user as any).orgId;

    const parties = await prisma.cari.findMany({
        where: { orgId },
        orderBy: { name: 'asc' }
    });

    return parties.map(p => ({
        id: p.id,
        name: p.name,
        taxNumber: p.taxNumber,
        type: p.type
    }));
    return parties.map(p => ({
        id: p.id,
        name: p.name,
        taxNumber: p.taxNumber,
        type: p.type
    }));
}

export async function getCariList(page = 1, limit = 100): Promise<{ data: CariDTO[], total: number }> {
    // Re-using logic, or making it distinct if pagination needed
    // For now, wrapping getParties
    const allParties = await getParties();
    // Slice for pagination mock
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
        data: allParties.slice(start, end),
        total: allParties.length
    };
}

import { z } from 'zod';
import { TaxNumberSchema } from '@/domain/shared/validation';
import { logAction } from '@/infrastructure/services/AuditService';
import { revalidatePath } from 'next/cache';

const CreateCariSchema = z.object({
    name: z.string().min(2),
    taxNumber: TaxNumberSchema.optional().or(z.literal('')),
    type: z.enum(['CUSTOMER', 'SUPPLIER', 'BOTH']),
});

export async function createCari(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        return { message: 'Unauthorized' };
    }
    const orgId = (session.user as any).orgId;

    const validated = CreateCariSchema.safeParse({
        name: formData.get('name'),
        taxNumber: formData.get('taxNumber'),
        type: formData.get('type')
    });

    if (!validated.success) {
        return { errors: validated.error.flatten().fieldErrors, message: 'Form hatalı' };
    }

    try {
        const cari = await prisma.cari.create({
            data: {
                orgId,
                name: validated.data.name,
                taxNumber: validated.data.taxNumber || null,
                type: validated.data.type as any
            }
        });

        await logAction(
            orgId,
            session.user.id,
            'CARI_CREATE',
            'Cari',
            cari.id,
            { name: cari.name }
        );

        revalidatePath('/dashboard/fatura/yeni'); // Revalidate places where cari list is used
        return { success: true, message: 'Cari başarıyla oluşturuldu.' };
    } catch (e: any) {
        return { message: 'Cari oluşturulurken hata: ' + e.message };
    }
}
