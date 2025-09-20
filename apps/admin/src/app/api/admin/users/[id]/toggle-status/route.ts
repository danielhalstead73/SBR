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

    // Toggle the isActive status
    const newActiveStatus = !userData.isActive
    const updatedUser = await userService.updateUser(userId, { isActive: newActiveStatus })
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to update user' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `User ${newActiveStatus ? 'activated' : 'deactivated'} successfully`,
      isActive: newActiveStatus
    })
  } catch (error) {
    console.error('Error toggling user status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to toggle user status' },
      { status: 500 }
    )
  }
}
