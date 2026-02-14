
import { AggregateRoot } from '../core/AggregateRoot';

export enum DonemDurumu {
    ACIK = 'ACIK',
    GECICI_KAPALI = 'GECICI_KAPALI',
    KESIN_KAPALI = 'KESIN_KAPALI',
}

interface MaliDonemProps {
    orgId: string;
    year: number;
    month: number;
    status: DonemDurumu;
    createdAt: Date;
    updatedAt: Date;
}

export class MaliDonem extends AggregateRoot<MaliDonemProps> {
    private constructor(props: MaliDonemProps, id?: string) {
        super(props, id);
    }

    public static create(
        props: Omit<MaliDonemProps, 'createdAt' | 'updatedAt' | 'status'>,
        id?: string
    ): MaliDonem {
        return new MaliDonem(
            {
                ...props,
                status: DonemDurumu.ACIK,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            id
        );
    }

    public static fromSnapshot(props: MaliDonemProps, id: string): MaliDonem {
        return new MaliDonem(props, id);
    }

    public closeSoft(): void {
        (this.props as any).status = DonemDurumu.GECICI_KAPALI;
        (this.props as any).updatedAt = new Date();
    }

    public closeHard(): void {
        (this.props as any).status = DonemDurumu.KESIN_KAPALI;
        (this.props as any).updatedAt = new Date();
    }

    public open(): void {
        (this.props as any).status = DonemDurumu.ACIK;
        (this.props as any).updatedAt = new Date();
    }

    get status(): DonemDurumu {
        return this.props.status;
    }

    get isOpen(): boolean {
        return this.props.status === DonemDurumu.ACIK;
    }
}
