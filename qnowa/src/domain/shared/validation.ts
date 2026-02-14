import { z } from 'zod';

export const TaxNumberSchema = z.string().refine((val) => {
    // Basic length check: 10 (VKN) or 11 (TCKN)
    if (val.length !== 10 && val.length !== 11) return false;

    // Numeric check
    if (!/^\d+$/.test(val)) return false;

    // Optional: Checksum algorithm implementation
    // For MVP, length and numeric is a good start. 
    // Implementing full VKN/TCKN checksum is complex and might reject valid mock data if not careful.
    return true;
}, {
    message: "Vergi No 10 hane (VKN) veya 11 hane (TCKN) olmalıdır."
});
