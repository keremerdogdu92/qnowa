
import { Organization } from '../Organization';

export interface IOrganizationRepository {
    findById(id: string): Promise<Organization | null>;
    findByTaxNumber(taxNumber: string): Promise<Organization | null>;
    save(organization: Organization): Promise<void>;
}
