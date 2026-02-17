import { PrismaClient, StockMovementType } from '@prisma/client';
import { StockMovement } from '../StockMovement';

const prisma = new PrismaClient();

export class StockService {

    async createMovement(
        orgId: string,
        productId: string,
        quantity: number,
        type: StockMovementType,
        date: Date,
        refId?: string,
        refType?: string
    ): Promise<StockMovement> {

        // Validation
        if (quantity <= 0) {
            throw new Error("Quantity must be positive");
        }

        // Calculate signed quantity for update
        const change = type === StockMovementType.IN ? quantity : -quantity;

        // Transaction: Create Movement + Update Product Stock
        const result = await prisma.$transaction(async (tx) => {
            const movement = await tx.stockMovement.create({
                data: {
                    orgId,
                    productId,
                    quantity,
                    type,
                    date,
                    refId,
                    refType
                }
            });

            await tx.product.update({
                where: { id: productId },
                data: {
                    stockQuantity: {
                        increment: change
                    }
                }
            });

            return movement;
        });

        return new StockMovement(
            result.id,
            result.orgId,
            result.productId,
            result.quantity.toNumber(),
            result.type,
            result.date,
            result.refId || undefined,
            result.refType || undefined
        );
    }

    async getCurrentStock(productId: string): Promise<number> {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { stockQuantity: true }
        });

        return product?.stockQuantity.toNumber() || 0;
    }

    async getMovements(productId: string): Promise<StockMovement[]> {
        const rows = await prisma.stockMovement.findMany({
            where: { productId },
            orderBy: { date: 'desc' }
        });

        return rows.map(r => new StockMovement(
            r.id,
            r.orgId,
            r.productId,
            r.quantity.toNumber(),
            r.type,
            r.date,
            r.refId || undefined,
            r.refType || undefined
        ));
    }
}
