'use client'

import { useState } from 'react'
import { UserStatusBadge } from '@sbr/ui'
import type { UserStatus } from '@sbr/ui'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
  status: UserStatus
  emailVerified: boolean
  createdAt: string
  deactivatedAt?: string | null
  reactivatedAt?: string | null
  lastLoginAt?: string | null
}

interface UsersTableProps {
  users: User[]
  onUserAction: (userId: string, action: string) => Promise<void>
  actionLoading: string | null
  onViewUser: (user: User) => void
  onEditUser: (user: User) => void
}

export function UsersTable({ 
  users, 
  onUserAction, 
  actionLoading, 
  onViewUser, 
  onEditUser 
}: UsersTableProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    isOpen: boolean
    userId: string
    action: string
    userName: string
  }>({
    isOpen: false,
    userId: '',
    action: '',
    userName: ''
  })

  const handleStatusToggle = (user: User) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const action = newStatus === 'ACTIVE' ? 'activate' : 'deactivate'
    
    setShowConfirmDialog({
      isOpen: true,
      userId: user.id,
      action,
      userName: `${user.firstName} ${user.lastName}`
    })
  }

  const confirmAction = async () => {
    const { userId, action } = showConfirmDialog
    await onUserAction(userId, action)
    setShowConfirmDialog({
      isOpen: false,
      userId: '',
      action: '',
      userName: ''
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'super_admin':
        return 'bg-red-100 text-red-800'
      case 'venue_admin':
        return 'bg-blue-100 text-blue-800'
      case 'end_user':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role.toLowerCase()) {
      case 'super_admin':
        return 'Super Admin'
      case 'venue_admin':
        return 'Venue Admin'
      case 'end_user':
        return 'End User'
      default:
        return role.replace('_', ' ')
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      {!user.emailVerified && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Unverified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <UserStatusBadge status={user.status} size="sm" />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                      {user.deactivatedAt && (
                        <span className="ml-2 text-red-500">
                          • Deactivated {new Date(user.deactivatedAt).toLocaleDateString()}
                        </span>
                      )}
                      {user.reactivatedAt && (
                        <span className="ml-2 text-green-500">
                          • Reactivated {new Date(user.reactivatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewUser(user)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEditUser(user)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleStatusToggle(user)}
                      disabled={actionLoading === user.id}
                      className={`
                        text-sm font-medium transition-colors
                        ${user.status === 'ACTIVE' 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                        }
                        ${actionLoading === user.id ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {actionLoading === user.id ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {user.status === 'ACTIVE' ? 'Deactivating...' : 'Activating...'}
                        </div>
                      ) : (
                        user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm {showConfirmDialog.action === 'activate' ? 'Activation' : 'Deactivation'}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to {showConfirmDialog.action} <strong>{showConfirmDialog.userName}</strong>?
              {showConfirmDialog.action === 'deactivate' && (
                <span className="block mt-2 text-red-600">
                  They will be logged out immediately and unable to access the system.
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog({
                  isOpen: false,
                  userId: '',
                  action: '',
                  userName: ''
                })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`
                  px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors
                  ${showConfirmDialog.action === 'activate' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                  }
                `}
              >
                {showConfirmDialog.action === 'activate' ? 'Activate' : 'Deactivate'} User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
