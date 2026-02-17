
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@qnowa.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            hashedPassword: hashedPassword,
            role: 'ADMIN' // Ensure role is admin
        },
        create: {
            email,
            name: 'Admin User',
            hashedPassword: hashedPassword,
            role: 'ADMIN',
            // Create a default organization for them if needed, or assume they will be linked later.
            // But User model implies optional orgId. 
            // Let's create an Organization too to ensure they have one for the app to work (Dashboard usually requires Org).
            organization: {
                create: {
                    name: 'Qnowa HQ',
                    taxNumber: '1111111111'
                }
            }
        }
    });

    console.log(`User ${user.email} created/updated with password: ${password}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
