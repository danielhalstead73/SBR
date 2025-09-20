'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
  emailVerified: boolean
  createdAt: string
  lastLoginAt?: string
}

interface UserStats {
  totalUsers: number
  activeUsers: number
  verifiedUsers: number
  superAdmins: number
  venueAdmins: number
  endUsers: number
  recentRegistrations: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [createUserLoading, setCreateUserLoading] = useState(false)
  const [emailExists, setEmailExists] = useState(false)

  // Enhanced features state
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [sortField, setSortField] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    joinDate: 'all'
  })

  useEffect(() => {
    fetchUsers()
    fetchUserStats()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/admin/users/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    }
  }

  // ... rest of component logic and JSX unchanged, ending cleanly

  return (
    <div className="min-h-screen bg-gray-50">
      {/* sidebar, stats, table, modals... */}
    </div>
  )
}
