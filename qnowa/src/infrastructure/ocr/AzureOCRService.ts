'use server';

import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import { OCRService, ExtractedData } from "@/domain/ocr/OCRInterfaces";

const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT;
const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY;

export async function parseInvoiceWithAzure(fileBase64: string): Promise<ExtractedData> {
    if (!endpoint || !key) {
        throw new Error("Azure credentials not configured");
    }

    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

    // Convert base64 to buffer
    const buffer = Buffer.from(fileBase64, 'base64');

    // Use the pre-built invoice model
    const poller = await client.beginAnalyzeDocument("prebuilt-invoice", buffer);
    const { documents } = await poller.pollUntilDone();

    if (!documents || documents.length === 0) {
        throw new Error("No document analyzed");
    }

    const doc = documents[0];
    const fields = doc.fields;

    // Helper to get field value safely
    const getValue = (fieldName: string) => {
        return fields[fieldName]?.content;
    };

    const getAmount = (fieldName: string) => {
        const field = fields[fieldName];
        if (field?.kind === 'currency') {
            return field.value?.amount;
        }
        return undefined;
    }

    const getDate = (fieldName: string) => {
        const field = fields[fieldName];
        if (field?.kind === 'date') {
            return field.value;
        }
        return undefined;
    }

    // Extract Lines
    const lines = fields.Items?.values?.map((item: any) => {
        const props = item.properties;
        return {
            description: props.Description?.content || '',
            quantity: props.Quantity?.value || 1,
            unitPrice: props.UnitPrice?.value?.amount || 0,
            total: props.Amount?.value?.amount || 0,
            taxRate: 0 // Azure sometimes extracts this as TaxRate, check properties if needed
        };
    }) || [];

    return {
        senderName: getValue("VendorName"),
        invoiceNo: getValue("InvoiceId"),
        date: getDate("InvoiceDate"),
        totalAmount: getAmount("InvoiceTotal"),
        taxAmount: getAmount("TotalTax"),
        currency: fields.InvoiceTotal?.value?.currencySymbol || "TRY",
        lines: lines,
        confidence: 1.0, // Azure doesn't give a single confidence score, but per field. Simplifying.
        source: 'azure'
    };
}
