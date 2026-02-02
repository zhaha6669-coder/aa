const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
    const prisma = new PrismaClient();
    
    try {
        // Find the user
        const user = await prisma.user.findUnique({
            where: { email: 'admin@lumina.agency' }
        });
        
        if (!user) {
            console.log('❌ User not found!');
            return;
        }
        
        console.log('User found:');
        console.log('  ID:', user.id);
        console.log('  Email:', user.email);
        console.log('  Name:', user.name);
        console.log('  Role:', user.role);
        console.log('  isActive:', user.isActive);
        console.log('  Has password:', !!user.password);
        
        // Test password
        const testPassword = 'admin123456';
        const isValid = await bcrypt.compare(testPassword, user.password);
        console.log('\n🔐 Password test for "admin123456":', isValid ? '✅ Valid' : '❌ Invalid');
        
        if (!isValid) {
            // Reset password
            console.log('\n🔄 Resetting password...');
            const newHash = await bcrypt.hash(testPassword, 12);
            await prisma.user.update({
                where: { email: 'admin@lumina.agency' },
                data: { password: newHash, isActive: true }
            });
            console.log('✅ Password reset successfully!');
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
