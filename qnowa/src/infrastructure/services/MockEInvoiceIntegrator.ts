
import { IEInvoiceIntegrator } from '../../domain/invoice/services/IEInvoiceIntegrator';
import { Fatura } from '../../domain/invoice/Fatura';

export class MockEInvoiceIntegrator implements IEInvoiceIntegrator {
    async sendInvoice(fatura: Fatura): Promise<{ gtbRef: string; status: string }> {
        console.log(`[MockIntegrator] Sending Invoice ${fatura.id} to GIB...`);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            gtbRef: `GIB-MOCK-${Date.now()}`,
            status: 'PROCESSING'
        };
    }

    async checkStatus(gtbRef: string): Promise<string> {
        return 'APPROVED';
    }
}
