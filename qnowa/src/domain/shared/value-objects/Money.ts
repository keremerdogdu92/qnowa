
import { ValueObject } from '../../core/ValueObject';

interface MoneyProps {
    amount: number;
    currency: string;
}

export class Money extends ValueObject<MoneyProps> {
    private constructor(props: MoneyProps) {
        super(props);
    }

    public static create(amount: number, currency: string = 'TRY'): Money {
        return new Money({ amount, currency });
    }

    get amount(): number {
        return this.props.amount;
    }

    get currency(): string {
        return this.props.currency;
    }

    public add(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error('Cannot add money with different currencies');
        }
        return new Money({
            amount: this.amount + other.amount,
            currency: this.currency,
        });
    }

    public subtract(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error('Cannot subtract money with different currencies');
        }
        return new Money({
            amount: this.amount - other.amount,
            currency: this.currency,
        });
    }

    public multiply(multiplier: number): Money {
        return new Money({
            amount: this.amount * multiplier,
            currency: this.currency,
        });
    }

    public static zero(currency: string = 'TRY'): Money {
        return new Money({ amount: 0, currency });
    }

    public equals(other: Money): boolean {
        return (
            this.amount === other.amount && this.currency === other.currency
        );
    }

    public isZero(): boolean {
        return this.amount === 0;
    }

    public greaterThan(other: Money): boolean {
        return this.amount > other.amount;
    }

    public lessThan(other: Money): boolean {
        return this.amount < other.amount;
    }
}
