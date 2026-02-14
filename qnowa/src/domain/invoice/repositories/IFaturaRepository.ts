import { Fatura, FaturaDurumu } from '../Fatura';

export interface IFaturaRepository {
    save(fatura: Fatura): Promise<void>;
    findById(id: string): Promise<Fatura | null>;
    findAllByStatus(orgId: string, status: FaturaDurumu): Promise<Fatura[]>;
    findAll(orgId: string): Promise<Fatura[]>;
}
