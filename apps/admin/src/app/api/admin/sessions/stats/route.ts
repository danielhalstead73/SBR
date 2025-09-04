import { NextRequest, NextResponse } from 'next/server'
import { auth, authorize } from '@sbr/auth'
import { eventService } from '@sbr/database'

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

    const events = await eventService.getAllEvents()

    const stats = {
      totalSessions: events.length,
      upcomingSessions: events.filter(e => e.startTime > new Date()).length,
      pastSessions: events.filter(e => e.startTime < new Date()).length,
      publicSessions: events.filter(e => e.type === 'PUBLIC').length,
      privateSessions: events.filter(e => e.type === 'PRIVATE').length,
      competitionSessions: events.filter(e => e.type === 'COMPETITION').length,
      averageAttendees: events.length > 0 
        ? events.reduce((sum, event) => {
            const attendees = event.attendees?.filter(a => a.status === 'ATTENDING').length || 0
            return sum + attendees
          }, 0) / events.length 
        : 0,
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error('Error fetching session stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch session stats' },
      { status: 500 }
    )
  }
}
