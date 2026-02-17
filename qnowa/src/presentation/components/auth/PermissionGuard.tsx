
import { auth } from '@/auth';
import { ReactNode } from 'react';

interface PermissionGuardProps {
    permission: string;
    children: ReactNode;
    fallback?: ReactNode;
}

export async function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
    const session = await auth();
    const userPermissions = (session?.user as any)?.permissions || [];

    if (userPermissions.includes(permission)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
