import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@sbr/auth'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sbr-session')?.value
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await auth.getUserByToken(sessionToken)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}
