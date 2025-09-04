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

    const formattedSessions = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      type: event.type,
      status: event.status,
      startTime: event.startTime.toISOString(),
      endTime: event.endTime?.toISOString() || null,
      maxCapacity: event.maxCapacity,
      currentAttendees: event.attendees?.filter(a => a.status === 'ATTENDING').length || 0,
      organization: event.organization ? {
        id: event.organization.id,
        name: event.organization.name,
      } : null,
      venue: event.venue ? {
        id: event.venue.id,
        name: event.venue.name,
        address: event.venue.address,
      } : null,
      createdAt: event.createdAt.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      sessions: formattedSessions,
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}
