import { NextRequest, NextResponse } from 'next/server'
import { auth, authorize } from '@sbr/auth'

// Mock sync history data - in a real implementation, you'd store this in the database
const mockSyncHistory = [
  {
    id: '1',
    type: 'full',
    status: 'completed',
    gamesProcessed: 1250,
    gamesAdded: 45,
    gamesUpdated: 1205,
    startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    duration: 30 * 60 * 1000, // 30 minutes
  },
  {
    id: '2',
    type: 'single',
    status: 'completed',
    gamesProcessed: 1,
    gamesAdded: 1,
    gamesUpdated: 0,
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 1000).toISOString(),
    duration: 5 * 1000, // 5 seconds
  },
  {
    id: '3',
    type: 'full',
    status: 'failed',
    gamesProcessed: 500,
    gamesAdded: 0,
    gamesUpdated: 0,
    startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    duration: null,
    error: 'BGG API rate limit exceeded',
  },
]

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

    // In a real implementation, you'd fetch this from the database
    // For now, we'll return mock data
    return NextResponse.json({
      success: true,
      history: mockSyncHistory,
    })

  } catch (error) {
    console.error('Error fetching sync history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sync history' },
      { status: 500 }
    )
  }
}
