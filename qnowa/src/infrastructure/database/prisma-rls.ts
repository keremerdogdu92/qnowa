
import { PrismaClient } from '@prisma/client';

export function sectionRLS(prisma: PrismaClient, userId: string, orgId?: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          return prisma.$transaction(async (tx) => {
            try {
              // Validations can go here
              await tx.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, TRUE)`;
              if (orgId) {
                await tx.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, TRUE)`;
              }
              return await query(args);
            } finally {
              // Optional: Clear config? Usually transaction isolation handles it.
              // But strictly speaking, local params are transaction scoped if using SET LOCAL (which set_config with true is).
            }
          });
        },
      },
    },
  });
}
