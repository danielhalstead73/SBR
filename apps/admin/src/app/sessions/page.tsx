'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface GameSession {
  id: string
  title: string
  description: string
  gameId: string
  gameName: string
  venueId: string
  venueName: string
  organizationId: string
  organizationName: string
  sessionType: 'public' | 'private' | 'competition'
  address: string
  tableNumber?: string
  maxAttendees: number
  currentAttendees: number
  startDate: string
  endDate: string
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface SessionStats {
  totalSessions: number
  upcomingSessions: number
  activeSessions: number
  completedSessions: number
  totalAttendees: number
}

interface Attendee {
  id: string
  userId: string
  userName: string
  userEmail: string
  joinedAt: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<GameSession[]>([])
  const [stats, setStats] = useState<SessionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSession, setSelectedSession] = useState<GameSession | null>(null)
  const [showSessionDetails, setShowSessionDetails] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [sessionAttendees, setSessionAttendees] = useState<Attendee[]>([])

  useEffect(() => {
    fetchSessions()
    fetchSessionStats()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/admin/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSessionStats = async () => {
    try {
      const response = await fetch('/api/admin/sessions/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching session stats:', error)
    }
  }

  const fetchSessionAttendees = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/admin/sessions/${sessionId}/attendees`)
      if (response.ok) {
        const data = await response.json()
        setSessionAttendees(data.attendees)
      }
    } catch (error) {
      console.error('Error fetching session attendees:', error)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/sessions/${sessionId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchSessions() // Refresh the list
        alert('Session deleted successfully')
      } else {
        alert('Failed to delete session')
      }
    } catch (error) {
      console.error('Error deleting session:', error)
      alert('Error deleting session')
    }
  }

  const handleUpdateSessionStatus = async (sessionId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/sessions/${sessionId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (response.ok) {
        fetchSessions() // Refresh the list
      } else {
        alert('Failed to update session status')
      }
    } catch (error) {
      console.error('Error updating session status:', error)
      alert('Error updating session status')
    }
  }

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'public': return 'bg-green-100 text-green-800'
      case 'private': return 'bg-blue-100 text-blue-800'
      case 'competition': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.sessionType.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Link href="/sessions" className="flex items-center px-3 py-2 text-white bg-gray-700 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sessions
            </Link>
          </div>
          
          <div className="px-6 py-2">
            <Link href="/organizations" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
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
          <h1 className="text-3xl font-bold text-gray-900">Session Management</h1>
          <p className="text-gray-600">Manage game sessions, venues, and attendee information</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalSessions || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.upcomingSessions || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.activeSessions || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.completedSessions || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalAttendees || 0}</p>
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
                placeholder="Search sessions by title, game, venue, organization..."
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
                Create Session
              </button>
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Game & Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{session.title}</div>
                        <div className="text-sm text-gray-500">{session.organizationName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{session.gameName}</div>
                        <div className="text-sm text-gray-500">{session.venueName}</div>
                        {session.tableNumber && (
                          <div className="text-xs text-gray-400">Table {session.tableNumber}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSessionTypeColor(session.sessionType)}`}>
                          {session.sessionType}
                        </span>
                        <br />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {session.currentAttendees}/{session.maxAttendees}
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round((session.currentAttendees / session.maxAttendees) * 100)}% full
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(session.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(session.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(session.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedSession(session)
                            fetchSessionAttendees(session.id)
                            setShowSessionDetails(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSession(session)
                            setShowEditModal(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
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
