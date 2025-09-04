import bcrypt from 'bcryptjs'
import { prisma } from './client'

export * from '@prisma/client'
export { prisma } from './client'

export const userService = {
  async createUser(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    role?: string
    organizationId?: string
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 12)
    const emailVerifyToken = Math.random().toString(36).substring(2, 15)

    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'end_user',
        organizationId: data.organizationId,
        emailVerifyToken,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
        organizationId: true,
        avatar: true,
        bio: true,
        location: true,
        createdAt: true,
        emailVerifyToken: true,
      },
    })
  },

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
      },
    })
  },

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        organization: true,
        eventAttendees: {
          include: {
            event: {
              include: {
                organization: true,
                venue: true,
              },
            },
          },
        },
        followers: {
          include: {
            organization: true,
          },
        },
      },
    })
  },

  async validatePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword)
  },

  async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { emailVerifyToken: token },
    })

    if (!user) return null

    return prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
      },
    })
  },

  async updateUser(id: string, data: {
    firstName?: string
    lastName?: string
    avatar?: string
    bio?: string
    location?: string
    role?: string
  }) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
        organizationId: true,
        avatar: true,
        bio: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  },

  async updateUserPassword(id: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
        organizationId: true,
        avatar: true,
        bio: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  },

  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    })
  },

  async getAllUsers() {
    return prisma.user.findMany({
      include: {
        organization: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },
}

export const sessionService = {
  async createSession(userId: string, expiresAt: Date) {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    return prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    })
  },

  async findSessionByToken(token: string) {
    return prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            organization: true,
          },
        },
      },
    })
  },

  async deleteSession(token: string) {
    return prisma.session.delete({
      where: { token },
    })
  },
}

export const organizationService = {
  async getAllOrganizations() {
    return prisma.organization.findMany({
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
  },

  async findOrganizationById(id: string) {
    return prisma.organization.findUnique({
      where: { id },
      include: {
        users: true,
        games: true,
        venues: true,
        events: {
          include: {
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
        },
        followers: {
          include: {
            user: true,
          },
        },
      },
    })
  },

  async createOrganization(data: {
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
  }) {
    return prisma.organization.create({
      data,
    })
  },

  async updateOrganization(id: string, data: any) {
    return prisma.organization.update({
      where: { id },
      data,
    })
  },

  async deleteOrganization(id: string) {
    return prisma.organization.delete({
      where: { id },
    })
  },
}

export const venueService = {
  async createVenue(data: {
    name: string
    address: string
    city?: string
    state?: string
    zipCode?: string
    latitude?: number
    longitude?: number
    organizationId: string
  }) {
    return prisma.venue.create({
      data,
      include: {
        organization: true,
      },
    })
  },

  async findVenueById(id: string) {
    return prisma.venue.findUnique({
      where: { id },
      include: {
        organization: true,
        events: true,
      },
    })
  },

  async getVenuesByOrganization(organizationId: string) {
    return prisma.venue.findMany({
      where: { organizationId },
      include: {
        events: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
  },

  async updateVenue(id: string, data: any) {
    return prisma.venue.update({
      where: { id },
      data,
    })
  },

  async deleteVenue(id: string) {
    return prisma.venue.delete({
      where: { id },
    })
  },
}

export const eventService = {
  async createEvent(data: {
    title: string
    description?: string
    type: string
    startTime: Date
    endTime?: Date
    maxCapacity?: number
    isRecurring?: boolean
    recurrenceRule?: string
    organizationId: string
    venueId?: string
    gameIds?: string
  }) {
    return prisma.event.create({
      data: {
        ...data,
        maxCapacity: data.maxCapacity || 8,
        gameIds: data.gameIds || '[]',
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
    })
  },

  async findEventById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        organization: true,
        venue: true,
        attendees: {
          include: {
            user: true,
          },
        },
      },
    })
  },

  async getAllEvents() {
    return prisma.event.findMany({
      where: {
        status: 'ACTIVE',
        type: 'PUBLIC',
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
  },

  async getEventsByOrganization(organizationId: string) {
    return prisma.event.findMany({
      where: { organizationId },
      include: {
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
  },

  async updateEvent(id: string, data: any) {
    return prisma.event.update({
      where: { id },
      data,
      include: {
        organization: true,
        venue: true,
        attendees: {
          include: {
            user: true,
          },
        },
      },
    })
  },

  async deleteEvent(id: string) {
    return prisma.event.delete({
      where: { id },
    })
  },
}

export const eventAttendeeService = {
  async registerForEvent(eventId: string, userId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        attendees: true,
      },
    })

    if (!event) {
      throw new Error('Event not found')
    }

    const isAlreadyRegistered = event.attendees.some(
      (attendee: any) => attendee.userId === userId
    )

    if (isAlreadyRegistered) {
      throw new Error('User is already registered for this event')
    }

    const currentAttendees = event.attendees.filter(
      (attendee: any) => attendee.status === 'ATTENDING'
    ).length

    const status = currentAttendees >= event.maxCapacity ? 'WAITLIST' : 'ATTENDING'

    return prisma.eventAttendee.create({
      data: {
        eventId,
        userId,
        status,
      },
      include: {
        event: true,
        user: true,
      },
    })
  },

  async cancelEventRegistration(eventId: string, userId: string) {
    return prisma.eventAttendee.delete({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    })
  },

  async updateAttendeeStatus(eventId: string, userId: string, status: string) {
    return prisma.eventAttendee.update({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      data: { status },
      include: {
        event: true,
        user: true,
      },
    })
  },

  async getEventAttendees(eventId: string) {
    return prisma.eventAttendee.findMany({
      where: { eventId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
  },

  async getUserEvents(userId: string) {
    return prisma.eventAttendee.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            organization: true,
            venue: true,
          },
        },
      },
      orderBy: {
        event: {
          startTime: 'asc',
        },
      },
    })
  },
}

export const followerService = {
  async followOrganization(userId: string, organizationId: string) {
    return prisma.follower.create({
      data: {
        userId,
        organizationId,
      },
      include: {
        user: true,
        organization: true,
      },
    })
  },

  async unfollowOrganization(userId: string, organizationId: string) {
    return prisma.follower.delete({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    })
  },

  async isFollowing(userId: string, organizationId: string) {
    const follower = await prisma.follower.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    })
    return !!follower
  },

  async getOrganizationFollowers(organizationId: string) {
    return prisma.follower.findMany({
      where: { organizationId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async getUserFollowing(userId: string) {
    return prisma.follower.findMany({
      where: { userId },
      include: {
        organization: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },
}

export const messageService = {
  async createMessage(data: {
    subject: string
    content: string
    organizationId: string
    sentToFollowers?: boolean
  }) {
    return prisma.message.create({
      data,
      include: {
        organization: true,
      },
    })
  },

  async getOrganizationMessages(organizationId: string) {
    return prisma.message.findMany({
      where: { organizationId },
      orderBy: {
        sentAt: 'desc',
      },
    })
  },

  async deleteMessage(id: string) {
    return prisma.message.delete({
      where: { id },
    })
  },
}

export const boardGameService = {
  async createBoardGame(data: {
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
  }) {
    return prisma.boardGame.create({
      data: {
        ...data,
        categories: data.categories || '[]',
        mechanics: data.mechanics || '[]',
        designers: data.designers || '[]',
        publishers: data.publishers || '[]',
      },
    })
  },

  async findBoardGameByBggId(bggId: number) {
    return prisma.boardGame.findUnique({
      where: { bggId },
    })
  },

  async findBoardGameById(id: string) {
    return prisma.boardGame.findUnique({
      where: { id },
    })
  },

  async searchBoardGames(query: string) {
    return prisma.boardGame.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      orderBy: {
        rating: 'desc',
      },
      take: 20,
    })
  },

  async getAllBoardGames() {
    return prisma.boardGame.findMany({
      orderBy: {
        name: 'asc',
      },
    })
  },

  async updateBoardGame(id: string, data: any) {
    return prisma.boardGame.update({
      where: { id },
      data,
    })
  },
}

export const gameService = {
  async getAllGames() {
    return prisma.game.findMany({
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
  },

  async createGame(data: {
    title: string
    description?: string
    bggId?: number
    bggData?: string
    minPlayers?: number
    maxPlayers?: number
    playTime?: number
    minAge?: number
    complexity?: number
    organizationId?: string
    createdById: string
  }) {
    return prisma.game.create({
      data,
      include: {
        organization: true,
        createdBy: true,
      },
    })
  },

  async findGameById(id: string) {
    return prisma.game.findUnique({
      where: { id },
      include: {
        organization: true,
        createdBy: true,
      },
    })
  },

  async updateGame(id: string, data: any) {
    return prisma.game.update({
      where: { id },
      data,
      include: {
        organization: true,
        createdBy: true,
      },
    })
  },

  async deleteGame(id: string) {
    return prisma.game.delete({
      where: { id },
    })
  },
}
