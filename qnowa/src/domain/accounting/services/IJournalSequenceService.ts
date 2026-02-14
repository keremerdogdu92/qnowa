
export interface IJournalSequenceService {
    getNextJournalNumber(orgId: string, year: number): Promise<number>;
}
