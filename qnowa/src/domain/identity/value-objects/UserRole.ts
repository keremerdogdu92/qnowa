
import { ValueObject } from '../../core/ValueObject';

export type UserRoleType = 'ADMIN' | 'ACCOUNTANT' | 'USER';

interface UserRoleProps {
    value: UserRoleType;
}

export class UserRole extends ValueObject<UserRoleProps> {
    private constructor(props: UserRoleProps) {
        super(props);
    }

    public static create(value: UserRoleType): UserRole {
        return new UserRole({ value });
    }

    get value(): UserRoleType {
        return this.props.value;
    }

    public isAdmin(): boolean {
        return this.props.value === 'ADMIN';
    }

    public isAccountant(): boolean {
        return this.props.value === 'ACCOUNTANT';
    }
}
