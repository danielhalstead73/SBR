'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface DashboardStats {
  totalGames: number
  totalSessions: number
  totalPlayers: number
  recentActivity: Array<{
    id: string
    type: string
    description: string
    date: string
  }>
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          // Redirect to login if not authenticated
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const statsData = await response.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchUserData()
    fetchStats()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">SBR Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Games</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalGames || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Game Sessions</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalSessions || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Players Met</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalPlayers || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/games" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Browse Games</h3>
              <p className="text-sm text-gray-600">Discover new board games</p>
            </div>
          </Link>

          <Link href="/sessions/new" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">New Session</h3>
              <p className="text-sm text-gray-600">Record a game session</p>
            </div>
          </Link>

          <Link href="/players" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Find Players</h3>
              <p className="text-sm text-gray-600">Connect with gamers</p>
            </div>
          </Link>

          <Link href="/profile" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Profile</h3>
              <p className="text-sm text-gray-600">Manage your account</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.type}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  )
}
