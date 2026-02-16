export class Bank {
    constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly name: string,
        public readonly currency: string,
        public readonly accountId?: string,
        public readonly branch?: string,
        public readonly iban?: string,
    ) { }

    static create(props: {
        orgId: string;
        name: string;
        currency?: string;
        accountId?: string;
        branch?: string;
        iban?: string;
    }): Bank {
        return new Bank(
            crypto.randomUUID(),
            props.orgId,
            props.name,
            props.currency || 'TRY',
            props.accountId,
            props.branch,
            props.iban
        );
    }
}
