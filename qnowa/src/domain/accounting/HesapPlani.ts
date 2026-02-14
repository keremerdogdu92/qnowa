
import { AggregateRoot } from '../core/AggregateRoot';
import { AccountCode } from './value-objects/AccountCode';

interface HesapPlaniProps {
    orgId?: string; // Null if standard global account
    code: AccountCode;
    name: string;
    parentCode?: AccountCode;
    createdAt: Date;
    updatedAt: Date;
}

export class HesapPlani extends AggregateRoot<HesapPlaniProps> {
    private constructor(props: HesapPlaniProps, id?: string) {
        super(props, id);
    }

    public static create(
        props: Omit<HesapPlaniProps, 'createdAt' | 'updatedAt'>,
        id?: string
    ): HesapPlani {
        // Invariant: If code indicates a sub-account, parentCode should logically align?
        // We can check if props.code.getParentCode() matches props.parentCode?.value
        // But parentCode might be optional in props if we just pass the ID or Code object.

        if (props.code.getParentCode() && !props.parentCode) {
            // Domain rule: Sub-accounts must have a parent? 
            // For creation, maybe we enforce passing the parent code object.
        }

        if (props.parentCode && props.code.getParentCode() !== props.parentCode.value) {
            throw new Error(`Parent code mismatch. Code ${props.code.value} implies parent ${props.code.getParentCode()} but verified against ${props.parentCode.value}`);
        }

        return new HesapPlani(
            {
                ...props,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            id
        );
    }

    get code(): AccountCode {
        return this.props.code;
    }

    get name(): string {
        return this.props.name;
    }

    get orgId(): string | undefined {
        return this.props.orgId;
    }

    public rename(newName: string): void {
        if (!newName || newName.length < 2) {
            throw new Error('Account name too short');
        }
        (this.props as any).name = newName;
        (this.props as any).updatedAt = new Date();
    }
}
