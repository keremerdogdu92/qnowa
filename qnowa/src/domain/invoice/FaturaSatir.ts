import { Entity } from '../core/Entity';
import { Money } from '../shared/value-objects/Money';

interface FaturaSatirProps {
    description: string;
    quantity: number;
    unitPrice: Money;
    taxRate: number; // Percentage, e.g. 18
    total: Money;
}

export class FaturaSatir extends Entity<FaturaSatirProps> {
    private constructor(props: FaturaSatirProps, id?: string) {
        super(props, id);
    }

    public static create(
        props: Omit<FaturaSatirProps, 'total'>,
        id?: string
    ): FaturaSatir {
        if (props.quantity <= 0) {
            throw new Error('Quantity must be greater than zero');
        }
        if (props.taxRate < 0) {
            throw new Error('Tax rate cannot be negative');
        }

        const totalAmount = props.unitPrice.amount * props.quantity * (1 + props.taxRate / 100);
        const total = Money.create(totalAmount, props.unitPrice.currency);

        return new FaturaSatir({ ...props, total }, id);
    }

    get quantity(): number {
        return this.props.quantity;
    }

    get unitPrice(): Money {
        return this.props.unitPrice;
    }

    get taxRate(): number {
        return this.props.taxRate;
    }

    get total(): Money {
        return this.props.total;
    }

    get description(): string {
        return this.props.description;
    }
}
