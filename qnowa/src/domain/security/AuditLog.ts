export class AuditLog {
    constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly action: string,
        public readonly entityId: string,
        public readonly entityType: string,
        public readonly createdAt: Date,
        public readonly userId?: string,
        public readonly details?: any,
        public readonly ipAddress?: string,
        public readonly userAgent?: string
    ) { }

    static create(props: {
        orgId: string;
        action: string;
        entityId: string;
        entityType: string;
        userId?: string;
        details?: any;
        ipAddress?: string;
        userAgent?: string;
    }): AuditLog {
        return new AuditLog(
            crypto.randomUUID(),
            props.orgId,
            props.action,
            props.entityId,
            props.entityType,
            new Date(),
            props.userId,
            props.details,
            props.ipAddress,
            props.userAgent
        );
    }
}
