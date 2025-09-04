import { NextRequest, NextResponse } from 'next/server'
import { auth, authorize } from '@sbr/auth'
import { userService } from '@sbr/database'

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

    if (!user || !authorize.isAdmin(user)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const users = await userService.getAllUsers()

    const stats = {
      totalUsers: users.length,
      activeUsers: users.length, // All users are active by default
      verifiedUsers: users.filter(u => u.emailVerified).length,
      superAdmins: users.filter(u => u.role === 'super_admin').length,
      venueAdmins: users.filter(u => u.role === 'venue_admin').length,
      endUsers: users.filter(u => u.role === 'end_user').length,
      recentRegistrations: users
        .filter(u => {
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return u.createdAt > thirtyDaysAgo
        })
        .length,
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user stats' },
      { status: 500 }
    )
  }
}
