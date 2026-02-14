
import { ValueObject } from '../../core/ValueObject';

export type DonemStatus = 'OPEN' | 'SOFT_CLOSE' | 'HARD_CLOSE';

interface DonemProps {
    year: number;
    month: number;
    status: DonemStatus;
}

export class Donem extends ValueObject<DonemProps> {
    private constructor(props: DonemProps) {
        super(props);
    }

    public static create(year: number, month: number, status: DonemStatus = 'OPEN'): Donem {
        if (month < 1 || month > 12) {
            throw new Error('Geçersiz ay');
        }
        return new Donem({ year, month, status });
    }

    get year(): number {
        return this.props.year;
    }

    get month(): number {
        return this.props.month;
    }

    get status(): DonemStatus {
        return this.props.status;
    }

    public isOpen(): boolean {
        return this.status === 'OPEN';
    }

    public isClosed(): boolean {
        return this.status === 'HARD_CLOSE';
    }

    public canPost(): boolean {
        return this.status !== 'HARD_CLOSE';
    }
}
