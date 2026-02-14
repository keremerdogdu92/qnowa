
import { MuhasebeFisi } from '../MuhasebeFisi';

export interface IMuhasebeFisiRepository {
    save(journal: MuhasebeFisi): Promise<void>;
    findById(id: string): Promise<MuhasebeFisi | null>;
    findByJournalNo(orgId: string, year: number, no: number): Promise<MuhasebeFisi | null>;
}
