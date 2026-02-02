const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
    const prisma = new PrismaClient();
    
    try {
        const hash = await bcrypt.hash('admin123456', 12);
        
        const user = await prisma.user.upsert({
            where: { email: 'admin@lumina.agency' },
            update: { password: hash },
            create: {
                email: 'admin@lumina.agency',
                name: 'Admin',
                password: hash,
                role: 'admin'
            }
        });
        
        console.log('✅ Admin user created/updated successfully!');
        console.log('📧 Email: admin@lumina.agency');
        console.log('🔑 Password: admin123456');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
