
import { IUserRepository } from '../../domain/identity/repositories/IUserRepository';
import { User } from '../../domain/identity/User';
import { UserRole, UserRoleType } from '../../domain/identity/value-objects/UserRole';
import { prisma } from '../database/prisma-client';

export class PrismaUserRepository implements IUserRepository {
    async findById(id: string): Promise<User | null> {
        const row = await prisma.user.findUnique({
            where: { id },
        });
        if (!row) return null;
        return this.toDomain(row);
    }

    async findByEmail(email: string): Promise<User | null> {
        const row = await prisma.user.findUnique({
            where: { email },
        });
        if (!row) return null;
        return this.toDomain(row);
    }

    async save(user: User): Promise<void> {
        const data = {
            name: user.name,
            email: user.email,
            orgId: user.orgId,
            role: user.role.value as any, // Cast to Prisma Enum
            hashedPassword: user.passwordHash,
            updatedAt: new Date(),
        };

        await prisma.user.upsert({
            where: { id: user.id },
            create: {
                id: user.id,
                ...data,
                createdAt: new Date(), // Only on create
            },
            update: data, // Only update mutable fields
        });
    }

    private toDomain(row: any): User {
        return User.create(
            {
                email: row.email!,
                name: row.name || undefined,
                orgId: row.orgId || undefined,
                role: UserRole.create(row.role as UserRoleType),
                passwordHash: row.hashedPassword || undefined,
            },
            row.id
        );
    }
}
