import { NextRequest, NextResponse } from 'next/server'
import { userService } from '@sbr/database'

export async function GET(request: NextRequest) {
  try {
    const users = await userService.getAllUsers()
    
    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt
      }))
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

