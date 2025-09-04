import { NextRequest, NextResponse } from 'next/server'
import { dataService } from '@sbr/database'

export async function GET() {
  try {
    // Get dashboard stats using consistent data service
    const stats = await dataService.getDashboardStats()
    
    return NextResponse.json({
      totalGames: stats.totalGames,
      totalSessions: stats.totalSessions,
      totalPlayers: stats.totalUsers, // Use totalUsers as totalPlayers
      recentActivity: stats.recentActivity
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}