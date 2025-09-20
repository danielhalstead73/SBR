import React from 'react'

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION'

interface UserStatusBadgeProps {
  status: UserStatus
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const statusConfig = {
  ACTIVE: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 border-green-200',
    dotClassName: 'bg-green-500',
  },
  INACTIVE: {
    label: 'Inactive',
    className: 'bg-red-100 text-red-800 border-red-200',
    dotClassName: 'bg-red-500',
  },
  SUSPENDED: {
    label: 'Suspended',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dotClassName: 'bg-yellow-500',
  },
  PENDING_VERIFICATION: {
    label: 'Pending',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    dotClassName: 'bg-blue-500',
  },
}

const sizeConfig = {
  sm: {
    container: 'px-2 py-1 text-xs',
    dot: 'w-1.5 h-1.5',
  },
  md: {
    container: 'px-2.5 py-1.5 text-sm',
    dot: 'w-2 h-2',
  },
  lg: {
    container: 'px-3 py-2 text-base',
    dot: 'w-2.5 h-2.5',
  },
}

export function UserStatusBadge({ status, className = '', size = 'md' }: UserStatusBadgeProps) {
  const config = statusConfig[status]
  const sizeStyles = sizeConfig[size]

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${config.className}
        ${sizeStyles.container}
        ${className}
      `}
    >
      <span
        className={`
          rounded-full
          ${config.dotClassName}
          ${sizeStyles.dot}
        `}
      />
      {config.label}
    </span>
  )
}

export default UserStatusBadge
