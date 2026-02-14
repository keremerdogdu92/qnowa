
import { AggregateRoot } from '../core/AggregateRoot';
import { Money } from '../shared/value-objects/Money';
import { MuhasebeFisiSatir } from './MuhasebeFisiSatir';

export enum FisDurumu {
    TASLAK = 'TASLAK',
    ONAYLI = 'ONAYLI',
}

interface MuhasebeFisiProps {
    orgId: string;
    yevmiyeNo: number; // Formerly journalNo
    date: Date;
    description?: string;
    status: FisDurumu;
    lines: MuhasebeFisiSatir[];
    periodMonth: number;
    periodYear: number;
    createdAt: Date;
    updatedAt: Date;
}

export class MuhasebeFisi extends AggregateRoot<MuhasebeFisiProps> {
    private constructor(props: MuhasebeFisiProps, id?: string) {
        super(props, id);
    }

    public static create(
        props: Omit<MuhasebeFisiProps, 'createdAt' | 'updatedAt' | 'lines' | 'status'>,
        id?: string
    ): MuhasebeFisi {
        return new MuhasebeFisi(
            {
                ...props,
                lines: [],
                status: FisDurumu.TASLAK,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            id
        );
    }

    get lines(): MuhasebeFisiSatir[] {
        return this.props.lines;
    }

    get status(): FisDurumu {
        return this.props.status;
    }

    get date(): Date {
        return this.props.date;
    }

    get yevmiyeNo(): number {
        return this.props.yevmiyeNo;
    }

    public yevmiyeNoAta(no: number): void {
        if (this.props.yevmiyeNo > 0) {
            throw new Error('Yevmiye numarası zaten atanmış');
        }
        (this.props as any).yevmiyeNo = no;
        (this.props as any).updatedAt = new Date();
    }

    public satirEkle(line: MuhasebeFisiSatir): void {
        if (this.props.status === FisDurumu.ONAYLI) {
            throw new Error('Onaylı fişe satır eklenemez');
        }
        this.props.lines.push(line);
        (this.props as any).updatedAt = new Date();
    }

    // Formerly post()
    public onayla(): void {
        if (this.props.lines.length === 0) {
            throw new Error('Boş fiş onaylanamaz');
        }
        if (!this.denkMi()) {
            throw new Error('Fiş denk değil (Borç != Alacak)');
        }
        (this.props as any).status = FisDurumu.ONAYLI;
        (this.props as any).updatedAt = new Date();
    }

    // Formerly isBalanced()
    public denkMi(): boolean {
        if (this.props.lines.length === 0) return true;

        const currency = this.props.lines[0].debit.currency;
        let totalDebit = Money.zero(currency);
        let totalCredit = Money.zero(currency);

        for (const line of this.props.lines) {
            totalDebit = totalDebit.add(line.debit);
            totalCredit = totalCredit.add(line.credit);
        }

        return totalDebit.equals(totalCredit);
    }
}
