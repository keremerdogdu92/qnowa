
import { Entity } from '@/domain/core/Entity';
import { Money } from '@/domain/shared/value-objects/Money';

export enum ChequeType {
    GELEN = 'GELEN',
    GIDEN = 'GIDEN'
}

export enum InstrumentType {
    CEK = 'CEK',
    SENET = 'SENET'
}

export enum ChequeStatus {
    PORTFOY = 'PORTFOY',
    TAHSIL = 'TAHSIL',
    CIRO = 'CIRO',
    ODENDI = 'ODENDI',
    KARSILIKSIZ = 'KARSILIKSIZ',
    IADE = 'IADE'
}

interface ChequeProps {
    orgId: string;
    chequeNo: string;
    bankName?: string;
    branchName?: string;
    accountNo?: string;
    drawer?: string;
    amount: Money;
    issueDate: Date;
    dueDate: Date;
    type: ChequeType;
    instrument: InstrumentType; // Added
    status: ChequeStatus;
    cariId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Cheque extends Entity<ChequeProps> {
    private constructor(props: ChequeProps, id?: string) {
        super(props, id);
        // Default if missing
        if (!this.props.instrument) {
            this.props.instrument = InstrumentType.CEK;
        }
    }

    public static create(props: ChequeProps, id?: string): Cheque {
        // Validation logic here
        if (props.amount.amount <= 0) {
            throw new Error('Tutar 0 dan büyük olmalıdır.');
        }
        return new Cheque(props, id);
    }

    // Getters
    get chequeNo() { return this.props.chequeNo; }
    get amount() { return this.props.amount; }
    get status() { return this.props.status; }
    get dueDate() { return this.props.dueDate; }
    get cariId() { return this.props.cariId; }
    get orgId() { return this.props.orgId; }
    get type() { return this.props.type; }
    get instrument() { return this.props.instrument; } // Added Getter

    // Actions
    public collect(): void {
        this.validateTransition(ChequeStatus.TAHSIL);
        this.props.status = ChequeStatus.TAHSIL;
        this.props.updatedAt = new Date();
    }

    public endorse(toCariId: string): void {
        this.validateTransition(ChequeStatus.CIRO);
        this.props.status = ChequeStatus.CIRO;
        this.props.updatedAt = new Date();
        // logic to update location/holder could be handled by service
    }

    public bounce(): void {
        this.props.status = ChequeStatus.KARSILIKSIZ;
        this.props.updatedAt = new Date();
    }

    public return(): void {
        this.props.status = ChequeStatus.IADE;
        this.props.updatedAt = new Date();
    }

    private validateTransition(target: ChequeStatus): void {
        if (this.props.status === ChequeStatus.TAHSIL || this.props.status === ChequeStatus.CIRO) {
            throw new Error(`Çek zaten işlem görmüş (${this.props.status}). Tekrar işlem yapılamaz.`);
        }
    }
}
