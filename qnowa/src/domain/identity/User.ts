
import { AggregateRoot } from '../core/AggregateRoot';
import { UserRole, UserRoleType } from './value-objects/UserRole';

interface UserProps {
    email: string;
    name?: string;
    orgId?: string;
    role: UserRole;
    passwordHash?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class User extends AggregateRoot<UserProps> {
    private constructor(props: UserProps, id?: string) {
        super(props, id);
    }

    public static create(
        props: Omit<UserProps, 'createdAt' | 'updatedAt'>,
        id?: string
    ): User {
        return new User(
            {
                ...props,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            id
        );
    }

    get email(): string {
        return this.props.email;
    }

    get name(): string | undefined {
        return this.props.name;
    }

    get orgId(): string | undefined {
        return this.props.orgId;
    }

    get role(): UserRole {
        return this.props.role;
    }

    public changeRole(newRole: UserRoleType): void {
        // Business rule: Only admin can change roles (can run checks here)
        // For now, simpler logic.
        // In a richer model, we would check caller permissions or dispatch an event.
        // We update props directly (AggregateRoot/Entity props should ideally be mutable or handled via methods)
        // Since ValueObject<T> props are readonly, here we should reconstruct or use mutable props in Entity.
        // For simplicity with DDD base classes usually using read-only props, we might need a method to return a *new* instance or use a mutable internal state.
        // Let's assume for this base implementation we can't mutate props easily without a setter or rebuilding.
        // To keep it simple and correct:
        // We will adopt a style where we treat the aggregate as mutable for state changes.
        (this.props as any).role = UserRole.create(newRole);
        (this.props as any).updatedAt = new Date();
    }

    public setOrganization(orgId: string): void {
        if (this.props.orgId) {
            throw new Error('User already belongs to an organization');
        }
        (this.props as any).orgId = orgId;
        (this.props as any).updatedAt = new Date();
    }

    get passwordHash(): string | undefined {
        return this.props.passwordHash;
    }
}
