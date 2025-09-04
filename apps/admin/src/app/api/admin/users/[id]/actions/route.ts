import { NextRequest, NextResponse } from 'next/server'
import { auth, authorize } from '@sbr/auth'
import { userService } from '@sbr/database'
import { revalidatePath } from 'next/cache'

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
    const { action, data } = body

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      )
    }

    // Prevent admin from performing actions on themselves
    if (userId === user.id && ['delete', 'lock'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Cannot perform this action on your own account' },
        { status: 400 }
      )
    }

    const targetUser = await userService.findUserById(userId)
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    let result: any = null

    switch (action) {
      case 'view':
        result = {
          id: targetUser.id,
          email: targetUser.email,
          firstName: targetUser.firstName,
          lastName: targetUser.lastName,
          role: targetUser.role,
          isEmailVerified: targetUser.emailVerified,
          isActive: true, // Default to true since we don't have isActive field
          createdAt: targetUser.createdAt.toISOString(),
          lastLoginAt: null, // We don't have lastLoginAt field
          organization: targetUser.organization,
        }
        break

      case 'edit':
        if (!data) {
          return NextResponse.json(
            { success: false, error: 'Data is required for edit action' },
            { status: 400 }
          )
        }
        result = await userService.updateUser(userId, {
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
        })
        break

      case 'reset_password':
        if (!data?.newPassword) {
          return NextResponse.json(
            { success: false, error: 'New password is required' },
            { status: 400 }
          )
        }
        if (data.newPassword.length < 6) {
          return NextResponse.json(
            { success: false, error: 'Password must be at least 6 characters' },
            { status: 400 }
          )
        }
        result = await userService.updateUserPassword(userId, data.newPassword)
        break

      case 'lock':
        // Since we don't have an isActive field, we'll implement this as a role-based lock
        // Locked users will have role set to 'locked'
        result = await userService.updateUser(userId, { role: 'locked' })
        break

      case 'unlock':
        // Unlock by setting role back to 'end_user'
        result = await userService.updateUser(userId, { role: 'end_user' })
        break

      case 'delete':
        // Delete user with transaction for related records
        await userService.deleteUser(userId)
        result = { message: 'User deleted successfully' }
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Revalidate the users page to refresh the data
    revalidatePath('/users')

    return NextResponse.json({
      success: true,
      message: `User ${action} completed successfully`,
      data: result,
    })
  } catch (error) {
    console.error(`Error performing user action:`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to perform user action' },
      { status: 500 }
    )
  }
}
