'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
}

interface SystemStats {
  totalUsers: number
  totalGames: number
  totalSessions: number
  totalOrganizations: number
  recentUsers: Array<{
    id: string
    name: string
    email: string
    createdAt: string
  }>
  recentActivity: Array<{
    id: string
    type: string
    description: string
    date: string
  }>
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          if (userData.role === 'super_admin' || userData.role === 'venue_admin') {
            setUser(userData)
          } else {
            window.location.href = '/unauthorized'
          }
        } else {
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
        const response = await fetch('/api/admin/stats')
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
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white">SBR Admin</h1>
        </div>
        
        <nav className="mt-6">
          <div className="px-6 py-2">
            <Link href="/dashboard" className="flex items-center px-3 py-2 text-white bg-gray-700 rounded-lg">
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
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
            <span>{user?.name}</span>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">{user?.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Dashboard</h1>
          <p className="text-gray-600">Overview of system statistics and recent activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/users" className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </Link>

          <Link href="/games" className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Games</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalGames || 0}</p>
              </div>
            </div>
          </Link>

          <Link href="/sessions" className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Game Sessions</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalSessions || 0}</p>
              </div>
            </div>
          </Link>

          <Link href="/organizations" className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Organizations</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalOrganizations || 0}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity and Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Users</h2>
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              <div className="space-y-3">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-gray-900 font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className="text-sm text-gray-500">{user.createdAt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent users</p>
            )}
          </div>

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
    </div>
  )
}
