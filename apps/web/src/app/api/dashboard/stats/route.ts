import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@sbr/auth'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sbr-session')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await auth.getUserByToken(sessionToken)
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Return mock stats for now - these can be made dynamic later
    const stats = {
      totalGames: 12,
      totalSessions: 34,
      totalPlayers: 8,
      recentActivity: [
        {
          id: '1',
          type: 'Game Session',
          description: 'Played Catan with 4 players',
          date: '2 days ago'
        },
        {
          id: '2',
          type: 'New Game',
          description: 'Added Wingspan to collection',
          date: '1 week ago'
        }
      ]
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
