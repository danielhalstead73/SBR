import { z } from 'zod'

// Validation schemas
export const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const organizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  logo: z.string().url().optional(),
  bannerImage: z.string().url().optional(),
  socialLinks: z.string().optional(), // JSON string
  contactInfo: z.string().optional(), // JSON string
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  allowMultiVenue: z.boolean().default(false),
  enableFollowers: z.boolean().default(true),
  enablePublicEvents: z.boolean().default(true),
  enableMessaging: z.boolean().default(true),
})

export const venueSchema = z.object({
  name: z.string().min(1, 'Venue name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  organizationId: z.string().min(1, 'Organization is required'),
})

export const eventSchema = z.object({
  title: z.string().min(1, 'Event title is required'),
  description: z.string().optional(),
  type: z.enum(['PUBLIC', 'PRIVATE', 'COMPETITION']),
  startTime: z.date(),
  endTime: z.date().optional(),
  maxCapacity: z.number().min(1).max(24).default(8),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().optional(), // JSON string
  organizationId: z.string().min(1, 'Organization is required'),
  venueId: z.string().optional(),
  gameIds: z.string().optional(), // JSON string array
})

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  userId: z.string().min(1, 'User ID is required'),
})

export const followerSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  organizationId: z.string().min(1, 'Organization ID is required'),
})

export const messageSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Message content is required'),
  organizationId: z.string().min(1, 'Organization is required'),
  sentToFollowers: z.boolean().default(true),
})

export const boardGameSchema = z.object({
  bggId: z.number().positive(),
  name: z.string().min(1, 'Game name is required'),
  description: z.string().optional(),
  image: z.string().url().optional(),
  thumbnail: z.string().url().optional(),
  minPlayers: z.number().positive().optional(),
  maxPlayers: z.number().positive().optional(),
  playingTime: z.number().positive().optional(),
  minAge: z.number().positive().optional(),
  categories: z.string().optional(), // JSON string array
  mechanics: z.string().optional(), // JSON string array
  designers: z.string().optional(), // JSON string array
  publishers: z.string().optional(), // JSON string array
  yearPublished: z.number().positive().optional(),
  complexity: z.number().min(1).max(5).optional(),
  rating: z.number().min(0).max(10).optional(),
})

export const gameSchema = z.object({
  title: z.string().min(1, 'Game title is required'),
  description: z.string().optional(),
  bggId: z.number().positive().optional(),
  bggData: z.string().optional(), // JSON string
  minPlayers: z.number().positive().optional(),
  maxPlayers: z.number().positive().optional(),
  playTime: z.number().positive().optional(),
  minAge: z.number().positive().optional(),
  complexity: z.number().min(1).max(5).optional(),
  organizationId: z.string().optional(),
  createdById: z.string().min(1, 'Creator is required'),
})

export const gameSessionSchema = z.object({
  gameId: z.string().min(1, 'Game is required'),
  date: z.date(),
  duration: z.number().min(1).optional(),
  notes: z.string().optional(),
  players: z.array(z.string()).min(1, 'At least one player is required'),
  scores: z.array(z.object({
    playerName: z.string(),
    score: z.number().optional(),
    position: z.number().min(1).optional(),
    notes: z.string().optional(),
  })).optional(),
})

// Utility functions
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0

    const attempt = async () => {
      try {
        attempts++
        const result = await fn()
        resolve(result)
      } catch (error) {
        if (attempts >= maxAttempts) {
          reject(error)
        } else {
          setTimeout(attempt, delay)
        }
      }
    }

    attempt()
  })
}

// Constants
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  VENUE_ADMIN: 'venue_admin',
  END_USER: 'end_user',
} as const

export const MEMBER_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const

export const EVENT_TYPES = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  COMPETITION: 'COMPETITION',
} as const

export const EVENT_STATUS = {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
} as const

export const ATTENDEE_STATUS = {
  ATTENDING: 'ATTENDING',
  WAITLIST: 'WAITLIST',
  DECLINED: 'DECLINED',
} as const

export const GAME_CATEGORIES = [
  'Strategy',
  'Family',
  'Party',
  'Cooperative',
  'Deck Building',
  'Worker Placement',
  'Area Control',
  'Dice',
  'Card Game',
  'Miniatures',
  'RPG',
  'Other',
] as const

export const PLAYER_COUNT_OPTIONS = [
  '1',
  '1-2',
  '1-4',
  '2',
  '2-4',
  '2-6',
  '2-8',
  '3-6',
  '4+',
  '5+',
  '6+',
] as const

export const PLAYING_TIME_OPTIONS = [
  '15 minutes',
  '30 minutes',
  '45 minutes',
  '1 hour',
  '1.5 hours',
  '2 hours',
  '2.5 hours',
  '3+ hours',
] as const

// Types and enums
export enum Role {
  SUPER_ADMIN = 'super_admin',
  VENUE_ADMIN = 'venue_admin',
  END_USER = 'end_user',
}

export interface UserDTO {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  emailVerified: boolean
  organizationId?: string
  avatar?: string
  bio?: string
  location?: string
  organization?: {
    id: string
    name: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface OrganizationDTO {
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
  allowMultiVenue: boolean
  enableFollowers: boolean
  enablePublicEvents: boolean
  enableMessaging: boolean
  createdAt: Date
  updatedAt: Date
}

export interface EventDTO {
  id: string
  title: string
  description?: string
  type: string
  startTime: Date
  endTime?: Date
  maxCapacity: number
  isRecurring: boolean
  recurrenceRule?: string
  status: string
  organizationId: string
  venueId?: string
  gameIds: string
  organization?: OrganizationDTO
  venue?: VenueDTO
  attendees?: EventAttendeeDTO[]
  createdAt: Date
  updatedAt: Date
}

export interface VenueDTO {
  id: string
  name: string
  address: string
  city?: string
  state?: string
  zipCode?: string
  latitude?: number
  longitude?: number
  organizationId: string
  organization?: OrganizationDTO
  createdAt: Date
  updatedAt: Date
}

export interface EventAttendeeDTO {
  id: string
  eventId: string
  userId: string
  status: string
  event?: EventDTO
  user?: UserDTO
  createdAt: Date
}

export interface BoardGameDTO {
  id: string
  bggId: number
  name: string
  description?: string
  image?: string
  thumbnail?: string
  minPlayers?: number
  maxPlayers?: number
  playingTime?: number
  minAge?: number
  categories?: string
  mechanics?: string
  designers?: string
  publishers?: string
  yearPublished?: number
  complexity?: number
  rating?: number
  createdAt: Date
  updatedAt: Date
}
