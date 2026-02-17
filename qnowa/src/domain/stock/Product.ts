import { ProductType } from '@prisma/client';

export class Product {
    constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly name: string,
        public readonly code: string,
        public readonly type: ProductType,
        public readonly vatRate: number,
        public readonly unit: string,
        public readonly buyPrice: number,
        public readonly sellPrice: number,
        public readonly currency: string,
        public readonly stockQuantity: number
    ) { }

    static create(props: {
        orgId: string;
        name: string;
        code: string;
        type?: ProductType;
        vatRate?: number;
        unit?: string;
        buyPrice?: number;
        sellPrice?: number;
        currency?: string;
    }): Product {
        return new Product(
            crypto.randomUUID(),
            props.orgId,
            props.name,
            props.code,
            props.type || 'GOODS',
            props.vatRate || 20,
            props.unit || 'Adet',
            props.buyPrice || 0,
            props.sellPrice || 0,
            props.currency || 'TRY',
            0 // Initial stock is 0
        );
    }
}
