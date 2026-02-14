'use server';

import { auth } from '@/auth';
import { prisma } from '@/infrastructure/database/prisma-client';

export type CariDTO = {
    id: string;
    name: string;
    taxNumber: string | null;
    type: 'CUSTOMER' | 'SUPPLIER' | 'BOTH';
};

export async function getParties(): Promise<CariDTO[]> {
    const session = await auth();
    if (!session?.user?.id || !(session.user as any).orgId) {
        return [];
    }
    const orgId = (session.user as any).orgId;

    const parties = await prisma.cari.findMany({
        where: { orgId },
        orderBy: { name: 'asc' }
    });

    return parties.map(p => ({
        id: p.id,
        name: p.name,
        taxNumber: p.taxNumber,
        type: p.type
    }));
}
