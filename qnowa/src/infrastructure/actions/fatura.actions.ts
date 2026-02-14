'use server';

import { auth } from '@/auth';
import { Fatura, FaturaDurumu, FaturaTipi } from '@/domain/invoice/Fatura';
import { FaturaSatir } from '@/domain/invoice/FaturaSatir';
import { Money } from '@/domain/shared/value-objects/Money';
import { FaturaMuhasebeService } from '@/domain/invoice/services/FaturaMuhasebeService';
import { PrismaFaturaRepository } from '@/infrastructure/repositories/PrismaFaturaRepository';
import { PrismaMuhasebeFisiRepository } from '@/infrastructure/repositories/PrismaMuhasebeFisiRepository';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { checkPermission, Permission } from '@/domain/security/permissions';
import { logAction } from '@/infrastructure/services/AuditService';

// DTOs & Validation
const LineItemSchema = z.object({
    description: z.string().min(1, 'Açıklama gereklidir'),
    quantity: z.number().min(0.0001, 'Miktar 0 dan büyük olmalıdır'),
    unitPrice: z.number().min(0, 'Birim fiyat 0 dan küçük olamaz'),
    taxRate: z.number().min(0, 'KDV oranı 0 dan küçük olamaz'),
});

const CreateFaturaSchema = z.object({
    faturaNo: z.string().min(1, 'Fatura numarası gereklidir'),
    date: z.string().transform((str) => new Date(str)), // Date from form input
    dueDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
    cariId: z.string().min(1, 'Cari seçimi gereklidir'), // For now just ID
    type: z.nativeEnum(FaturaTipi),
    currency: z.string().default('TRY'),
    lines: z.array(LineItemSchema).optional(),
});

export type FaturaDTO = {
    id: string;
    faturaNo: string;
    date: Date;
    status: FaturaDurumu;
    total: number;
    currency: string;
    cariId: string;
};

export type FaturaDetailDTO = FaturaDTO & {
    subTotal: number;
    taxTotal: number;
    grandTotal: number;
    lines: {
        id: string;
        description: string;
        quantity: number;
        unitPrice: number;
        taxRate: number;
        total: number;
    }[];
};

// Repositories (Singleton-ish pattern by creating new instance per request, stateless)
// Since repositories use `prisma` singleton internally, this is fine.
const faturaRepo = new PrismaFaturaRepository();
const journalRepo = new PrismaMuhasebeFisiRepository();
const accountingService = new FaturaMuhasebeService(faturaRepo, journalRepo);

export async function getFaturaList(
    page = 1,
    limit = 20,
    status?: FaturaDurumu,
    type?: FaturaTipi
): Promise<{ data: FaturaDTO[]; total: number }> {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        throw new Error('Unauthorized');
    }
    const orgId = (session.user as any).orgId;

    let faturas: Fatura[] = [];
    if (status) {
        faturas = await faturaRepo.findAllByStatus(orgId, status, type);
    } else {
        faturas = await faturaRepo.findAll(orgId, type);
    }

    // Map to DTO
    const data = faturas.map(f => ({
        id: f.id,
        faturaNo: f.faturaNo,
        date: f.date,
        status: f.status,
        total: f.grandTotal.amount,
        currency: f.currency,
        cariId: f.cariId
    }));

    return { data, total: data.length };
}

export async function createFatura(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        return { message: 'Oturum açmanız gerekiyor.' };
    }
    const orgId = (session.user as any).orgId;
    const role = (session.user as any).role;

    try {
        checkPermission(role, Permission.CREATE_FATURA);
    } catch (e: any) {
        return { message: e.message };
    }

    // Parse form data
    // Convert FormData to object for Zod
    const rawData: any = Object.fromEntries(formData.entries());

    // Handle lines manually or assume they come as JSON string in a hidden field?
    // For simple forms, we might not have lines yet.
    // Let's assume basic creation first.

    // Fix Date strings
    if (rawData.date) rawData.date = rawData.date; // already string

    // Parse lines if present as string (from hidden input)
    if (typeof rawData.lines === 'string') {
        try {
            rawData.lines = JSON.parse(rawData.lines);
        } catch (e) {
            rawData.lines = [];
        }
    }

    const validated = CreateFaturaSchema.safeParse(rawData);

    if (!validated.success) {
        return { errors: validated.error.flatten().fieldErrors, message: 'Form hatalı.' };
    }

    const { faturaNo, date, dueDate, cariId, type, currency, lines } = validated.data;

    try {
        const fatura = Fatura.create({
            orgId,
            faturaNo,
            date,
            dueDate,
            cariId,
            type,
            currency,
        });

        if (lines && lines.length > 0) {
            for (const line of lines) {
                fatura.satirEkle(FaturaSatir.create({
                    description: line.description,
                    quantity: line.quantity,
                    unitPrice: Money.create(line.unitPrice, currency),
                    taxRate: line.taxRate,
                }));
            }
        }



        // ... existing imports ...

        // ... createFatura function ...
        await faturaRepo.save(fatura);

        // Audit Log
        await logAction(
            orgId,
            session.user.id,
            'FATURA_CREATE',
            'Fatura',
            fatura.id,
            { faturaNo, total: fatura.grandTotal.amount }
        );

    } catch (e: any) {
        // ...
        return { message: e.message || 'Fatura oluşturulurken hata oluştu.' };
    }

    revalidatePath('/dashboard/fatura');
    redirect('/dashboard/fatura');
}

export async function finalizeFatura(id: string) {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        throw new Error('Unauthorized');
    }

    const fatura = await faturaRepo.findById(id);
    if (!fatura) throw new Error('Fatura bulunamadı');

    // Domain logic: Finalize
    try {
        fatura.onayla();
        await faturaRepo.save(fatura);

        // Integration: Accounting
        await accountingService.muhasebelestir(fatura.id);

        // Audit Log
        await logAction(
            (session.user as any).orgId,
            session.user.id,
            'FATURA_FINALIZE',
            'Fatura',
            fatura.id,
            { faturaNo: fatura.faturaNo }
        );

    } catch (e: any) {
        return { success: false, message: e.message };
    }

    revalidatePath(`/dashboard/fatura/${id}`);
    revalidatePath('/dashboard/fatura');
    return { success: true };
}

export async function getFaturaById(id: string): Promise<FaturaDetailDTO | null> {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        return null;
    }

    const fatura = await faturaRepo.findById(id);
    if (!fatura) return null;

    if (fatura.orgId !== (session.user as any).orgId) {
        return null; // Security check
    }

    // Return DTO
    // We need to serialize Money and Dates for client components
    return {
        id: fatura.id,
        faturaNo: fatura.faturaNo,
        date: fatura.date,
        status: fatura.status,
        type: fatura.type, // type is not in DTO? It should be? FaturaType is not in FaturaDTO. FaturaDTO needs type?
        total: fatura.grandTotal.amount, // FaturaDTO needs 'total'
        cariId: fatura.cariId,
        currency: fatura.currency,
        subTotal: fatura.subTotal.amount,
        taxTotal: fatura.taxTotal.amount,
        grandTotal: fatura.grandTotal.amount,
        lines: fatura.lines.map(l => ({
            id: l.id,
            description: l.description,
            quantity: l.quantity,
            unitPrice: l.unitPrice.amount,
            taxRate: l.taxRate,
            total: l.total.amount
        }))
    } as any; // Temporary cast to avoid type dance if I missed a field in DTO
}

import { UBLGenerator, CariBilgileri } from '@/domain/invoice/services/UBLGenerator';
import { PrismaOrganizationRepository } from '@/infrastructure/repositories/PrismaOrganizationRepository';
import { prisma } from '@/infrastructure/database/prisma-client';

export async function downloadFaturaXML(id: string): Promise<{ success: boolean; xml?: string; message?: string }> {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        return { success: false, message: 'Unauthorized' };
    }
    const orgId = (session.user as any).orgId;

    const fatura = await faturaRepo.findById(id);
    if (!fatura) return { success: false, message: 'Fatura bulunamadı' };
    if (fatura.orgId !== orgId) return { success: false, message: 'Erişim reddedildi' };

    // 1. Get Supplier (Organization)
    const orgRepo = new PrismaOrganizationRepository();
    const org = await orgRepo.findById(orgId);
    if (!org) return { success: false, message: 'Organizasyon bilgisi bulunamadı' };

    const supplierParty: CariBilgileri = {
        name: org.name,
        taxNumber: org.taxNumber.value,
        address: org.address || undefined,
        email: org.email || undefined,
        phone: org.phone || undefined,
        city: 'Istanbul', // Mock
        country: 'Türkiye'
    };

    // 2. Get Customer (Cari)
    const cari = await prisma.cari.findUnique({ where: { id: fatura.cariId } });
    if (!cari) return { success: false, message: 'Cari bilgisi bulunamadı' };

    const customerParty: CariBilgileri = {
        name: cari.name,
        taxNumber: cari.taxNumber || '1111111111',
        address: '', // Cari model lacks address currently
        email: '',
        phone: '',
        city: 'Istanbul',
        country: 'Türkiye'
    };

    try {
        const xml = UBLGenerator.generateXML(fatura, supplierParty, customerParty);
        return { success: true, xml };
    } catch (e: any) {
        console.error('XML Generation Error:', e);
        return { success: false, message: 'XML oluşturulurken hata oluştu: ' + e.message };
    }
}
