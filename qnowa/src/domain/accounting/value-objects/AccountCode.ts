
import { ValueObject } from '../../core/ValueObject';

interface AccountCodeProps {
    value: string;
}

export class AccountCode extends ValueObject<AccountCodeProps> {
    private constructor(props: AccountCodeProps) {
        super(props);
    }

    public static create(code: string): AccountCode {
        if (!this.isValid(code)) {
            throw new Error('Invalid account code format. Expected format: 100, 100.01, etc.');
        }
        return new AccountCode({ value: code });
    }

    public get value(): string {
        return this.props.value;
    }

    private static isValid(code: string): boolean {
        // Basic regex for TDHP: 3 digits, optionally followed by dots and more digits
        // e.g., 100, 100.01, 120.01.001
        const regex = /^\d{3}(\.\d+)*$/;
        return regex.test(code);
    }

    public getParentCode(): string | null {
        if (!this.value.includes('.')) {
            return null;
        }
        const parts = this.value.split('.');
        parts.pop();
        return parts.join('.');
    }
}
