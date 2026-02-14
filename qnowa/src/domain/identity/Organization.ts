
import { AggregateRoot } from '../core/AggregateRoot';
import { VergiNumarasi } from '../shared/value-objects/VergiNumarasi';

interface OrganizationProps {
    name: string;
    taxNumber: VergiNumarasi;
    address?: string;
    email?: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Organization extends AggregateRoot<OrganizationProps> {
    private constructor(props: OrganizationProps, id?: string) {
        super(props, id);
    }

    public static create(
        props: {
            name: string;
            taxNumber: string;
            address?: string;
            email?: string;
            phone?: string;
        },
        id?: string
    ): Organization {
        return new Organization(
            {
                name: props.name,
                taxNumber: VergiNumarasi.create(props.taxNumber),
                address: props.address,
                email: props.email,
                phone: props.phone,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            id
        );
    }

    get name(): string {
        return this.props.name;
    }

    get taxNumber(): VergiNumarasi {
        return this.props.taxNumber;
    }

    get address(): string | undefined {
        return this.props.address;
    }

    get email(): string | undefined {
        return this.props.email;
    }

    get phone(): string | undefined {
        return this.props.phone;
    }
}
