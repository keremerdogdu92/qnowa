
import { IMaliDonemRepository } from '../repositories/IMaliDonemRepository';
import { DonemDurumu } from '../MaliDonem';

export class MaliDonemService {
    constructor(private repo: IMaliDonemRepository) { }

    async validateTransactionDate(orgId: string, date: Date): Promise<void> {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const period = await this.repo.findByMonth(orgId, year, month);

        if (!period) {
            // Default policy: If not defined, it is OPEN.
            // To be stricter, we could require period activation.
            return;
        }

        if (period.status === DonemDurumu.KESIN_KAPALI) {
            throw new Error(`Mali dönem ${month}/${year} kapalı (kesinleşmiş).`);
        }
    }
}
