import { create } from 'xmlbuilder2';

export class SoapClient {
    private endpoint: string;
    private username?: string;
    private password?: string;

    constructor(endpoint: string, username?: string, password?: string) {
        this.endpoint = endpoint;
        this.username = username;
        this.password = password;
    }

    async call(action: string, bodyXml: any): Promise<any> {
        console.log(`[SoapClient] Calling ${action} on ${this.endpoint}`);

        const envelope = create({ version: '1.0', encoding: 'UTF-8' })
            .ele('soapenv:Envelope', {
                'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
                'xmlns:ser': 'http://service.connector.cs.com.tr/' // Namespace from WSDL
            })
            .ele('soapenv:Header');

        // Add WS-Security if credentials exist
        if (this.username && this.password) {
            envelope.ele('wsse:Security', {
                'xmlns:wsse': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
                'xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd'
            })
                .ele('wsse:UsernameToken', { 'wsu:Id': 'UsernameToken-1' })
                .ele('wsse:Username').txt(this.username).up()
                .ele('wsse:Password', {
                    'Type': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText'
                }).txt(this.password).up()
                .up()
                .up();
        }

        // Add Body
        const body = envelope.up().ele('soapenv:Body');

        // Convert input body object/xml to string if it's not already
        // For simplicity, we assume bodyXml is a builder object or we reconstruct it
        // But xmlbuilder2 can import objects. 
        // Let's assume bodyXml is an object representing the method call
        body.ele(bodyXml);

        const xmlString = envelope.end({ prettyPrint: true });

        console.log("[SoapClient] Request XML:", xmlString);

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/xml;charset=UTF-8',
                    'SOAPAction': action // Start with empty or specific action if needed
                },
                body: xmlString
            });

            const responseText = await response.text();
            console.log("[SoapClient] Response:", responseText);

            if (!response.ok) {
                throw new Error(`SOAP Call Failed: ${response.status} ${response.statusText} - ${responseText}`);
            }

            return responseText; // For now return raw text, we can parse later
        } catch (error) {
            console.error("[SoapClient] Error:", error);
            throw error;
        }
    }
}
