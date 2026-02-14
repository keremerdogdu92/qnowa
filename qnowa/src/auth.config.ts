
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/giris',
        newUser: '/kayit',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // Redirect to dashboard if logged in and trying to access login page
                if (nextUrl.pathname === '/giris' || nextUrl.pathname === '/kayit') {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
                return true;
            }
            return true;
        },
        session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                (session.user as any).orgId = token.orgId;
                (session.user as any).role = token.role;
            }
            return session;
        },
        jwt({ token, user, trigger, session }) {
            if (user) {
                token.orgId = (user as any).orgId;
                token.role = (user as any).role;
            }
            if (trigger === "update" && session) {
                return { ...token, ...session.user };
            }
            return token;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
