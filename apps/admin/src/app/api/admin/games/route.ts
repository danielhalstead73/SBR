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

    const formattedGames = games.map(game => ({
      id: game.id,
      bggId: game.bggId,
      name: game.name,
      description: game.description,
      image: game.image,
      thumbnail: game.thumbnail,
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      playingTime: game.playingTime,
      minAge: game.minAge,
      categories: game.categories ? JSON.parse(game.categories) : [],
      mechanics: game.mechanics ? JSON.parse(game.mechanics) : [],
      designers: game.designers ? JSON.parse(game.designers) : [],
      publishers: game.publishers ? JSON.parse(game.publishers) : [],
      yearPublished: game.yearPublished,
      complexity: game.complexity,
      rating: game.rating,
      createdAt: game.createdAt.toISOString(),
      updatedAt: game.updatedAt.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      games: formattedGames,
    })
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}
