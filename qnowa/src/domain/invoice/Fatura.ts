import { AggregateRoot } from '../core/AggregateRoot';
import { Money } from '../shared/value-objects/Money';
import { FaturaSatir } from './FaturaSatir';

export enum FaturaDurumu {
    TASLAK = 'TASLAK',
    ONAYLI = 'ONAYLI',
    GONDERILDI = 'GONDERILDI',
    IPTAL = 'IPTAL',
}

export enum FaturaTipi {
    SATIS = 'SATIS',
    ALIS = 'ALIS',
}

interface FaturaProps {
    orgId: string;
    faturaNo: string;
    date: Date;
    dueDate?: Date;
    status: FaturaDurumu;
    type: FaturaTipi;
    cariId: string;
    lines: FaturaSatir[];
    subTotal: Money;
    taxTotal: Money;
    grandTotal: Money;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Fatura extends AggregateRoot<FaturaProps> {
    private constructor(props: FaturaProps, id?: string) {
        super(props, id);
    }

    public static create(
        props: Omit<FaturaProps, 'lines' | 'subTotal' | 'taxTotal' | 'grandTotal' | 'createdAt' | 'updatedAt' | 'status'>,
        id?: string
    ): Fatura {
        return new Fatura(
            {
                ...props,
                lines: [],
                status: FaturaDurumu.TASLAK,
                subTotal: Money.zero(props.currency),
                taxTotal: Money.zero(props.currency),
                grandTotal: Money.zero(props.currency),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            id
        );
    }

    get status(): FaturaDurumu {
        return this.props.status;
    }

    get lines(): FaturaSatir[] {
        return this.props.lines;
    }

    get total(): Money {
        return this.props.grandTotal;
    }

    get faturaNo(): string {
        return this.props.faturaNo;
    }

    get date(): Date {
        return this.props.date;
    }

    get orgId(): string {
        return this.props.orgId;
    }

    get currency(): string {
        return this.props.currency;
    }

    get subTotal(): Money {
        return this.props.subTotal;
    }

    get taxTotal(): Money {
        return this.props.taxTotal;
    }

    get grandTotal(): Money {
        return this.props.grandTotal;
    }

    get type(): FaturaTipi {
        return this.props.type;
    }

    get cariId(): string {
        return this.props.cariId;
    }

    // Formerly addLine
    public satirEkle(line: FaturaSatir): void {
        if (this.props.status !== FaturaDurumu.TASLAK) {
            throw new Error('Onaylı veya iptal edilmiş faturaya satır eklenemez');
        }
        if (line.unitPrice.currency !== this.props.currency) {
            throw new Error('Para birimi uyuşmazlığı');
        }

        this.props.lines.push(line);
        this.recalculateTotals();
        (this.props as any).updatedAt = new Date();
    }

    // Formerly finalize
    public onayla(): void {
        if (this.props.lines.length === 0) {
            throw new Error('Boş fatura onaylanamaz');
        }
        if (this.props.status !== FaturaDurumu.TASLAK) {
            throw new Error('Fatura zaten onaylı veya iptal edilmiş');
        }

        // In a real app, we might call an external service (GIB/Integrator) here or emit an event
        // For Manual Trigger workflow, we just mark it as FINALIZED (ONAYLI).

        (this.props as any).status = FaturaDurumu.ONAYLI;
        (this.props as any).updatedAt = new Date();
    }

    public gonderildi(): void {
        if (this.props.status !== FaturaDurumu.ONAYLI) {
            throw new Error('Sadece onaylı faturalar gönderilebilir');
        }
        (this.props as any).status = FaturaDurumu.GONDERILDI;
        (this.props as any).updatedAt = new Date();
    }

    private recalculateTotals(): void {
        let sub = 0;
        let tax = 0;

        for (const line of this.props.lines) {
            const lineTotal = line.total.amount;
            const lineTax = (line.unitPrice.amount * line.quantity * line.taxRate) / 100;
            const lineSub = line.unitPrice.amount * line.quantity;

            sub += lineSub;
            tax += lineTax;
        }

        const currency = this.props.currency;
        (this.props as any).subTotal = Money.create(sub, currency);
        (this.props as any).taxTotal = Money.create(tax, currency);
        (this.props as any).grandTotal = Money.create(sub + tax, currency);
    }
}
