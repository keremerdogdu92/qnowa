
import { PrismaClient, Prisma } from '@prisma/client';

// Helper type for Transaction Client
type PrismaTx = Prisma.TransactionClient;

export class PrismaJournalSequenceService {

    /**
     * Gets the next sequence number for a given Organization and Year.
     * MUST be called within a transaction to ensure gap-less consistency.
     * 
     * @param tx - The active Prisma transaction client
     * @param orgId - Organization ID
     * @param year - Fiscal Year
     * @returns The newly incremented sequence number
     */
    async getNextSequence(tx: PrismaTx, orgId: string, year: number): Promise<number> {

        // UPSERT with atomic increment
        // This locks the row for update in Postgres because of the implicit Transaction logic in upsert/update
        // When inside an interactive transaction ($transaction), this operation holds the lock until the transaction commits.
        // If saving the journal fails later in the same transaction, this increment rolls back. -> GAP-LESS GUARANTEED.

        const sequence = await tx.yevmiyeSequence.upsert({
            where: {
                orgId_year: {
                    orgId,
                    year,
                },
            },
            create: {
                orgId,
                year,
                lastNo: 1, // First number
            },
            update: {
                lastNo: {
                    increment: 1,
                },
            },
            select: {
                lastNo: true
            }
        });

        return sequence.lastNo;
    }
}
