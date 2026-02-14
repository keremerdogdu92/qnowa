
import { ValueObject } from '../../core/ValueObject';

interface VergiNumarasiProps {
    value: string;
}

export class VergiNumarasi extends ValueObject<VergiNumarasiProps> {
    private constructor(props: VergiNumarasiProps) {
        super(props);
    }

    public static create(value: string): VergiNumarasi {
        if (!this.validate(value)) {
            throw new Error('Geçersiz vergi numarası');
        }
        return new VergiNumarasi({ value });
    }

    get value(): string {
        return this.props.value;
    }

    private static validate(vkn: string): boolean {
        if (!vkn || (vkn.length !== 10 && vkn.length !== 11)) {
            return false;
        }
        if (!/^\d+$/.test(vkn)) {
            return false;
        }
        // Algorithmic validation can be added here
        return true;
    }
}
