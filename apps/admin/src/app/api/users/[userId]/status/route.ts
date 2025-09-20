import { NextRequest, NextResponse } from 'next/server'
import { auth, authorize } from '@sbr/auth'
import { userService, sessionService } from '@sbr/database'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const sessionToken = request.cookies.get('sbr-session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const adminUser = await auth.getUserByToken(sessionToken)

    if (!adminUser || !authorize.isAdmin(adminUser)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status, reason } = body

    if (!status || !['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be ACTIVE, INACTIVE, SUSPENDED, or PENDING_VERIFICATION' },
        { status: 400 }
      )
    }

    // Get current user data
    const currentUser = await userService.findUserById(userId)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent self-deactivation
    if (userId === adminUser.id && status === 'INACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Cannot deactivate your own account' },
        { status: 400 }
      )
    }

    const oldStatus = currentUser.status
    const isActive = status === 'ACTIVE'
    const now = new Date()

    // Prepare update data
    const updateData: any = {
      status,
      isActive,
    }

    // Set timestamps based on status change
    if (status === 'INACTIVE' && oldStatus !== 'INACTIVE') {
      updateData.deactivatedAt = now
      updateData.deactivatedBy = adminUser.id
      updateData.reactivatedAt = null
    } else if (status === 'ACTIVE' && oldStatus !== 'ACTIVE') {
      updateData.reactivatedAt = now
      updateData.deactivatedAt = null
      updateData.deactivatedBy = null
    }

    // Update user status
    const updatedUser = await userService.updateUser(userId, updateData)

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to update user status' },
        { status: 500 }
      )
    }

    // Create status log entry
    await userService.createStatusLog({
      userId,
      oldStatus,
      newStatus: status,
      changedBy: adminUser.id,
      reason,
    })

    // If user is being deactivated, invalidate all their sessions
    if (status === 'INACTIVE') {
      try {
        await sessionService.deleteAllUserSessions(userId)
      } catch (error) {
        console.error('Error invalidating user sessions:', error)
        // Don't fail the request if session invalidation fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `User ${status === 'ACTIVE' ? 'activated' : status === 'INACTIVE' ? 'deactivated' : 'status updated'} successfully`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        status: updatedUser.status,
        isActive: updatedUser.isActive,
        deactivatedAt: updatedUser.deactivatedAt,
        reactivatedAt: updatedUser.reactivatedAt,
        updatedAt: updatedUser.updatedAt,
      },
    })

  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user status' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const sessionToken = request.cookies.get('sbr-session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const adminUser = await auth.getUserByToken(sessionToken)

    if (!adminUser || !authorize.isAdmin(adminUser)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get user status logs
    const statusLogs = await userService.getUserStatusLogs(userId)

    return NextResponse.json({
      success: true,
      statusLogs,
    })

  } catch (error) {
    console.error('Error fetching user status logs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch status logs' },
      { status: 500 }
    )
  }
}
