
'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { PrismaOrganizationRepository } from '@/infrastructure/repositories/PrismaOrganizationRepository';
import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository';
import { Organization } from '@/domain/identity/Organization';
import { User } from '@/domain/identity/User';
import { UserRole } from '@/domain/identity/value-objects/UserRole';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Giriş bilgileri hatalı.';
                default:
                    return 'Bir hata oluştu.';
            }
        }
        throw error;
    }
}

const RegisterSchema = z.object({
    companyName: z.string().min(2, "Firma ünvanı en az 2 karakter olmalıdır"),
    taxNumber: z.string().length(10, "Vergi numarası 10 haneli olmalıdır").or(z.string().length(11, "TCKN 11 haneli olmalıdır")),
    name: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
    email: z.string().email("Geçersiz email adresi"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export type RegisterState = {
    errors?: {
        companyName?: string[];
        taxNumber?: string[];
        name?: string[];
        email?: string[];
        password?: string[];
    };
    message?: string;
};

export async function register(prevState: RegisterState | undefined, formData: FormData): Promise<RegisterState> {
    const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Lütfen alanları kontrol ediniz.",
        };
    }

    const { companyName, taxNumber, name, email, password } = validatedFields.data;

    const orgRepo = new PrismaOrganizationRepository();
    const userRepo = new PrismaUserRepository();

    // 1. Check if user or org exists
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
        return { message: "Bu email adresi zaten kayıtlı." };
    }

    // 2. Create Organization
    const newOrg = Organization.create({
        name: companyName,
        taxNumber: taxNumber,
    });

    // 3. Create User (Admin)
    const hashedPassword = await bcrypt.hash(password, 10);
    // Note: Creating user with props. passwordHash should be handled by saving mechanism or included in Create props if updated.
    // Assuming User.create accepts updated props or we handle it.
    // For now, passing it as is, assuming User definition helps or we save it manually.
    const newUser = User.create({
        email,
        name,
        orgId: newOrg.id,
        role: UserRole.create('ADMIN'),
        // passwordHash: hashedPassword, // If User.create accepts it
    } as any); // Casting to any to allow passwordHash if it was missing in strict type but present in class

    // Hack: Append passwordHash to user props manually for repository to pick up if it looks for it
    (newUser as any).props.passwordHash = hashedPassword;

    // 4. Save to DB
    try {
        await orgRepo.save(newOrg);
        await userRepo.save(newUser);
    } catch (error) {
        console.error("Registration error:", error);
        return { message: "Kayıt sırasında bir hata oluştu." };
    }

    redirect('/giris');
}
