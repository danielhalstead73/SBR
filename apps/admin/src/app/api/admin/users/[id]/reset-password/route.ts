import { NextRequest, NextResponse } from 'next/server'
import { auth, authorize } from '@sbr/auth'
import { userService } from '@sbr/database'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const sessionToken = request.cookies.get('sbr-session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await auth.getUserByToken(sessionToken)

    if (!user || !authorize.isAdmin(user)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const userId = id
    const body = await request.json()
    const { newPassword } = body

    if (!newPassword) {
      return NextResponse.json(
        { success: false, error: 'New password is required' },
        { status: 400 }
      )
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const updatedUser = await userService.updateUserPassword(userId, newPassword)
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}
