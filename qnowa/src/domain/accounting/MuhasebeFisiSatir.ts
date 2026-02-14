
import { Entity } from '../core/Entity';
import { Money } from '../shared/value-objects/Money';

interface MuhasebeFisiSatirProps {
    journalId: string;
    accountId: string; // Ref to HesapPlani
    description?: string;
    debit: Money;
    credit: Money;
    sequence: number;
}

export class MuhasebeFisiSatir extends Entity<MuhasebeFisiSatirProps> {
    private constructor(props: MuhasebeFisiSatirProps, id?: string) {
        super(props, id);
    }

    public static create(
        props: MuhasebeFisiSatirProps,
        id?: string
    ): MuhasebeFisiSatir {
        const zero = Money.zero(props.debit.currency); // Assuming same currency

        if (props.debit.greaterThan(zero) && props.credit.greaterThan(zero)) {
            throw new Error('Line cannot have both debit and credit greater than zero');
        }
        if (props.debit.lessThan(zero) || props.credit.lessThan(zero)) {
            throw new Error('Amounts cannot be negative');
        }

        return new MuhasebeFisiSatir(props, id);
    }

    get debit(): Money {
        return this.props.debit;
    }

    get credit(): Money {
        return this.props.credit;
    }
}
