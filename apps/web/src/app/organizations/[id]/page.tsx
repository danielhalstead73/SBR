'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Users, Calendar, Globe, Phone, Mail, Heart, HeartOff } from 'lucide-react'

interface Organization {
  id: string
  name: string
  description?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phone?: string
  email?: string
  website?: string
  logo?: string
  bannerImage?: string
  socialLinks?: string
  contactInfo?: string
  latitude?: number
  longitude?: number
  followers: { id: string; user: { id: string; firstName: string; lastName: string } }[]
  events: {
    id: string
    title: string
    description?: string
    type: string
    startTime: string
    endTime?: string
    maxCapacity: number
    venue?: { name: string; address: string }
    attendees: { id: string }[]
  }[]
}

export default function OrganizationProfilePage() {
  const params = useParams()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchOrganization(params.id as string)
      checkFollowStatus(params.id as string)
    }
  }, [params.id])

  const fetchOrganization = async (id: string) => {
    try {
      const response = await fetch(`/api/organizations/${id}`)
      if (response.ok) {
        const data = await response.json()
        setOrganization(data.organization)
        setFollowersCount(data.organization.followers.length)
      }
    } catch (error) {
      console.error('Failed to fetch organization:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkFollowStatus = async (organizationId: string) => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}/follow-status`)
      if (response.ok) {
        const data = await response.json()
        setIsFollowing(data.isFollowing)
      }
    } catch (error) {
      console.error('Failed to check follow status:', error)
    }
  }

  const toggleFollow = async () => {
    if (!organization) return

    try {
      const response = await fetch(`/api/organizations/${organization.id}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setIsFollowing(!isFollowing)
        setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1)
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Organization not found
            </h1>
            <Link
              href="/organizations"
              className="text-blue-600 hover:text-blue-800"
            >
              Back to organizations
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          {organization.bannerImage && (
            <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${organization.bannerImage})` }} />
          )}
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {organization.logo ? (
                  <img
                    src={organization.logo}
                    alt={organization.name}
                    className="w-16 h-16 rounded-lg object-cover mr-6"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-6">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {organization.name}
                  </h1>
                  {organization.city && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {organization.city}{organization.state && `, ${organization.state}`}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={toggleFollow}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFollowing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? (
                  <>
                    <HeartOff className="h-4 w-4 mr-2" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Follow
                  </>
                )}
              </button>
            </div>

            {organization.description && (
              <p className="text-gray-600 mt-4">{organization.description}</p>
            )}

            {/* Contact Info */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
              {organization.website && (
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-blue-600"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Website
                </a>
              )}
              {organization.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {organization.phone}
                </div>
              )}
              {organization.email && (
                <a
                  href={`mailto:${organization.email}`}
                  className="flex items-center hover:text-blue-600"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {organization.email}
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {followersCount} followers
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {organization.events.length} events
              </div>
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
          {organization.events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organization.events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.type === 'PUBLIC' ? 'bg-green-100 text-green-800' :
                        event.type === 'PRIVATE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {event.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {event.attendees.length}/{event.maxCapacity}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    <div className="text-sm text-gray-500">
                      <div className="mb-1">{formatDate(event.startTime)}</div>
                      {event.venue && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.venue.name}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events scheduled
              </h3>
              <p className="text-gray-500">
                This organization hasn't scheduled any events yet.
              </p>
            </div>
          )}
        </div>

        {/* Followers */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Followers</h2>
          {organization.followers.length > 0 ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {organization.followers.map((follower) => (
                    <div key={follower.id} className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {follower.user.firstName} {follower.user.lastName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No followers yet
              </h3>
              <p className="text-gray-500">
                Be the first to follow this organization!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
