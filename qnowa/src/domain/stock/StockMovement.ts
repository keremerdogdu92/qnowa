import { StockMovementType } from '@prisma/client';

export class StockMovement {
    constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly productId: string,
        public readonly quantity: number,
        public readonly type: StockMovementType,
        public readonly date: Date,
        public readonly refId?: string,
        public readonly refType?: string
    ) { }

    static create(props: {
        orgId: string;
        productId: string;
        quantity: number;
        type: StockMovementType;
        date: Date;
        refId?: string;
        refType?: string;
    }): StockMovement {
        if (props.quantity <= 0) {
            throw new Error("Stock movement quantity must be positive.");
        }

        return new StockMovement(
            crypto.randomUUID(),
            props.orgId,
            props.productId,
            props.quantity,
            props.type,
            props.date,
            props.refId,
            props.refType
        );
    }
}
