
import { QNBIntegrator } from '../src/infrastructure/services/QNBIntegrator';
import { Fatura, FaturaDurumu, FaturaTipi } from '../src/domain/invoice/Fatura';
import { Money } from '../src/domain/shared/value-objects/Money';

async function verify() {
    console.log("Starting QNB Integration Verification...");

    // 1. Create Mock Fatura
    const fatura = Fatura.create({
        orgId: "org-123",
        faturaNo: "QNB2024000000001",
        date: new Date(),
        cariId: "cari-123",
        type: FaturaTipi.SATIS,
        currency: "TRY"
    });

    // Add lines manually (since creating via factory initializes empty)
    // We need to access private lines or use methods. casting to any for test script simplicity.
    (fatura as any).props.lines = [{
        description: "Test Product",
        quantity: 1,
        unitPrice: Money.create(100, "TRY"),
        taxRate: 20,
        total: Money.create(120, "TRY")
    }];
    (fatura as any).recalculateTotals();
    (fatura as any).props.status = FaturaDurumu.ONAYLI;

    console.log("Mock Fatura Created:", fatura.faturaNo);

    // 2. Instantiate Integrator
    const integrator = new QNBIntegrator();

    // 3. Send Invoice
    try {
        console.log("Sending Invoice...");
        const result = await integrator.sendInvoice(fatura);
        console.log("Result:", result);
    } catch (error: any) {
        console.log("Caught Expected Error/Result:");
        console.error(error.message);
    }
}

verify().catch(console.error);
