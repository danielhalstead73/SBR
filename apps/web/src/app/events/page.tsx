'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Calendar, MapPin, Users, Clock } from 'lucide-react'

interface Event {
  id: string
  title: string
  description?: string
  type: string
  startTime: string
  endTime?: string
  maxCapacity: number
  organization: {
    id: string
    name: string
    logo?: string
  }
  venue?: {
    name: string
    address: string
    city?: string
    state?: string
  }
  attendees: { id: string }[]
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organization.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || event.type === filterType
    return matchesSearch && matchesType
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'PUBLIC':
        return 'bg-green-100 text-green-800'
      case 'PRIVATE':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPETITION':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Events
          </h1>
          <p className="text-gray-600">
            Find board game events, tournaments, and meetups near you
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Event Types</option>
                <option value="PUBLIC">Public Events</option>
                <option value="PRIVATE">Private Events</option>
                <option value="COMPETITION">Competitions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {event.attendees.length}/{event.maxCapacity}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>

                {event.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                )}

                <div className="flex items-center mb-3">
                  {event.organization.logo ? (
                    <img
                      src={event.organization.logo}
                      alt={event.organization.name}
                      className="w-6 h-6 rounded mr-2"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">
                      <Users className="h-3 w-3 text-blue-600" />
                    </div>
                  )}
                  <span className="text-sm text-gray-600">
                    {event.organization.name}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(event.startTime)}
                  </div>
                  
                  {event.endTime && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </div>
                  )}

                  {event.venue && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="truncate">
                        {event.venue.name}
                        {event.venue.city && `, ${event.venue.city}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
