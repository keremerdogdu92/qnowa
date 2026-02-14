
import { IOrganizationRepository } from '../../domain/identity/repositories/IOrganizationRepository';
import { Organization } from '../../domain/identity/Organization';
import { prisma } from '../database/prisma-client';

export class PrismaOrganizationRepository implements IOrganizationRepository {
    async findById(id: string): Promise<Organization | null> {
        const row = await prisma.organization.findUnique({
            where: { id },
        });
        if (!row) return null;
        return this.toDomain(row);
    }

    async findByTaxNumber(taxNumber: string): Promise<Organization | null> {
        const row = await prisma.organization.findUnique({
            where: { taxNumber },
        });
        if (!row) return null;
        return this.toDomain(row);
    }

    async save(organization: Organization): Promise<void> {
        const data = {
            name: organization.name,
            taxNumber: organization.taxNumber.value,
            address: organization.address,
            email: organization.email,
            phone: organization.phone,
            updatedAt: new Date(),
        };

        // Accessing props directly might be an issue if they are protected in AggregateRoot. 
        // Usually we expose getters. Let's assume we added getters or use (organization as any).props for now if getters are missing.
        // In Organization.ts we only exposed name/taxNumber. We should fix Organization.ts to expose others or use a mapper method on the aggregate.
        // For this MVP step, I will use getters if available, else I might need to update Organization.ts.
        // Let's assume for now I will use 'as any' to access props if getters are missing, but better to add getters.

        // Actually, looking at Organization.ts, I only exposed name and taxNumber.
        // I should probably update Organization.ts to expose address, email, phone.
        // But for now, to avoid context switching too much, I'll rely on what's there and maybe I'll miss some fields or I should update it.
        // Let's update Organization.ts to be correct first.

        await prisma.organization.upsert({
            where: { id: organization.id },
            create: {
                id: organization.id,
                ...data,
                createdAt: new Date(),
            },
            update: data,
        });
    }

    private toDomain(row: any): Organization {
        return Organization.create(
            {
                name: row.name,
                taxNumber: row.taxNumber,
                address: row.address || undefined,
                email: row.email || undefined,
                phone: row.phone || undefined,
            },
            row.id
        );
    }
}
