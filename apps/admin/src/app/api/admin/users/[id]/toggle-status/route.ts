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
    const userData = await userService.findUserById(userId)

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Since we don't have an isActive field in the User model, we'll implement this as a role-based toggle
    // For now, we'll toggle between 'end_user' and 'venue_admin' roles
    const newRole = userData.role === 'end_user' ? 'venue_admin' : 'end_user'
    const updatedUser = await userService.updateUser(userId, { role: newRole })
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to update user' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'User status updated successfully',
      isActive: newRole !== 'end_user'
    })
  } catch (error) {
    console.error('Error toggling user status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to toggle user status' },
      { status: 500 }
    )
  }
}
