import { User, Session, Organization, Game, GameSession, GameRating, GameReview } from '@prisma/client'

export type UserRole = 'super_admin' | 'venue_admin' | 'end_user'
export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER'

export type UserWithRelations = User & {
  sessions?: Session[]
  gameSessions?: GameSession[]
  organizations?: any[]
  gameRatings?: GameRating[]
  gameReviews?: GameReview[]
}

export type GameWithRelations = Game & {
  gameSessions?: GameSession[]
  gameRatings?: GameRating[]
  gameReviews?: GameReview[]
  organization?: Organization | null
}

export type GameSessionWithRelations = GameSession & {
  game?: Game
  organization?: Organization | null
  players?: any[]
  scores?: any[]
}

export type OrganizationWithRelations = Organization & {
  members?: any[]
  gameSessions?: GameSession[]
  games?: Game[]
}
