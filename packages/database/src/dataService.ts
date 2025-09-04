import { prisma } from './client'

export interface DashboardStats {
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

export interface UserStats {
  totalUsers: number
  activeUsers: number
  verifiedUsers: number
  superAdmins: number
  venueAdmins: number
  endUsers: number
  recentRegistrations: number
}

export interface GameStats {
  totalGames: number
  averageRating: number
  averageComplexity: number
  gamesWithBggId: number
  recentAdditions: number
  topRatedGames: number
  complexGames: number
}

export interface SessionStats {
  totalSessions: number
  upcomingSessions: number
  pastSessions: number
  publicSessions: number
  privateSessions: number
  competitionSessions: number
  averageAttendees: number
}

export interface OrganizationStats {
  totalOrganizations: number
  verifiedOrganizations: number
  activeOrganizations: number
  organizationsWithVenues: number
  organizationsWithEvents: number
  averageFollowers: number
  recentOrganizations: number
}

export class DataService {
  /**
   * Get dashboard statistics using raw SQL to avoid Prisma count() bugs
   */
  async getDashboardStats(): Promise<DashboardStats> {
    return await prisma.$transaction(async (tx) => {
      // Use raw SQL for all count queries to avoid Prisma bugs
      const [userCount, gameCount, sessionCount, orgCount] = await Promise.all([
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM users`,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM games`,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM events`,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM organizations`
      ])

      // Get recent users (last 5)
      const recentUsers = await tx.$queryRaw<Array<{
        id: string
        firstName: string
        lastName: string
        email: string
        createdAt: string
      }>>`
        SELECT id, firstName, lastName, email, createdAt 
        FROM users 
        ORDER BY createdAt DESC 
        LIMIT 5
      `

      // Mock recent activity (can be enhanced later)
      const recentActivity = [
        {
          id: '1',
          type: 'User Registration',
          description: 'New user registered',
          date: new Date().toLocaleDateString(),
        },
        {
          id: '2',
          type: 'Organization Created',
          description: 'New organization added',
          date: new Date().toLocaleDateString(),
        },
      ]

      return {
        totalUsers: Number(userCount[0].count),
        totalGames: Number(gameCount[0].count),
        totalSessions: Number(sessionCount[0].count),
        totalOrganizations: Number(orgCount[0].count),
        recentUsers: recentUsers.map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          createdAt: new Date(user.createdAt).toLocaleDateString(),
        })),
        recentActivity,
      }
    })
  }

  /**
   * Get user statistics using raw SQL
   */
  async getUserStats(): Promise<UserStats> {
    return await prisma.$transaction(async (tx) => {
      const [totalUsers, verifiedUsers, superAdmins, venueAdmins, endUsers, recentRegistrations] = await Promise.all([
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM users`,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM users WHERE emailVerified = 1`,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM users WHERE role = 'super_admin'`,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM users WHERE role = 'venue_admin'`,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM users WHERE role = 'end_user'`,
        tx.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count 
          FROM users 
          WHERE createdAt > datetime('now', '-30 days')
        `
      ])

      return {
        totalUsers: Number(totalUsers[0].count),
        activeUsers: Number(totalUsers[0].count), // All users are active by default
        verifiedUsers: Number(verifiedUsers[0].count),
        superAdmins: Number(superAdmins[0].count),
        venueAdmins: Number(venueAdmins[0].count),
        endUsers: Number(endUsers[0].count),
        recentRegistrations: Number(recentRegistrations[0].count),
      }
    })
  }

  /**
   * Get game statistics using raw SQL
   */
  async getGameStats(): Promise<GameStats> {
    return await prisma.$transaction(async (tx) => {
      const [totalGames, gamesWithBggId, recentAdditions, topRatedGames, complexGames] = await Promise.all([
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM games`,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM games WHERE bggId IS NOT NULL`,
        tx.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count 
          FROM games 
          WHERE createdAt > datetime('now', '-30 days')
        `,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM games WHERE complexity > 3`,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM games WHERE complexity > 3`
      ])

      // Get average complexity
      const avgComplexity = await tx.$queryRaw<[{ avg: number | null }]>`
        SELECT AVG(complexity) as avg FROM games WHERE complexity IS NOT NULL
      `

      return {
        totalGames: Number(totalGames[0].count),
        averageRating: 0, // Not implemented yet
        averageComplexity: avgComplexity[0].avg || 0,
        gamesWithBggId: Number(gamesWithBggId[0].count),
        recentAdditions: Number(recentAdditions[0].count),
        topRatedGames: Number(topRatedGames[0].count),
        complexGames: Number(complexGames[0].count),
      }
    })
  }

  /**
   * Get session statistics using raw SQL
   */
  async getSessionStats(): Promise<SessionStats> {
    return await prisma.$transaction(async (tx) => {
      const [totalSessions, upcomingSessions, pastSessions, publicSessions, privateSessions, competitionSessions] = await Promise.all([
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM events`,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM events WHERE startTime > datetime('now')`,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM events WHERE startTime < datetime('now')`,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM events WHERE type = 'PUBLIC'`,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM events WHERE type = 'PRIVATE'`,
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM events WHERE type = 'COMPETITION'`
      ])

      return {
        totalSessions: Number(totalSessions[0].count),
        upcomingSessions: Number(upcomingSessions[0].count),
        pastSessions: Number(pastSessions[0].count),
        publicSessions: Number(publicSessions[0].count),
        privateSessions: Number(privateSessions[0].count),
        competitionSessions: Number(competitionSessions[0].count),
        averageAttendees: 0, // Can be calculated later if needed
      }
    })
  }

  /**
   * Get organization statistics using raw SQL
   */
  async getOrganizationStats(): Promise<OrganizationStats> {
    return await prisma.$transaction(async (tx) => {
      const [totalOrgs, orgsWithVenues, orgsWithEvents, recentOrgs] = await Promise.all([
        tx.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM organizations`,
        tx.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(DISTINCT o.id) as count 
          FROM organizations o 
          INNER JOIN venues v ON o.id = v.organizationId
        `,
        tx.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(DISTINCT o.id) as count 
          FROM organizations o 
          INNER JOIN events e ON o.id = e.organizationId
        `,
        tx.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count 
          FROM organizations 
          WHERE createdAt > datetime('now', '-30 days')
        `
      ])

      return {
        totalOrganizations: Number(totalOrgs[0].count),
        verifiedOrganizations: Number(totalOrgs[0].count), // All orgs are verified by default
        activeOrganizations: Number(totalOrgs[0].count), // All orgs are active by default
        organizationsWithVenues: Number(orgsWithVenues[0].count),
        organizationsWithEvents: Number(orgsWithEvents[0].count),
        averageFollowers: 0, // Can be calculated later if needed
        recentOrganizations: Number(recentOrgs[0].count),
      }
    })
  }

  /**
   * Get all users with consistent formatting
   */
  async getAllUsers() {
    return await prisma.user.findMany({
      include: {
        organization: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  /**
   * Get all organizations with consistent formatting
   */
  async getAllOrganizations() {
    return await prisma.organization.findMany({
      include: {
        users: true,
        games: true,
        venues: true,
        events: true,
        followers: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
  }

  /**
   * Get all games with consistent formatting
   */
  async getAllGames() {
    return await prisma.game.findMany({
      include: {
        organization: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  /**
   * Get all events with consistent formatting
   */
  async getAllEvents() {
    return await prisma.event.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        organization: true,
        venue: true,
        attendees: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    })
  }
}

export const dataService = new DataService()
