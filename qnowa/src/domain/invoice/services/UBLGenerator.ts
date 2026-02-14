import { create } from 'xmlbuilder2';
import { Fatura } from '../Fatura';

export interface CariBilgileri {
    name: string;
    taxNumber: string; // VKN or TCKN
    address?: string;
    email?: string;
    phone?: string;
    city?: string;
    country?: string;
}

export class UBLGenerator {
    static generateXML(fatura: Fatura, supplier: CariBilgileri, customer: CariBilgileri, ettn?: string): string {
        const doc = create({ version: '1.0', encoding: 'UTF-8' })
            .ele('Invoice', {
                'xmlns': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
                'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
                'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
                'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
                'xmlns:ext': 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2',
                'xmlns:xades': 'http://uri.etsi.org/01903/v1.3.2#',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'xsi:schemaLocation': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 UBL-Invoice-2.1.xsd'
            });

        // 1. UBL Version & Customization
        doc.ele('cbc:UBLVersionID').txt('2.1').up();
        doc.ele('cbc:CustomizationID').txt('TR1.2').up();
        doc.ele('cbc:ProfileID').txt('UBL-TR-PROFILE-1').up();

        // 2. Invoice ID & ETTN (UUID)
        doc.ele('cbc:ID').txt(fatura.faturaNo).up();
        doc.ele('cbc:CopyIndicator').txt('false').up();
        doc.ele('cbc:UUID').txt(ettn || fatura.id).up(); // ETTN MUST be UUID

        // 3. Issue Date & Time
        doc.ele('cbc:IssueDate').txt(fatura.date.toISOString().split('T')[0]).up();
        doc.ele('cbc:IssueTime').txt('12:00:00').up(); // Defaulting time for now

        // 4. Invoice Type Code
        doc.ele('cbc:InvoiceTypeCode').txt('SATIS').up();

        // 5. Currency
        doc.ele('cbc:DocumentCurrencyCode').txt(fatura.currency).up();

        // 6. Line Count
        doc.ele('cbc:LineCountNumeric').txt(fatura.lines.length.toString()).up();

        // 7. Accounting Supplier Party (Satıcı - Biz)
        const supplierParty = doc.ele('cac:AccountingSupplierParty').ele('cac:Party');
        UBLGenerator.addParty(supplierParty, supplier);
        supplierParty.up().up();

        // 8. Accounting Customer Party (Alıcı - Müşteri)
        const customerParty = doc.ele('cac:AccountingCustomerParty').ele('cac:Party');
        UBLGenerator.addParty(customerParty, customer);
        customerParty.up().up();

        // 9. Tax Total
        // Group amounts by VAT rate (Scanning lines to map rates)
        const taxRates = new Map<number, number>();
        fatura.lines.forEach(line => {
            const currentTax = taxRates.get(line.taxRate) || 0;
            const lineTaxInfo = UBLGenerator.calculateLineTax(line, fatura.currency);
            taxRates.set(line.taxRate, currentTax + lineTaxInfo.taxAmount);
        });

        const taxTotal = doc.ele('cac:TaxTotal');
        taxTotal.ele('cbc:TaxAmount', { currencyID: fatura.currency }).txt(fatura.taxTotal.amount.toFixed(2)).up();

        // Add Tax Subtotal for each rate
        taxRates.forEach((amount, rate) => {
            // Recalculate taxable base for this rate (simplified reverse calc or sum)
            // Ideally we sum up taxable amounts per line too.
            // For MVP, we'll just output the total tax breakdown logic roughly or refine it.
            // Let's iterate lines again properly if needed, or assume per-line subtotal addition.
            // Better: 
            let taxableAmount = 0;
            fatura.lines.filter(l => l.taxRate === rate).forEach(l => {
                taxableAmount += l.unitPrice.amount * l.quantity;
            });

            const taxSubtotal = taxTotal.ele('cac:TaxSubtotal');
            taxSubtotal.ele('cbc:TaxableAmount', { currencyID: fatura.currency }).txt(taxableAmount.toFixed(2)).up();
            taxSubtotal.ele('cbc:TaxAmount', { currencyID: fatura.currency }).txt(amount.toFixed(2)).up();
            taxSubtotal.ele('cbc:CalculationSequenceNumeric').txt('1').up();
            taxSubtotal.ele('cbc:Percent').txt(rate.toString()).up();
            taxSubtotal.ele('cac:TaxCategory')
                .ele('cac:TaxScheme')
                .ele('cbc:Name').txt('KDV').up()
                .ele('cbc:TaxTypeCode').txt('0015').up()
                .up().up().up();
        });
        taxTotal.up();

        // 10. Legal Monetary Total
        const monetaryTotal = doc.ele('cac:LegalMonetaryTotal');
        monetaryTotal.ele('cbc:LineExtensionAmount', { currencyID: fatura.currency }).txt(fatura.subTotal.amount.toFixed(2)).up();
        monetaryTotal.ele('cbc:TaxExclusiveAmount', { currencyID: fatura.currency }).txt(fatura.subTotal.amount.toFixed(2)).up();
        monetaryTotal.ele('cbc:TaxInclusiveAmount', { currencyID: fatura.currency }).txt(fatura.grandTotal.amount.toFixed(2)).up();
        monetaryTotal.ele('cbc:AllowanceTotalAmount', { currencyID: fatura.currency }).txt('0.00').up();
        monetaryTotal.ele('cbc:PayableAmount', { currencyID: fatura.currency }).txt(fatura.grandTotal.amount.toFixed(2)).up();
        monetaryTotal.up();

        // 11. Invoice Lines
        fatura.lines.forEach((line, index) => {
            const invoiceLine = doc.ele('cac:InvoiceLine');
            invoiceLine.ele('cbc:ID').txt((index + 1).toString()).up();
            invoiceLine.ele('cbc:InvoicedQuantity', { unitCode: 'NIU' }).txt(line.quantity.toString()).up();
            invoiceLine.ele('cbc:LineExtensionAmount', { currencyID: fatura.currency }).txt((line.unitPrice.amount * line.quantity).toFixed(2)).up();

            // Tax
            const lineVals = UBLGenerator.calculateLineTax(line, fatura.currency);

            const lineTaxTotal = invoiceLine.ele('cac:TaxTotal');
            lineTaxTotal.ele('cbc:TaxAmount', { currencyID: fatura.currency }).txt(lineVals.taxAmount.toFixed(2)).up();
            const lineTaxSubtotal = lineTaxTotal.ele('cac:TaxSubtotal');
            lineTaxSubtotal.ele('cbc:TaxableAmount', { currencyID: fatura.currency }).txt(lineVals.taxableAmount.toFixed(2)).up();
            lineTaxSubtotal.ele('cbc:TaxAmount', { currencyID: fatura.currency }).txt(lineVals.taxAmount.toFixed(2)).up();
            lineTaxSubtotal.ele('cbc:Percent').txt(line.taxRate.toString()).up();
            lineTaxSubtotal.ele('cac:TaxCategory')
                .ele('cac:TaxScheme')
                .ele('cbc:Name').txt('KDV').up()
                .ele('cbc:TaxTypeCode').txt('0015').up()
                .up().up().up();
            lineTaxTotal.up();

            // Item
            invoiceLine.ele('cac:Item')
                .ele('cbc:Name').txt(line.description).up()
                .up();

            // Price
            invoiceLine.ele('cac:Price')
                .ele('cbc:PriceAmount', { currencyID: fatura.currency }).txt(line.unitPrice.amount.toFixed(2)).up()
                .up();

            invoiceLine.up();
        });

        return doc.end({ prettyPrint: true });
    }

    private static calculateLineTax(line: any, currency: string) {
        const taxableAmount = line.unitPrice.amount * line.quantity;
        const taxAmount = (taxableAmount * line.taxRate) / 100;
        return { taxableAmount, taxAmount };
    }

    private static addParty(partyNode: any, party: CariBilgileri) {
        // Party Identification
        partyNode.ele('cac:PartyIdentification')
            .ele('cbc:ID', { schemeID: party.taxNumber.length === 11 ? 'TCKN' : 'VKN' }).txt(party.taxNumber).up()
            .up();

        // Party Name
        partyNode.ele('cac:PartyName')
            .ele('cbc:Name').txt(party.name).up()
            .up();

        // Postal Address
        const address = partyNode.ele('cac:PostalAddress');
        address.ele('cbc:CitySubdivisionName').txt(party.city || 'Merkez').up();
        address.ele('cbc:CityName').txt(party.city || 'Istanbul').up();
        address.ele('cac:Country')
            .ele('cbc:Name').txt(party.country || 'Türkiye').up()
            .up();
        address.up();

        // Tax Scheme (Vergi Dairesi)
        if (party.taxNumber.length === 10) {
            partyNode.ele('cac:PartyTaxScheme')
                .ele('cac:TaxScheme')
                .ele('cbc:Name').txt('VERGI_DAIRESI').up()
                .up()
                .up();
        }

        // Contact
        if (party.email || party.phone) {
            const contact = partyNode.ele('cac:Contact');
            if (party.phone) contact.ele('cbc:Telephone').txt(party.phone).up();
            if (party.email) contact.ele('cbc:ElectronicMail').txt(party.email).up();
            contact.up();
        }
    }
}
