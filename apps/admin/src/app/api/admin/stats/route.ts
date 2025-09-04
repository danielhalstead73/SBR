import { NextRequest, NextResponse } from 'next/server'
import { auth, authorize } from '@sbr/auth'
import { dataService } from '@sbr/database'

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

    // Fetch system statistics using consistent data service
    const stats = await dataService.getDashboardStats()

    return NextResponse.json({
      success: true,
      totalUsers: stats.totalUsers,
      totalOrganizations: stats.totalOrganizations,
      totalGames: stats.totalGames,
      totalSessions: stats.totalSessions,
      recentUsers: stats.recentUsers,
      recentActivity: stats.recentActivity,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
