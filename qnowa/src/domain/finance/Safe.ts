export class Safe {
    constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly name: string,
        public readonly currency: string,
        public readonly accountId?: string
    ) { }

    static create(props: {
        orgId: string;
        name: string;
        currency?: string;
        accountId?: string;
    }): Safe {
        return new Safe(
            crypto.randomUUID(),
            props.orgId,
            props.name,
            props.currency || 'TRY',
            props.accountId
        );
    }
}
