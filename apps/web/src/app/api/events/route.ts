import { NextResponse } from 'next/server'
import { eventService } from '@sbr/database'

export async function GET() {
  try {
    const events = await eventService.getAllEvents()
    
    return NextResponse.json({
      success: true,
      events: events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        type: event.type,
        startTime: event.startTime,
        endTime: event.endTime,
        maxCapacity: event.maxCapacity,
        isRecurring: event.isRecurring,
        recurrenceRule: event.recurrenceRule,
        status: event.status,
        organization: event.organization ? {
          id: event.organization.id,
          name: event.organization.name,
          logo: event.organization.logo,
        } : null,
        venue: event.venue ? {
          id: event.venue.id,
          name: event.venue.name,
          address: event.venue.address,
          city: event.venue.city,
          state: event.venue.state,
        } : null,
        attendees: event.attendees,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      }))
    })
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
