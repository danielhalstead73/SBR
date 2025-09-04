import { NextRequest, NextResponse } from 'next/server'
import { sessionService } from '@sbr/database'

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sbr-session')?.value

    if (sessionToken) {
      await sessionService.deleteSession(sessionToken)
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
    response.cookies.delete('sbr-session')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}
