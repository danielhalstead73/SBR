'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, Users, Calendar } from 'lucide-react'

interface Organization {
  id: string
  name: string
  description?: string
  city?: string
  state?: string
  logo?: string
  followers: { id: string }[]
  events: { id: string }[]
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCity, setFilterCity] = useState('')

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organizations')
      if (response.ok) {
        const data = await response.json()
        setOrganizations(data.organizations)
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCity = !filterCity || org.city?.toLowerCase().includes(filterCity.toLowerCase())
    return matchesSearch && matchesCity
  })

  const cities = [...new Set(organizations.map(org => org.city).filter(Boolean))]

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
            Discover Organizations
          </h1>
          <p className="text-gray-600">
            Find board game clubs, cafes, and venues in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <Link
              key={org.id}
              href={`/organizations/${org.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="w-12 h-12 rounded-lg object-cover mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                    {org.city && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {org.city}{org.state && `, ${org.state}`}
                      </div>
                    )}
                  </div>
                </div>
                
                {org.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {org.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {org.followers.length} followers
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {org.events.length} events
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredOrganizations.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No organizations found
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
