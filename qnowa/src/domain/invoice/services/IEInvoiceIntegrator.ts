import { Fatura } from '../Fatura';

export interface IEInvoiceIntegrator {
    sendInvoice(fatura: Fatura): Promise<{ gtbRef: string; status: string }>;
    checkStatus(gtbRef: string): Promise<string>;
}
