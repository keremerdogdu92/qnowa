import { PaymentType } from '@prisma/client';

export class Payment {
    constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly date: Date,
        public readonly amount: number,
        public readonly currency: string,
        public readonly type: PaymentType,
        public readonly description?: string,
        public readonly cariId?: string,
        public readonly faturaId?: string,
        public readonly bankId?: string,
        public readonly safeId?: string,
    ) { }

    static create(props: {
        orgId: string;
        date: Date;
        amount: number;
        currency?: string;
        type: PaymentType;
        description?: string;
        cariId?: string;
        faturaId?: string;
        bankId?: string;
        safeId?: string;
    }): Payment {
        if (!props.bankId && !props.safeId) {
            throw new Error("Payment must be linked to either a Bank or a Safe.");
        }
        if (props.bankId && props.safeId) {
            throw new Error("Payment cannot be linked to both Bank and Safe simultaneously (unless it is a transfer, which is a different use case).");
        }

        return new Payment(
            crypto.randomUUID(),
            props.orgId,
            props.date,
            props.amount,
            props.currency || 'TRY',
            props.type,
            props.description,
            props.cariId,
            props.faturaId,
            props.bankId,
            props.safeId
        );
    }
}
