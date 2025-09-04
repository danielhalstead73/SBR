import { NextRequest, NextResponse } from 'next/server'
import { auth, authorize } from '@sbr/auth'
import { userService, organizationService, gameService } from '@sbr/database'

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

    // Fetch system statistics
    const [users, organizations, games] = await Promise.all([
      userService.getAllUsers(),
      organizationService.getAllOrganizations(),
      gameService.getAllGames(),
    ])

    // Get recent users (last 5)
    const recentUsers = users
      .slice(0, 5)
      .map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        createdAt: user.createdAt.toLocaleDateString(),
      }))

    // Mock recent activity (you can implement this based on your needs)
    const recentActivity = [
      {
        id: '1',
        type: 'User Registration',
        description: 'New user registered',
        date: new Date().toLocaleDateString(),
      },
      {
        id: '2',
        type: 'Organization Created',
        description: 'New organization added',
        date: new Date().toLocaleDateString(),
      },
    ]

    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      totalOrganizations: organizations.length,
      totalGames: games.length,
      totalSessions: 0, // You can implement this when you have game sessions
      recentUsers,
      recentActivity,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
