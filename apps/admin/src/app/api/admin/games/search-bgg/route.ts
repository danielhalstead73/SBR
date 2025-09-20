import { NextRequest, NextResponse } from 'next/server'
import { auth, authorize } from '@sbr/auth'
import { config } from '@sbr/config'

async function searchBGGGames(query: string) {
  try {
    const response = await fetch(`${config.urls.bggApi}/search?query=${encodeURIComponent(query)}&type=boardgame`)
    const xmlText = await response.text()
    
    // Parse search results using regex (Node.js compatible)
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

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    const results = await searchBGGGames(query)

    return NextResponse.json({
      success: true,
      results,
      query
    })

  } catch (error) {
    console.error('Error searching BGG:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search BGG' },
      { status: 500 }
    )
  }
}
