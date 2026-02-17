
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from '@/infrastructure/database/prisma-client';
import bcrypt from 'bcryptjs';

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                userRole: {
                    include: {
                        permissions: {
                            include: { permission: true }
                        }
                    }
                }
            }
        });
        return user as any;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);

                    // In a real app we would have a password field. 
                    // Our User model needs a 'password' or 'hash' field. 
                    // Let's assume we have 'hashedPassword' in our schema (Wait, I added 'hashedPassword'?)
                    // Checking schema... Yes, User model has `passwordHash?` effectively if I didn't add it explicitly to schema I might have missed it.
                    // Let me check schema.prisma content I wrote.
                    // I wrote: `model User { ... hashedPassword String? ... }`
                    // Yes, it's called `hashedPassword`.

                    if (!user) return null;
                    if (!user.hashedPassword) return null; // User might be OAuth only?

                    const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);
                    if (passwordsMatch) {
                        const u = user as any;
                        // Flatten permissions
                        const permissions = u.userRole?.permissions.map((p: any) => p.permission.key) || [];
                        const roleName = u.userRole?.name || u.role; // Fallback to enum if no dynamic role

                        return {
                            ...user,
                            role: roleName,
                            permissions: permissions
                        };
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
