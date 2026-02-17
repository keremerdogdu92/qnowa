'use server';

import { auth } from '@/auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ProductService } from '@/domain/stock/services/ProductService';
import { ProductType } from '@prisma/client';

const productService = new ProductService();

const createProductSchema = z.object({
    name: z.string().min(2),
    code: z.string().min(1),
    type: z.nativeEnum(ProductType),
    vatRate: z.coerce.number().min(0).max(100),
    unit: z.string().min(1),
    buyPrice: z.coerce.number().min(0),
    sellPrice: z.coerce.number().min(0),
    currency: z.string().default("TRY"),
});

export async function createProduct(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.orgId) {
        return { error: 'Unauthorized' };
    }

    const validatedFields = createProductSchema.safeParse({
        name: formData.get('name'),
        code: formData.get('code'),
        type: formData.get('type') || 'GOODS',
        vatRate: formData.get('vatRate'),
        unit: formData.get('unit'),
        buyPrice: formData.get('buyPrice'),
        sellPrice: formData.get('sellPrice'),
        currency: formData.get('currency'),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await productService.createProduct({
            orgId: session.user.orgId,
            ...validatedFields.data
        });

        revalidatePath('/dashboard/stok/urunler');
        return { success: true };
    } catch (error) {
        console.error("Create Product Error:", error);
        return { error: 'Failed to create product. SKU might be duplicate.' };
    }
}

export async function getProducts() {
    const session = await auth();
    if (!session?.user || !(session.user as any).orgId) return [];

    const productService = new ProductService();
    return await productService.listProducts((session.user as any).orgId);
}
