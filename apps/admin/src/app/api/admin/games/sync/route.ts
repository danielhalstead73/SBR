import { NextRequest, NextResponse } from 'next/server'
import { auth, authorize } from '@sbr/auth'
import { boardGameService } from '@sbr/database'
import { config } from '@sbr/config'

// BGG API helper functions
async function fetchBGGGameDetails(bggId: number) {
  try {
    const response = await fetch(`${config.urls.bggApi}/thing?id=${bggId}&stats=1`)
    const xmlText = await response.text()
    
    // Simple XML parsing for BGG data using regex (Node.js compatible)
    const parseXmlValue = (xml: string, tag: string, attribute?: string) => {
      const regex = attribute 
        ? new RegExp(`<${tag}[^>]*${attribute}="([^"]*)"`, 'i')
        : new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i')
      const match = xml.match(regex)
      return match ? match[1] : null
    }
    
    const parseXmlArray = (xml: string, tag: string, attribute: string) => {
      const regex = new RegExp(`<${tag}[^>]*${attribute}="([^"]*)"`, 'gi')
      const matches = []
      let match
      while ((match = regex.exec(xml)) !== null) {
        matches.push(match[1])
      }
      return matches
    }
    
    // Check if we have a valid item
    if (!xmlText.includes('<item')) return null

    const name = parseXmlValue(xmlText, 'name', 'value') || 'Unknown'
    const description = parseXmlValue(xmlText, 'description') || ''
    const image = parseXmlValue(xmlText, 'image') || ''
    const thumbnail = parseXmlValue(xmlText, 'thumbnail') || ''
    
    const minPlayers = parseInt(parseXmlValue(xmlText, 'minplayers', 'value') || '0')
    const maxPlayers = parseInt(parseXmlValue(xmlText, 'maxplayers', 'value') || '0')
    const playingTime = parseInt(parseXmlValue(xmlText, 'playingtime', 'value') || '0')
    const minAge = parseInt(parseXmlValue(xmlText, 'minage', 'value') || '0')
    
    // Extract categories
    const categories = parseXmlArray(xmlText, 'link', 'value').filter((_, index, arr) => {
      const typeMatch = xmlText.match(new RegExp(`<link[^>]*value="${arr[index]}"[^>]*type="boardgamecategory"`, 'i'))
      return typeMatch !== null
    })
    
    // Extract mechanics
    const mechanics = parseXmlArray(xmlText, 'link', 'value').filter((_, index, arr) => {
      const typeMatch = xmlText.match(new RegExp(`<link[^>]*value="${arr[index]}"[^>]*type="boardgamemechanic"`, 'i'))
      return typeMatch !== null
    })
    
    // Extract designers
    const designers = parseXmlArray(xmlText, 'link', 'value').filter((_, index, arr) => {
      const typeMatch = xmlText.match(new RegExp(`<link[^>]*value="${arr[index]}"[^>]*type="boardgamedesigner"`, 'i'))
      return typeMatch !== null
    })
    
    // Extract publishers
    const publishers = parseXmlArray(xmlText, 'link', 'value').filter((_, index, arr) => {
      const typeMatch = xmlText.match(new RegExp(`<link[^>]*value="${arr[index]}"[^>]*type="boardgamepublisher"`, 'i'))
      return typeMatch !== null
    })
    
    const yearPublished = parseInt(parseXmlValue(xmlText, 'yearpublished', 'value') || '0')
    
    // Get statistics
    const averageRating = parseFloat(parseXmlValue(xmlText, 'average', 'value') || '0')
    const complexity = parseFloat(parseXmlValue(xmlText, 'averageweight', 'value') || '0')

    return {
      bggId,
      name,
      description: description.replace(/<[^>]*>/g, ''), // Strip HTML tags
      image,
      thumbnail,
      minPlayers: minPlayers || null,
      maxPlayers: maxPlayers || null,
      playingTime: playingTime || null,
      minAge: minAge || null,
      categories: JSON.stringify(categories),
      mechanics: JSON.stringify(mechanics),
      designers: JSON.stringify(designers),
      publishers: JSON.stringify(publishers),
      yearPublished: yearPublished || null,
      complexity: complexity || null,
      rating: averageRating || null,
    }
  } catch (error) {
    console.error('Error fetching BGG game details:', error)
    return null
  }
}

async function searchBGGGames(query: string) {
  try {
    const response = await fetch(`${config.urls.bggApi}/search?query=${encodeURIComponent(query)}&type=boardgame`)
    const xmlText = await response.text()
    
    // Parse search results using regex
    const itemRegex = /<item[^>]*id="(\d+)"[^>]*>([\s\S]*?)<\/item>/gi
    const items = []
    let match
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXml = match[2]
      const bggId = parseInt(match[1])
      
      const nameMatch = itemXml.match(/<name[^>]*value="([^"]*)"[^>]*>/i)
      const yearMatch = itemXml.match(/<yearpublished[^>]*value="([^"]*)"[^>]*>/i)
      
      items.push({
        bggId,
        name: nameMatch ? nameMatch[1] : 'Unknown',
        yearPublished: yearMatch ? yearMatch[1] : null,
      })
    }
    
    return items
  } catch (error) {
    console.error('Error searching BGG games:', error)
    return []
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { type, bggId, query } = body

    if (type === 'single' && bggId) {
      // Sync a single game by BGG ID
      const gameData = await fetchBGGGameDetails(bggId)
      
      if (!gameData) {
        return NextResponse.json(
          { success: false, error: 'Game not found on BGG' },
          { status: 404 }
        )
      }

      // Check if game already exists
      const existingGame = await boardGameService.findBoardGameByBggId(bggId)
      
      if (existingGame) {
        // Update existing game
        await boardGameService.updateBoardGame(existingGame.id, gameData)
        return NextResponse.json({
          success: true,
          message: 'Game updated successfully',
          game: existingGame
        })
      } else {
        // Create new game
        const newGame = await boardGameService.createBoardGame(gameData)
        return NextResponse.json({
          success: true,
          message: 'Game synced successfully',
          game: newGame
        })
      }
    }

    if (type === 'search' && query) {
      // Search BGG for games
      const results = await searchBGGGames(query)
      return NextResponse.json({
        success: true,
        results
      })
    }

    if (type === 'full') {
      // Full sync - this would be a long-running operation
      // For now, we'll just return a success message
      // In a real implementation, you'd want to use a job queue
      return NextResponse.json({
        success: true,
        message: 'Full sync initiated. This is a placeholder implementation.'
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid sync type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in BGG sync:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to sync with BGG' },
      { status: 500 }
    )
  }
}
