import { prisma } from './client'
import bcrypt from 'bcryptjs'

async function createAdminUser() {
  try {
    // Check if admin user exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'admin@shakebattleroll.com' },
          { role: 'super_admin' }
        ]
      }
    })

    if (existingAdmin) {
      console.log('Admin user already exists:')
      console.log(`- Email: ${existingAdmin.email}`)
      console.log(`- Role: ${existingAdmin.role}`)
      console.log(`- Email Verified: ${existingAdmin.emailVerified}`)
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Whagmi120373!', 12)
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@shakebattleroll.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'super_admin',
        emailVerified: true,
        emailVerifyToken: null,
      }
    })

    console.log('Admin user created successfully:')
    console.log(`- ID: ${adminUser.id}`)
    console.log(`- Email: ${adminUser.email}`)
    console.log(`- Role: ${adminUser.role}`)
    console.log(`- Email Verified: ${adminUser.emailVerified}`)
    
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()

