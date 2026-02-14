
import { MaliDonem } from '../MaliDonem';

export interface IMaliDonemRepository {
    save(period: MaliDonem): Promise<void>;
    findByMonth(orgId: string, year: number, month: number): Promise<MaliDonem | null>;
}
