import { NextRequest, NextResponse } from 'next/server'
import { userService } from '@sbr/database'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Check if admin user already exists
    const existingAdmin = await userService.findUserByEmail('admin@shakebattleroll.com')
    
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists',
        user: {
          id: existingAdmin.id,
          email: existingAdmin.email,
          role: existingAdmin.role,
          emailVerified: existingAdmin.emailVerified
        }
      })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Whagmi120373!', 12)
    
    const adminUser = await userService.createUser({
      email: 'admin@shakebattleroll.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'super_admin'
    })

    // Verify the email immediately
    await userService.verifyEmail(adminUser.emailVerifyToken!)

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        emailVerified: true
      }
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create admin user' },
      { status: 500 }
    )
  }
}

