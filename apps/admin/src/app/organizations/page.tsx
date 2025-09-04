'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Organization {
  id: string
  name: string
  description: string
  website?: string
  email: string
  phone?: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  logo?: string
  banner?: string
  isActive: boolean
  isVerified: boolean
  memberCount: number
  followerCount: number
  eventCount: number
  venueCount: number
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface OrganizationStats {
  totalOrganizations: number
  activeOrganizations: number
  verifiedOrganizations: number
  totalMembers: number
  totalFollowers: number
  totalEvents: number
}

interface OrganizationMember {
  id: string
  userId: string
  userName: string
  userEmail: string
  role: string
  joinedAt: string
  isActive: boolean
}

interface OrganizationFollower {
  id: string
  userId: string
  userName: string
  userEmail: string
  followedAt: string
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [stats, setStats] = useState<OrganizationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)
  const [showOrganizationDetails, setShowOrganizationDetails] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [organizationMembers, setOrganizationMembers] = useState<OrganizationMember[]>([])
  const [organizationFollowers, setOrganizationFollowers] = useState<OrganizationFollower[]>([])

  useEffect(() => {
    fetchOrganizations()
    fetchOrganizationStats()
  }, [])

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/admin/organizations')
      if (response.ok) {
        const data = await response.json()
        setOrganizations(data.organizations)
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrganizationStats = async () => {
    try {
      const response = await fetch('/api/admin/organizations/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching organization stats:', error)
    }
  }

  const fetchOrganizationMembers = async (organizationId: string) => {
    try {
      const response = await fetch(`/api/admin/organizations/${organizationId}/members`)
      if (response.ok) {
        const data = await response.json()
        setOrganizationMembers(data.members)
      }
    } catch (error) {
      console.error('Error fetching organization members:', error)
    }
  }

  const fetchOrganizationFollowers = async (organizationId: string) => {
    try {
      const response = await fetch(`/api/admin/organizations/${organizationId}/followers`)
      if (response.ok) {
        const data = await response.json()
        setOrganizationFollowers(data.followers)
      }
    } catch (error) {
      console.error('Error fetching organization followers:', error)
    }
  }

  const handleDeleteOrganization = async (organizationId: string) => {
    if (!confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/organizations/${organizationId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchOrganizations() // Refresh the list
        alert('Organization deleted successfully')
      } else {
        alert('Failed to delete organization')
      }
    } catch (error) {
      console.error('Error deleting organization:', error)
      alert('Error deleting organization')
    }
  }

  const handleToggleOrganizationStatus = async (organizationId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/organizations/${organizationId}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })
      if (response.ok) {
        fetchOrganizations() // Refresh the list
      } else {
        alert('Failed to update organization status')
      }
    } catch (error) {
      console.error('Error updating organization status:', error)
      alert('Error updating organization status')
    }
  }

  const handleVerifyOrganization = async (organizationId: string, isVerified: boolean) => {
    try {
      const response = await fetch(`/api/admin/organizations/${organizationId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !isVerified })
      })
      if (response.ok) {
        fetchOrganizations() // Refresh the list
      } else {
        alert('Failed to update organization verification status')
      }
    } catch (error) {
      console.error('Error updating organization verification status:', error)
      alert('Error updating organization verification status')
    }
  }

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white">SBR Admin</h1>
        </div>
        
        <nav className="mt-6">
          <div className="px-6 py-2">
            <Link href="/dashboard" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
              Dashboard
            </Link>
          </div>
          
          <div className="px-6 py-2">
            <Link href="/users" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Users
            </Link>
          </div>
          
          <div className="px-6 py-2">
            <Link href="/games" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Games
            </Link>
          </div>
          
          <div className="px-6 py-2">
            <Link href="/sessions" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sessions
            </Link>
          </div>
          
          <div className="px-6 py-2">
            <Link href="/organizations" className="flex items-center px-3 py-2 text-white bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Organizations
            </Link>
          </div>
          
          <div className="px-6 py-2">
            <Link href="/settings" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
          <p className="text-gray-600">Manage organizations, their members, followers, and events</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Organizations</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalOrganizations || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Organizations</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.activeOrganizations || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified Organizations</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.verifiedOrganizations || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalMembers || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search organizations by name, description, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Organization
              </button>
            </div>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrganizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {org.logo ? (
                            <img className="h-12 w-12 rounded-lg object-cover" src={org.logo} alt={org.name} />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-300 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{org.name}</div>
                          <div className="text-sm text-gray-500">{org.email}</div>
                          {org.website && (
                            <div className="text-xs text-blue-600">
                              <a href={org.website} target="_blank" rel="noopener noreferrer">
                                {org.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{org.city}, {org.state}</div>
                      <div className="text-sm text-gray-500">{org.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Members: {org.memberCount}</div>
                        <div>Followers: {org.followerCount}</div>
                        <div>Events: {org.eventCount}</div>
                        <div>Venues: {org.venueCount}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          org.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {org.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <br />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          org.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {org.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrganization(org)
                            fetchOrganizationMembers(org.id)
                            fetchOrganizationFollowers(org.id)
                            setShowOrganizationDetails(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrganization(org)
                            setShowEditModal(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleOrganizationStatus(org.id, org.isActive)}
                          className={`${
                            org.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {org.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleVerifyOrganization(org.id, org.isVerified)}
                          className={`${
                            org.isVerified ? 'text-yellow-600 hover:text-yellow-900' : 'text-blue-600 hover:text-blue-900'
                          }`}
                        >
                          {org.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                        <button
                          onClick={() => handleDeleteOrganization(org.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
