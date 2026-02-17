import { PrismaClient, ProductType } from '@prisma/client';
import { Product } from '../Product';

const prisma = new PrismaClient();

export class ProductService {

    async createProduct(data: {
        orgId: string;
        name: string;
        code: string;
        type?: ProductType;
        vatRate?: number;
        unit?: string;
        buyPrice?: number;
        sellPrice?: number;
        currency?: string;
    }): Promise<Product> {

        const created = await prisma.product.create({
            data: {
                orgId: data.orgId,
                name: data.name,
                code: data.code,
                type: data.type || 'GOODS',
                vatRate: data.vatRate || 20,
                unit: data.unit || 'Adet',
                buyPrice: data.buyPrice || 0,
                sellPrice: data.sellPrice || 0,
                currency: data.currency || 'TRY',
                stockQuantity: 0 // Initial
            }
        });

        return new Product(
            created.id,
            created.orgId,
            created.name,
            created.code,
            created.type,
            created.vatRate,
            created.unit,
            created.buyPrice.toNumber(),
            created.sellPrice.toNumber(),
            created.currency,
            created.stockQuantity.toNumber()
        );
    }

    async updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'orgId' | 'stockQuantity'>>): Promise<Product> {
        const updated = await prisma.product.update({
            where: { id },
            data: {
                ...data
            }
        });

        return new Product(
            updated.id,
            updated.orgId,
            updated.name,
            updated.code,
            updated.type,
            updated.vatRate,
            updated.unit,
            updated.buyPrice.toNumber(),
            updated.sellPrice.toNumber(),
            updated.currency,
            updated.stockQuantity.toNumber()
        );
    }

    async getProduct(id: string): Promise<Product | null> {
        const p = await prisma.product.findUnique({ where: { id } });
        if (!p) return null;

        return new Product(
            p.id,
            p.orgId,
            p.name,
            p.code,
            p.type,
            p.vatRate,
            p.unit,
            p.buyPrice.toNumber(),
            p.sellPrice.toNumber(),
            p.currency,
            p.stockQuantity.toNumber()
        );
    }

    async listProducts(orgId: string): Promise<Product[]> {
        const list = await prisma.product.findMany({
            where: { orgId },
            orderBy: { name: 'asc' }
        });

        return list.map(p => new Product(
            p.id,
            p.orgId,
            p.name,
            p.code,
            p.type,
            p.vatRate,
            p.unit,
            p.buyPrice.toNumber(),
            p.sellPrice.toNumber(),
            p.currency,
            p.stockQuantity.toNumber()
        ));
    }
}
