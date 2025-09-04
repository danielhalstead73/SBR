import { NextRequest, NextResponse } from 'next/server'
import { auth, authorize } from '@sbr/auth'
import { boardGameService } from '@sbr/database'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sbr-session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await auth.getUserByToken(sessionToken)

    if (!user || !authorize.isAdmin(user)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const games = await boardGameService.getAllBoardGames()

    const stats = {
      totalGames: games.length,
      averageRating: games.length > 0 
        ? games.reduce((sum, game) => sum + (game.rating || 0), 0) / games.length 
        : 0,
      averageComplexity: games.length > 0 
        ? games.reduce((sum, game) => sum + (game.complexity || 0), 0) / games.length 
        : 0,
      gamesWithBggId: games.filter(g => g.bggId).length,
      recentAdditions: games
        .filter(g => {
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return g.createdAt > thirtyDaysAgo
        })
        .length,
      topRatedGames: games
        .filter(g => g.rating && g.rating > 7)
        .length,
      complexGames: games
        .filter(g => g.complexity && g.complexity > 3)
        .length,
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error('Error fetching game stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch game stats' },
      { status: 500 }
    )
  }
}
