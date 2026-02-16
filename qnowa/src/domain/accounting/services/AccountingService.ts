import { IMuhasebeFisiRepository } from '../repositories/IMuhasebeFisiRepository';
import { MuhasebeFisi } from '../MuhasebeFisi';
import { MuhasebeFisiSatir } from '../MuhasebeFisiSatir';
import { Money } from '../../shared/value-objects/Money';

export class AccountingService {
    constructor(
        private journalRepo: IMuhasebeFisiRepository
    ) { }

    async createJournal(props: {
        orgId: string;
        date: Date;
        description: string;
        lines: {
            accountId: string;
            description?: string;
            debit: number;
            credit: number;
            currency?: string;
        }[]
    }): Promise<string> {
        // 1. Create Header
        const journal = MuhasebeFisi.create({
            orgId: props.orgId,
            yevmiyeNo: 0, // Assigned by Repo
            date: props.date,
            description: props.description,
            periodMonth: props.date.getMonth() + 1,
            periodYear: props.date.getFullYear(),
        });

        // 2. Add Lines
        let sequence = 1;
        for (const line of props.lines) {
            journal.satirEkle(MuhasebeFisiSatir.create({
                journalId: journal.id,
                accountId: line.accountId,
                debit: Money.create(line.debit, line.currency || 'TRY'),
                credit: Money.create(line.credit, line.currency || 'TRY'),
                sequence: sequence++,
                description: line.description || props.description
            }));
        }

        // 3. Post (Validates balance)
        journal.onayla();

        // 4. Save
        await this.journalRepo.save(journal);

        return journal.id;
    }
}
